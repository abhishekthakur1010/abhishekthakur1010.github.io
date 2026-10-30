// Cover banner: a festive ember scene (bunting, hanging kandils, strings of diyas,
// rising sparks). The cursor is a sparkler: bring it to a diya to light it, and it
// burns for a few seconds before it needs relighting. While it sparkles fully, the
// Diwali greeting shows and skyrockets burst behind the scene. Clicking the big
// kandil, or the bow peeking up at the bottom left, opens an archery game: pull the arrow back, let go, hit the target
// on the right.
(function () {
  var cover = document.querySelector('.cover');
  if (!cover || !document.createElement('canvas').getContext) return;

  var DIYA_S = 1.5; // diya size on the strings
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Categories heading: a hint until the sparkler peaks, then "Happy Diwali" with the skyrockets.
  // Without motion nothing can be lit, so it greets at once.
  var crackerLit = false, chStage = '';
  if (reduce) { document.documentElement.classList.add('sky-peak'); document.documentElement.setAttribute('data-ch', 'wish'); }
  function headStage(st) {
    var next = peak ? (crackerLit ? 'wish' : 'cracker') : sparkler.lit ? (st < RAMP ? 'catch' : 'fade') : sparkler.everLit ? 'again' : 'hint';
    if (next === chStage) return;
    chStage = next;
    document.documentElement.setAttribute('data-ch', next);
    document.documentElement.classList.toggle('sky-peak', peak);
  }
  var ARROWS = 3, G = 900, MAX_PULL = 110, MAX_SPEED = 1500;
  // A sparkler takes a moment to catch: it smoulders first, then sparks a little,
  // then burns at full strength before it fades out.
  var CATCH = 3, RAMP = 6, BURN = 14, FADE = 2, LIGHT_RADIUS = 26;
  var C = {
    gold: '#f5b82e', marigold: '#f08a24', vermilion: '#d9412b', leaf: '#1f7a5a',
    clay: '#a8401c', deep: '#5a1a0c', cream: '#fff3d6'
  };

  var canvas = document.createElement('canvas');
  canvas.className = 'cover-canvas';
  canvas.setAttribute('aria-hidden', 'true');
  cover.insertBefore(canvas, cover.firstChild);
  cover.classList.add('has-canvas', 'is-festive');
  // The greeting waits for a fully lit sparkler (shown at once when motion is reduced).
  if (!reduce) cover.classList.add('awaits-greeting');
  var ctx = canvas.getContext('2d');

  // The hidden way into the game: an invisible button over the big kandil.
  var hint = document.createElement('button');
  hint.type = 'button';
  hint.className = 'cover-hint';
  hint.setAttribute('aria-label', 'Play a hidden archery game');
  cover.appendChild(hint);
  // The invitation floats in the middle of the banner while the kandil is hovered.
  var tip = document.createElement('span');
  tip.className = 'cover-float-tip';
  tip.setAttribute('aria-hidden', 'true');
  tip.textContent = 'Feeling sharp? Take a shot';
  cover.appendChild(tip);

  // ---------- sound: tiny Web Audio synth, no files ----------
  var SOUND_KEY = 'at-archery-sound';
  var sfx = (function () {
    var AC = window.AudioContext || window.webkitAudioContext, ac = null, noise = null, on = true;
    try { on = localStorage.getItem(SOUND_KEY) !== 'off'; } catch (e) {}
    function ctxOk() { return on && ac && ac.state !== 'closed'; }
    function unlock() {
      if (!AC || !on) return;
      if (!ac) {
        ac = new AC();
        noise = ac.createBuffer(1, ac.sampleRate, ac.sampleRate);
        var d = noise.getChannelData(0);
        for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      }
      if (ac.state === 'suspended') ac.resume();
    }
    function env(g, t, peakAt, peak, end) {
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + peakAt);
      g.gain.exponentialRampToValueAtTime(0.0001, t + end);
    }
    function noiseBurst(t, dur, type, f0, f1, q, peak, peakAt) {
      var src = ac.createBufferSource(), f = ac.createBiquadFilter(), g = ac.createGain();
      src.buffer = noise; f.type = type; f.Q.value = q;
      f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(f1, t + dur);
      env(g, t, peakAt || 0.01, peak, dur);
      src.connect(f).connect(g).connect(ac.destination);
      src.start(t, Math.random() * 0.5); src.stop(t + dur + 0.05);
    }
    function tone(t, dur, type, f0, f1, peak) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      env(g, t, 0.005, peak, dur);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + dur + 0.05);
    }
    return {
      unlock: unlock,
      isOn: function () { return on; },
      toggle: function () {
        on = !on;
        try { localStorage.setItem(SOUND_KEY, on ? 'on' : 'off'); } catch (e) {}
        if (on) unlock();
        return on;
      },
      // Wood and string under tension: a short, rising creak.
      creak: function (p) {
        if (!ctxOk()) return;
        var t = ac.currentTime;
        noiseBurst(t, 0.07, 'bandpass', 500 + p * 500, 800 + p * 700, 9, 0.05 + p * 0.04);
        tone(t, 0.06, 'sawtooth', 70 + p * 50, 90 + p * 60, 0.015);
      },
      // The string snapping forward.
      twang: function (p) {
        if (!ctxOk()) return;
        var t = ac.currentTime;
        tone(t, 0.28, 'triangle', 150 + p * 60, 85, 0.18);
        noiseBurst(t, 0.03, 'highpass', 2500, 2500, 0.7, 0.12, 0.002);
      },
      // Air rushing past the arrow.
      whoosh: function (p) {
        if (!ctxOk()) return;
        noiseBurst(ac.currentTime + 0.01, 0.38, 'bandpass', 2600, 500, 1.4, 0.06 + p * 0.1, 0.06);
      },
      // The arrow biting into the target; a little chime for a bullseye.
      thunk: function (bull) {
        if (!ctxOk()) return;
        var t = ac.currentTime;
        tone(t, 0.16, 'sine', 170, 55, 0.35);
        noiseBurst(t, 0.06, 'lowpass', 1800, 300, 0.8, 0.2, 0.002);
        if (bull) { tone(t + 0.05, 0.5, 'sine', 1320, 1310, 0.06); tone(t + 0.12, 0.6, 'sine', 1760, 1750, 0.05); }
      },
      // Skyrocket going up: a thin rising whistle with a little hiss.
      whistle: function () {
        if (!ctxOk()) return;
        var t = ac.currentTime, d = 0.75 + Math.random() * 0.3;
        tone(t, d, 'sine', 700 + Math.random() * 200, 2000 + Math.random() * 600, 0.025);
        noiseBurst(t, d, 'bandpass', 2500, 5500, 5, 0.02, 0.25);
      },
      // Skyrocket bursting: a low boom, then a crackle as the stars fall.
      boom: function () {
        if (!ctxOk()) return;
        var t = ac.currentTime;
        tone(t, 0.55, 'sine', 120, 38, 0.3);
        noiseBurst(t, 0.9, 'lowpass', 2400, 160, 0.7, 0.3, 0.004);
        for (var i = 0; i < 7; i++) noiseBurst(t + 0.18 + Math.random() * 0.6, 0.04, 'highpass', 3500, 3500, 0.8, 0.03 + Math.random() * 0.03, 0.002);
      },
      // A soft thud as the bow lands in place.
      land: function () {
        if (!ctxOk()) return;
        tone(ac.currentTime, 0.12, 'sine', 120, 70, 0.12);
      }
    };
  })();

  ['pointerdown', 'keydown', 'touchstart'].forEach(function (ev) {
    window.addEventListener(ev, function first() { sfx.unlock(); window.removeEventListener(ev, first, true); }, true);
  });

  // The visible way in: a bow peeking up from the bottom left of the banner.
  var peek = document.createElement('button');
  peek.type = 'button';
  peek.className = 'cover-peek';
  peek.setAttribute('aria-label', 'Play archery');
  peek.innerHTML =
    '<svg viewBox="0 0 64 64" aria-hidden="true">' +
    '<path d="M24 5 Q48 32 24 59" fill="none" stroke="#f5b82e" stroke-width="4.5" stroke-linecap="round"/>' +
    '<path d="M24 5 L13 32 L24 59" fill="none" stroke="#fff3d6" stroke-width="1.4"/>' +
    '<path d="M13 32 H55" stroke="#fff3d6" stroke-width="2.4" stroke-linecap="round"/>' +
    '<path d="M61 32 L52 27 L54 32 L52 37 Z" fill="#fff3d6"/>' +
    '<path d="M13 32 L8 27 M13 32 L8 37 M18 32 L13 27 M18 32 L13 37" stroke="#f08a24" stroke-width="2.2" stroke-linecap="round"/>' +
    '</svg><span class="cover-peek-tip">Play archery</span>';
  cover.appendChild(peek);

  var hud = document.createElement('div');
  hud.className = 'cover-hud';
  hud.innerHTML =
    '<p class="cover-hud-text" aria-live="polite"></p>' +
    '<div class="cover-hud-btns">' +
    '<button type="button" data-act="sound" aria-pressed="true">Sound on</button>' +
    '<button type="button" data-act="again">New round</button>' +
    '<button type="button" data-act="close" aria-label="Close game">Close</button>' +
    '</div>';
  cover.appendChild(hud);
  var hudText = hud.querySelector('.cover-hud-text');
  var soundBtn = hud.querySelector('[data-act="sound"]');
  function syncSound(on) { soundBtn.textContent = on ? 'Sound on' : 'Sound off'; soundBtn.setAttribute('aria-pressed', on ? 'true' : 'false'); }
  syncSound(sfx.isOn());

  var W = 0, H = 0, dpr = 1, mouse = null, now = 0, visible = true;
  var mode = 'idle'; // idle | aim | fly | done
  var bow, target = null, pull = null, arrow = null, stuck = [], left = ARROWS, score = 0, flash = 0, best = null;
  var keyAim = { angle: -0.18, power: 0.7 }, raf = 0, last = 0, landing = false, keyUsed = false;
  var embers = [], sparks = [], trail = [], scene = null, emberW = 0, emberH = 0;
  // Skyrockets in the background while the sparkler is at its peak.
  var rockets = [], stars = [], nextRocket = 0, peak = false;
  var STAR_COLS = ['#ffd27a', '#ff9a4d', '#ff6b5a', '#ffe9b8', '#ffb3c7', '#9fe3c9'];
  // Sparkler state: unlit until it touches a diya flame, then burns for BURN seconds.
  var sparkler = { lit: false, t: 0, everLit: false }, sparkles = [];

  try { best = +localStorage.getItem('at-archery-best') || null; } catch (e) {}

  function rand(a, b) { return a + Math.random() * (b - a); }

  // ---------- layout ----------
  // Where the bow rests for a banner of this size. On the full-screen categories banner it sits
  // low and to the left, under the circles; the target then swings level with it (see resize).
  function bowSpot(w, h) {
    var narrow = w < 600;
    if (document.documentElement.classList.contains('cat-mode'))
      return { x: narrow ? Math.max(56, w * 0.14) : Math.max(110, w * 0.1), y: h - (narrow ? 96 : 150) };
    return { x: narrow ? w * 0.18 : w * 0.2, y: narrow ? h * 0.46 : h * 0.42 };
  }
  function resize() {
    var r = cover.getBoundingClientRect();
    if (!r.width || !r.height) return; // hidden (the Instagram look has no banner)
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = r.width; H = r.height;
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    var narrow = W < 600;
    bow = bowSpot(W, H);
    var R = narrow ? 30 : 40;
    target = target || { y: H * 0.45, dir: 1 };
    target.x = W - (narrow ? 26 : 44); target.r = R;
    target.top = narrow ? 70 + R : R + 16; target.bottom = H - (narrow ? 80 : 60) - R;
    // The target swings in a short band level with the bow, so the shot reads straight across.
    var band = narrow ? 26 : 44;
    target.top = Math.max(target.top, bow.y - band); target.bottom = Math.min(target.bottom, bow.y + band);
    if (target.bottom < target.top) target.top = target.bottom = bow.y;
    target.y = Math.max(target.top, Math.min(target.bottom, target.y));
    buildScene();
    draw();
  }

  // Positions are fixed per size so the scene doesn't jump between frames.
  function buildScene() {
    var narrow = W < 600, base = Math.min(H, 200);
    // A pair of kandils on each edge, sized and hung differently so the sides
    // balance without mirroring; a few diyas drop in between at uneven lengths.
    var strings = narrow
      ? [[0.36, 0.3], [0.62, 0.4]]
      : [[0.3, 0.3], [0.48, 0.44], [0.66, 0.34]];
    scene = {
      lanterns: narrow
        ? [{ x: W * 0.08, len: 6, s: 0.4, p: 0 }, { x: W * 0.9, len: 14, s: 0.34, p: 1.7 }]
        : [{ x: W * 0.13, len: 22, s: 0.64, p: 0 }, { x: W * 0.045, len: 8, s: 0.48, p: 1.7 },
           { x: W * 0.87, len: 10, s: 0.53, p: 0.9 }, { x: W * 0.955, len: 30, s: 0.45, p: 2.4 }],
      diyas: strings.map(function (d, i) { return { x: W * d[0], len: base * d[1], p: i * 1.3 }; })
    };
    // Each kandil hangs clear of the bunting: its top sits a little below the flags above it.
    scene.lanterns.forEach(function (L) { L.len = Math.max(L.len, (buntingBottom(L.x) + 6) / L.s) + 4 / L.s; });
    // Flame positions, used to light the sparkler.
    scene.flames = scene.diyas.map(function (d) { return { x: d.x + 3 * DIYA_S, y: d.len + 4 - DIYA_S }; });
    var L = scene.lanterns[0];
    hint.style.left = (L.x - 28 * L.s) + 'px';
    hint.style.top = (L.len * L.s) + 'px';
    hint.style.width = (56 * L.s) + 'px';
    hint.style.height = (92 * L.s) + 'px';
    var n = Math.round((W * H) / (narrow ? 2600 : 4200));
    // Keep the embers already floating exactly where they are when the banner resizes
    // (e.g. it shrinks after picking a category): drop only those now outside, and top up
    // in the newly uncovered strip if the banner grew.
    var grewFrom = embers.length ? emberH : 0;
    embers = embers.filter(function (e) { return e.x <= W && e.y <= H + 20; });
    var tries = 0;
    while (embers.length < n && tries++ < n * 4) {
      var e = newEmber(true);
      if (grewFrom && e.y < grewFrom && e.x <= emberW) continue; // the area already shown keeps its own embers
      embers.push(e);
    }
    emberW = W; emberH = H;
  }
  function newEmber(anywhere) {
    return {
      x: rand(0, W), y: anywhere ? rand(0, H) : H + rand(2, 20),
      r: rand(0.6, 1.9), vy: rand(8, 22), f: rand(0.6, 1.6), p: rand(0, 6.28)
    };
  }

  // ---------- scene drawing ----------
  // Lowest point of the flags at x: the swag's curve (sag 16) plus a flag's height (13), as drawn below.
  function buntingBottom(x) {
    var swags = W < 600 ? 2 : 3, sw = W / swags, u = (x % sw) / sw;
    return 2 + 16 * 4 * u * (1 - u) + 13 + 2;
  }
  function drawBunting() {
    var swags = W < 600 ? 2 : 3, sw = W / swags;
    for (var s = 0; s < swags; s++) {
      var x0 = s * sw, sag = 16;
      ctx.strokeStyle = 'rgba(255,230,190,.55)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, 2); ctx.quadraticCurveTo(x0 + sw / 2, 2 + sag * 2, x0 + sw, 2); ctx.stroke();
      var flags = Math.floor(sw / 24), cols = [C.gold, C.vermilion, C.leaf, C.marigold];
      for (var i = 1; i < flags; i++) {
        var u = i / flags, x = x0 + sw * u, y = 2 + sag * 2 * 2 * u * (1 - u);
        var sway = reduce ? 0 : Math.sin(now * 1.4 + i + s) * 1.2;
        ctx.fillStyle = cols[(i + s) % cols.length];
        ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.lineTo(x + sway, y + 13); ctx.closePath(); ctx.fill();
      }
    }
  }

  function flame(x, y, s, p) {
    var k = reduce ? 1 : 1 + Math.sin(now * 9 + p) * 0.08 + Math.sin(now * 13.7 + p * 2) * 0.05;
    var g = ctx.createRadialGradient(x, y - 2 * s, 0, x, y - 2 * s, 14 * s);
    g.addColorStop(0, 'rgba(255,200,90,.55)'); g.addColorStop(1, 'rgba(255,140,40,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 2 * s, 14 * s, 0, 6.2832); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * k);
    var fg = ctx.createLinearGradient(0, -10, 0, 0);
    fg.addColorStop(0, '#fff6c8'); fg.addColorStop(1, C.marigold);
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(4, -3, 0, 0); ctx.quadraticCurveTo(-4, -3, 0, -10); ctx.fill();
    ctx.restore();
  }

  function diya(x, y, s, p) {
    ctx.fillStyle = C.clay;
    ctx.beginPath(); ctx.moveTo(x - 9 * s, y); ctx.quadraticCurveTo(x, y + 9 * s, x + 9 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold;
    ctx.fillRect(x - 9 * s, y - 1.2 * s, 18 * s, 1.6 * s);
    flame(x + 3 * s, y - 1 * s, s * 0.8, p);
  }

  function drawDiyaStrings() {
    scene.diyas.forEach(function (d) {
      ctx.fillStyle = 'rgba(255,225,180,.38)';
      for (var y = 4; y < d.len; y += 5) { ctx.beginPath(); ctx.arc(d.x, y, 0.8, 0, 6.2832); ctx.fill(); }
      diya(d.x, d.len + 4, DIYA_S, d.p);
    });
  }

  function lantern(L) {
    var sway = reduce ? 0 : Math.sin(now * 1.1 + L.p) * 0.05;
    ctx.save();
    ctx.translate(L.x, 0); ctx.rotate(sway); ctx.scale(L.s, L.s);
    ctx.strokeStyle = 'rgba(255,230,190,.6)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L.len); ctx.stroke();
    var y = L.len;
    var g = ctx.createRadialGradient(0, y + 34, 0, 0, y + 34, 60);
    g.addColorStop(0, 'rgba(255,190,80,.35)'); g.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, y + 34, 60, 0, 6.2832); ctx.fill();
    ctx.fillStyle = C.deep; ctx.fillRect(-9, y, 18, 6);
    // kandil body: an outer diamond with lit panes inside
    ctx.fillStyle = C.vermilion;
    ctx.beginPath(); ctx.moveTo(0, y + 6); ctx.lineTo(26, y + 32); ctx.lineTo(0, y + 58); ctx.lineTo(-26, y + 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.cream;
    ctx.beginPath(); ctx.moveTo(-13, y + 19); ctx.lineTo(0, y + 32); ctx.lineTo(-13, y + 45); ctx.lineTo(-24, y + 32); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(13, y + 19); ctx.lineTo(24, y + 32); ctx.lineTo(13, y + 45); ctx.lineTo(0, y + 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold;
    ctx.beginPath(); ctx.moveTo(0, y + 10); ctx.lineTo(9, y + 32); ctx.lineTo(0, y + 54); ctx.lineTo(-9, y + 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.deep; ctx.fillRect(-10, y + 57, 20, 4);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 1.2;
    for (var i = -8; i <= 8; i += 2.6) {
      var tw = reduce ? 0 : Math.sin(now * 2 + i) * 1.5;
      ctx.beginPath(); ctx.moveTo(i, y + 61); ctx.lineTo(i * 1.15 + tw, y + 88); ctx.stroke();
    }
    ctx.restore();
  }

  function drawEmbers(dt) {
    embers.forEach(function (e, i) {
      if (!reduce) {
        e.y -= e.vy * dt;
        e.x += Math.sin(now * e.f + e.p) * 8 * dt;
        if (e.y < -6) embers[i] = e = newEmber(false);
      }
      var a = 0.35 + 0.35 * Math.sin(now * 2 * e.f + e.p);
      var near = 0;
      if (mouse && mode === 'idle') {
        var d = Math.hypot(mouse.x - e.x, mouse.y - e.y);
        if (d < 120) near = 1 - d / 120;
      }
      ctx.fillStyle = 'rgba(255,170,70,' + (0.18 * (a + near)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (3 + near * 2), 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(255,225,160,' + Math.min(1, a + near * 0.6).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.2832); ctx.fill();
    });
  }

  function drawFireworks(dt) {
    if (peak && !reduce && mode === 'idle') {
      nextRocket -= dt;
      if (nextRocket <= 0) {
        nextRocket = rand(0.45, 0.9);
        rockets.push({ x: W * rand(0.18, 0.82), y: H + 4, vy: -rand(H * 1.3, H * 1.7), top: H * rand(0.14, 0.42),
          col: STAR_COLS[Math.floor(rand(0, STAR_COLS.length))] });
      }
    }
    if (!rockets.length && !stars.length) return;
    ctx.save();
    ctx.globalCompositeOperation = 'lighter';
    rockets = rockets.filter(function (r) {
      r.y += r.vy * dt;
      ctx.strokeStyle = 'rgba(255,220,170,.55)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + 14); ctx.stroke();
      if (r.y > r.top) return true;
      // Burst: a ring of stars, with a second colour mixed in.
      var n = Math.round(rand(50, 70)), alt = STAR_COLS[Math.floor(rand(0, STAR_COLS.length))], sp = rand(H * 0.7, H * 0.95);
      for (var i = 0; i < n; i++) {
        var a = (i / n) * 6.2832 + rand(-0.08, 0.08), v = sp * rand(0.45, 1);
        stars.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(1, 1.5), max: 1.5, col: i % 3 ? r.col : alt });
      }
      return false;
    });
    stars = stars.filter(function (p) {
      p.vx *= 1 - 1.6 * dt; p.vy = p.vy * (1 - 1.6 * dt) + 40 * dt;
      var px = p.x, py = p.y;
      p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) return false;
      // A short streak behind each star, with a flicker as it dies.
      ctx.globalAlpha = Math.min(1, p.life / 0.8) * (p.life < 0.5 && Math.random() < 0.3 ? 0.3 : 0.9);
      ctx.strokeStyle = p.col; ctx.lineWidth = 1.6; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px - p.vx * dt * 3, py - p.vy * dt * 3); ctx.lineTo(p.x, p.y); ctx.stroke();
      return true;
    });
    ctx.restore();
  }

  function drawScene(dt, dim) {
    if (!dim) drawFireworks(dt);
    ctx.globalAlpha = dim ? 0.45 : 1;
    drawDiyaStrings();
    scene.lanterns.forEach(lantern);
    drawBunting();
    ctx.globalAlpha = 1;
    drawEmbers(dt);
    if (!dim && document.documentElement.classList.contains('cat-mode')) drawFountains(dt);
    if (!dim) drawSparkler(dt);
  }

  // ---------- anaar: a fountain cracker in each bottom corner of the full-screen banner ----------
  // Bring a burning sparkler to the wick and it sprays gold for a few seconds.
  var fountains = [{ side: -1, t: -1, sparks: [] }, { side: 1, t: -1, sparks: [] }], ANAAR_BURN = 7;
  function drawFountains(dt) {
    var narrow = W < 600, s = narrow ? 0.75 : 0.95, inset = narrow ? 26 : 40;
    fountains.forEach(function (F) {
      var x = F.side < 0 ? inset : W - inset, y = H - (narrow ? 12 : 16), tipX = x, tipY = y - 34 * s;
      if (F.t >= 0) { F.t += dt; if (F.t > ANAAR_BURN) F.t = -1; }
      if (F.t < 0 && mouse && sparkler.lit && sparkler.t > CATCH && Math.hypot(mouse.x - tipX, mouse.y - tipY) < 46 * s) { F.t = 0; kick(); crackerLit = true; }
      var k = F.t < 0 ? 0 : F.t < 0.6 ? F.t / 0.6 : F.t > ANAAR_BURN - 1.5 ? (ANAAR_BURN - F.t) / 1.5 : 1;
      if (k > 0 && !reduce) {
        for (var i = 0, n = Math.round(14 * k); i < n; i++) {
          var a = -Math.PI / 2 + rand(-0.28, 0.28), v = rand(240, 520) * (0.55 + 0.45 * k) * s * Math.min(1, H / 800 + 0.3);
          F.sparks.push({ x: tipX + rand(-2, 2), y: tipY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.9, 1.6), col: Math.random() < 0.25 });
        }
      }
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      if (k > 0) {
        var g = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 130 * s);
        g.addColorStop(0, 'rgba(255,210,120,' + (0.42 * k).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,150,50,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tipX, tipY, 130 * s, 0, 6.2832); ctx.fill();
      }
      F.sparks = F.sparks.filter(function (p) {
        var px = p.x, py = p.y; p.vy += 300 * dt; p.vx *= 1 - 0.6 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        if (p.life <= 0 || p.y > H + 10) return false;
        var al = Math.min(1, p.life * 1.4);
        ctx.strokeStyle = p.col ? 'rgba(255,255,240,' + al.toFixed(3) + ')' : 'rgba(255,' + (160 + Math.round(60 * Math.min(1, p.life))) + ',60,' + al.toFixed(3) + ')';
        ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
        return true;
      });
      ctx.restore();
      anaarPot(x, y, s, F.t >= 0, k);
    });
  }
  // A clay anaar drawn with a little depth: a round-bodied cone lit from the upper left,
  // an elliptical mouth, a paper band that wraps around it and a soft contact shadow.
  function anaarPot(x, y, s, burning, k) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    var sh = ctx.createRadialGradient(0, 1, 2, 0, 1, 26);
    sh.addColorStop(0, 'rgba(30,6,20,.45)'); sh.addColorStop(1, 'rgba(30,6,20,0)');
    ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(0, 1, 26, 6, 0, 0, 6.2832); ctx.fill();
    // body: shaded across its width so it reads as round
    var body = ctx.createLinearGradient(-19, 0, 19, 0);
    body.addColorStop(0, '#5c1f0c'); body.addColorStop(0.28, '#d0642f'); body.addColorStop(0.42, '#e98a4d');
    body.addColorStop(0.7, '#a8401c'); body.addColorStop(1, '#4a1708');
    ctx.fillStyle = body;
    ctx.beginPath(); ctx.moveTo(-19, 0); ctx.lineTo(-6, -33); ctx.lineTo(6, -33); ctx.lineTo(19, 0);
    ctx.ellipse(0, 0, 19, 4.5, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    // paper band, curved with the body
    var band = ctx.createLinearGradient(-15, 0, 15, 0);
    band.addColorStop(0, '#9c6a10'); band.addColorStop(0.35, '#ffd25a'); band.addColorStop(0.5, '#fff0b0'); band.addColorStop(1, '#8a5a0a');
    ctx.fillStyle = band;
    ctx.beginPath(); ctx.moveTo(-14.6, -11); ctx.ellipse(0, -11, 14.6, 3.4, 0, Math.PI, 0, true);
    ctx.lineTo(10.6, -21.5); ctx.ellipse(0, -21.5, 10.6, 2.5, 0, 0, Math.PI); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = 'rgba(31,122,90,.9)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.ellipse(0, -16.2, 12.6, 2.9, 0, 0, Math.PI); ctx.stroke();
    // specular streak
    ctx.strokeStyle = 'rgba(255,230,200,.35)'; ctx.lineWidth = 2; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(-8.5, -4); ctx.lineTo(-3.6, -28); ctx.stroke();
    // mouth
    ctx.fillStyle = '#7a2c14'; ctx.beginPath(); ctx.ellipse(0, -33, 6, 1.9, 0, 0, 6.2832); ctx.fill();
    ctx.fillStyle = burning ? 'rgba(255,220,140,' + (0.5 + 0.5 * k).toFixed(3) + ')' : '#2a0e05';
    ctx.beginPath(); ctx.ellipse(0, -33, 4, 1.2, 0, 0, 6.2832); ctx.fill();
    if (!burning) {
      ctx.strokeStyle = '#d9d2c4'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(0, -33); ctx.quadraticCurveTo(3, -38, 1, -42); ctx.stroke();
    }
    ctx.restore();
  }

  // ---------- sparkler (the cursor) ----------
  function drawSparkler(dt) {
    if (sparkler.lit) {
      sparkler.t += dt;
      if (sparkler.t >= BURN) sparkler.lit = false;
    }
    // 0 while it smoulders, rising to 1 by RAMP seconds, falling to 0 over the last FADE seconds.
    var st = sparkler.t, strength = !sparkler.lit || st < CATCH ? 0
      : st < RAMP ? 0.12 + 0.88 * Math.pow((st - CATCH) / (RAMP - CATCH), 2)
      : st > BURN - FADE ? (BURN - st) / FADE : 1;
    // The greeting shows only while the sparkler is at its peak.
    peak = strength >= 1;
    if (!reduce) cover.classList.toggle('awaits-greeting', !peak);
    if (!reduce) headStage(st);
    if (mouse && !sparkler.lit && scene.flames.some(function (f) {
      return Math.hypot(f.x - mouse.x, f.y - mouse.y) < LIGHT_RADIUS;
    })) {
      sparkler.lit = true; sparkler.t = 0; sparkler.everLit = true;
    }
    if (mouse && sparkler.lit && !reduce) {
      // Fewer sparks as it burns down.
      var n = strength < 0.3 ? (Math.random() < strength * 2.5 ? 1 : 0) : Math.round(rand(5, 9) * strength);
      for (var i = 0; i < n; i++) {
        var a = rand(0, 6.2832), v = rand(50, 190) * (0.45 + 0.55 * strength);
        sparkles.push({ x: mouse.x, y: mouse.y, px: mouse.x, py: mouse.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.25, 0.55) });
      }
    }
    sparkles = sparkles.filter(function (s) { return s.life > 0; });
    ctx.lineCap = 'round';
    sparkles.forEach(function (s) {
      s.px = s.x; s.py = s.y;
      s.vy += 140 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      ctx.strokeStyle = 'rgba(255,' + (200 + Math.round(55 * s.life)) + ',150,' + Math.min(1, s.life * 2.2).toFixed(3) + ')';
      ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(s.px, s.py); ctx.lineTo(s.x, s.y); ctx.stroke();
      // the occasional fork, like a real phuljhadi
      if (s.life > 0.3 && Math.random() < 0.05) {
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x + rand(-5, 5), s.y + rand(-5, 5)); ctx.stroke();
      }
    });
    if (!mouse) return;
    // The stick hangs down and to the right of the tip, which sits on the pointer.
    var len = 54, ang = 1.05, ex = mouse.x + Math.cos(ang) * len, ey = mouse.y + Math.sin(ang) * len;
    var coat = sparkler.lit ? 1 - Math.max(0, sparkler.t - CATCH) / (BURN - CATCH) : sparkler.everLit ? 0 : 1;
    if (sparkler.everLit && !sparkler.lit) coat = 0;
    ctx.strokeStyle = 'rgba(190,190,190,.9)'; ctx.lineWidth = 1.6;
    ctx.beginPath(); ctx.moveTo(mouse.x, mouse.y); ctx.lineTo(ex, ey); ctx.stroke();
    if (coat > 0) {
      var cx = mouse.x + Math.cos(ang) * len * 0.62 * (1 - coat), cy = mouse.y + Math.sin(ang) * len * 0.62 * (1 - coat);
      ctx.strokeStyle = '#5b4436'; ctx.lineWidth = 3.4;
      ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(mouse.x + Math.cos(ang) * len * 0.62, mouse.y + Math.sin(ang) * len * 0.62); ctx.stroke();
    }
    if (sparkler.lit) {
      // Smouldering: a small ember that slowly brightens. Burning: a bright core.
      var catchK = Math.min(1, st / CATCH), rad = strength > 0 ? 8 + 14 * strength : 3 + 4 * catchK;
      var core = strength > 0 ? 'rgba(255,250,220,.95)' : 'rgba(255,150,70,' + (0.4 + 0.5 * catchK).toFixed(3) + ')';
      var g = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, rad);
      g.addColorStop(0, core); g.addColorStop(0.35, 'rgba(255,190,100,' + (0.2 + 0.3 * Math.max(strength, catchK * 0.4)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,160,60,0)');
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(mouse.x, mouse.y, rad, 0, 6.2832); ctx.fill();
    } else {
      ctx.fillStyle = sparkler.everLit ? 'rgba(80,60,50,.9)' : '#5b4436';
      ctx.beginPath(); ctx.arc(mouse.x, mouse.y, 2, 0, 6.2832); ctx.fill();
    }
  }

  // ---------- game drawing ----------
  // Target: a straw boss hung on a cord, with a painted face (outer ring to gold centre).
  var RINGS = [C.cream, '#3a1430', '#2f6f9e', C.vermilion, C.gold];
  function drawTarget() {
    var T = target, rx = T.r * 0.42, R = T.r;
    ctx.save();
    ctx.translate(T.x, T.y);
    // cord up to the top of the banner, and a tassel below
    ctx.strokeStyle = 'rgba(255,236,200,.55)'; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(0, -R - 6); ctx.lineTo(0, -T.y); ctx.stroke();
    ctx.strokeStyle = C.gold; ctx.lineWidth = 1;
    for (var k = -3; k <= 3; k += 1.5) { ctx.beginPath(); ctx.moveTo(k * 0.6, R + 7); ctx.lineTo(k, R + 20); ctx.stroke(); }
    ctx.fillStyle = C.vermilion; ctx.beginPath(); ctx.arc(0, R + 7, 2.5, 0, 6.2832); ctx.fill();
    if (flash > 0) {
      ctx.fillStyle = 'rgba(255,214,110,' + (flash * 0.45).toFixed(3) + ')';
      ctx.beginPath(); ctx.ellipse(0, 0, rx + 22 * flash, R + 22 * flash, 0, 0, 6.2832); ctx.fill();
    }
    // straw boss: a thick rim with woven ticks, and a soft drop shadow
    ctx.shadowColor = 'rgba(40,10,30,.35)'; ctx.shadowBlur = 12; ctx.shadowOffsetX = 3;
    ctx.fillStyle = '#c98e3a';
    ctx.beginPath(); ctx.ellipse(0, 0, rx + 5, R + 6, 0, 0, 6.2832); ctx.fill();
    ctx.shadowColor = 'transparent';
    ctx.strokeStyle = 'rgba(120,70,20,.55)'; ctx.lineWidth = 1;
    for (var t = 0; t < 6.2832; t += 0.32) {
      var c = Math.cos(t), sn = Math.sin(t);
      ctx.beginPath(); ctx.moveTo(c * (rx + 1), sn * (R + 1)); ctx.lineTo(c * (rx + 5), sn * (R + 6)); ctx.stroke();
    }
    // painted face, with thin dividers between the scoring rings
    for (var i = 0; i < 5; i++) {
      var f = 1 - i / 5;
      ctx.fillStyle = RINGS[i];
      ctx.beginPath(); ctx.ellipse(0, 0, rx * f, R * f, 0, 0, 6.2832); ctx.fill();
      ctx.strokeStyle = i === 1 ? 'rgba(255,243,214,.35)' : 'rgba(40,10,30,.25)'; ctx.lineWidth = 0.8;
      ctx.beginPath(); ctx.ellipse(0, 0, rx * f, R * f, 0, 0, 6.2832); ctx.stroke();
    }
    // a little sheen across the face
    var g = ctx.createLinearGradient(-rx, -R, rx, R);
    g.addColorStop(0, 'rgba(255,255,255,.22)'); g.addColorStop(0.5, 'rgba(255,255,255,0)'); g.addColorStop(1, 'rgba(0,0,0,.12)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(0, 0, rx, R, 0, 0, 6.2832); ctx.fill();
    ctx.fillStyle = '#5a1a0c'; ctx.beginPath(); ctx.ellipse(0, 0, 1.4, 2.6, 0, 0, 6.2832); ctx.fill();
    ctx.restore();
  }

  // Arrow: gold shaft and fletching with a cream head (two colours, like the bow).
  var BOW_GOLD = '#f5b82e', BOW_CREAM = '#fff3d6';
  // The game bow is the peeking bow's SVG (64-unit box, grip at 36,32) drawn at this scale.
  var BOW_K = 76 / 64 * 1.3;
  // Arrow, drawn like the bow's SVG: cream shaft and head, marigold fletching. (x, y) is the tip.
  function drawArrow(x, y, ang, len, lit) {
    var k = BOW_K * len / 52;
    ctx.save();
    ctx.translate(x, y); ctx.rotate(ang); ctx.scale(k, k);
    ctx.lineCap = 'round';
    ctx.strokeStyle = BOW_CREAM; ctx.lineWidth = 2.4;
    ctx.beginPath(); ctx.moveTo(-48, 0); ctx.lineTo(-6, 0); ctx.stroke();
    ctx.fillStyle = BOW_CREAM;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-9, -5); ctx.lineTo(-7, 0); ctx.lineTo(-9, 5); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C.marigold; ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-48, 0); ctx.lineTo(-53, -5); ctx.moveTo(-48, 0); ctx.lineTo(-53, 5);
    ctx.moveTo(-43, 0); ctx.lineTo(-48, -5); ctx.moveTo(-43, 0); ctx.lineTo(-48, 5);
    ctx.stroke();
    ctx.restore();
    if (lit) flame(x, y, 0.65, 0);
  }

  function aimState() {
    if (pull) {
      var dx = pull.x0 - pull.x, dy = pull.y0 - pull.y;
      var d = Math.min(MAX_PULL, Math.hypot(dx, dy));
      if (d < 4) return { angle: keyAim.angle, power: 0 };
      return { angle: Math.atan2(dy, dx), power: d / MAX_PULL };
    }
    // At rest the string is slack, until the arrow keys set a power.
    return keyUsed ? keyAim : { angle: keyAim.angle, power: 0 };
  }

  // Bow: the same gold bow as the one peeking up from the banner, with the string drawn back.
  function drawBow(a) {
    var ang = a.angle, sx = 13 - a.power * 14;
    ctx.save();
    ctx.translate(bow.x, bow.y); ctx.rotate(ang); ctx.scale(BOW_K, BOW_K); ctx.translate(-36, -32);
    ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    ctx.strokeStyle = BOW_CREAM; ctx.globalAlpha = 0.9; ctx.lineWidth = 1.4;
    ctx.beginPath(); ctx.moveTo(24, 5); ctx.lineTo(sx, 32); ctx.lineTo(24, 59); ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.strokeStyle = BOW_GOLD; ctx.lineWidth = 4.5;
    ctx.beginPath(); ctx.moveTo(24, 5); ctx.quadraticCurveTo(48, 32, 24, 59); ctx.stroke();
    ctx.restore();
    if (mode === 'aim' && left > 0) {
      var tip = (sx + 48 - 36) * BOW_K;
      drawArrow(bow.x + Math.cos(ang) * tip, bow.y + Math.sin(ang) * tip, ang, 52, true);
      if (a.power > 0.05) drawGuide(a);
    }
  }

  // A short dotted preview of the flight: enough to aim, not enough to give it away.
  function drawGuide(a) {
    var v = a.power * MAX_SPEED, vx = Math.cos(a.angle) * v, vy = Math.sin(a.angle) * v;
    ctx.fillStyle = 'rgba(255,230,190,.5)';
    for (var s = 1; s <= 9; s++) {
      var tt = s * 0.03 * Math.min(1, W / 1100);
      ctx.beginPath(); ctx.arc(bow.x + 26 + vx * tt, bow.y + vy * tt + 0.5 * G * tt * tt, 1.6, 0, 6.2832); ctx.fill();
    }
  }

  function drawSparks(dt) {
    sparks = sparks.filter(function (s) { return s.life > 0; });
    sparks.forEach(function (s) {
      s.vy += 260 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt * 1.2;
      ctx.fillStyle = 'rgba(255,' + (190 + Math.round(60 * s.life)) + ',110,' + Math.max(0, s.life).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(s.x, s.y, 1.6, 0, 6.2832); ctx.fill();
    });
  }
  function burst(x, y, n) {
    if (reduce) return;
    for (var i = 0; i < n; i++) {
      var a = rand(0, 6.2832), v = rand(60, 260);
      sparks.push({ x: x, y: y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 60, life: rand(0.6, 1) });
    }
  }

  function draw(dt) {
    dt = dt || 0;
    ctx.clearRect(0, 0, W, H);
    if (!scene) return;
    drawScene(dt, mode !== 'idle');
    if (mode === 'idle') return;
    drawTarget();
    stuck.forEach(function (s) { drawArrow(target.x + 3, target.y + s.dy, s.ang, 40, false); });
    if (!landing) drawBow(aimState());
    trail.forEach(function (p, i) {
      ctx.fillStyle = 'rgba(255,180,80,' + (i / trail.length * 0.6).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(p.x, p.y, 1 + i / trail.length * 1.6, 0, 6.2832); ctx.fill();
    });
    if (arrow) drawArrow(arrow.x, arrow.y, Math.atan2(arrow.vy, arrow.vx), 52, true);
    drawSparks(dt);
  }

  // ---------- loop ----------
  function loop(ts) {
    var dt = Math.min(0.033, last ? (ts - last) / 1000 : 0.016);
    last = ts; now += dt;
    if (mode !== 'idle') step(dt);
    draw(dt);
    raf = (visible && (!reduce || mode !== 'idle' || mouse)) ? requestAnimationFrame(loop) : 0;
  }
  function kick() { if (!raf) { last = 0; raf = requestAnimationFrame(loop); } }

  function step(dt) {
    // After the first scoring shot the target starts to drift.
    if (score > 0 && !reduce && mode !== 'done') {
      target.y += target.dir * 38 * dt;
      if (target.y > target.bottom) { target.y = target.bottom; target.dir = -1; }
      if (target.y < target.top) { target.y = target.top; target.dir = 1; }
    }
    if (flash > 0) flash = Math.max(0, flash - dt * 1.6);
    if (arrow) {
      var px = arrow.x;
      arrow.vy += G * dt; arrow.x += arrow.vx * dt; arrow.y += arrow.vy * dt;
      trail.push({ x: arrow.x - Math.cos(Math.atan2(arrow.vy, arrow.vx)) * 52, y: arrow.y - Math.sin(Math.atan2(arrow.vy, arrow.vx)) * 52 });
      if (trail.length > 14) trail.shift();
      if (px < target.x && arrow.x >= target.x) {
        var dy = arrow.y - target.y;
        if (Math.abs(dy) <= target.r) hit(dy, Math.atan2(arrow.vy, arrow.vx));
      }
      if (arrow && (arrow.x > W + 60 || arrow.y > H + 60 || arrow.x < -60)) miss();
    } else if (trail.length) trail.shift();
  }

  function shoot(a) {
    if (mode !== 'aim' || left <= 0 || a.power < 0.08) return;
    var v = a.power * MAX_SPEED;
    sfx.twang(a.power); sfx.whoosh(a.power);
    arrow = { x: bow.x + Math.cos(a.angle) * 25 * BOW_K, y: bow.y + Math.sin(a.angle) * 25 * BOW_K, vx: Math.cos(a.angle) * v, vy: Math.sin(a.angle) * v };
    left--; mode = 'fly'; trail = [];
    status();
  }

  var NAMES = ['Bullseye!', 'Great shot!', 'Nice!', 'On the board.', 'Just made it.'];
  var POINTS = [10, 8, 6, 4, 2];
  function hit(dy, ang) {
    var ring = Math.min(4, Math.floor(Math.abs(dy) / (target.r / 5)));
    stuck.push({ dy: dy, ang: ang });
    score += POINTS[ring];
    arrow = null;
    flash = ring === 0 ? 1 : 0.5;
    sfx.thunk(ring === 0);
    burst(target.x, target.y + dy, ring === 0 ? 70 : 24);
    afterShot(NAMES[ring] + ' +' + POINTS[ring] + '.');
  }
  function miss() { arrow = null; afterShot('Missed.'); }

  function afterShot(msg) {
    if (left > 0) { mode = 'aim'; status(msg); return; }
    mode = 'done';
    cover.classList.add('is-won');
    var isBest = score > 0 && (!best || score > best);
    if (isBest) { best = score; try { localStorage.setItem('at-archery-best', String(score)); } catch (e) {} }
    if (score >= 24) burst(W * 0.6, H * 0.4, 120);
    var verdict = score >= 24 ? 'Right on target, like the work.' : score >= 12 ? 'Solid aim. One more round?' : '';
    hudText.textContent = msg + ' Final score ' + score + '/30' + (isBest ? ' (your best)' : best ? ' · best ' + best : '') + '.' + (verdict ? ' ' + verdict : '');
  }

  function status(msg) {
    if (mode === 'done') return;
    var arrows = left + (left === 1 ? ' arrow' : ' arrows') + ' left';
    hudText.textContent = (msg ? msg + ' ' : '') + 'Score ' + score + ' · ' + arrows;
  }

  function newRound() {
    stuck = []; left = ARROWS; score = 0; arrow = null; pull = null; flash = 0; sparks = []; trail = [];
    target.y = bow ? bow.y : H * 0.45; target.dir = 1;
    mode = 'aim';
    cover.classList.remove('is-won');
    status();
    kick();
  }

  function start() {
    mouse = null; sparkles = []; rockets = []; stars = []; peak = false;
    cover.classList.add('is-playing');
    mode = 'aim';
    setTimeout(function () { resize(); newRound(); }, reduce ? 0 : 320);
    hud.querySelector('[data-act="close"]').focus({ preventScroll: true });
    kick();
  }
  function stop() {
    mode = 'idle'; arrow = null; pull = null; sparks = []; trail = []; mouse = null;
    cover.classList.remove('is-playing', 'is-won');
    setTimeout(function () { resize(); kick(); }, reduce ? 0 : 320);
    peek.focus({ preventScroll: true });
  }

  // ---------- input ----------
  function pos(ev) {
    var r = canvas.getBoundingClientRect();
    return { x: ev.clientX - r.left, y: ev.clientY - r.top };
  }
  cover.addEventListener('pointermove', function (ev) {
    if (mode === 'idle') { mouse = pos(ev); kick(); }
  });
  cover.addEventListener('pointerdown', function (ev) {
    if (mode === 'idle') { mouse = pos(ev); kick(); }
  });
  cover.addEventListener('pointerleave', function () { mouse = null; sparkles = []; kick(); });

  // Press anywhere on the banner and drag back; the arrow flies the opposite way.
  canvas.addEventListener('pointerdown', function (ev) {
    if (mode !== 'aim') return;
    var p = pos(ev);
    pull = { x0: p.x, y0: p.y, x: p.x, y: p.y, step: 0 };
    sfx.unlock();
    canvas.setPointerCapture(ev.pointerId);
    ev.preventDefault();
  });
  canvas.addEventListener('pointermove', function (ev) {
    if (pull) {
      var p = pos(ev); pull.x = p.x; pull.y = p.y;
      // A creak for every notch the string is drawn back.
      var notch = Math.floor(aimState().power * 6);
      if (notch > pull.step) { pull.step = notch; sfx.creak(notch / 6); }
      else if (notch < pull.step) pull.step = notch;
    }
  });
  function release() {
    if (!pull) return;
    var a = aimState();
    pull = null;
    if (a.power >= 0.08) keyAim = { angle: a.angle, power: a.power };
    shoot(a);
  }
  canvas.addEventListener('pointerup', release);
  canvas.addEventListener('pointercancel', function () { pull = null; });

  hint.addEventListener('click', start);
  // The bow shakes on a tap, then leaps up to where it sits in the game.
  function playHeight() {
    var t = cover.style.transition;
    cover.style.transition = 'none';
    cover.classList.add('is-playing');
    var h = cover.getBoundingClientRect().height;
    cover.classList.remove('is-playing');
    void cover.offsetHeight;
    cover.style.transition = t;
    return h;
  }
  function jump() {
    var svg = peek.querySelector('svg');
    if (reduce || !svg.animate) { start(); return; }
    var c = cover.getBoundingClientRect(), r = peek.getBoundingClientRect();
    var w = c.width, h = playHeight(), narrow = w < 600;
    var spot = bowSpot(w, h), tx = spot.x, ty = spot.y;
    // Pin the bow to the banner's top so it stays put while the banner grows.
    var top = r.top - c.top;
    peek.style.top = top + 'px'; peek.style.bottom = 'auto';
    peek.classList.add('is-jumping');
    // Rotate and scale around the grip of the drawn bow (56% across, half way down).
    var ox = (r.left - c.left) + 2 + 76 * 0.5625, oy = top + 6 + 38;
    var dx = tx - ox, dy = ty - oy, lift = Math.min(90, Math.max(46, -dy * 0.5 + 46));
    var y0 = getComputedStyle(svg).transform === 'none' ? 0 : new DOMMatrix(getComputedStyle(svg).transform).f;
    svg.style.transform = 'none';
    landing = true;
    start();
    sfx.whoosh(0.5);
    // The throw: across on a smooth curve, up past its spot on a gentle slope and back down
    // into it, one smooth turn on the way, growing to its game size. It lands exactly where it
    // stays, with a soft settle and no bounce.
    var D = 1150, opts = { duration: D, fill: 'forwards' };
    var peakY = Math.min(y0, dy) - Math.min(90, Math.max(48, Math.abs(dx) * 0.08 + 36));
    var anims = [
      peek.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(' + dx + 'px)' }],
        { duration: D * 0.8, easing: 'cubic-bezier(.35,0,.25,1)', fill: 'forwards' }),
      svg.animate([
        { translate: '0 ' + y0 + 'px', easing: 'cubic-bezier(.2,.6,.35,1)' },
        { translate: '0 ' + peakY + 'px', offset: 0.5, easing: 'cubic-bezier(.55,0,.45,1)' },
        { translate: '0 ' + (dy + 3) + 'px', offset: 0.86, easing: 'ease-out' },
        { translate: '0 ' + dy + 'px' }
      ], opts),
      // One smooth clockwise turn that rides the whole arc and finishes on its aiming angle.
      svg.animate([
        { rotate: '-38deg', easing: 'cubic-bezier(.45,.05,.3,1)' },
        { rotate: '350deg', offset: 0.86 },
        { rotate: '350deg' }
      ], opts),
      svg.animate([
        { scale: '1', easing: 'cubic-bezier(.3,0,.3,1)' },
        { scale: '1.22', offset: 0.5, easing: 'cubic-bezier(.4,0,.3,1)' },
        { scale: '1.32', offset: 0.86, easing: 'ease-out' },
        { scale: '1.3' }
      ], opts)
    ];
    setTimeout(sfx.land, D * 0.86);
    anims[1].onfinish = function () {
      landing = false;
      resize();
      burst(bow.x, bow.y, 18);
      kick();
      requestAnimationFrame(function () {
        anims.forEach(function (a) { a.cancel(); });
        peek.classList.remove('is-jumping');
        peek.style.top = peek.style.bottom = svg.style.transform = '';
      });
    };
  }
  peek.addEventListener('click', function () {
    if (mode !== 'idle' || landing) return;
    sfx.unlock();
    if (navigator.vibrate) { try { navigator.vibrate(30); } catch (e) {} }
    jump();
  });
  hud.addEventListener('click', function (ev) {
    var act = ev.target.getAttribute('data-act');
    if (act === 'close') stop();
    if (act === 'again') newRound();
    if (act === 'sound') syncSound(sfx.toggle());
  });
  // Keyboard play: Up/Down aim, Left/Right set power, Space shoots, Esc closes.
  document.addEventListener('keydown', function (ev) {
    if (mode === 'idle') return;
    if (ev.key === 'Escape') { stop(); return; }
    if (mode !== 'aim') return;
    var used = true;
    if (ev.key === 'ArrowUp') keyAim.angle = Math.max(-1.3, keyAim.angle - 0.03);
    else if (ev.key === 'ArrowDown') keyAim.angle = Math.min(0.6, keyAim.angle + 0.03);
    else if (ev.key === 'ArrowRight') { keyAim.power = Math.min(1, keyAim.power + 0.03); if (Math.floor(keyAim.power * 6) !== Math.floor((keyAim.power - 0.03) * 6)) sfx.creak(keyAim.power); }
    else if (ev.key === 'ArrowLeft') keyAim.power = Math.max(0.1, keyAim.power - 0.03);
    else if (ev.key === ' ') shoot(keyAim);
    else used = false;
    if (used && ev.key !== ' ') keyUsed = true;
    if (used) ev.preventDefault();
  });

  // Only animate while the banner is on screen.
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (en) {
      visible = en[0].isIntersecting;
      if (visible) kick();
    }).observe(cover);
  }
  // While the bow is jumping, the banner grows; resizing the canvas every frame of that would stutter.
  if ('ResizeObserver' in window) new ResizeObserver(function () { if (!landing) resize(); }).observe(cover);
  else window.addEventListener('resize', resize);
  resize();
  kick();
})();
