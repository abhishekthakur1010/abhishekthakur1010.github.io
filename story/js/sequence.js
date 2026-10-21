/* Chapter 01 pre-rendered frame sequence (Himalayas → village → boy).
   If frames exist, scroll scrubs them. If not, an honest previs: abstract
   dawn light + a storyboard card that scrubs through the planned shots. */

const lerp = (a, b, t) => a + (b - a) * t;
const mix = (c1, c2, t) => c1.map((v, i) => Math.round(lerp(v, c2[i], t)));
const rgb = (c, a = 1) => `rgba(${c[0]},${c[1]},${c[2]},${a})`;

// blue hour → golden sunrise, along the four storyboard shots
const SKY = [
  { top: [9, 15, 28], mid: [32, 46, 72], low: [88, 104, 138] },
  { top: [14, 23, 38], mid: [52, 66, 98], low: [150, 140, 140] },
  { top: [24, 36, 60], mid: [109, 127, 163], low: [214, 180, 140] },
  { top: [42, 59, 87], mid: [201, 184, 154], low: [254, 243, 221] },
];

export function createSequence(canvas, cfg, { mobile, previsEls }) {
  const ctx = canvas.getContext("2d");
  const total = cfg.frameCount;
  const frames = new Array(total).fill(null);
  const status = new Array(total).fill("none");
  let ext = null, mode = "probing", w = 1, h = 1, dpr = 1, last = -1, p = 0, time = 0;

  const pad = (n) => String(n).padStart(cfg.pad, "0");
  const path = (i, e) =>
    (mobile ? cfg.pathMobile : cfg.pathDesktop).replace("{n}", pad(cfg.startIndex + i)).replace("{ext}", e);

  function resize() {
    dpr = Math.min(window.devicePixelRatio, mode === "frames" ? 2 : 1);
    w = canvas.clientWidth; h = canvas.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    last = -1;
  }

  // Probe frame 1 in each extension; decides frames vs previs.
  function probe() {
    let i = 0;
    const tryExt = () => {
      if (i >= cfg.exts.length) { mode = "previs"; previsEls.root.hidden = false; buildStrip(); resize(); return; }
      const e = cfg.exts[i++], img = new Image();
      img.onload = () => { ext = e; frames[0] = img; status[0] = "ok"; mode = "frames"; resize(); };
      img.onerror = tryExt;
      img.src = path(0, e);
    };
    tryExt();
  }

  function load(i) {
    if (i < 0 || i >= total || status[i] !== "none") return;
    status[i] = "loading";
    const img = new Image();
    img.decoding = "async";
    img.onload = () => { frames[i] = img; status[i] = "ok"; };
    img.onerror = () => { status[i] = "error"; };
    img.src = path(i, ext);
  }

  function drawFrame(idx) {
    let img = frames[idx];
    for (let d = 1; !img && d < total; d++) img = frames[idx - d] || frames[idx + d];
    if (!img) return;
    const s = Math.max((w * dpr) / img.naturalWidth, (h * dpr) / img.naturalHeight);
    const iw = img.naturalWidth * s, ih = img.naturalHeight * s;
    ctx.drawImage(img, (w * dpr - iw) / 2, (h * dpr - ih) / 2, iw, ih);
  }

  function buildStrip() {
    previsEls.strip.innerHTML = cfg.shots.map(() => "<span><i></i></span>").join("");
  }

  function drawPrevis() {
    const W = w * dpr, H = h * dpr;
    const f = p * (SKY.length - 1), k = Math.min(SKY.length - 2, Math.floor(f)), t = f - k;
    const a = SKY[k], b = SKY[k + 1];
    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, rgb(mix(a.top, b.top, t)));
    g.addColorStop(0.55, rgb(mix(a.mid, b.mid, t)));
    g.addColorStop(1, rgb(mix(a.low, b.low, t)));
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);
    // the sun rising off-frame right
    const sy = lerp(H * 1.05, H * 0.62, p);
    const sg = ctx.createRadialGradient(W * 0.78, sy, 0, W * 0.78, sy, Math.max(W, H) * 0.7);
    sg.addColorStop(0, `rgba(254,243,221,${0.15 + 0.5 * p})`);
    sg.addColorStop(1, "rgba(254,243,221,0)");
    ctx.fillStyle = sg;
    ctx.fillRect(0, 0, W, H);
    // slow drifting mist bands
    for (let i = 0; i < 5; i++) {
      const y = H * (0.45 + i * 0.12) + Math.sin(time * 0.15 + i) * 8 * dpr;
      const x = W * 0.5 + Math.sin(time * 0.05 + i * 1.7) * W * 0.18 - p * W * 0.1 * (i % 2 ? 1 : -1);
      const mg = ctx.createRadialGradient(x, y, 0, x, y, W * 0.6);
      mg.addColorStop(0, `rgba(243,232,214,${0.06 + 0.04 * (1 - p)})`);
      mg.addColorStop(1, "rgba(243,232,214,0)");
      ctx.fillStyle = mg;
      ctx.save(); ctx.translate(x, y); ctx.scale(1, 0.22); ctx.translate(-x, -y);
      ctx.fillRect(0, y - W * 0.6, W, W * 1.2);
      ctx.restore();
    }
  }

  function updateCard(frame) {
    const shotIdx = cfg.shots.findIndex((s) => frame <= s.to);
    const s = cfg.shots[shotIdx];
    previsEls.shot.textContent = `Shot ${shotIdx + 1} / ${cfg.shots.length} — ${s.name}`;
    previsEls.note.textContent = s.note;
    previsEls.frame.textContent = `frame_${pad(frame)} / ${pad(total)} · 0 of ${total} rendered`;
    [...previsEls.strip.children].forEach((el, i) => {
      const sh = cfg.shots[i];
      const fill = Math.min(1, Math.max(0, (frame - sh.from + 1) / (sh.to - sh.from + 1)));
      el.firstChild.style.transform = `scaleX(${fill})`;
    });
  }

  function setProgress(v) { p = v; }

  function render(dt) {
    time += dt;
    const idx = Math.min(total - 1, Math.floor(p * total));
    if (mode === "frames") {
      for (let d = -6; d <= 24; d++) load(idx + d);
      if (idx !== last || !frames[idx]) { drawFrame(idx); last = idx; }
    } else if (mode === "previs") {
      drawPrevis();
      if (idx !== last) { updateCard(idx + cfg.startIndex); last = idx; }
    }
  }

  window.addEventListener("resize", resize);
  resize();
  probe();
  return { setProgress, render, get mode() { return mode; } };
}
