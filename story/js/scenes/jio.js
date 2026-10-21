/* Chapter 04 — Jio Platforms. Connected devices running real JioMart, MyJio and
   Netmeds screens, linked through one ecosystem hub. Opens tight on a single
   phone and pulls back ("Then the scale changed"), then tours each project. */
import * as THREE from "three";
import { clamp01, lerp, smooth, easeInOut, phone, panel, setPhoneScreen, setScroll, setOpacity } from "./kit.js";

function labelTexture(text, sub) {
  const c = document.createElement("canvas"); c.width = 512; c.height = 160;
  const g = c.getContext("2d");
  g.fillStyle = "rgba(9,14,26,0.85)"; g.beginPath(); g.roundRect(4, 4, 504, 152, 76); g.fill();
  g.strokeStyle = "rgba(238,241,247,0.25)"; g.lineWidth = 2; g.stroke();
  g.fillStyle = "#eef1f7"; g.font = "500 40px Inter, sans-serif"; g.textAlign = "center"; g.fillText(text, 256, 78);
  g.fillStyle = "rgba(238,241,247,0.55)"; g.font = "400 24px Inter, sans-serif"; g.fillText(sub, 256, 116);
  const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

export function createJio({ tex, projects, recognition, mobile }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x060b18);
  scene.fog = new THREE.Fog(0x060b18, 7, 18);
  const camera = new THREE.PerspectiveCamera(mobile ? 52 : 38, 1, 0.05, 60);
  scene.add(new THREE.HemisphereLight(0x8fa8ff, 0x0a0f1a, 0.9));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(3, 5, 6); scene.add(key);

  // devices: positions form a loose constellation around the hub
  const [disc, check, myjio, netmeds] = projects;
  const P0 = phone(tex(disc.screens[0])); P0.position.set(-2.5, 0, 0.2); P0.rotation.y = 0.32;
  const P1 = phone(tex(check.screens[0])); P1.position.set(-0.85, 0.2, -1.1); P1.rotation.y = 0.12;
  const P2 = phone(tex("../images/visual-feed-gallery/visual-gallery-30.webp")); P2.position.set(0.9, -0.05, -0.5); P2.rotation.y = -0.12;
  const N3 = panel(tex(netmeds.img), { w: 1.7, h: 0.96 }); N3.position.set(2.75, 0.25, 0.1); N3.rotation.y = -0.38;
  const M2 = panel(tex(myjio.img), { w: 1.3, h: 0.73 }); M2.position.set(1.95, -0.95, -1.7); M2.rotation.y = -0.2;
  scene.add(P0, P1, P2, N3, M2);
  const targets = [P0, P1, P2, N3];

  // further surfaces of the ecosystem: named, not illustrated (no screens yet)
  const tags = [
    ["WhatsApp commerce", "case study in preparation", -3.4, 2.2, -5.2],
    ["Urban Ladder", "case study in preparation", 3.6, 2.25, -5.4],
  ].map(([a, b, x, y, z]) => {
    const s = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.5), new THREE.MeshBasicMaterial({ map: labelTexture(a, b), transparent: true, toneMapped: false }));
    s.position.set(x, y, z); scene.add(s); return s;
  });

  // hub + links
  const hub = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.012, 12, 64), new THREE.MeshBasicMaterial({ color: 0x7ea2ff, toneMapped: false }));
  hub.position.set(0.1, 1.55, -2.2); scene.add(hub);
  const linkMat = new THREE.LineDashedMaterial({ color: 0x5b7bd6, dashSize: 0.06, gapSize: 0.05, transparent: true, opacity: 0.7 });
  const links = [...targets, M2, ...tags].map((o) => {
    const g = new THREE.BufferGeometry().setFromPoints([hub.position.clone(), o.position.clone().add(new THREE.Vector3(0, 0.6, 0))]);
    const l = new THREE.Line(g, linkMat); l.computeLineDistances(); scene.add(l); return l;
  });

  // recognition: the Spotlight Award certificate
  const award = panel(tex(recognition.img), { w: 1.5, h: 0.84 });
  award.position.set(0, 0.3, 1.6); scene.add(award);

  const camPos = new THREE.Vector3(), look = new THREE.Vector3();
  const tmp = new THREE.Vector3();
  const frontOf = (o, dist) => {
    const n = new THREE.Vector3(0, 0, 1).applyQuaternion(o.quaternion);
    return o.position.clone().addScaledVector(n, dist).add(new THREE.Vector3(0, 0.05, 0));
  };
  const wide = { pos: new THREE.Vector3(0, 1.2, 6.6), look: new THREE.Vector3(0, 0.25, -0.6) };

  function update(p) {
    // 0–0.26: tight on the first phone, pulling back to the whole ecosystem
    const pull = easeInOut(smooth(0.06, 0.26, p));
    camPos.copy(frontOf(P0, mobile ? 2.2 : 1.7)).lerp(wide.pos, pull);
    look.copy(P0.position).lerp(wide.look, pull);

    // 0.28–0.86: tour the four projects
    const tour = smooth(0.3, 0.84, p);
    const f = tour * (targets.length - 1), i0 = Math.floor(f), i1 = Math.min(targets.length - 1, i0 + 1), k = easeInOut(f - i0);
    const into = easeInOut(smooth(0.26, 0.34, p)) * (1 - easeInOut(smooth(0.84, 0.92, p)));
    if (into > 0) {
      const dist = (o) => (o === N3 ? (mobile ? 3.4 : 2.9) : mobile ? 3.3 : 2.9);
      tmp.copy(frontOf(targets[i0], dist(targets[i0]))).lerp(frontOf(targets[i1], dist(targets[i1])), k);
      camPos.lerp(tmp, into);
      look.lerp(targets[i0].position.clone().lerp(targets[i1].position, k), into);
      // desktop: frame the device right of centre, leaving the left column to the text
      if (!mobile) {
        const right = new THREE.Vector3().subVectors(look, camPos).cross(new THREE.Vector3(0, 1, 0)).normalize();
        camPos.addScaledVector(right, -0.75 * into);
        look.addScaledVector(right, -0.75 * into);
      }
    }
    // 0.86–1: back out, the recognition card comes forward
    const out = easeInOut(smooth(0.86, 1, p));
    camPos.lerp(new THREE.Vector3(0, 0.9, 4.9), out);
    look.lerp(new THREE.Vector3(0, 0.3, 0.4), out);
    setOpacity(award, smooth(0.86, 0.95, p));

    // live screens: discovery steps home → PLP → PDP, checkout cart → payment → success
    const focus = Math.round(f);
    const local = (idx) => clamp01((f - idx + 0.5));
    const step = (ph, list, idx) => {
      const s = local(idx), n = Math.min(list.length - 1, Math.floor(s * list.length));
      const t = tex(list[n]);
      if (ph.userData.screenMat.map !== t) setPhoneScreen(ph, t);
      setScroll(t, (s * list.length) % 1);
    };
    step(P0, disc.screens, 0);
    step(P1, check.screens, 1);
    setScroll(P2.userData.screenMat.map, local(2));

    [...targets, M2].forEach((o, i) => setOpacity(o, i < targets.length && i !== focus && into > 0.5 ? 0.55 : 1));
    linkMat.dashSize = 0.06; linkMat.opacity = 0.35 + 0.4 * pull;
    hub.rotation.z = p * 4;
    return Math.min(focus, targets.length - 1);
  }
  function apply(cam) { cam.position.copy(camPos); cam.lookAt(look); }
  return { scene, camera, update, apply, prefetch: () => { disc.screens.concat(check.screens).forEach((u) => tex(u)); } };
}
