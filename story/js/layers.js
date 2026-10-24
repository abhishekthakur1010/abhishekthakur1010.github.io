/* Chapter 02 interactive scene: the anatomy of a web page.
   Scroll explodes one page into Code → Structure → Interface → Human.
   Drag to turn, hover (or tap) a layer for its caption. */
import * as THREE from "three";

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

const PAGE_W = 1.6, PAGE_H = 1.0;

/* ---------- procedural layer textures ---------- */
function paint(w, h, draw) {
  const c = document.createElement("canvas");
  c.width = w; c.height = h;
  draw(c.getContext("2d"), w, h);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}
function roundRect(g, x, y, w, h, r) {
  g.beginPath(); g.roundRect(x, y, w, h, r);
}

const drawCode = (g, W, H) => {
  g.fillStyle = "#0b1322"; g.fillRect(0, 0, W, H);
  const s = W / 1024;
  const lines = [
    [["#6d7fa3", "<!doctype "], ["#c9b89a", "html"], ["#6d7fa3", ">"]],
    [["#6d7fa3", "<"], ["#e5484d", "header "], ["#c9b89a", "class"], ["#eef1f7", '="nav"'], ["#6d7fa3", ">"]],
    [["#eef1f7", "  "], ["#6d7fa3", "<"], ["#e5484d", "a "], ["#c9b89a", "href"], ["#eef1f7", '="/"'], ["#6d7fa3", ">"], ["#eef1f7", "home"], ["#6d7fa3", "</a>"]],
    [["#6d7fa3", "</header>"]],
    [["#6d7fa3", "<"], ["#e5484d", "section "], ["#c9b89a", "class"], ["#eef1f7", '="hero"'], ["#6d7fa3", ">"]],
    [["#eef1f7", "  "], ["#6d7fa3", "<"], ["#e5484d", "h1"], ["#6d7fa3", ">"], ["#fef3dd", "Hello, world."], ["#6d7fa3", "</h1>"]],
    [["#eef1f7", "  "], ["#6d7fa3", "<"], ["#e5484d", "button"], ["#6d7fa3", ">"], ["#fef3dd", "Get started"], ["#6d7fa3", "</button>"]],
    [["#6d7fa3", "</section>"]],
    [["#6d7fa3", "<"], ["#e5484d", "style"], ["#6d7fa3", ">"]],
    [["#eef1f7", "  .hero { "], ["#c9b89a", "display"], ["#eef1f7", ": grid; "], ["#c9b89a", "gap"], ["#eef1f7", ": 24px; }"]],
    [["#eef1f7", "  h1 { "], ["#c9b89a", "font-size"], ["#eef1f7", ": 64px; }"]],
    [["#6d7fa3", "</style>"]],
    [["#6d7fa3", "<!-- 2 a.m. · hostel room · it finally works -->"]],
  ];
  g.font = `${22 * s}px ui-monospace, SFMono-Regular, Menlo, monospace`;
  g.textBaseline = "top";
  lines.forEach((ln, i) => {
    let x = 64 * s;
    const y = (48 + i * 42) * s;
    g.fillStyle = "rgba(238,241,247,0.22)";
    g.fillText(String(i + 1).padStart(2, " "), 18 * s, y);
    ln.forEach(([col, txt]) => { g.fillStyle = col; g.fillText(txt, x, y); x += g.measureText(txt).width; });
  });
};

const drawStructure = (g, W, H) => {
  g.clearRect(0, 0, W, H);
  const s = W / 1024;
  g.strokeStyle = "rgba(143,163,206,0.9)"; g.lineWidth = 2 * s;
  g.setLineDash([10 * s, 8 * s]);
  g.strokeRect(4 * s, 4 * s, W - 8 * s, H - 8 * s);
  g.setLineDash([]);
  // 12-col grid
  g.fillStyle = "rgba(109,127,163,0.10)";
  for (let i = 0; i < 12; i++) g.fillRect((48 + i * 78) * s, 0, 62 * s, H);
  const box = (x, y, w, h, label) => {
    g.strokeStyle = "rgba(201,212,238,0.85)"; g.strokeRect(x * s, y * s, w * s, h * s);
    g.fillStyle = "rgba(201,212,238,0.85)"; g.font = `${16 * s}px Inter, sans-serif`;
    g.fillText(label, (x + 10) * s, (y + 24) * s);
  };
  box(48, 32, 928, 64, "header · nav");
  box(48, 128, 560, 220, "hero · h1 + cta");
  box(640, 128, 336, 220, "media");
  box(48, 380, 290, 210, "card");
  box(367, 380, 290, 210, "card");
  box(686, 380, 290, 210, "card");
};

const drawInterface = (g, W, H) => {
  const s = W / 1024;
  g.fillStyle = "#f3eee6"; g.fillRect(0, 0, W, H);
  // nav
  g.fillStyle = "#0b1220"; g.font = `600 ${22 * s}px Fraunces, Georgia, serif`;
  g.fillText("studio.", 56 * s, 74 * s);
  g.fillStyle = "rgba(11,18,32,0.55)"; g.font = `${17 * s}px Inter, sans-serif`;
  ["Work", "About", "Contact"].forEach((t, i) => g.fillText(t, (700 + i * 96) * s, 72 * s));
  // hero
  g.fillStyle = "#0b1220"; g.font = `300 ${66 * s}px Fraunces, Georgia, serif`;
  g.fillText("Hello,", 56 * s, 210 * s);
  g.fillText("world.", 56 * s, 280 * s);
  roundRect(g, 56 * s, 308 * s, 170 * s, 46 * s, 23 * s); g.fillStyle = "#e5484d"; g.fill();
  g.fillStyle = "#fff"; g.font = `600 ${17 * s}px Inter, sans-serif`; g.fillText("Get started", 90 * s, 338 * s);
  // media
  const mg = g.createLinearGradient(640 * s, 128 * s, 976 * s, 348 * s);
  mg.addColorStop(0, "#2a3b57"); mg.addColorStop(0.6, "#6d7fa3"); mg.addColorStop(1, "#f0c89a");
  roundRect(g, 640 * s, 128 * s, 336 * s, 220 * s, 14 * s); g.fillStyle = mg; g.fill();
  g.fillStyle = "rgba(14,23,38,0.55)";
  g.beginPath(); g.moveTo(640 * s, 348 * s); g.lineTo(730 * s, 262 * s); g.lineTo(790 * s, 300 * s); g.lineTo(880 * s, 214 * s); g.lineTo(976 * s, 300 * s); g.lineTo(976 * s, 348 * s); g.closePath(); g.fill();
  // cards
  [48, 367, 686].forEach((x, i) => {
    roundRect(g, x * s, 380 * s, 290 * s, 210 * s, 14 * s); g.fillStyle = "#fff"; g.fill();
    roundRect(g, (x + 18) * s, 398 * s, 254 * s, 104 * s, 10 * s); g.fillStyle = ["#d9dfeb", "#efe3d1", "#e6d9e0"][i]; g.fill();
    g.fillStyle = "#0b1220"; g.font = `600 ${17 * s}px Inter, sans-serif`; g.fillText(["Discover", "Book", "Share"][i], (x + 18) * s, 536 * s);
    g.fillStyle = "rgba(11,18,32,0.4)"; g.fillRect((x + 18) * s, 552 * s, 180 * s, 8 * s);
  });
};

const drawHuman = (g, W, H) => {
  g.clearRect(0, 0, W, H);
  const s = W / 1024;
  // F-pattern attention heatmap
  const spots = [[150, 230, 170, 0.75], [300, 250, 140, 0.5], [140, 330, 90, 0.85], [800, 240, 120, 0.35], [190, 480, 110, 0.5], [500, 470, 90, 0.3], [130, 70, 80, 0.4]];
  g.globalCompositeOperation = "lighter";
  spots.forEach(([x, y, r, a]) => {
    const rg = g.createRadialGradient(x * s, y * s, 0, x * s, y * s, r * s);
    rg.addColorStop(0, `rgba(229,72,77,${a})`);
    rg.addColorStop(0.5, `rgba(255,140,80,${a * 0.45})`);
    rg.addColorStop(1, "rgba(255,140,80,0)");
    g.fillStyle = rg; g.fillRect(0, 0, W, H);
  });
  g.globalCompositeOperation = "source-over";
  // gaze path
  const path = [[130, 70], [160, 220], [330, 245], [140, 330], [800, 240], [190, 480], [500, 470]];
  g.strokeStyle = "rgba(254,243,221,0.9)"; g.lineWidth = 2 * s; g.setLineDash([6 * s, 6 * s]);
  g.beginPath(); path.forEach(([x, y], i) => (i ? g.lineTo(x * s, y * s) : g.moveTo(x * s, y * s))); g.stroke();
  g.setLineDash([]);
  path.forEach(([x, y], i) => {
    g.beginPath(); g.arc(x * s, y * s, 15 * s, 0, Math.PI * 2); g.fillStyle = "#fef3dd"; g.fill();
    g.fillStyle = "#0b1220"; g.font = `600 ${15 * s}px Inter, sans-serif`; g.textAlign = "center"; g.textBaseline = "middle";
    g.fillText(String(i + 1), x * s, y * s + 1);
  });
  g.textAlign = "start"; g.textBaseline = "alphabetic";
};

/* ---------- scene ---------- */
export function createLayers(canvas, { layers: meta, mobile, reduced, tipEl, hintEl, renderer: shared }) {
  // v0.3 shares the stage renderer; standalone use still creates its own
  const renderer = shared || new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  if (!shared) renderer.setPixelRatio(Math.min(window.devicePixelRatio, mobile ? 1.5 : 2));
  const scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x070c16, 4, 9);
  scene.background = new THREE.Color(0x0a1222);
  const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 50);
  camera.position.set(0, 0, 4.4);

  const res = mobile ? 768 : 1024;
  const painters = [drawCode, drawStructure, drawInterface, drawHuman];
  const stack = new THREE.Group();
  const root = new THREE.Group();
  root.add(stack);
  scene.add(root);

  const geo = new THREE.PlaneGeometry(PAGE_W, PAGE_H);
  const edgeGeo = new THREE.EdgesGeometry(geo);
  const planes = meta.map((m, i) => {
    const mat = new THREE.MeshBasicMaterial({
      toneMapped: false,
      map: paint(res, res * (PAGE_H / PAGE_W), painters[i]),
      transparent: true, side: THREE.DoubleSide, depthWrite: i < 2,
      blending: i === 3 ? THREE.AdditiveBlending : THREE.NormalBlending,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.add(new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x8fa3ce, transparent: true, opacity: 0.35 })));
    mesh.userData = { i, ...m };
    mesh.renderOrder = i;
    stack.add(mesh);
    return mesh;
  });

  // faint floor grid: the page sits in a physical space
  const grid = new THREE.GridHelper(12, 36, 0x2a3b57, 0x16213a);
  grid.position.y = -1.05;
  grid.material.transparent = true; grid.material.opacity = 0.5;
  scene.add(grid);

  let p = 0, w = 1, h = 1;
  const drag = { on: false, x: 0, y: 0, yaw: 0, pitch: 0, vYaw: 0, vPitch: 0 };
  const pointer = new THREE.Vector2(9, 9), tilt = new THREE.Vector2();
  let hovered = -1, interactive = false, active = true;
  // keep the stack readable: never turn it edge-on
  const clampYaw = (y) => Math.max(-0.95, Math.min(0.5, y));
  const ray = new THREE.Raycaster();

  function resize() {
    w = canvas.clientWidth; h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = camera.aspect > 1.1;
    root.position.set(wide ? 0.62 : 0, wide ? 0 : -0.32, 0);
    root.scale.setScalar(wide ? 1 : Math.min(1, camera.aspect * 1.35));
  }

  function focusFor(prog) {
    if (prog < 0.22) return 0;
    if (prog < 0.47) return 3;
    if (prog < 0.6) return 1;
    if (prog < 0.76) return 2;
    if (prog < 0.92) return 3;
    return -1;
  }

  function setProgress(v) {
    p = v;
    interactive = active && p > 0.05;
    hintEl.classList.toggle("is-on", active && p > 0.1 && p < 0.98);
  }

  function showTip(i, x, y) {
    if (i < 0) { tipEl.hidden = true; return; }
    tipEl.hidden = false;
    tipEl.querySelector("b").textContent = `${String(i + 1).padStart(2, "0")} · ${meta[i].label}`;
    tipEl.querySelector("span").textContent = meta[i].caption;
    tipEl.style.left = `${Math.min(x, w - 260)}px`;
    tipEl.style.top = `${y}px`;
  }

  function pick(clientX, clientY) {
    const r = canvas.getBoundingClientRect();
    pointer.set(((clientX - r.left) / r.width) * 2 - 1, -((clientY - r.top) / r.height) * 2 + 1);
    ray.setFromCamera(pointer, camera);
    const hit = ray.intersectObjects(planes, false)[0];
    return { i: hit ? hit.object.userData.i : -1, x: clientX - r.left, y: clientY - r.top };
  }

  canvas.addEventListener("pointerdown", (e) => {
    drag.on = true; drag.x = e.clientX; drag.y = e.clientY;
    canvas.classList.add("is-dragging");
    if (e.pointerType !== "touch") canvas.setPointerCapture(e.pointerId);
  });
  canvas.addEventListener("pointermove", (e) => {
    if (e.pointerType !== "touch") {
      const r = canvas.getBoundingClientRect();
      tilt.set(((e.clientX - r.left) / r.width) * 2 - 1, ((e.clientY - r.top) / r.height) * 2 - 1);
    }
    if (drag.on) {
      const dx = (e.clientX - drag.x) / w, dy = (e.clientY - drag.y) / h;
      drag.x = e.clientX; drag.y = e.clientY;
      drag.vYaw = dx * 3; drag.vPitch = e.pointerType === "touch" ? 0 : dy * 3;
      drag.yaw = clampYaw(drag.yaw + drag.vYaw); drag.pitch = Math.max(-0.5, Math.min(0.5, drag.pitch + drag.vPitch));
    } else if (interactive && e.pointerType !== "touch") {
      const hit = pick(e.clientX, e.clientY);
      hovered = hit.i; showTip(hovered, hit.x, hit.y);
    }
  });
  const end = (e) => {
    if (drag.on && e && e.pointerType === "touch" && interactive) {
      const hit = pick(e.clientX, e.clientY);
      hovered = hit.i; showTip(hovered, hit.x, hit.y);
    }
    drag.on = false; canvas.classList.remove("is-dragging");
  };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  canvas.addEventListener("pointerleave", () => { if (!drag.on) { hovered = -1; showTip(-1); tilt.set(0, 0); } });

  function render(dt) {
    const e = reduced ? 1 : smooth(0.04, 0.5, p);
    const spacing = lerp(0.004, mobile ? 0.34 : 0.42, e);
    if (!drag.on) { drag.yaw = clampYaw(drag.yaw + drag.vYaw * 0.5); drag.vYaw *= 0.85; }
    const k = Math.min(1, dt * 5);
    stack.rotation.x = lerp(stack.rotation.x, -0.9 * e + drag.pitch + tilt.y * 0.08, k);
    stack.rotation.y = lerp(stack.rotation.y, 0.55 * e + drag.yaw + tilt.x * 0.12, k);
    stack.rotation.z = lerp(stack.rotation.z, 0.12 * e, k);

    const focus = hovered >= 0 ? hovered : focusFor(p);
    planes.forEach((m, i) => {
      m.position.z = (i - 1.5) * spacing;
      // before the page separates only the code layer is shown, so it reads as one screen
      const dimmed = 0.28 * smooth(0.08, 0.22, p);
      const humanIn = i === 3 ? smooth(0.2, 0.32, p) : 1;
      const target = (focus < 0 || focus === i ? 1 : dimmed) * humanIn;
      m.material.opacity = lerp(m.material.opacity, target, k);
      m.children[0].material.opacity = lerp(m.children[0].material.opacity, focus === i ? 0.9 : 0.3, k);
    });
    renderer.render(scene, camera);
  }

  resize();
  // the shared canvas also hosts other chapters: only react to the pointer while on screen
  function setActive(a) {
    if (a === active) return;
    active = a;
    if (!a) { interactive = false; hovered = -1; showTip(-1); hintEl.classList.remove("is-on"); drag.on = false; }
  }
  return { setProgress, render, resize, setActive };
}
