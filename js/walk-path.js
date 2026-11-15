/* The walk: a mountain path you walk by scrolling. Seven stops, one per chapter.
   three.js r170 (vendored in world/vendor). Textures are Poly Haven CC0 (see world/CREDITS.md). */
import * as THREE from '../world/vendor/three.module.min.js';

const canvas = document.getElementById('scene');
const mobile = window.matchMedia('(max-width: 860px)').matches;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const T = mobile ? '_s' : '';

let renderer;
try {
  renderer = new THREE.WebGLRenderer({ canvas, antialias: !mobile, powerPreference: 'high-performance' });
} catch (e) {
  document.documentElement.classList.add('no-webgl');
  throw e;
}
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, mobile ? 1.5 : 1.75));
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.shadowMap.enabled = !mobile;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const scene = new THREE.Scene();
const FOG = new THREE.Color('#c99a8a');
scene.fog = new THREE.FogExp2(FOG, 0.0062);

const camera = new THREE.PerspectiveCamera(mobile ? 66 : 52, window.innerWidth / window.innerHeight, 0.1, 2500);

/* ---------- Helpers ---------- */
const loader = new THREE.TextureLoader();
function tex(name, rx, ry, srgb = true) {
  const t = loader.load(`./world/tex/${name}.webp`);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.repeat.set(rx, ry);
  t.anisotropy = 4;
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function hash(x, y) {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return s - Math.floor(s);
}
function noise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y), xf = x - xi, yf = y - yi;
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi), b = hash(xi + 1, yi), c = hash(xi, yi + 1), d = hash(xi + 1, yi + 1);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}
function fbm(x, y) {
  let f = 0, amp = 0.5, fr = 1;
  for (let i = 0; i < 4; i++) { f += amp * noise(x * fr, y * fr); amp *= 0.5; fr *= 2.03; }
  return f;
}
const smooth = (a, b, x) => { const t = Math.min(1, Math.max(0, (x - a) / (b - a))); return t * t * (3 - 2 * t); };
let seed = 7;
const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };

/* ---------- The path ---------- */
const L = 620;
const ctrl = [];
for (let i = 0; i <= 14; i++) {
  const z = -i * (L / 14);
  const x = i === 0 ? 0 : Math.sin(i * 0.9) * 16 + Math.sin(i * 0.37) * 10;
  const y = Math.sin(i * 0.55) * 2.2 + i * 0.55; // a gentle climb
  ctrl.push(new THREE.Vector3(x, y, z));
}
const curve = new THREE.CatmullRomCurve3(ctrl, false, 'centripetal');
const SAMPLES = 600;
const pathPts = curve.getSpacedPoints(SAMPLES);
const curveLen = curve.getLength();

function nearestOnPath(x, z) {
  let best = 1e9, bi = 0;
  for (let i = 0; i < pathPts.length; i += 3) {
    const p = pathPts[i], dx = p.x - x, dz = p.z - z, d = dx * dx + dz * dz;
    if (d < best) { best = d; bi = i; }
  }
  for (let i = Math.max(0, bi - 3); i < Math.min(pathPts.length, bi + 4); i++) {
    const p = pathPts[i], dx = p.x - x, dz = p.z - z, d = dx * dx + dz * dz;
    if (d < best) { best = d; bi = i; }
  }
  return { d: Math.sqrt(best), i: bi };
}

function groundHeight(x, z) {
  const n = nearestOnPath(x, z);
  const py = pathPts[n.i].y;
  const hills = (fbm(x * 0.012, z * 0.012) - 0.35) * 26 + fbm(x * 0.05, z * 0.05) * 3;
  const sideRise = Math.pow(Math.max(0, n.d - 18), 1.25) * 0.06;  // valley walls
  let h = py - 0.15 + (hills + sideRise) * smooth(3.2, 26, n.d);
  const past = -z - (L + 10);
  if (past > 0 && n.d < 200) h -= past * 0.55 * smooth(0, 40, past); // the overlook drops away
  return h;
}

/* ---------- Sky ---------- */
const sunDir = new THREE.Vector3(-0.25, 0.09, -1).normalize();
const sky = new THREE.Mesh(
  new THREE.SphereGeometry(2000, 32, 16),
  new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { sun: { value: sunDir } },
    vertexShader: `varying vec3 vDir; void main(){ vDir = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `
      uniform vec3 sun; varying vec3 vDir;
      void main(){
        float h = vDir.y;
        vec3 top = vec3(0.17,0.14,0.27);
        vec3 mid = vec3(0.62,0.43,0.52);
        vec3 hor = vec3(1.0,0.72,0.47);
        vec3 col = mix(hor, mid, smoothstep(0.0,0.22,h));
        col = mix(col, top, smoothstep(0.18,0.75,h));
        col = mix(col, vec3(0.36,0.26,0.32), smoothstep(0.0,-0.25,h));
        float s = max(dot(vDir, sun), 0.0);
        col += vec3(1.0,0.62,0.32) * pow(s, 8.0) * 0.55;
        col += vec3(1.0,0.86,0.62) * pow(s, 90.0) * 1.2;
        col += vec3(1.0,0.95,0.85) * smoothstep(0.9993,0.9996,s) * 2.0;
        gl_FragColor = vec4(col,1.0);
      }`
  })
);
scene.add(sky);

/* ---------- Lights ---------- */
scene.add(new THREE.HemisphereLight('#ffe2c4', '#5a4650', 1.9));
const fill = new THREE.DirectionalLight('#b9a6d8', 0.7); fill.position.set(0.3, 1, 1).multiplyScalar(100); scene.add(fill);
const sun = new THREE.DirectionalLight('#ffc48a', 2.6);
sun.position.copy(sunDir).multiplyScalar(120);
sun.castShadow = !mobile;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.camera.left = -40; sun.shadow.camera.right = 40;
sun.shadow.camera.top = 40; sun.shadow.camera.bottom = -40;
sun.shadow.camera.far = 400;
sun.shadow.bias = -0.0005;
scene.add(sun, sun.target);

/* ---------- Terrain ---------- */
{
  const size = 900, seg = mobile ? 140 : 220;
  const g = new THREE.PlaneGeometry(size, size + 300, seg, seg);
  g.rotateX(-Math.PI / 2);
  g.translate(0, 0, -L / 2 - 60);
  const pos = g.attributes.position;
  const colors = new Float32Array(pos.count * 3);
  const c1 = new THREE.Color('#9fae63'), c2 = new THREE.Color('#6f7f45'), c3 = new THREE.Color('#b59a6a');
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), z = pos.getZ(i);
    const h = groundHeight(x, z);
    pos.setY(i, h);
    const n = fbm(x * 0.03, z * 0.03);
    const c = c1.clone().lerp(c2, n).lerp(c3, smooth(14, 60, h - 6) * 0.6);
    colors[i * 3] = c.r; colors[i * 3 + 1] = c.g; colors[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({ map: tex('grass_diff' + T, 160, 210), vertexColors: true, roughness: 0.95 });
  const ground = new THREE.Mesh(g, m);
  ground.receiveShadow = true;
  scene.add(ground);
}

/* ---------- Path ribbon (cobbles) ---------- */
{
  const W = 1.7, pos = [], uv = [], idx = [];
  const up = new THREE.Vector3(0, 1, 0);
  let dist = 0;
  for (let i = 0; i <= SAMPLES; i++) {
    const p = pathPts[i];
    if (i > 0) dist += p.distanceTo(pathPts[i - 1]);
    const t = curve.getTangentAt(i / SAMPLES);
    const side = new THREE.Vector3().crossVectors(t, up).normalize();
    for (const s of [-1, 1]) {
      pos.push(p.x + side.x * W * s, p.y + 0.04, p.z + side.z * W * s);
      uv.push(s < 0 ? 0 : 1, dist / (W * 2));
    }
    if (i < SAMPLES) { const a = i * 2; idx.push(a, a + 2, a + 1, a + 1, a + 2, a + 3); }
  }
  const g = new THREE.BufferGeometry();
  g.setAttribute('position', new THREE.Float32BufferAttribute(pos, 3));
  g.setAttribute('uv', new THREE.Float32BufferAttribute(uv, 2));
  g.setIndex(idx);
  g.computeVertexNormals();
  const m = new THREE.MeshStandardMaterial({
    map: tex('cobble_diff' + T, 1, 1), normalMap: mobile ? null : tex('cobble_nor', 1, 1, false),
    roughness: 0.85, color: '#fff1dc'
  });
  const road = new THREE.Mesh(g, m);
  road.receiveShadow = true;
  scene.add(road);
}

/* ---------- Edging stones, flowers, pines ---------- */
const dummy = new THREE.Object3D();
function sideOf(u) {
  const t = curve.getTangentAt(u);
  return new THREE.Vector3(-t.z, 0, t.x).normalize();
}
{
  // edging stones
  const n = mobile ? 700 : 1300;
  const mesh = new THREE.InstancedMesh(new THREE.DodecahedronGeometry(0.15, 0), new THREE.MeshStandardMaterial({ color: '#cbbba6', roughness: 1, flatShading: true }), n);
  for (let i = 0; i < n; i++) {
    const u = (i >> 1) / (n / 2) * 0.985;
    const p = curve.getPointAt(u), s = sideOf(u), k = i % 2 ? 1 : -1;
    dummy.position.set(p.x + s.x * 1.85 * k, p.y + 0.02, p.z + s.z * 1.85 * k);
    dummy.rotation.set(rand() * 3, rand() * 3, rand() * 3);
    const sc = 0.7 + rand() * 0.8; dummy.scale.set(sc * 1.3, sc * 0.7, sc);
    dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
  }
  mesh.receiveShadow = true;
  scene.add(mesh);
}
{
  // wildflowers in drifts along the path
  const n = mobile ? 4000 : 10000;
  const palette = ['#f6a5c0', '#ffffff', '#f7d25c', '#c79be8', '#f28a6b', '#ffd1e0'].map(c => new THREE.Color(c));
  const geo = new THREE.IcosahedronGeometry(0.08, 0);
  const mesh = new THREE.InstancedMesh(geo, new THREE.MeshStandardMaterial({ roughness: 0.6, emissive: '#3a1d1d', emissiveIntensity: 0.15 }), n);
  const stems = new THREE.InstancedMesh(new THREE.ConeGeometry(0.05, 0.5, 3), new THREE.MeshStandardMaterial({ color: '#5f7a3a', roughness: 1 }), n);
  for (let i = 0; i < n; i++) {
    const u = rand() * 0.99;
    const p = curve.getPointAt(u), s = sideOf(u);
    const k = rand() < 0.5 ? -1 : 1;
    const off = 2.2 + Math.pow(rand(), 1.8) * 9;
    const along = (rand() - 0.5) * 2;
    const t = curve.getTangentAt(u);
    const x = p.x + s.x * off * k + t.x * along, z = p.z + s.z * off * k + t.z * along;
    const y = groundHeight(x, z);
    const h = 0.18 + rand() * 0.3;
    dummy.position.set(x, y + h, z); dummy.rotation.set(0, 0, 0);
    const sc = 0.7 + rand() * 0.9; dummy.scale.set(sc, sc * 0.8, sc);
    dummy.updateMatrix(); mesh.setMatrixAt(i, dummy.matrix);
    const pick = fbm(x * 0.08, z * 0.08) * palette.length * 1.6 + rand() * 1.2;
    mesh.setColorAt(i, palette[Math.floor(pick) % palette.length]);
    dummy.position.set(x, y + h * 0.5, z); dummy.scale.set(0.5, h * 2, 0.5);
    dummy.updateMatrix(); stems.setMatrixAt(i, dummy.matrix);
  }
  scene.add(mesh, stems);
}
{
  // deodar pines
  const n = mobile ? 380 : 800;
  const trunks = new THREE.InstancedMesh(new THREE.CylinderGeometry(0.18, 0.3, 3, 6), new THREE.MeshStandardMaterial({ map: tex('bark_diff' + T, 1, 2), roughness: 1 }), n);
  const lowCone = new THREE.ConeGeometry(2.3, 5.5, 8); lowCone.translate(0, 4.6, 0);
  const highCone = new THREE.ConeGeometry(1.5, 4.2, 8); highCone.translate(0, 7.6, 0);
  const leafMat = new THREE.MeshStandardMaterial({ color: '#4d6b40', roughness: 0.9, flatShading: true });
  const low = new THREE.InstancedMesh(lowCone, leafMat, n), high = new THREE.InstancedMesh(highCone, leafMat, n);
  const tint = new THREE.Color();
  let placed = 0, guard = 0;
  while (placed < n && guard++ < n * 20) {
    const u = rand() * 1.02;
    const p = curve.getPointAt(Math.min(u, 1)), s = sideOf(Math.min(u, 1));
    const k = rand() < 0.5 ? -1 : 1;
    const off = 7 + Math.pow(rand(), 1.3) * 110;
    const x = p.x + s.x * off * k + (rand() - 0.5) * 20, z = p.z + s.z * off * k + (rand() - 0.5) * 20;
    if (nearestOnPath(x, z).d < 6.5) continue;
    if (-z > L - 20 && Math.abs(x - pathPts[SAMPLES].x) < 40) continue; // keep the overlook open
    const y = groundHeight(x, z);
    const sc = 0.7 + rand() * 0.9;
    dummy.position.set(x, y + 1.4 * sc, z); dummy.rotation.set(0, rand() * 6, 0); dummy.scale.set(sc, sc, sc);
    dummy.updateMatrix(); trunks.setMatrixAt(placed, dummy.matrix);
    dummy.position.y = y; dummy.updateMatrix();
    low.setMatrixAt(placed, dummy.matrix); high.setMatrixAt(placed, dummy.matrix);
    tint.setHSL(0.25 + rand() * 0.07, 0.3, 0.42 + rand() * 0.18);
    low.setColorAt(placed, tint); high.setColorAt(placed, tint);
    placed++;
  }
  for (const m of [trunks, low, high]) { m.count = placed; m.castShadow = true; scene.add(m); }
}

/* ---------- Far ranges: layered ridgelines, snow on the farthest ---------- */
function ridge(dist, height, width, colA, colB, snow, seedX) {
  const segX = 360, segY = 24;
  const g = new THREE.PlaneGeometry(width, 1, segX, segY);
  const pos = g.attributes.position;
  const col = new Float32Array(pos.count * 3);
  const a = new THREE.Color(colA), bcol = new THREE.Color(colB), snowC = new THREE.Color('#fff1e4'), c = new THREE.Color();
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i), v = pos.getY(i) + 0.5; // 0 bottom .. 1 top
    const n = 1 - Math.abs(noise(x * 0.004 + seedX, seedX) * 2 - 1);
    const top = (Math.pow(n, 1.6) * 0.75 + fbm(x * 0.012 + seedX, 1.3) * 0.45) * height;
    pos.setX(i, x); pos.setY(i, v * top - 30); pos.setZ(i, 0);
    c.copy(bcol).lerp(a, v);
    if (snow && v * top > height * 0.55) c.lerp(snowC, smooth(height * 0.55, height * 0.72, v * top) * (0.6 + 0.4 * noise(x * 0.05, v * 9)));
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
  }
  g.setAttribute('color', new THREE.BufferAttribute(col, 3));
  const m = new THREE.Mesh(g, new THREE.MeshBasicMaterial({ vertexColors: true, fog: false, depthWrite: true }));
  m.position.set(0, 0, -L - dist);
  return m;
}
const ranges = new THREE.Group();
ranges.add(ridge(1500, 760, 5200, '#e4c6d0', '#e9b49a', true, 3.7));   // snowy Dhauladhar-like crest
ranges.add(ridge(1100, 300, 4400, '#a9839c', '#c99a8a', false, 9.1));
ranges.add(ridge(800, 140, 3600, '#7e6075', '#b48a84', false, 1.9));
scene.add(ranges);

/* ---------- Stations: timber arches, plaques and photo boards ---------- */
const stops = Array.from(document.querySelectorAll('.stop'));
const STATION_U = [0.11, 0.24, 0.37, 0.5, 0.63, 0.77, 0.955];
const woodMat = new THREE.MeshStandardMaterial({ map: tex('planks_diff' + T, 1, 2), color: '#c49a73', roughness: 0.85 });
const brass = new THREE.MeshStandardMaterial({ color: '#c9974f', metalness: 0.7, roughness: 0.35 });
const glowMat = new THREE.MeshBasicMaterial({ color: '#ffd59a' });

function plaqueTexture(num, label, year) {
  const c = document.createElement('canvas'); c.width = 1024; c.height = 300;
  const x = c.getContext('2d');
  x.fillStyle = '#2b1f22'; x.fillRect(0, 0, 1024, 300);
  x.strokeStyle = '#d9a75e'; x.lineWidth = 10; x.strokeRect(14, 14, 996, 272);
  x.fillStyle = '#f2c27c'; x.font = '600 150px Fraunces, Georgia, serif'; x.textBaseline = 'middle';
  x.fillText(num, 60, 155);
  x.fillStyle = '#f6efe6'; x.font = '500 74px Poppins, Arial, sans-serif';
  x.fillText(label, 300, 120);
  x.fillStyle = 'rgba(246,239,230,0.7)'; x.font = '400 50px Poppins, Arial, sans-serif';
  x.fillText(year, 302, 205);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4;
  return t;
}

const stations = stops.map((el, i) => {
  const u = STATION_U[i];
  const p = curve.getPointAt(u), t = curve.getTangentAt(u);
  const group = new THREE.Group();
  group.position.copy(p);
  group.lookAt(p.x - t.x, p.y, p.z - t.z); // face the walker
  const postG = new THREE.BoxGeometry(0.34, 4.4, 0.34);
  for (const s of [-1, 1]) {
    const post = new THREE.Mesh(postG, woodMat); post.position.set(2.45 * s, 2.2, 0); post.castShadow = true; group.add(post);
    const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 8), glowMat); lamp.position.set(2.45 * s, 3.6, 0.3); group.add(lamp);
  }
  const beam = new THREE.Mesh(new THREE.BoxGeometry(6, 0.38, 0.42), woodMat); beam.position.set(0, 4.45, 0); beam.castShadow = true; group.add(beam);
  const top = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.2, 0.7), woodMat); top.position.set(0, 4.75, 0); group.add(top);
  const plaque = new THREE.Mesh(new THREE.PlaneGeometry(3.1, 0.9), new THREE.MeshBasicMaterial({ map: plaqueTexture(el.dataset.num, el.dataset.label, el.dataset.year) }));
  plaque.position.set(0, 3.75, 0.24); group.add(plaque);
  const frameB = new THREE.Mesh(new THREE.BoxGeometry(3.24, 1.04, 0.06), brass); frameB.position.set(0, 3.75, 0.2); group.add(frameB);
  for (const s of [-1, 1]) { const chain = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.3), brass); chain.position.set(1.3 * s, 4.25, 0.22); group.add(chain); }

  // photo board beside the path, turned toward the walker
  const photo = el.dataset.photo;
  if (photo) {
    const board = new THREE.Group();
    const side = 1;
    board.position.set((mobile ? 3.1 : 4.6) * side, 0, 3.2);
    board.rotation.y = -side * 0.55;
    const img = loader.load(photo, (tx) => {
      const a = tx.image.width / tx.image.height;
      const h = 2.3, w = Math.min(3.4, h * a);
      pic.geometry.dispose(); pic.geometry = new THREE.PlaneGeometry(w, w / a);
      back.geometry.dispose(); back.geometry = new THREE.BoxGeometry(w + 0.24, w / a + 0.24, 0.08);
    });
    img.colorSpace = THREE.SRGBColorSpace; img.anisotropy = 4;
    const pic = new THREE.Mesh(new THREE.PlaneGeometry(2.4, 1.8), new THREE.MeshBasicMaterial({ map: img, toneMapped: false }));
    const back = new THREE.Mesh(new THREE.BoxGeometry(2.64, 2.04, 0.08), new THREE.MeshStandardMaterial({ color: '#f6efe6', roughness: 0.7 }));
    pic.position.set(0, 2.2, 0.05); back.position.set(0, 2.2, 0);
    for (const s of [-1, 1]) { const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.12), woodMat); leg.position.set(0.8 * s, 1.1, -0.15); leg.rotation.x = -0.08; board.add(leg); }
    back.castShadow = true;
    board.add(back, pic);
    group.add(board);
  }
  scene.add(group);
  return { u, el };
});

/* ---------- Walk: scroll drives the camera along the path ---------- */
const STOP_BACK = (mobile ? 17 : 10) / curveLen; // halt this far before each arch so it frames the view
const camStops = [0.005, ...STATION_U.map(u => u - STOP_BACK)];
const MOVE = 0.6; // share of each beat spent walking; the rest is a pause at the stop
const spacer = document.getElementById('walkSpace');
const hud = document.querySelector('.hud');
const trailLinks = Array.from(document.querySelectorAll('.trail a'));
const trailFill = document.getElementById('trailFill');
const countNow = document.getElementById('countNow');
const bar = document.getElementById('bar');
const trail = document.querySelector('.trail');
const hero = document.querySelector('.hero');

function beat() {
  const max = spacer.offsetHeight - window.innerHeight;
  const s = Math.min(1, Math.max(0, window.scrollY / max));
  return s * (camStops.length - 1);
}
function targetU(f) {
  const i = Math.min(camStops.length - 2, Math.floor(f));
  const frac = f - i;
  const m = smooth(0, MOVE, frac);
  return camStops[i] + (camStops[i + 1] - camStops[i]) * m;
}

let camU = targetU(beat());
let lastActive = -1;
const look = new THREE.Vector3(), eye = new THREE.Vector3(), lookCur = new THREE.Vector3();
let first = true;

function updateHud(f) {
  // a stop is "on" while you are pausing in front of it
  let active = 0;
  for (let k = 1; k < camStops.length; k++) {
    if (f >= k - 1 + MOVE - 0.08 && f < k + 0.1) active = k;
  }
  if (f >= camStops.length - 1 - (1 - MOVE) - 0.08) active = camStops.length - 1;
  if (active !== lastActive) {
    stops.forEach((el, i) => el.classList.toggle('on', i + 1 === active));
    hero.classList.toggle('off', f > 0.12);
    lastActive = active;
  }
  hero.classList.toggle('off', f > 0.12);
  const reached = Math.min(7, Math.floor(f + (1 - MOVE) + 0.08));
  trailLinks.forEach((a, i) => {
    a.classList.toggle('now', i + 1 === reached);
    a.classList.toggle('past', i + 1 < reached);
  });
  countNow.textContent = ('0' + reached).slice(-2);
  bar.classList.toggle('on', f > 0.3);
  trail.classList.toggle('on', f > 0.3);
  const total = f / (camStops.length - 1);
  if (mobile) trailFill.style.setProperty('--total', (total * 100).toFixed(1) + '%');
  else trailFill.style.height = (Math.min(1, Math.max(0, (f - 1 + (1 - MOVE)) / 6)) * trailFill.parentNode.offsetHeight).toFixed(1) + 'px';
}

trailLinks.forEach((a, i) => a.addEventListener('click', (e) => {
  e.preventDefault();
  const max = spacer.offsetHeight - window.innerHeight;
  const f = i + MOVE + 0.15; // land in the pause at stop i+1
  window.scrollTo({ top: (f / (camStops.length - 1)) * max, behavior: reduce ? 'auto' : 'smooth' });
}));
document.querySelectorAll('[data-walk-start]').forEach(a => a.addEventListener('click', (e) => {
  e.preventDefault(); trailLinks[0].click();
}));

const clock = new THREE.Clock();
function frame() {
  const dt = Math.min(0.05, clock.getDelta());
  const f = beat();
  const goal = targetU(f);
  camU += (goal - camU) * (reduce ? 1 : 1 - Math.pow(0.0025, dt));
  const speed = Math.abs(goal - camU) * curveLen;

  const p = curve.getPointAt(Math.min(0.999, Math.max(0, camU)));
  const bob = reduce ? 0 : Math.sin(camU * curveLen * 1.7) * Math.min(0.06, speed * 0.01);
  eye.set(p.x, p.y + 1.7 + bob, p.z);
  const ahead = curve.getPointAt(Math.min(1, camU + 14 / curveLen));
  look.set(ahead.x, ahead.y + 1.55 + (camU < 0.02 ? 1.2 : 0), ahead.z);
  if (first) { lookCur.copy(look); first = false; }
  lookCur.lerp(look, reduce ? 1 : 1 - Math.pow(0.02, dt));
  camera.position.copy(eye);
  camera.lookAt(lookCur);

  sun.position.copy(p).addScaledVector(sunDir, 120);
  sun.target.position.copy(p);
  sky.position.copy(p);

  updateHud(f);
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
}
document.documentElement.classList.add('webgl-ready');
requestAnimationFrame(frame);

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
