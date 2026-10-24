/* v0.2 Earth: NASA textures, physically based single-scattering atmosphere,
   independent cloud layer, sun-driven day/night, and a real-elevation
   Himalaya terrain patch the camera descends onto. Same API as v0.1:
   setDive(p) / setArc(p) / project(which) / render(dt) / resize(). */
import * as THREE from "three";

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;
const DEG = Math.PI / 180;
const EARTH_M = 6371000;

// Equirectangular lat/lon → unit vector, matching SphereGeometry's UVs.
function dirFromLatLon(lat, lon, out = new THREE.Vector3()) {
  const phi = (90 - lat) * DEG, theta = (lon + 180) * DEG;
  return out.set(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
}
function latLonFromDir(v) {
  const lat = 90 - Math.acos(Math.max(-1, Math.min(1, v.y))) / DEG;
  let lon = Math.atan2(v.z, -v.x) / DEG - 180;
  if (lon < -180) lon += 360;
  return { lat, lon };
}
function northAt(dir) {
  const east = new THREE.Vector3().crossVectors(new THREE.Vector3(0, 1, 0), dir).normalize();
  return new THREE.Vector3().crossVectors(dir, east).normalize();
}

/* ---------------- shaders ---------------- */
const SPHERE_VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;

const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uDay, uNight, uClouds, uElev;
  uniform vec3 uSun, uCam; uniform vec2 uElevTexel; uniform float uCloudShift, uSunI, uCloudFade;
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main() {
    vec3 N = normalize(vN), V = normalize(uCam - vW), L = uSun;
    vec3 T = normalize(cross(vec3(0.0, 1.0, 0.0), N)), B = cross(N, T);
    // relief from NASA elevation
    float hE = texture2D(uElev, vUv + vec2(uElevTexel.x, 0.0)).r - texture2D(uElev, vUv - vec2(uElevTexel.x, 0.0)).r;
    float hN = texture2D(uElev, vUv + vec2(0.0, uElevTexel.y)).r - texture2D(uElev, vUv - vec2(0.0, uElevTexel.y)).r;
    vec3 Nb = normalize(N - (T * hE + B * hN) * 2.2);
    vec3 day = texture2D(uDay, vUv).rgb;
    float elev = texture2D(uElev, vUv).r;
    float ocean = (1.0 - smoothstep(0.0, 0.012, elev)) * smoothstep(0.0, 0.05, day.b - day.r);
    float mu = dot(N, L);
    float lit = smoothstep(-0.06, 0.2, mu);
    // cloud shadows: sample the cloud layer offset toward the sun
    vec2 shUv = vUv + vec2(uCloudShift, 0.0) - vec2(dot(L, T), dot(L, B)) * 0.0025;
    float shadow = 1.0 - 0.45 * smoothstep(0.25, 1.0, texture2D(uClouds, shUv).r) * uCloudFade;
    float diff = max(dot(Nb, L), 0.0);
    vec3 sun = vec3(1.0, 0.95, 0.88) * uSunI;
    vec3 col = day * sun * (diff * shadow) * lit;
    // ocean: sun glint + sheen
    vec3 H = normalize(L + V);
    float spec = pow(max(dot(N, H), 0.0), 140.0) * 2.4 + pow(max(dot(N, H), 0.0), 14.0) * 0.06;
    col += sun * spec * ocean * lit * shadow;
    // night side city lights (Black Marble), dimmed under clouds
    vec3 nightTex = texture2D(uNight, vUv).rgb;
    float dark = 1.0 - smoothstep(-0.2, 0.04, mu);
    float cloudHere = texture2D(uClouds, vUv + vec2(uCloudShift, 0.0)).r;
    col += pow(nightTex, vec3(1.6)) * vec3(1.0, 0.72, 0.42) * 1.6 * dark * (1.0 - 0.7 * cloudHere);
    gl_FragColor = vec4(col, 1.0);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

const CLOUD_FRAG = /* glsl */ `
  uniform sampler2D uClouds; uniform vec3 uSun; uniform float uCloudShift, uSunI, uFade;
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main() {
    float c = texture2D(uClouds, vUv + vec2(uCloudShift, 0.0)).r;
    float a = smoothstep(0.3, 1.0, c) * 0.85 * uFade;
    float mu = dot(normalize(vN), uSun);
    float lit = smoothstep(-0.12, 0.25, mu);
    // warm the cloud tops near the terminator
    vec3 tint = mix(vec3(1.0, 0.62, 0.38), vec3(1.0), smoothstep(0.0, 0.35, mu));
    vec3 col = tint * uSunI * 0.62 * lit + vec3(0.004, 0.006, 0.01);
    gl_FragColor = vec4(col, a);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

// Single-scattering Rayleigh + Mie, raymarched through the shell (Nishita-style).
const ATMO_FRAG = /* glsl */ `
  #define PI 3.14159265
  uniform vec3 uCam, uSun; uniform float uRa, uI, uHaze;
  varying vec3 vW; varying vec2 vUv; varying vec3 vN;
  // Earth's real coefficients, in units of Earth radii (β·6371 km, H/6371 km)
  const vec3 BR = vec3(36.95, 86.0, 210.9);  // Rayleigh β (5.8, 13.5, 33.1)e-6 /m
  const float BM = 133.8;                      // Mie β 21e-6 /m
  const float HR = 0.001256, HM = 0.000188;    // 8 km, 1.2 km scale heights
  vec2 hit(vec3 ro, vec3 rd, float r) {
    float b = dot(ro, rd), c = dot(ro, ro) - r * r, d = b * b - c;
    if (d < 0.0) return vec2(1e9, -1e9);
    d = sqrt(d); return vec2(-b - d, -b + d);
  }
  void main() {
    vec3 ro = uCam, rd = normalize(vW - uCam);
    vec2 ta = hit(ro, rd, uRa);
    if (ta.x > ta.y) discard;
    vec2 tp = hit(ro, rd, 1.0);
    float t0 = max(ta.x, 0.0), t1 = ta.y;
    if (tp.x > 0.0 && tp.x < tp.y) t1 = min(t1, tp.x);
    if (t1 <= t0) discard;
    float seg = (t1 - t0) / float(NS), t = t0;
    vec3 sR = vec3(0.0), sM = vec3(0.0); float oR = 0.0, oM = 0.0;
    for (int i = 0; i < NS; i++) {
      vec3 p = ro + rd * (t + seg * 0.5);
      float h = length(p) - 1.0;
      float hr = exp(-h / HR) * seg, hm = exp(-h / HM) * seg;
      oR += hr; oM += hm;
      vec2 tl = hit(p, uSun, uRa);
      vec2 tpl = hit(p, uSun, 1.0);
      float sunVis = (tpl.x > 0.0 && tpl.x < tpl.y) ? 0.0 : 1.0;
      float sl = tl.y / float(NL), lR = 0.0, lM = 0.0;
      for (int j = 0; j < NL; j++) {
        float hl = length(p + uSun * sl * (float(j) + 0.5)) - 1.0;
        lR += exp(-hl / HR) * sl; lM += exp(-hl / HM) * sl;
      }
      vec3 att = exp(-(BR * (oR + lR) + BM * 1.1 * (oM + lM))) * sunVis;
      sR += att * hr; sM += att * hm;
      t += seg;
    }
    float mu = dot(rd, uSun), g = 0.76;
    float pR = 3.0 / (16.0 * PI) * (1.0 + mu * mu);
    float pM = 3.0 / (8.0 * PI) * ((1.0 - g * g) * (1.0 + mu * mu)) / ((2.0 + g * g) * pow(1.0 + g * g - 2.0 * g * mu, 1.5));
    // art direction: near the ground, thin the haze so the warm KF3/KF4 palette survives
    vec3 col = uI * (sR * BR * pR + sM * BM * pM) * uHaze;
    // alpha carries the view-ray transmittance: blending dims what lies behind the haze
    vec3 tv = exp(-(BR * oR + BM * 1.1 * oM));
    gl_FragColor = vec4(col, mix(1.0, dot(tv, vec3(0.2126, 0.7152, 0.0722)), uHaze));
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

const TERRAIN_VERT = /* glsl */ `
  attribute vec2 gUv; attribute float hM;
  varying vec2 vUv; varying vec2 vG; varying vec3 vN; varying vec3 vW; varying float vH;
  void main() {
    vUv = uv; vG = gUv; vH = hM;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
const TERRAIN_FRAG = /* glsl */ `
  uniform sampler2D uSat, uDay; uniform vec3 uSun; uniform float uSunI, uFade, uVMax;
  varying vec2 vUv; varying vec2 vG; varying vec3 vN; varying vec3 vW; varying float vH;
  void main() {
    vec3 sat = texture2D(uSat, vUv).rgb;
    // keep Sentinel-2 detail, take low-frequency colour from the globe: hides mosaic seams
    vec3 satLow = texture2D(uSat, vUv, 7.0).rgb;
    vec3 dayLow = texture2D(uDay, vG, 1.5).rgb;
    // match brightness only (not hue) to the globe, so winter snow in the globe map doesn't bleach the plateau
    const vec3 LUM = vec3(0.2126, 0.7152, 0.0722);
    float gain = clamp(dot(dayLow, LUM) / max(dot(satLow, LUM), 0.015), 0.65, 1.6);
    vec3 col = sat * mix(1.0, gain, 0.8);
    vec3 N = normalize(vN), up = normalize(vW);
    // snow only on the high peaks, not the whole plateau
    float snow = smoothstep(5600.0, 6600.0, vH) * smoothstep(0.5, 0.85, dot(N, up));
    col = mix(col, vec3(0.78, 0.8, 0.84), snow * 0.4);
    float diff = max(dot(N, uSun), 0.0);
    float lit = smoothstep(-0.06, 0.2, dot(up, uSun));
    vec3 sun = vec3(1.0, 0.93, 0.84) * uSunI;
    vec3 sky = vec3(0.32, 0.42, 0.62) * 0.35 * uSunI * (0.5 + 0.5 * dot(N, up));
    vec3 c = col * (sun * diff + sky) * lit;
    // fade into the globe at the patch edges (patch spans image rows 0..uVMax)
    float pv = (1.0 - vUv.y) / uVMax;
    float e = min(min(vUv.x, 1.0 - vUv.x), min(pv, 1.0 - pv));
    gl_FragColor = vec4(c, smoothstep(0.0, 0.07, e) * uFade);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
  }`;

/* ---------------- globe ---------------- */
export function createGlobe(canvas, { places, mobile, reduced, onReady }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 0.95;
  renderer.autoClear = false;
  const maxTex = renderer.capabilities.maxTextureSize;
  const big = !mobile && maxTex >= 4096;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mobile ? 50 : 36, 1, 0.001, 10);
  // stars live in their own pass so the earth camera can use tight near/far planes
  const starScene = new THREE.Scene();
  const starCam = new THREE.PerspectiveCamera(camera.fov, 1, 1, 400);

  const loader = new THREE.TextureLoader();
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  const tex = (url, srgb = true) => {
    const t = loader.load(url, () => { dirty = true; if (--pending === 0 && onReady) { onReady(); loadTerrain(); } });
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    return t;
  };
  let pending = 4, dirty = true;
  const A = "./assets/earth/";
  const day = tex(A + (big ? "day-4k.jpg" : "day-2k.jpg"));
  const night = tex(A + (big ? "night-4k.jpg" : "night-2k.jpg"));
  const clouds = tex(A + (big ? "clouds-2k.jpg" : "clouds-1k.jpg"), false);
  const elev = tex(A + (big ? "elev-4k.png" : "elev-2k.png"), false);
  clouds.wrapS = THREE.RepeatWrapping;

  // Morning over India: sun low in the east, terminator over Arabia (as in KF1/KF2).
  // Subsolar point east of India: ~27° sun over the Himalayas, terminator over East Africa.
  const sun = dirFromLatLon(-12, 125);
  const SUN_I = 2.1;

  const seg = mobile ? 160 : 288;
  const earthMat = new THREE.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: EARTH_FRAG,
    uniforms: {
      uDay: { value: day }, uNight: { value: night }, uClouds: { value: clouds }, uElev: { value: elev },
      uSun: { value: sun }, uCam: { value: new THREE.Vector3() }, uSunI: { value: SUN_I },
      uElevTexel: { value: new THREE.Vector2(1 / (big ? 4096 : 2048), 1 / (big ? 2048 : 1024)) },
      uCloudShift: { value: 0 }, uCloudFade: { value: 1 },
    },
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, seg, seg / 2), earthMat);
  earth.renderOrder = 0;
  scene.add(earth);

  const cloudMat = new THREE.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: CLOUD_FRAG, transparent: true, depthWrite: false,
    uniforms: { uClouds: { value: clouds }, uSun: { value: sun }, uSunI: { value: SUN_I }, uCloudShift: earthMat.uniforms.uCloudShift, uFade: { value: 1 } },
  });
  const cloudMesh = new THREE.Mesh(new THREE.SphereGeometry(1.006, seg, seg / 2), cloudMat);
  cloudMesh.renderOrder = 2;
  scene.add(cloudMesh);

  const RA = 1.016; // ~100 km of atmosphere
  const atmoMat = new THREE.ShaderMaterial({
    vertexShader: SPHERE_VERT, fragmentShader: ATMO_FRAG, side: THREE.BackSide,
    transparent: true, depthWrite: false, depthTest: false,
    // out = scatter + behind · transmittance
    blending: THREE.CustomBlending, blendEquation: THREE.AddEquation,
    blendSrc: THREE.OneFactor, blendDst: THREE.SrcAlphaFactor,
    defines: { NS: mobile ? 8 : 14, NL: mobile ? 3 : 5 },
    // surface shading omits the 1/π of Lambert, so the sun's irradiance here is π·SUN_I
    uniforms: { uCam: earthMat.uniforms.uCam, uSun: { value: sun }, uRa: { value: RA }, uI: { value: Math.PI * 2.1 }, uHaze: { value: 1 } },
  });
  const atmo = new THREE.Mesh(new THREE.SphereGeometry(RA, 96, 48), atmoMat);
  atmo.renderOrder = 5;
  // ?noatmo / ?noterrain isolate layers when tuning the look
  const debug = new URLSearchParams(location.search);
  atmo.visible = !debug.has("noatmo");
  scene.add(atmo);

  // stars
  const starCount = mobile ? 900 : 2600;
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(200);
    sp.set([v.x, v.y, v.z], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  starScene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xd6def0, size: 0.55, sizeAttenuation: true, transparent: true, opacity: 0.75, depthWrite: false })));

  /* ---------- Himalaya terrain (AWS terrain tiles + Sentinel-2 cloudless 2016) ---------- */
  // Web-mercator tile block z7 x89–95 y50–54 (DEM) / z9 x356–383 y200–219 (imagery).
  const TB = { z: 7, x0: 89, x1: 96, y0: 50, y1: 55 };
  const EXAG = 3.0;
  // the 2016 mosaic switches composite below ~25.6°N: stop the patch just above that seam
  const VMAX = 0.9;
  let terrain = null;
  const tileLon = (x) => (x / 2 ** TB.z) * 360 - 180;
  const tileLat = (y) => Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / 2 ** TB.z))) / DEG;

  function loadTerrain() {
    const H = "./assets/himalaya/";
    const img = new Image();
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = img.width; c.height = img.height;
      const g = c.getContext("2d", { willReadFrequently: true });
      g.drawImage(img, 0, 0);
      const d = g.getImageData(0, 0, c.width, c.height).data;
      const W = c.width, Hh = c.height, hts = new Float32Array(W * Hh);
      for (let i = 0; i < W * Hh; i++) hts[i] = d[i * 4] * 256 + d[i * 4 + 1] + d[i * 4 + 2] / 256 - 32768;
      const sample = (u, v) => {
        const x = Math.min(W - 1.001, Math.max(0, u * (W - 1))), y = Math.min(Hh - 1.001, Math.max(0, v * (Hh - 1)));
        const x0 = Math.floor(x), y0 = Math.floor(y), fx = x - x0, fy = y - y0, i = y0 * W + x0;
        return lerp(lerp(hts[i], hts[i + 1], fx), lerp(hts[i + W], hts[i + W + 1], fx), fy);
      };
      const NX = mobile ? 320 : 720, NY = Math.round((NX * Hh * VMAX) / W);
      const pos = new Float32Array((NX + 1) * (NY + 1) * 3);
      const uv = new Float32Array((NX + 1) * (NY + 1) * 2);
      const guv = new Float32Array((NX + 1) * (NY + 1) * 2);
      const hm = new Float32Array((NX + 1) * (NY + 1));
      const v3 = new THREE.Vector3();
      let k = 0;
      for (let j = 0; j <= NY; j++) {
        const v = (j / NY) * VMAX, lat = tileLat(TB.y0 + v * (TB.y1 - TB.y0));
        for (let i = 0; i <= NX; i++, k++) {
          const u = i / NX, lon = tileLon(TB.x0 + u * (TB.x1 - TB.x0));
          // heights ease to zero at the border so the patch meets the sphere
          const edge = smooth(0, 0.06, Math.min(u, 1 - u, j / NY, 1 - j / NY));
          const h = Math.max(0, sample(u, v));
          dirFromLatLon(lat, lon, v3).multiplyScalar(1 + (h * edge * EXAG) / EARTH_M);
          pos.set([v3.x, v3.y, v3.z], k * 3);
          uv.set([u, 1 - v], k * 2);
          guv.set([(lon + 180) / 360, (lat + 90) / 180], k * 2);
          hm[k] = h;
        }
      }
      const idx = new Uint32Array(NX * NY * 6);
      let q = 0;
      for (let j = 0; j < NY; j++) for (let i = 0; i < NX; i++) {
        const a = j * (NX + 1) + i, b2 = a + 1, c2 = a + NX + 1, d2 = c2 + 1;
        idx.set([a, c2, b2, b2, c2, d2], q); q += 6;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("uv", new THREE.BufferAttribute(uv, 2));
      geo.setAttribute("gUv", new THREE.BufferAttribute(guv, 2));
      geo.setAttribute("hM", new THREE.BufferAttribute(hm, 1));
      geo.setIndex(new THREE.BufferAttribute(idx, 1));
      geo.computeVertexNormals();
      const sat = loader.load(H + (big ? "sat-4k.jpg" : "sat-2k.jpg"), () => { terrainReady = true; dirty = true; });
      sat.colorSpace = THREE.SRGBColorSpace;
      sat.anisotropy = aniso;
      const mat = new THREE.ShaderMaterial({
        vertexShader: TERRAIN_VERT, fragmentShader: TERRAIN_FRAG, transparent: true,
        uniforms: { uSat: { value: sat }, uDay: { value: day }, uSun: { value: sun }, uSunI: { value: SUN_I }, uFade: { value: 0 }, uVMax: { value: VMAX } },
      });
      terrain = new THREE.Mesh(geo, mat);
      terrain.renderOrder = 1;
      terrain.visible = false;
      scene.add(terrain);
    };
    img.src = H + "dem-900.png";
  }
  let terrainReady = false;

  /* ---------- arc Himalayas → Allahabad (Chapter 02) ---------- */
  const home = places.home, college = places.college;
  const homeDir = dirFromLatLon(home.lat, home.lon), collegeDir = dirFromLatLon(college.lat, college.lon);
  const slerpDir = (a, b, t) => a.clone().applyQuaternion(new THREE.Quaternion().slerp(new THREE.Quaternion().setFromUnitVectors(a, b), t));
  const arcPts = [];
  for (let i = 0; i <= 64; i++) { const t = i / 64; arcPts.push(slerpDir(homeDir, collegeDir, t).multiplyScalar(1.003 + 0.016 * Math.sin(Math.PI * t))); }
  const curve = new THREE.CatmullRomCurve3(arcPts);
  const tubeSeg = 96, radial = 6;
  const arcGeo = new THREE.TubeGeometry(curve, tubeSeg, 0.0011, radial, false);
  arcGeo.setDrawRange(0, 0);
  const arc = new THREE.Mesh(arcGeo, new THREE.MeshBasicMaterial({ color: 0xff5a4f, toneMapped: false }));
  arc.renderOrder = 6;
  scene.add(arc);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.0026, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfff4e0, toneMapped: false }));
  head.visible = false; head.renderOrder = 6;
  scene.add(head);

  /* ---------- camera path: KF1 → KF2 → KF3 → KF4 ---------- */
  // [p, camLat, camLon, altitude (Earth radii), lookLat, lookLon, look weight]
  const DIVE = [
    [0.0, 10, 20, 3.4, 22, 78, 0.0],
    [0.3, 17, 66, 1.7, 24, 78, 0.0],      // the planet turns India into the light (KF1)
    [0.52, 19, 78.5, 0.62, 27, 79, 0.3],  // subcontinent fills the frame (KF2)
    // from here the camera stays oblique, looking north, so the frame sits on the
    // high-detail terrain instead of the magnified globe texture below
    [0.7, 24.2, 79, 0.2, 30.5, 79.2, 0.9],
    [0.85, 26.8, 79.2, 0.05, 31.2, 79.6, 1.0], // Ganga plain → Himalayan arc (KF3)
    [1.0, 28.4, 78.9, 0.0115, 31.0, 79.1, 1.0], // low over the foothills, peaks ahead (KF4)
  ];
  // Catmull-Rom through the keyframe values; altitude interpolated in log space.
  function pathAt(keys, p) {
    let i = 0;
    while (i < keys.length - 2 && p > keys[i + 1][0]) i++;
    const k0 = keys[Math.max(0, i - 1)], k1 = keys[i], k2 = keys[i + 1], k3 = keys[Math.min(keys.length - 1, i + 2)];
    const t = Math.min(1, Math.max(0, (p - k1[0]) / (k2[0] - k1[0])));
    const cr = (a, b, c, d) => 0.5 * (2 * b + (-a + c) * t + (2 * a - 5 * b + 4 * c - d) * t * t + (-a + 3 * b - 3 * c + d) * t * t * t);
    const val = (n, f = (x) => x) => cr(f(k0[n]), f(k1[n]), f(k2[n]), f(k3[n]));
    return { lat: val(1), lon: val(2), alt: Math.exp(val(3, Math.log)), lookLat: val(4), lookLon: val(5), w: Math.min(1, Math.max(0, val(6))) };
  }

  const camPos = new THREE.Vector3(), look = new THREE.Vector3(), up = new THREE.Vector3(0, 1, 0);
  let width = 1, height = 1, cloudShift = 0;
  const last = { key: "" };

  function place(s) {
    dirFromLatLon(s.lat, s.lon, camPos).multiplyScalar(1 + s.alt);
    const target = dirFromLatLon(s.lookLat, s.lookLon).multiplyScalar(1.001);
    look.set(0, 0, 0).lerp(target, s.w);
    up.set(0, 1, 0).lerp(northAt(camPos.clone().normalize()), s.w).normalize();
    // terrain fades in as its detail starts to beat the globe texture
    const fade = smooth(0.9, 0.35, s.alt);
    if (terrain) { terrain.visible = terrainReady && fade > 0.001 && !debug.has("noterrain"); terrain.material.uniforms.uFade.value = fade; }
    // the 2K cloud map can't hold up close: clouds (and their shadows) clear as we descend
    const cf = smooth(0.18, 0.95, s.alt);
    cloudMat.uniforms.uFade.value = cf;
    earthMat.uniforms.uCloudFade.value = cf;
    atmoMat.uniforms.uHaze.value = lerp(0.5, 1, smooth(0.015, 0.35, s.alt));
  }

  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = starCam.aspect = width / height;
    // portrait screens widen the lens so the planet still fits
    camera.fov = starCam.fov = camera.aspect < 0.8 ? 58 : mobile ? 50 : 36;
    camera.updateProjectionMatrix(); starCam.updateProjectionMatrix();
    dirty = true;
  }
  resize();

  /** Chapter 01: p 0..1, Earth → India → Himalayas (deterministic in p) */
  function setDive(p) {
    const s = pathAt(DIVE, p);
    place(s);
    cloudShift = p * 0.012; // clouds drift with scroll, not time: reverse scrolling is exact
    arcGeo.setDrawRange(0, 0);
    head.visible = false;
    const key = "d" + p.toFixed(5);
    if (key !== last.key) { last.key = key; dirty = true; }
  }

  /** Chapter 02 transition: pull out from the Himalayas, draw the road south, settle on Allahabad */
  function setArc(p) {
    const mid = latLonFromDir(slerpDir(homeDir, collegeDir, 0.5));
    const ARC = [
      [0.0, home.lat - 4, home.lon + 0.6, 0.12, home.lat, home.lon, 1],
      [0.4, mid.lat - 8, mid.lon, 0.6, mid.lat, mid.lon, 0.85],
      [1.0, college.lat - 6, college.lon, 0.38, college.lat, college.lon, 1],
    ];
    place(pathAt(ARC, p));
    cloudShift = 0.012 + p * 0.006;
    const t = smooth(0.2, 0.64, p);
    arcGeo.setDrawRange(0, Math.floor(t * tubeSeg) * radial * 6);
    head.visible = t > 0 && t < 1;
    if (head.visible) head.position.copy(curve.getPoint(t));
    const key = "a" + p.toFixed(5);
    if (key !== last.key) { last.key = key; dirty = true; }
  }

  const tmp = new THREE.Vector3();
  /** Screen position + visibility of a place, for HTML labels */
  function project(which) {
    const pt = (which === "college" ? collegeDir : homeDir).clone().multiplyScalar(1.001);
    const facing = pt.clone().normalize().dot(tmp.copy(camera.position).sub(pt).normalize());
    const v = pt.project(camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height, visible: facing > 0.05 && v.z < 1 && Math.abs(v.x) < 1.1 && Math.abs(v.y) < 1.1 };
  }

  // Render only when the view changed: scroll position, size or a texture arriving.
  function render() {
    camera.position.copy(camPos);
    camera.up.copy(up);
    camera.lookAt(look);
    const alt = camPos.length() - 1;
    camera.near = Math.max(alt * 0.15, 2e-5);
    camera.far = camPos.length() + 1.3;
    camera.updateProjectionMatrix();
    earthMat.uniforms.uCam.value.copy(camPos);
    earthMat.uniforms.uCloudShift.value = cloudShift;
    if (!dirty) return;
    dirty = false;
    starCam.quaternion.copy(camera.quaternion);
    renderer.clear();
    renderer.render(starScene, starCam);
    renderer.clearDepth();
    renderer.render(scene, camera);
  }

  return { setDive, setArc, project, render, resize };
}
