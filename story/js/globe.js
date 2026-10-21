/* Real-time globe: Earth → India → Himalayas, then Himalayas → Allahabad.
   Driven entirely by scroll progress via setDive(p) / setArc(p). */
import * as THREE from "three";

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const lerp = (a, b, t) => a + (b - a) * t;

// Equirectangular lat/lon → unit vector, matching SphereGeometry's UVs.
function dirFromLatLon(lat, lon) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(-Math.sin(phi) * Math.cos(theta), Math.cos(phi), Math.sin(phi) * Math.sin(theta));
}
function eastAt(lat, lon) {
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(Math.sin(theta), 0, Math.cos(theta)).normalize();
}
function slerpDir(a, b, t) {
  const q = new THREE.Quaternion().setFromUnitVectors(a, b);
  return a.clone().applyQuaternion(new THREE.Quaternion().slerp(q, t));
}

const EARTH_VERT = /* glsl */ `
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main() {
    vUv = uv;
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
const EARTH_FRAG = /* glsl */ `
  uniform sampler2D uNight; uniform sampler2D uTopo; uniform vec3 uSun; uniform vec3 uCam;
  varying vec2 vUv; varying vec3 vN; varying vec3 vW;
  void main() {
    vec3 N = normalize(vN); vec3 V = normalize(uCam - vW);
    float elev = texture2D(uTopo, vUv).r;
    float land = smoothstep(0.015, 0.06, elev);
    vec3 night = texture2D(uNight, vUv).rgb;
    float lit = dot(N, uSun);
    float day = smoothstep(-0.12, 0.45, lit);
    // blue-hour base: deep ocean, dusk land, peaks catch warm light
    vec3 ocean = mix(vec3(0.028, 0.05, 0.095), vec3(0.06, 0.1, 0.17), day);
    vec3 ground = mix(vec3(0.09, 0.13, 0.21), vec3(0.3, 0.37, 0.5), day);
    ground = mix(ground, vec3(0.95, 0.83, 0.66), smoothstep(0.5, 0.95, elev) * (0.15 + 0.6 * day));
    vec3 col = mix(ocean, ground, land);
    // city lights on the dark side, warm gold
    float lum = dot(night, vec3(0.3, 0.59, 0.11));
    col += vec3(1.0, 0.78, 0.48) * pow(lum, 1.6) * 1.5 * (1.0 - day);
    // sunrise band along the terminator
    col += vec3(1.0, 0.62, 0.4) * exp(-pow(lit / 0.09, 2.0)) * 0.09 * (0.4 + land);
    // atmospheric rim
    float fres = pow(1.0 - max(dot(N, V), 0.0), 3.0);
    col = mix(col, vec3(0.43, 0.52, 0.7), fres * 0.55);
    gl_FragColor = vec4(col, 1.0);
  }`;
const ATMO_VERT = /* glsl */ `
  varying vec3 vN; varying vec3 vW;
  void main() {
    vN = normalize(mat3(modelMatrix) * normal);
    vec4 w = modelMatrix * vec4(position, 1.0); vW = w.xyz;
    gl_Position = projectionMatrix * viewMatrix * w;
  }`;
const ATMO_FRAG = /* glsl */ `
  uniform vec3 uCam; uniform vec3 uSun;
  varying vec3 vN; varying vec3 vW;
  void main() {
    // back faces: -dot(N,V) is ~0.38 at the planet's limb and 0 at the shell edge
    vec3 V = normalize(uCam - vW);
    float f = clamp(-dot(normalize(vN), V) / 0.38, 0.0, 1.0);
    float i = pow(f, 3.0) * 0.55;
    float warm = smoothstep(-0.2, 0.6, dot(normalize(vN), uSun));
    vec3 c = mix(vec3(0.36, 0.5, 0.82), vec3(1.0, 0.74, 0.5), warm * 0.5);
    gl_FragColor = vec4(c * i, 1.0);
  }`;

export function createGlobe(canvas, { places, mobile, onReady }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, alpha: false, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.25 : 1.75));
  renderer.setClearColor(0x070c16, 1);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(mobile ? 46 : 34, 1, 0.01, 200);

  const loader = new THREE.TextureLoader();
  let pending = 2;
  const done = () => { if (--pending === 0 && onReady) onReady(); };
  const night = loader.load(mobile ? "./assets/textures/earth-night-2k.jpg" : "./assets/textures/earth-night.jpg", done, undefined, done);
  const topo = loader.load("./assets/textures/earth-topology.png", done, undefined, done);
  night.colorSpace = THREE.SRGBColorSpace;
  night.anisotropy = topo.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const home = places.home, college = places.college;
  const homeDir = dirFromLatLon(home.lat, home.lon);
  const collegeDir = dirFromLatLon(college.lat, college.lon);
  const east = eastAt(home.lat, home.lon);
  const north = new THREE.Vector3().crossVectors(homeDir, east).normalize();
  // Sun low on the eastern horizon of the Himalayas: it is dawn there.
  const sun = east.clone().multiplyScalar(1).addScaledVector(homeDir, 0.22).normalize();

  const seg = mobile ? 72 : 128;
  const earthMat = new THREE.ShaderMaterial({
    vertexShader: EARTH_VERT, fragmentShader: EARTH_FRAG,
    uniforms: { uNight: { value: night }, uTopo: { value: topo }, uSun: { value: sun }, uCam: { value: new THREE.Vector3() } },
  });
  const earth = new THREE.Mesh(new THREE.SphereGeometry(1, seg, seg / 2), earthMat);
  scene.add(earth);

  const atmoMat = new THREE.ShaderMaterial({
    vertexShader: ATMO_VERT, fragmentShader: ATMO_FRAG, side: THREE.BackSide,
    blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    uniforms: { uCam: earthMat.uniforms.uCam, uSun: { value: sun } },
  });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(1.08, 64, 32), atmoMat));

  // stars
  const starCount = mobile ? 700 : 2000;
  const sp = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount; i++) {
    const v = new THREE.Vector3().randomDirection().multiplyScalar(40 + Math.random() * 50);
    sp.set([v.x, v.y, v.z], i * 3);
  }
  const starGeo = new THREE.BufferGeometry();
  starGeo.setAttribute("position", new THREE.BufferAttribute(sp, 3));
  scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xc9d4ee, size: 0.12, sizeAttenuation: true, transparent: true, opacity: 0.7, depthWrite: false })));

  // arc Himalayas → Allahabad
  const arcPts = [];
  for (let i = 0; i <= 64; i++) {
    const t = i / 64;
    arcPts.push(slerpDir(homeDir, collegeDir, t).multiplyScalar(1.002 + 0.045 * Math.sin(Math.PI * t)));
  }
  const curve = new THREE.CatmullRomCurve3(arcPts);
  const tubeSeg = 96, radial = 6;
  const arcGeo = new THREE.TubeGeometry(curve, tubeSeg, 0.0028, radial, false);
  arcGeo.setDrawRange(0, 0);
  const arc = new THREE.Mesh(arcGeo, new THREE.MeshBasicMaterial({ color: 0xff6b5e, transparent: true, opacity: 0.95 }));
  scene.add(arc);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.006, 12, 8), new THREE.MeshBasicMaterial({ color: 0xfef3dd }));
  head.visible = false;
  scene.add(head);

  // state
  const startDir = dirFromLatLon(14, 18);
  const camPos = new THREE.Vector3(), look = new THREE.Vector3();
  const homePoint = homeDir.clone(), collegePoint = collegeDir.clone();
  const tmp = new THREE.Vector3();
  let width = 1, height = 1, time = 0;

  function resize() {
    width = window.innerWidth; height = window.innerHeight;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }
  resize();

  // portrait screens need more distance so the globe fits horizontally
  const far = () => (camera.aspect < 0.8 ? 6.4 : 4.3);

  function place(dir, dist, tilt, lookAt) {
    tmp.copy(dir).addScaledVector(north, -tilt).normalize().multiplyScalar(dist);
    camPos.copy(tmp);
    look.copy(lookAt);
  }

  /** Chapter 01: p 0..1, Earth → India → Himalayas */
  function setDive(p) {
    const e = easeInOut(p);
    const drift = Math.sin(time * 0.06) * 0.12 * (1 - smooth(0, 0.25, p));
    const d0 = startDir.clone().applyAxisAngle(new THREE.Vector3(0, 1, 0), drift);
    const dir = slerpDir(d0, homeDir, smooth(0.0, 0.7, p));
    const dist = lerp(far(), 1.3, Math.pow(e, 1.15));
    const tilt = 0.5 * smooth(0.45, 1, p);
    const target = tmp.set(0, 0, 0).lerp(homePoint.clone().addScaledVector(north, 0.1), smooth(0.4, 1, p)).clone();
    place(dir, dist, tilt, target);
    arcGeo.setDrawRange(0, 0);
    head.visible = false;
  }

  /** Chapter 02 transition: p 0..1, pull out, draw the road south, settle on Allahabad */
  function setArc(p) {
    const out = smooth(0, 0.38, p), into = smooth(0.62, 1, p);
    const mid = slerpDir(homeDir, collegeDir, 0.5);
    let dir = slerpDir(homeDir, mid, out);
    dir = slerpDir(dir, collegeDir, into);
    const dist = lerp(lerp(1.3, 2.25, easeInOut(out)), 1.5, easeInOut(into));
    const tilt = lerp(0.5, 0.18, out) + 0.22 * into;
    const target = new THREE.Vector3().lerpVectors(homePoint, collegePoint, smooth(0.2, 0.9, p)).multiplyScalar(lerp(1, 0.85, out));
    place(dir, dist, tilt, target);
    const t = smooth(0.2, 0.64, p);
    arcGeo.setDrawRange(0, Math.floor(t * tubeSeg) * radial * 6);
    head.visible = t > 0 && t < 1;
    if (head.visible) head.position.copy(curve.getPoint(t));
  }

  /** Screen position + visibility of a place, for HTML labels */
  function project(which) {
    const pt = which === "college" ? collegePoint : homePoint;
    const facing = pt.dot(tmp.copy(camera.position).normalize());
    const v = pt.clone().project(camera);
    return { x: (v.x * 0.5 + 0.5) * width, y: (-v.y * 0.5 + 0.5) * height, visible: facing > 0.2 && v.z < 1 };
  }

  function render(dt) {
    time += dt;
    camera.position.copy(camPos);
    camera.lookAt(look);
    earthMat.uniforms.uCam.value.copy(camera.position);
    renderer.render(scene, camera);
  }

  return { setDive, setArc, project, render, resize };
}
