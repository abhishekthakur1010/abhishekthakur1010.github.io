/* Cloud transition: the camera falls through a sunlit cloud deck between the
   real-time terrain and the KF5 village still. Three fractal-noise layers are
   generated once, then scaled/offset by scroll (t: 0 clear → 0.5 overcast → 1 clear). */

function noise2(seed) {
  // value noise with smooth interpolation on a 256 lattice
  const p = new Uint8Array(512), r = mulberry(seed);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 256; i++) p[i + 256] = p[i];
  const v = new Float32Array(256).map(() => r());
  const f = (t) => t * t * (3 - 2 * t);
  return (x, y) => {
    const xi = Math.floor(x) & 255, yi = Math.floor(y) & 255, xf = x - Math.floor(x), yf = y - Math.floor(y);
    const a = v[p[p[xi] + yi]], b = v[p[p[xi + 1] + yi]], c = v[p[p[xi] + yi + 1]], d = v[p[p[xi + 1] + yi + 1]];
    const u = f(xf), w = f(yf);
    return a + (b - a) * u + (c - a) * w + (a - b - c + d) * u * w;
  };
}
function mulberry(a) {
  return () => { a |= 0; a = (a + 0x6d2b79f5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
}

function cloudLayer(w, h, seed, cover) {
  const n = noise2(seed), c = document.createElement("canvas");
  c.width = w; c.height = h;
  const g = c.getContext("2d"), img = g.createImageData(w, h);
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    let s = 0, amp = 0.55, fr = 3.2 / w;
    for (let o = 0; o < 5; o++) { s += amp * n(x * fr + seed, y * fr * 1.6); amp *= 0.5; fr *= 2.1; }
    const d = Math.min(1, Math.max(0, (s - (1 - cover)) * 2.4));
    // sunlit tops (warm, upper-right sun), cool blue-grey undersides
    const lit = Math.min(1, Math.max(0, s * 1.25 - 0.1 + (x / w) * 0.12 - (y / h) * 0.1));
    const i = (y * w + x) * 4;
    img.data[i] = 150 + 105 * lit; img.data[i + 1] = 160 + 90 * lit; img.data[i + 2] = 182 + 60 * lit; img.data[i + 3] = 255 * d;
  }
  g.putImageData(img, 0, 0);
  return c;
}

export function createClouds(canvas, { mobile }) {
  const ctx = canvas.getContext("2d");
  const W = mobile ? 220 : 320, H = Math.round(W * 0.6);
  const layers = [cloudLayer(W, H, 11, 0.62), cloudLayer(W, H, 47, 0.7), cloudLayer(W, H, 83, 0.78)];
  let w = 1, h = 1, last = -1;

  function resize() {
    const s = mobile ? 0.5 : 0.6; // drawn soft and upscaled: clouds have no hard detail
    w = Math.round(innerWidth * s); h = Math.round(innerHeight * s);
    canvas.width = w; canvas.height = h; last = -1;
  }

  /** t: 0..1 through the deck. Returns the overcast amount (0..1) for the caller. */
  function render(t) {
    if (Math.abs(t - last) < 0.0005) return;
    last = t;
    ctx.clearRect(0, 0, w, h);
    const dense = Math.sin(Math.PI * Math.min(1, Math.max(0, t)));
    if (dense <= 0.001) return;
    layers.forEach((L, i) => {
      // nearer layers grow faster: we are moving down through them
      const scale = 1.25 + t * (1.4 + i * 1.1);
      const dw = w * scale, dh = Math.max(h * scale, (dw * L.height) / L.width);
      const drift = (i - 1) * 0.08 * t;
      ctx.globalAlpha = Math.min(1, dense * (0.75 + i * 0.25));
      ctx.drawImage(L, (w - dw) / 2 + drift * w, (h - dh) / 2 - (t - 0.5) * h * (0.15 + i * 0.12), dw, dh);
    });
    // at full density the deck closes completely
    ctx.globalAlpha = Math.max(0, (dense - 0.72) / 0.28);
    ctx.fillStyle = "#c9d0dc";
    ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = 1;
  }

  resize();
  return { render, resize };
}
