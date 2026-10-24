/* One WebGL renderer for every chapter after the globe. Scenes register here;
   only the active scene renders, and only when its inputs change. */
import * as THREE from "three";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { textureBank } from "./scenes/kit.js";
import { createDineout } from "./scenes/dineout.js";
import { createJio } from "./scenes/jio.js";
import { createDelhivery } from "./scenes/delhivery.js";
import { createLayers } from "./layers.js";

export function createStage(canvas, { S, mobile, reduced, tipEl, hintEl }) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(devicePixelRatio, mobile ? 1.5 : 1.75));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  let dirty = true;
  const tex = textureBank(renderer, () => { dirty = true; });

  const env = new THREE.PMREMGenerator(renderer).fromScene(new RoomEnvironment(renderer), 0.04).texture;
  const P = S.projects;
  const scenes = {
    dineout: createDineout({ tex, projects: P.dineout, mobile }),
    jio: createJio({ tex, projects: P.jio, recognition: P.jioRecognition, mobile }),
    delhivery: createDelhivery({ tex, projects: P.delhivery, mobile }),
  };
  Object.values(scenes).forEach((s) => { s.scene.environment = env; s.scene.environmentIntensity = 0.35; });

  // Chapter 02's interactive layers share this renderer
  const layers = createLayers(canvas, { layers: S.layersMeta, mobile, reduced, tipEl, hintEl, renderer });

  let w = 1, h = 1, lastKey = "";
  function resize() {
    w = innerWidth; h = innerHeight;
    renderer.setSize(w, h, false);
    Object.values(scenes).forEach((s) => { s.camera.aspect = w / h; s.camera.updateProjectionMatrix(); });
    layers.resize();
    dirty = true;
  }
  resize();

  const prefetched = new Set();
  function prefetch(key) { if (scenes[key] && !prefetched.has(key)) { prefetched.add(key); scenes[key].prefetch(); } }

  /** Render one scene for the given progress values. Returns the focused item index. */
  function render(key, a, b = 0, dt = 0.016) {
    if (key === "layers") { layers.setActive(true); layers.setProgress(a); layers.render(dt); lastKey = key; return -1; }
    layers.setActive(false);
    const s = scenes[key];
    const focus = s.update(a, b);
    const k = `${key}:${a.toFixed(4)}:${b.toFixed(4)}`;
    if (k !== lastKey || dirty) {
      s.apply(s.camera);
      renderer.render(s.scene, s.camera);
      lastKey = k; dirty = false;
    }
    return focus;
  }
  return { render, resize, prefetch };
}
