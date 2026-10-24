/* Chapter 03 — Dineout. A pendant-lit restaurant table; the "Reserved" card lifts
   off the table and becomes the first project panel, then the real Dineout work
   fans out as panels the camera moves across. Objects are code-built (not renders). */
import * as THREE from "three";
import { clamp01, lerp, smooth, easeInOut, panel, setOpacity } from "./kit.js";

function woodTexture() {
  const c = document.createElement("canvas"); c.width = 1024; c.height = 1024;
  const g = c.getContext("2d");
  g.fillStyle = "#4a2f1d"; g.fillRect(0, 0, 1024, 1024);
  for (let i = 0; i < 260; i++) {
    const y = Math.random() * 1024, a = 0.03 + Math.random() * 0.07;
    g.strokeStyle = Math.random() > 0.5 ? `rgba(30,16,8,${a})` : `rgba(120,78,46,${a})`;
    g.lineWidth = 1 + Math.random() * 3;
    g.beginPath(); g.moveTo(0, y);
    for (let x = 0; x <= 1024; x += 64) g.lineTo(x, y + Math.sin(x * 0.006 + i) * 6);
    g.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
function tentCard() {
  const c = document.createElement("canvas"); c.width = 512; c.height = 320;
  const g = c.getContext("2d");
  g.fillStyle = "#f4efe6"; g.fillRect(0, 0, 512, 320);
  g.fillStyle = "#1c1a17"; g.textAlign = "center";
  g.font = "italic 300 64px Fraunces, Georgia, serif"; g.fillText("Reserved", 256, 160);
  g.font = "500 22px Inter, sans-serif"; g.fillStyle = "#8a7f72"; g.fillText("TABLE FOR TWO · 8:30 PM", 256, 214);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function createDineout({ tex, projects, mobile }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0705);
  scene.fog = new THREE.Fog(0x0a0705, 6, 16);
  const camera = new THREE.PerspectiveCamera(mobile ? 50 : 38, 1, 0.05, 60);

  // light: one warm pendant over the table, a cool rim from the room
  const pendant = new THREE.SpotLight(0xffd7a0, 60, 12, 0.62, 0.55, 1.6);
  pendant.position.set(0, 4.2, 0.3); pendant.target.position.set(0, 0, 0);
  scene.add(pendant, pendant.target);
  scene.add(new THREE.HemisphereLight(0x3a4a6a, 0x120a05, 0.35));
  const rim = new THREE.DirectionalLight(0x8fa3ce, 0.5); rim.position.set(-4, 2, -4); scene.add(rim);
  const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.09, 16, 12), new THREE.MeshBasicMaterial({ color: 0xffe2b0 }));
  bulb.position.set(0, 3.0, 0.3);
  const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 3, 6), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  cord.position.set(0, 4.5, 0.3);
  const shade = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.3, 32, 1, true), new THREE.MeshStandardMaterial({ color: 0x1b1f24, metalness: 0.7, roughness: 0.35, side: THREE.DoubleSide }));
  shade.position.set(0, 3.12, 0.3);
  scene.add(bulb, cord, shade);

  // the table and its setting
  const table = new THREE.Group();
  const top = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.07, 72), new THREE.MeshStandardMaterial({ map: woodTexture(), roughness: 0.48, metalness: 0.05 }));
  table.add(top);
  const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.12, 1.4, 24), new THREE.MeshStandardMaterial({ color: 0x15100c, roughness: 0.6 }));
  leg.position.y = -0.74; table.add(leg);
  const plateProfile = [[0, 0], [0.34, 0], [0.4, 0.02], [0.46, 0.05], [0.47, 0.055], [0.44, 0.045], [0.33, 0.012], [0, 0.012]].map(([x, y]) => new THREE.Vector2(x, y));
  const plateMat = new THREE.MeshStandardMaterial({ color: 0xf2eee8, roughness: 0.25, metalness: 0.0 });
  [[-0.62, 0.42], [0.62, -0.42]].forEach(([x, z]) => {
    const p = new THREE.Mesh(new THREE.LatheGeometry(plateProfile, 48), plateMat);
    p.position.set(x, 0.036, z); table.add(p);
    const knife = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.006, 0.42), new THREE.MeshStandardMaterial({ color: 0xc9c9c9, metalness: 1, roughness: 0.25 }));
    knife.position.set(x + 0.58 * Math.sign(x), 0.04, z); table.add(knife);
  });
  const glassProfile = [[0, 0], [0.12, 0], [0.12, 0.012], [0.015, 0.03], [0.015, 0.22], [0.1, 0.3], [0.12, 0.42], [0.11, 0.48]].map(([x, y]) => new THREE.Vector2(x, y));
  const glass = new THREE.Mesh(new THREE.LatheGeometry(glassProfile, 40),
    mobile ? new THREE.MeshStandardMaterial({ color: 0xcfe3ff, transparent: true, opacity: 0.25, roughness: 0.05 })
           : new THREE.MeshPhysicalMaterial({ color: 0xffffff, transmission: 1, thickness: 0.05, roughness: 0.04, ior: 1.45 }));
  glass.position.set(0.25, 0.036, 0.55); table.add(glass);
  const candle = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.16, 20), new THREE.MeshStandardMaterial({ color: 0xf1e3c8, emissive: 0x331a00, roughness: 0.7 }));
  candle.position.set(-0.2, 0.12, -0.05); table.add(candle);
  const flame = new THREE.PointLight(0xffa64d, 0.9, 2.2); flame.position.set(-0.2, 0.26, -0.05); table.add(flame);
  scene.add(table);

  // the reservation card that becomes the interface
  const card = new THREE.Group();
  const cardFace = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.39), new THREE.MeshStandardMaterial({ map: tentCard(), roughness: 0.8, side: THREE.DoubleSide }));
  card.add(cardFace);
  card.position.set(0.05, 0.24, 0.05);
  card.rotation.x = -0.18;
  scene.add(card);

  // project panels: real Dineout covers on an arc
  const N = projects.length, R = mobile ? 4.2 : 5.2;
  const panels = projects.map((p, i) => {
    const pn = panel(tex(p.img), { w: 1.6, h: 0.9 });
    const a = (i - (N - 1) / 2) * 0.36;
    pn.userData.home = new THREE.Vector3(Math.sin(a) * R, 1.65, -Math.cos(a) * R + R - 1.2);
    pn.userData.angle = -a;
    scene.add(pn);
    return pn;
  });

  let focus = 0;
  const camPos = new THREE.Vector3(), look = new THREE.Vector3();

  /** p: chapter progress 0..1 */
  function update(p) {
    // 0.00–0.28 establish: slow descent toward the table
    const est = easeInOut(smooth(0, 0.28, p));
    // 0.26–0.5 the card lifts, turns and grows into the first panel (the 10K → 10M beat plays over it)
    const lift = easeInOut(smooth(0.26, 0.5, p));
    // 0.56–0.95 the work: camera moves across the panels
    const work = smooth(0.58, 0.95, p);

    camPos.set(lerp(2.6, 1.9, est), lerp(3.4, 2.1, est), lerp(4.2, 3.0, est));
    look.set(0, lerp(0.1, 0.25, est), 0);

    const first = panels[0].userData.home;
    card.position.set(lerp(0.05, first.x, lift), lerp(0.24, first.y, lift), lerp(0.05, first.z, lift));
    card.rotation.set(lerp(-0.18, 0, lift), lerp(0, panels[0].userData.angle, lift), 0);
    card.scale.setScalar(lerp(1, 2.58, lift));
    setOpacity(card, 1 - smooth(0.5, 0.55, p));

    // panels appear as the card arrives, then the camera tours them
    const appear = smooth(0.48, 0.6, p);
    const f = work * (N - 1);
    focus = Math.round(f);
    panels.forEach((pn, i) => {
      const h = pn.userData.home;
      const k = clamp01(appear * 1.6 - i * 0.12);
      pn.position.set(h.x, lerp(0.3, h.y, k), h.z);
      pn.rotation.y = pn.userData.angle;
      const near = 1 - Math.min(1, Math.abs(f - i));
      pn.scale.setScalar(lerp(0.86, 1.04, near) * lerp(0.6, 1, k));
      setOpacity(pn, k * lerp(0.42, 1, near));
    });
    if (p > 0.4) {
      const t = easeInOut(smooth(0.4, 0.58, p));
      const ff = panels[Math.min(N - 1, Math.floor(f))].userData.home, fn = panels[Math.min(N - 1, Math.ceil(f))].userData.home;
      const fx = lerp(ff.x, fn.x, f - Math.floor(f)), fz = lerp(ff.z, fn.z, f - Math.floor(f));
      const target = new THREE.Vector3(fx, 1.62, fz);
      const dir = new THREE.Vector3(fx, 0, fz - (R - 1.2)).normalize();
      const cam = target.clone().addScaledVector(dir, -(mobile ? 3.4 : 2.6));
      cam.y = 1.72;
      camPos.lerp(cam, t);
      look.lerp(target, t);
    }
    // the room falls away as the work takes over
    const away = smooth(0.5, 0.66, p);
    table.position.y = -away * 0.6;
    pendant.intensity = lerp(60, 26, away);
    return focus;
  }

  function apply(cam) { cam.position.copy(camPos); cam.lookAt(look); }
  return { scene, camera, update, apply, prefetch: () => projects.forEach((p) => tex(p.img)) };
}
