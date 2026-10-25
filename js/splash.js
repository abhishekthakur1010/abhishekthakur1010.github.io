// Splash: a dusk-gradient ball bounces on the beat and knocks up DESIGNER, DEVELOPER and HUMAN, splats across
// the screen, folds into "Abhishek Thakur", then the dark opens from the ball into the Diwali banner.
// Every frame is a pure function of time (seek), drawn on a 1920x1080 stage scaled to the screen.
// window.splashDone resolves as the banner starts to show, so js/categories.js raises the circles then.
(function () {
  var root = document.documentElement, el = document.getElementById('splash');
  if (!el || !root.classList.contains('splash-on')) { window.splashDone = Promise.resolve(); return; }
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finish, ended = false;
  window.splashDone = new Promise(function (r) { finish = r; });

  var stage = document.getElementById('sp-stage'), fdefs = document.getElementById('sp-fdefs');
  var W = 1920, H = 1080, CX = 960, CY = 540, DUR = 5;
  var SAF = '#F28B30', BLK = '#0B0B0E', WHT = '#FFFFFF';
  // The ball wears the Diwali banner's dusk gradient, so it opens straight into the banner.
  var DUSK = 'linear-gradient(180deg, #4a2378, #8e2f7c 45%, #d4513f 78%, #ef8a3c)';
  // HUMAN takes the warm end of the banner sky.
  var GLOW = 'linear-gradient(180deg, #D3784F, #DE8E54 50%, #E8A45A)';
  function dusk(white) { white = clamp(white); return white <= 0 ? DUSK : white >= 1 ? WHT : 'linear-gradient(rgba(255,255,255,' + white.toFixed(3) + '), rgba(255,255,255,' + white.toFixed(3) + ')), ' + DUSK; }
  var VW = W, VH = H;   // the screen, in stage units (set by fitStage)

  // ---------- easing, all functions of time ----------
  function clamp(x, a, b) { return Math.min(b === undefined ? 1 : b, Math.max(a || 0, x)); }
  function lerp(a, b, p) { return a + (b - a) * p; }
  function P(t, t0, d) { return clamp((t - t0) / d); }
  function eo(p) { return p <= 0 ? 0 : p >= 1 ? 1 : 1 - Math.pow(2, -10 * p); }
  function ei(p) { return p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, 10 * p - 10); }
  function eio(p) { return p <= 0 ? 0 : p >= 1 ? 1 : p < .5 ? Math.pow(2, 20 * p - 10) / 2 : (2 - Math.pow(2, -20 * p + 10)) / 2; }

  // ---------- type metrics ----------
  var CAP = 0.698, BASE = 0.85;
  var cv = document.createElement('canvas').getContext('2d');
  function cw(ch, size, weight) { cv.font = weight + ' ' + size + 'px Poppins, system-ui, sans-serif'; return cv.measureText(ch).width; }
  function textW(str, size, weight, ls) { var w = 0; for (var i = 0; i < str.length; i++) w += cw(str[i], size, weight); return w + (ls || 0) * (str.length - 1); }
  function fit(str, weight, maxW, maxSize) { return Math.min(maxSize, Math.floor(100 * maxW / textW(str, 100, weight, -2))); }
  function layout(str, size, weight, x, ls) {
    if (ls === undefined) ls = -0.02 * size;
    var cur = x - textW(str, size, weight, ls) / 2;
    return str.split('').map(function (ch) { var w = cw(ch, size, weight), o = { ch: ch, x: cur, w: w }; cur += w + ls; return o; });
  }

  // ---------- the ball ----------
  var FLOOR = 700, BD = 72, WS, WTOP, NS, APEX = FLOOR - 320;
  var HOPS;
  function measure() {
    WS = Math.min(fit('DEVELOPER', 800, 1080, 210), 210); WTOP = FLOOR - CAP * WS; NS = fit('ABHISHEK THAKUR', 800, 1120, 120);
    // Each hop: [land time, surface at the end, arc height]. The ball lands on every beat (120 BPM).
    HOPS = [[0.5, FLOOR, 0], [1.0, FLOOR, 200], [1.5, FLOOR, 120], [2.0, WTOP, 250], [2.5, WTOP, 150], [3.0, WTOP, 150], [3.5, WTOP, 340]];
  }
  function bottomAt(tt) {
    if (tt <= 0.5) return lerp(APEX, FLOOR, (tt / 0.5) * (tt / 0.5));
    for (var k = 1; k < HOPS.length; k++) {
      if (tt <= HOPS[k][0]) { var u = (tt - HOPS[k - 1][0]) / 0.5; return lerp(HOPS[k - 1][1], HOPS[k][1], u) - HOPS[k][2] * 4 * u * (1 - u); }
    }
    return WTOP;
  }
  function ballAt(t) {
    var y = bottomAt(t), v = (bottomAt(t) - bottomAt(t - 1 / 240)) * 240;
    // Stretch with speed, squash on every impact; volume is kept.
    var sy = 1 + Math.min(Math.abs(v) / 3200, .32), sx = 1 / sy;
    HOPS.forEach(function (h) { var q = Math.exp(-Math.pow((t - h[0]) / .035, 2)); sx *= 1 + .55 * q; sy *= 1 - .42 * q; });
    return { bottom: y, w: BD * sx, h: BD * sy };
  }

  // ---------- the timeline: drawable descriptors for time t ----------
  function build(t) {
    var D = [];
    function rect(o) { D.push(Object.assign({ type: 'rect', r: 0, z: 1 }, o)); }
    function word(id, str, size, baseline, opts, offs) {
      layout(str, size, opts.weight || 800, CX, opts.ls).forEach(function (g, i) {
        D.push(Object.assign({ type: 'text', id: id + i, ch: g.ch, x: g.x, y: baseline + offs(i), size: size, w: g.w, weight: 800, z: 10 }, opts));
      });
    }
    if (t < 3.5) {
      var b = ballAt(t);
      rect({ id: 'ball', cx: CX, cy: b.bottom - b.h / 2, w: b.w, h: b.h, r: 999, fill: DUSK, z: 20 });
    } else if (t < 4.0) {
      // The last, biggest bounce splats the ball until it floods the screen.
      var s = eio(P(t, 3.5, .4)), d = lerp(BD, Math.hypot(VW, VH) * 1.08, s), sq = Math.exp(-Math.pow((t - 3.5) / .035, 2));
      rect({ id: 'ball', cx: CX, cy: lerp(WTOP - BD / 2, CY, s), w: d * (1 + .55 * sq), h: d * (1 - .42 * sq), r: 999, fill: DUSK, z: 20 });
    }
    // The floor, drawn out from the first impact; the words stand on it.
    if (t >= 0.5 && t < 4.0) rect({ id: 'floor', cx: CX, cy: FLOOR + 2, w: (VW + 8) * eo(P(t, 0.5, .5)), h: 4, r: 2, fill: WHT, z: 3 });
    var kclip = { t: 0, r: W, b: FLOOR, l: 0 };
    function knock(L) { return 14 * Math.exp(-Math.pow((t - L) / .06, 2)); }
    if (t >= 1.5 && t < 2.2) word('w1', 'DESIGNER', WS, FLOOR, { color: WHT, clip: kclip },
      function (i) { return WS * (1 - eo(P(t, 1.5 + i * .015, .28))) + knock(2.0) + WS * ei(P(t, 2.0 + i * .006, .16)); });
    if (t >= 2.1 && t < 2.7) word('w2', 'DEVELOPER', WS, FLOOR, { color: WHT, clip: kclip },
      function (i) { return WS * (1 - eo(P(t, 2.1 + i * .012, .26))) + knock(2.5) + WS * ei(P(t, 2.5 + i * .006, .16)); });
    if (t >= 2.64 && t < 3.85) word('w3', 'HUMAN', WS, FLOOR, { color: GLOW, clip: kclip },
      function (i) { return WS * (1 - eo(P(t, 2.64 + i * .02, .26))) + knock(3.0) + WS * ei(P(t, 3.52 + i * .015, .26)); });
    // The saffron screen folds into a line, the name rises, then the line shrinks back into the ball.
    if (t >= 4.0) {
      var p = eio(P(t, 4.0, .3)), c = eio(P(t, 4.6, .4));
      var h = lerp(lerp(VH, 4, p), BD, c), w = lerp(VW + 8, BD, c);
      rect({ id: 'line', cx: CX, cy: lerp(lerp(CY, 640, p), APEX - BD / 2, c), w: w, h: h, r: c > 0 ? h / 2 : 2 * p, fill: c > 0 ? dusk(1 - c) : dusk(p), z: 30 });
    }
    if (t >= 4.08 && t < 4.85) word('title', 'ABHISHEK THAKUR', NS, 612, { color: WHT, clip: { t: 0, r: W, b: 636, l: 0 }, z: 31 },
      function (i) { return NS * 1.1 * (1 - eo(P(t, 4.1 + i * .012, .3))) + NS * 1.1 * ei(P(t, 4.56 + i * .006, .22)); });
    if (t >= 4.18 && t < 4.75) word('sub', 'PRODUCT DESIGNER', 28, 698, { weight: 600, color: SAF, ls: 7, clip: { t: 644, r: W, b: H, l: 0 }, z: 31 },
      function () { return -90 * (1 - eo(P(t, 4.2, .3))) - 90 * ei(P(t, 4.5, .2)); });
    return D;
  }

  // ---------- drawing ----------
  var els = {}, n = 0;
  function node(id) {
    if (els[id]) return els[id];
    var wrap = document.createElement('div'); wrap.className = 'wrap';
    var inner = document.createElement('div'); inner.className = 'el';
    wrap.appendChild(inner); stage.appendChild(wrap);
    var f = document.createElementNS('http://www.w3.org/2000/svg', 'filter'), fid = 'spf' + (n++);
    f.setAttribute('id', fid); f.setAttribute('x', '-60%'); f.setAttribute('y', '-60%'); f.setAttribute('width', '220%'); f.setAttribute('height', '220%');
    var g = document.createElementNS('http://www.w3.org/2000/svg', 'feGaussianBlur'); f.appendChild(g); fdefs.appendChild(f);
    return els[id] = { wrap: wrap, inner: inner, g: g, fid: fid };
  }
  function edges(d) {
    if (d.type === 'rect') return [d.cx - d.w / 2, d.cx + d.w / 2, d.cy - d.h / 2, d.cy + d.h / 2];
    var cy = d.y - CAP * d.size / 2;
    return [d.x, d.x + d.w, cy - CAP * d.size / 2, cy + CAP * d.size / 2];
  }
  function draw(d, prev) {
    var e = node(d.id), s = e.inner.style;
    e.wrap.style.display = 'block'; e.wrap.style.zIndex = d.z;
    e.wrap.style.clipPath = d.clip ? 'inset(' + d.clip.t + 'px ' + (W - d.clip.r) + 'px ' + (H - d.clip.b) + 'px ' + d.clip.l + 'px)' : 'none';
    if (d.type === 'rect') {
      s.left = (d.cx - d.w / 2) + 'px'; s.top = (d.cy - d.h / 2) + 'px'; s.width = Math.max(0, d.w) + 'px'; s.height = Math.max(0, d.h) + 'px';
      s.borderRadius = Math.min(d.r, d.w / 2, d.h / 2) + 'px'; s.background = d.fill;
    } else {
      s.left = d.x + 'px'; s.top = (d.y - BASE * d.size) + 'px'; s.font = d.weight + ' ' + d.size + 'px/' + d.size + 'px Poppins, system-ui, sans-serif';
      var grad = d.color.indexOf('gradient') > -1;
      s.color = grad ? 'transparent' : d.color; s.backgroundImage = grad ? d.color : 'none';
      s.webkitBackgroundClip = s.backgroundClip = grad ? 'text' : 'border-box';
      s.letterSpacing = (d.ls || 0) + 'px';
      if (e.inner.textContent !== d.ch) e.inner.textContent = d.ch;
    }
    // Blur follows speed and direction: how far each edge moved in the last moment.
    var bx = 0, by = 0;
    if (prev && !reduce) {
      var a = edges(d), b = edges(prev);
      bx = Math.min(Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])) * 240 / 60 * .3, 34);
      by = Math.min(Math.max(Math.abs(a[2] - b[2]), Math.abs(a[3] - b[3])) * 240 / 60 * .3, 34);
    }
    if (bx + by > .4) { e.g.setAttribute('stdDeviation', bx.toFixed(2) + ' ' + by.toFixed(2)); s.filter = 'url(#' + e.fid + ')'; }
    else s.filter = 'none';
  }
  function seek(t) {
    t = clamp(t, 0, DUR);
    el.style.background = t >= 3.9 && t < 4.0 ? DUSK : BLK;
    var cur = build(t), prev = {}, seen = {};
    build(Math.max(0, t - 1 / 240)).forEach(function (d) { prev[d.id] = d; });
    cur.forEach(function (d) { seen[d.id] = 1; draw(d, prev[d.id] && prev[d.id].type === d.type ? prev[d.id] : null); });
    Object.keys(els).forEach(function (id) { if (!seen[id]) els[id].wrap.style.display = 'none'; });
  }
  // The stage keeps the words readable on a phone and fills a wide screen.
  function fitStage() {
    var vw = window.innerWidth, vh = window.innerHeight, s = Math.min(vh / H, (vw - 24) / 1520);
    stage.style.transform = 'scale(' + s + ')';
    VW = vw / s; VH = vh / s;
  }

  function end() {
    if (ended) return; ended = true;
    try { sessionStorage.setItem('splash-seen', '1'); } catch (e) {}
    // The banner opens from wherever the ball (or the line) is.
    var b = els.line || els.ball, r = b && b.inner.getBoundingClientRect();
    if (r && r.width) { el.style.setProperty('--fx', (r.left + r.width / 2) + 'px'); el.style.setProperty('--fy', (r.top + r.height / 2) + 'px'); }
    root.classList.add('splash-out');
    finish();
    setTimeout(function () { root.classList.remove('splash-on', 'splash-out'); el.remove(); }, reduce ? 320 : 850);
  }

  var t0 = 0;
  function play() {
    measure(); fitStage(); seek(0);
    window.addEventListener('resize', fitStage);
    if (reduce) { seek(4.4); setTimeout(end, 1200); return; }
    t0 = performance.now();
    (function tick(now) {
      if (ended) return;
      var t = (now - t0) / 1000;
      seek(t);
      if (t >= DUR) end(); else requestAnimationFrame(tick);
    })(t0);
  }
  // Poppins comes from Google Fonts; wait for it briefly so the words are measured right, then play.
  var fontsReady = document.fonts && document.fonts.load ? Promise.all(['800', '600'].map(function (w) { return document.fonts.load(w + ' 100px Poppins'); })) : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () { requestAnimationFrame(play); });

  // A tap or key skips ahead.
  el.addEventListener('click', function () { if (performance.now() - t0 > 300) end(); });
  window.addEventListener('keydown', function k() { end(); window.removeEventListener('keydown', k); });
  setTimeout(end, 9000);
})();
