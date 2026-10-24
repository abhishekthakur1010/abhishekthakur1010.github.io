/* Chapter 05 — Delhivery, and Chapter 06 — What's Next.
   A parcel travels Warehouse → Inventory → Transportation → Fleet → Fintech → Last mile
   through a code-built network; real project covers float above each stop. In Chapter 06
   the camera rises and the network becomes points of light on a sunrise horizon. */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { clamp01, lerp, smooth, easeInOut, phone, panel, setOpacity } from "./kit.js";

const MATTE = (c, r = 0.75) => new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0.05 });
const RED = 0xd8323a, BONE = 0xe9e4da, STEEL = 0x8b95a7, DARK = 0x1b2230;

function kraft() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 512;
  const g = c.getContext("2d");
  g.fillStyle = "#b98a57"; g.fillRect(0, 0, 512, 512);
  for (let i = 0; i < 2600; i++) { g.fillStyle = `rgba(${Math.random() > 0.5 ? "90,60,30" : "220,180,130"},0.06)`; g.fillRect(Math.random() * 512, Math.random() * 512, 2, 2); }
  g.fillStyle = "rgba(225,205,170,0.85)"; g.fillRect(226, 0, 60, 512); // tape
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}
function truck(scale = 1) {
  const g = new THREE.Group();
  const box = new THREE.Mesh(new RoundedBoxGeometry(1.5, 0.72, 0.7, 3, 0.04), MATTE(BONE, 0.6)); box.position.set(-0.25, 0.55, 0);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.71), MATTE(RED, 0.5)); stripe.position.set(-0.25, 0.42, 0);
  const cab = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.56, 0.68, 3, 0.06), MATTE(RED, 0.45)); cab.position.set(0.78, 0.47, 0);
  const glass = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.22, 0.56), new THREE.MeshStandardMaterial({ color: 0x223044, roughness: 0.15, metalness: 0.6 })); glass.position.set(1.035, 0.6, 0);
  g.add(box, stripe, cab, glass);
  [[-0.7, 0.36], [-0.7, -0.36], [0.72, 0.36], [0.72, -0.36]].forEach(([x, z]) => {
    const w = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.1, 20), MATTE(0x111111, 0.9)); w.rotation.x = Math.PI / 2; w.position.set(x, 0.15, z); g.add(w);
  });
  g.scale.setScalar(scale);
  return g;
}
function warehouse() {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.9, 1.7), MATTE(BONE, 0.85)); body.position.y = 0.45;
  const roofShape = new THREE.Shape([new THREE.Vector2(-1.35, 0), new THREE.Vector2(1.35, 0), new THREE.Vector2(0, 0.42)]);
  const roof = new THREE.Mesh(new THREE.ExtrudeGeometry(roofShape, { depth: 1.8, bevelEnabled: false }), MATTE(STEEL, 0.5));
  roof.position.set(0, 0.9, -0.9);
  g.add(body, roof);
  for (let i = 0; i < 4; i++) { const d = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.5, 0.02), MATTE(DARK, 0.6)); d.position.set(-0.9 + i * 0.6, 0.27, 0.86); g.add(d); }
  return g;
}
function inventory() {
  const g = new THREE.Group(), box = new RoundedBoxGeometry(0.34, 0.3, 0.34, 2, 0.02), m = MATTE(0xb98a57, 0.85);
  for (let x = 0; x < 4; x++) for (let y = 0; y < 3; y++) for (let z = 0; z < 2; z++) {
    if (Math.random() < 0.15) continue;
    const b = new THREE.Mesh(box, m); b.position.set(-0.6 + x * 0.4, 0.15 + y * 0.32, -0.2 + z * 0.4); g.add(b);
  }
  const rack = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.03, 0.9), MATTE(STEEL, 0.4)); rack.position.y = 0.98; g.add(rack);
  return g;
}

export function createDelhivery({ tex, projects, mobile }) {
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x07101e, 10, 34);
  const camera = new THREE.PerspectiveCamera(mobile ? 52 : 40, 1, 0.05, 200);

  // sky dome: night blue in Chapter 05, sunrise in Chapter 06
  const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 32, 16), new THREE.ShaderMaterial({
    side: THREE.BackSide, depthWrite: false, fog: false,
    uniforms: { uRise: { value: 0 } },
    vertexShader: "varying vec3 vP; void main(){ vP = normalize(position); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
    fragmentShader: `uniform float uRise; varying vec3 vP;
      void main(){
        float h = vP.y;
        vec3 night = mix(vec3(0.03,0.06,0.12), vec3(0.01,0.02,0.05), smoothstep(0.0,0.6,h));
        vec3 dawn = mix(vec3(1.0,0.72,0.42), vec3(0.18,0.3,0.55), smoothstep(-0.02,0.42,h));
        dawn = mix(dawn, vec3(0.06,0.1,0.22), smoothstep(0.4,0.9,h));
        float glow = exp(-pow((h - 0.02) / 0.06, 2.0)) * 0.6;
        vec3 c = mix(night, dawn + vec3(1.0,0.82,0.6) * glow, uRise);
        gl_FragColor = vec4(c, 1.0);
        #include <colorspace_fragment>
      }`,
  }));
  scene.add(sky);
  const hemi = new THREE.HemisphereLight(0x9fb4e0, 0x0b1320, 0.75); scene.add(hemi);
  const sun = new THREE.DirectionalLight(0xffe2bf, 1.7); sun.position.set(6, 9, 4); scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(140, 140), new THREE.MeshStandardMaterial({ color: 0x0b1424, roughness: 0.95 }));
  ground.rotation.x = -Math.PI / 2; scene.add(ground);
  const grid = new THREE.GridHelper(140, 140, 0x1d2c46, 0x13203a); grid.position.y = 0.002; grid.material.transparent = true; scene.add(grid);

  // the network path
  const stops = [[-3, -3], [1.6, -6.6], [-1.6, -10.4], [2.4, -14], [-2, -17.6], [1.4, -21.2]];
  const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(0, 0, 2.2), ...stops.map(([x, z]) => new THREE.Vector3(x + (x > 0 ? -1.3 : 1.3), 0, z + 0.6)), new THREE.Vector3(0, 0, -24)]);
  const road = new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 0.035, 6, false), new THREE.MeshBasicMaterial({ color: 0x5a6f96, toneMapped: false }));
  road.position.y = 0.02; scene.add(road);
  const trail = new THREE.Mesh(new THREE.TubeGeometry(curve, 300, 0.045, 6, false), new THREE.MeshBasicMaterial({ color: 0xf2c37e, toneMapped: false }));
  trail.position.y = 0.025; trail.geometry.setDrawRange(0, 0); scene.add(trail);

  const builders = [
    () => warehouse(),
    () => inventory(),
    () => truck(1),
    () => { const g = new THREE.Group(); [-0.95, 0, 0.95].forEach((z, i) => { const t = truck(0.55); t.position.set(i * 0.35 - 0.35, 0, z); g.add(t); }); return g; },
    () => { const g = new THREE.Group(); const ph = phone(tex("../images/delfin/delfin-home.png"), { w: 0.6, h: 1.27 }); ph.position.y = 0.75; ph.rotation.y = 0.2; g.add(ph);
            const tag = new THREE.Mesh(new RoundedBoxGeometry(0.5, 0.3, 0.02, 2, 0.03), MATTE(RED, 0.4)); tag.position.set(0.55, 0.4, 0.2); tag.rotation.y = -0.4; g.add(tag); return g; },
    () => { const g = new THREE.Group(); const ph = phone(tex("../images/design-study/delhivery-case-study-fe-shipment-listing.png"), { w: 0.6, h: 1.27 }); ph.position.y = 0.75; ph.rotation.y = -0.2; g.add(ph);
            const house = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.55, 0.6), MATTE(BONE, 0.85)); house.position.set(0.75, 0.28, -0.2); g.add(house);
            const pk = new THREE.Mesh(new RoundedBoxGeometry(0.22, 0.18, 0.22, 2, 0.02), MATTE(0xb98a57)); pk.position.set(0.55, 0.09, 0.25); g.add(pk); return g; },
  ];
  const nodes = stops.map(([x, z], i) => {
    const g = builders[i]();
    g.position.set(x, 0, z);
    g.rotation.y = x > 0 ? -0.35 : 0.35;
    scene.add(g);
    const ring = new THREE.Mesh(new THREE.RingGeometry(1.25, 1.32, 64), new THREE.MeshBasicMaterial({ color: 0xf2c37e, transparent: true, opacity: 0.15, toneMapped: false, side: THREE.DoubleSide }));
    ring.rotation.x = -Math.PI / 2; ring.position.set(x, 0.01, z); scene.add(ring);
    const pn = panel(tex(projects[i].img), { w: 1.7, h: 0.96 });
    pn.position.set(x + (x > 0 ? 0.4 : -0.4), 2.25, z);
    pn.rotation.y = x > 0 ? -0.22 : 0.22;
    scene.add(pn);
    const beacon = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 10), new THREE.MeshBasicMaterial({ color: 0xffd9a0, toneMapped: false }));
    beacon.position.set(x, 3.1, z); scene.add(beacon);
    return { g, ring, pn, beacon, t: 0 };
  });
  // where along the curve each stop sits
  const N = 600, pts = curve.getSpacedPoints(N);
  nodes.forEach((n) => { let best = 0, bd = 1e9; pts.forEach((p, i) => { const d = p.distanceTo(n.g.position); if (d < bd) { bd = d; best = i; } }); n.t = best / N; });

  // the parcel
  const kraftTex = kraft();
  const parcel = new THREE.Mesh(new RoundedBoxGeometry(0.62, 0.46, 0.5, 3, 0.03), new THREE.MeshStandardMaterial({ map: kraftTex, roughness: 0.85 }));
  const logo = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.1), new THREE.MeshBasicMaterial({ map: tex("../images/brandLogo/delhivery.png"), transparent: true }));
  logo.position.set(0, 0.04, 0.252); parcel.add(logo);
  scene.add(parcel);

  // Chapter 06: far points of light on the horizon (other networks, what's next)
  const farGeo = new THREE.BufferGeometry(), farN = mobile ? 90 : 180, fp = new Float32Array(farN * 3);
  for (let i = 0; i < farN; i++) { const a = (Math.random() - 0.5) * 2.2, r = 12 + Math.random() * 42; fp.set([Math.sin(a) * r, 0.05, -Math.cos(a) * r - 34], i * 3); }
  farGeo.setAttribute("position", new THREE.BufferAttribute(fp, 3));
  const far = new THREE.Points(farGeo, new THREE.PointsMaterial({ color: 0xffd9a0, size: 0.18, transparent: true, opacity: 0, toneMapped: false, depthWrite: false }));
  scene.add(far);

  const camPos = new THREE.Vector3(), look = new THREE.Vector3(), tan = new THREE.Vector3();
  let rise = 0;

  /** p5: Chapter 05 progress; p6: Chapter 06 progress (0 while in Chapter 05). */
  function update(p5, p6 = 0) {
    // parcel travels the network
    const u = easeInOut(smooth(0.16, 0.8, p5));
    const at = curve.getPointAt(Math.min(0.999, u * 0.97));
    curve.getTangentAt(Math.min(0.999, u * 0.97), tan);
    parcel.position.set(at.x, 0.26 + Math.abs(Math.sin(u * 60)) * 0.015, at.z);
    parcel.rotation.y = Math.atan2(tan.x, tan.z);
    trail.geometry.setDrawRange(0, Math.floor(u * 0.97 * 300) * 6 * 6);

    // 0–0.16 close on the parcel
    const open = easeInOut(smooth(0, 0.16, p5));
    camPos.set(1.1, 0.75, 3.3).lerp(new THREE.Vector3(at.x - tan.x * 3.2 + 0.9, 2.5, at.z - tan.z * 3.2 + 1.8), open);
    look.set(0, 0.3, 2.2).lerp(new THREE.Vector3(at.x + tan.x * 2.4, 1.5, at.z + tan.z * 2.4 - 1.2), open);

    // which stop is in focus
    let focus = 0, fd = 9;
    nodes.forEach((n, i) => { const d = Math.abs(u * 0.97 - n.t); if (d < fd) { fd = d; focus = i; } });
    nodes.forEach((n, i) => {
      const reached = u * 0.97 >= n.t - 0.01;
      n.ring.material.opacity = reached ? 0.65 : 0.15;
      setOpacity(n.pn, smooth(0.08, 0.2, p5) * (i === focus ? 1 : reached ? 0.6 : 0.35));
      n.beacon.visible = reached;
    });

    // 0.8–1: rise to see the whole system
    const sys = easeInOut(smooth(0.8, 0.98, p5));
    camPos.lerp(new THREE.Vector3(0, 15, 6), sys);
    look.lerp(new THREE.Vector3(0, 0, -11), sys);

    // Chapter 06: fly over the network toward dawn; it ends behind the camera
    rise = easeInOut(smooth(0, 0.55, p6));
    if (p6 > 0) {
      camPos.lerp(new THREE.Vector3(0, 3.0, -27), rise);
      // tilted slightly up: the horizon sits low, so the final hero reads against open sky
      look.lerp(new THREE.Vector3(0, mobile ? 14 : 11, -90), rise);
      nodes.forEach((n) => setOpacity(n.pn, lerp(0.6, 0, rise)));
    }
    sky.material.uniforms.uRise.value = rise;
    scene.fog.color.setRGB(lerp(0.027, 0.55, rise), lerp(0.063, 0.42, rise), lerp(0.118, 0.36, rise));
    scene.fog.near = lerp(10, 18, rise); scene.fog.far = lerp(34, 95, rise);
    grid.material.opacity = lerp(1, 0.25, rise);
    far.material.opacity = smooth(0.15, 0.6, p6);
    sun.intensity = lerp(1.7, 2.2, rise);
    return focus;
  }
  function apply(cam) { cam.position.copy(camPos); cam.lookAt(look); }
  return { scene, camera, update, apply, prefetch: () => projects.forEach((p) => tex(p.img)) };
}
