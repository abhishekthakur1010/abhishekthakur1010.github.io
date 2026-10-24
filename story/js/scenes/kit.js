/* Shared building blocks for the product chapters: devices that show real
   screenshots, framed project panels, lazy textures and easing helpers. */
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";

export const clamp01 = (x) => Math.min(1, Math.max(0, x));
export const lerp = (a, b, t) => a + (b - a) * t;
export const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };
export const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/** Lazy texture registry: textures are created on demand and report when they arrive. */
export function textureBank(renderer, onChange) {
  const loader = new THREE.TextureLoader();
  const cache = new Map();
  const aniso = Math.min(8, renderer.capabilities.getMaxAnisotropy());
  return (url, { srgb = true } = {}) => {
    if (cache.has(url)) return cache.get(url);
    const t = loader.load(url, () => { t.userData.ready = true; (t.userData.cbs || []).forEach((f) => f(t)); onChange(); });
    if (srgb) t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = aniso;
    t.userData.cbs = [];
    cache.set(url, t);
    return t;
  };
}
export function whenReady(tex, fn) { tex.userData.ready ? fn(tex) : tex.userData.cbs.push(fn); }

/** Crop a texture to cover a target aspect, aligned to the top (app screens are long pages). */
export function coverTop(tex, aspect, scroll = 0) {
  whenReady(tex, (t) => {
    const ia = t.image.width / t.image.height;
    if (ia > aspect) { t.repeat.set(aspect / ia, 1); t.offset.set((1 - aspect / ia) / 2, 0); }
    else { const ry = ia / aspect; t.repeat.set(1, ry); t.offset.set(0, (1 - ry) * (1 - scroll)); }
    t.userData.coverAspect = aspect;
    t.needsUpdate = true;
  });
}
/** Scroll a cover-cropped screenshot (0 = top of the page, 1 = bottom). */
export function setScroll(tex, s) {
  if (!tex.userData.ready || tex.repeat.y >= 1) return;
  tex.offset.y = (1 - tex.repeat.y) * (1 - clamp01(s));
}

const maskCache = new Map();
/** White rounded rectangle on black, used as an alpha map for screens and panels. */
export function roundedMask(aspect, radius) {
  const key = aspect.toFixed(3) + ":" + radius;
  if (maskCache.has(key)) return maskCache.get(key);
  const H = 512, W = Math.round(H * aspect), c = document.createElement("canvas");
  c.width = W; c.height = H;
  const g = c.getContext("2d");
  g.fillStyle = "#000"; g.fillRect(0, 0, W, H);
  g.fillStyle = "#fff"; g.beginPath(); g.roundRect(0, 0, W, H, radius * H); g.fill();
  const t = new THREE.CanvasTexture(c);
  maskCache.set(key, t);
  return t;
}

/** A phone: rounded body + an unlit screen showing a real screenshot. */
export function phone(tex, { w = 0.74, h = 1.56, d = 0.07, color = 0x15181f } = {}) {
  const g = new THREE.Group();
  const body = new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 6, 0.09),
    new THREE.MeshStandardMaterial({ color, metalness: 0.65, roughness: 0.32 }));
  g.add(body);
  const sw = w * 0.9, sh = h * 0.93;
  const screenMat = new THREE.MeshBasicMaterial({ map: tex, alphaMap: roundedMask(sw / sh, 0.06), transparent: true, toneMapped: false });
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(sw, sh), screenMat);
  screen.position.z = d / 2 + 0.002;
  g.add(screen);
  if (tex) coverTop(tex, sw / sh);
  g.userData = { screen, screenMat, aspect: sw / sh };
  return g;
}
export function setPhoneScreen(ph, tex) {
  ph.userData.screenMat.map = tex;
  ph.userData.screenMat.needsUpdate = true;
  coverTop(tex, ph.userData.aspect);
}

/** A framed project panel (cover image) with a soft backing. */
export function panel(tex, { w = 1.6, h = 0.9 } = {}) {
  const g = new THREE.Group();
  const back = new THREE.Mesh(new RoundedBoxGeometry(w + 0.04, h + 0.04, 0.02, 4, 0.03),
    new THREE.MeshStandardMaterial({ color: 0x0c111c, metalness: 0.2, roughness: 0.6 }));
  back.position.z = -0.012;
  g.add(back);
  const mat = new THREE.MeshBasicMaterial({ map: tex, alphaMap: roundedMask(w / h, 0.035), transparent: true, toneMapped: false });
  g.add(new THREE.Mesh(new THREE.PlaneGeometry(w, h), mat));
  if (tex) coverTop(tex, w / h, 0.5);
  g.userData = { mat };
  return g;
}

/** Fade every material in a group (keeps each material's own base opacity). */
export function setOpacity(group, o) {
  group.traverse((m) => {
    if (!m.material) return;
    const mats = Array.isArray(m.material) ? m.material : [m.material];
    mats.forEach((mat) => {
      if (mat.userData.baseOpacity === undefined) mat.userData.baseOpacity = mat.opacity;
      mat.transparent = true;
      mat.opacity = mat.userData.baseOpacity * o;
    });
  });
  group.visible = o > 0.003;
}
