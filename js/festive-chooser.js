// Diwali lights for the "Who's visiting?" screen, in the same style as the profile cover:
// bunting, hanging kandils and strings of diyas. The cursor is a sparkler: touch a diya
// flame to light it. While it burns at full strength the title turns into a Diwali
// greeting and skyrockets burst behind the tiles. Two anaar (fountain crackers) sit in
// the bottom corners: bring the lit sparkler to one and it erupts for a few seconds.
(function () {
  if (!document.createElement('canvas').getContext) return;
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var CATCH = 1.2, RAMP = 3, BURN = 14, FADE = 2, LIGHT_RADIUS = 30;
  var C = { gold: '#f5b82e', marigold: '#f08a24', vermilion: '#d9412b', leaf: '#1f7a5a', clay: '#a8401c', deep: '#5a1a0c', cream: '#fff3d6' };
  var STAR_COLS = ['#ffd27a', '#ff9a4d', '#ff6b5a', '#ffe9b8', '#ffb3c7', '#9fe3c9', '#8fb8ff'];

  function layer(cls) {
    var c = document.createElement('canvas');
    c.className = cls; c.setAttribute('aria-hidden', 'true');
    document.body.appendChild(c);
    return { c: c, x: c.getContext('2d') };
  }
  var back = layer('festive-back'), front = layer('festive-front');
  document.body.classList.add('is-festive');


  var W = 0, H = 0, dpr = 1, now = 0, last = 0, mouse = null, scene = null, embers = [];
  var rockets = [], stars = [], nextRocket = 0, peak = false, fountains = [];
  var sparkler = { lit: false, t: 0, everLit: false }, sparkles = [];
  function rand(a, b) { return a + Math.random() * (b - a); }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2); W = innerWidth; H = innerHeight;
    [back, front].forEach(function (l) {
      l.c.width = Math.round(W * dpr); l.c.height = Math.round(H * dpr);
      l.c.style.width = W + 'px'; l.c.style.height = H + 'px';
      l.x.setTransform(dpr, 0, 0, dpr, 0, 0);
    });
    var narrow = W < 700, base = Math.min(H * 0.28, 210);
    var strings = narrow ? [[0.6, 0.22], [0.8, 0.34]] : [[0.3, 0.34], [0.5, 0.5], [0.7, 0.4]];
    scene = {
      lanterns: narrow
        ? [{ x: W * 0.92, len: 34, s: 0.5, p: 0 }, { x: W * 0.7, len: 6, s: 0.4, p: 1.7 }]
        : [{ x: W * 0.17, len: 60, s: 0.85, p: 0 }, { x: W * 0.235, len: 14, s: 0.6, p: 1.7 },
           { x: W * 0.84, len: 26, s: 0.72, p: 0.9 }, { x: W * 0.95, len: 54, s: 0.6, p: 2.4 }],
      diyas: strings.map(function (d, i) { return { x: W * d[0], len: base * d[1], p: i * 1.3 }; })
    };
    scene.flames = scene.diyas.map(function (d) { return { x: d.x + 3.5, y: d.len + 2 }; });
    var n = Math.round((W * H) / (narrow ? 5200 : 7000));
    embers = []; for (var i = 0; i < n; i++) embers.push(newEmber(true));
    var fs = narrow ? 0.75 : 1, fy = H - (narrow ? 26 : 34);
    var old = fountains;
    fountains = [{ x: narrow ? 36 : Math.max(60, W * 0.06), y: fy, s: fs }, { x: W - (narrow ? 36 : Math.max(60, W * 0.06)), y: fy, s: fs }]
      .map(function (f, i) { f.t = old[i] ? old[i].t : -1; f.sparks = old[i] ? old[i].sparks : []; return f; });
  }
  function newEmber(anywhere) {
    return { x: rand(0, W), y: anywhere ? rand(0, H) : H + rand(2, 20), r: rand(0.6, 1.8), vy: rand(8, 22), f: rand(0.6, 1.6), p: rand(0, 6.28) };
  }

  // ---------- scene (back layer) ----------
  var ctx = back.x;
  function drawBunting() {
    var start = 0, swags = W < 700 ? 2 : 4, sw = (W - start) / swags;
    for (var s = 0; s < swags; s++) {
      var x0 = start + s * sw, sag = 18;
      ctx.strokeStyle = 'rgba(255,230,190,.45)'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(x0, 2); ctx.quadraticCurveTo(x0 + sw / 2, 2 + sag * 2, x0 + sw, 2); ctx.stroke();
      var flags = Math.floor(sw / 26), cols = [C.gold, C.vermilion, C.leaf, C.marigold];
      for (var i = 1; i < flags; i++) {
        var u = i / flags, x = x0 + sw * u, y = 2 + sag * 2 * 2 * u * (1 - u);
        // leave a gap where a lantern or diya hangs, so flags never overlap the lights
        if (scene.lanterns.some(function (L) { return Math.abs(L.x - x) < 22 * L.s + 8; }) || scene.diyas.some(function (d) { return Math.abs(d.x - x) < 20; })) continue;
        var sway = reduce ? 0 : Math.sin(now * 1.4 + i + s) * 1.2;
        ctx.fillStyle = cols[(i + s) % cols.length];
        ctx.beginPath(); ctx.moveTo(x - 6, y); ctx.lineTo(x + 6, y); ctx.lineTo(x + sway, y + 13); ctx.closePath(); ctx.fill();
      }
    }
  }
  function flame(x, y, s, p) {
    var k = reduce ? 1 : 1 + Math.sin(now * 9 + p) * 0.08 + Math.sin(now * 13.7 + p * 2) * 0.05;
    var g = ctx.createRadialGradient(x, y - 2 * s, 0, x, y - 2 * s, 16 * s);
    g.addColorStop(0, 'rgba(255,200,90,.55)'); g.addColorStop(1, 'rgba(255,140,40,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y - 2 * s, 16 * s, 0, 6.2832); ctx.fill();
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s * k);
    var fg = ctx.createLinearGradient(0, -10, 0, 0); fg.addColorStop(0, '#fff6c8'); fg.addColorStop(1, C.marigold);
    ctx.fillStyle = fg; ctx.beginPath(); ctx.moveTo(0, -10); ctx.quadraticCurveTo(4, -3, 0, 0); ctx.quadraticCurveTo(-4, -3, 0, -10); ctx.fill();
    ctx.restore();
  }
  function diya(x, y, s, p) {
    ctx.fillStyle = C.clay; ctx.beginPath(); ctx.moveTo(x - 9 * s, y); ctx.quadraticCurveTo(x, y + 9 * s, x + 9 * s, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold; ctx.fillRect(x - 9 * s, y - 1.2 * s, 18 * s, 1.6 * s);
    flame(x + 3 * s, y - 1 * s, s * 0.8, p);
  }
  function drawDiyaStrings() {
    scene.diyas.forEach(function (d) {
      ctx.fillStyle = 'rgba(255,225,180,.34)';
      for (var y = 4; y < d.len; y += 5) { ctx.beginPath(); ctx.arc(d.x, y, 0.8, 0, 6.2832); ctx.fill(); }
      diya(d.x, d.len + 4, 1.3, d.p);
    });
  }
  function lantern(L) {
    var sway = reduce ? 0 : Math.sin(now * 1.1 + L.p) * 0.05;
    ctx.save(); ctx.translate(L.x, 0); ctx.rotate(sway); ctx.scale(L.s, L.s);
    ctx.strokeStyle = 'rgba(255,230,190,.55)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(0, L.len); ctx.stroke();
    var y = L.len, g = ctx.createRadialGradient(0, y + 34, 0, 0, y + 34, 70);
    g.addColorStop(0, 'rgba(255,190,80,.32)'); g.addColorStop(1, 'rgba(255,150,60,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, y + 34, 70, 0, 6.2832); ctx.fill();
    ctx.fillStyle = C.deep; ctx.fillRect(-9, y, 18, 6);
    ctx.fillStyle = C.vermilion; ctx.beginPath(); ctx.moveTo(0, y + 6); ctx.lineTo(26, y + 32); ctx.lineTo(0, y + 58); ctx.lineTo(-26, y + 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.cream;
    ctx.beginPath(); ctx.moveTo(-13, y + 19); ctx.lineTo(0, y + 32); ctx.lineTo(-13, y + 45); ctx.lineTo(-24, y + 32); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(13, y + 19); ctx.lineTo(24, y + 32); ctx.lineTo(13, y + 45); ctx.lineTo(0, y + 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(0, y + 10); ctx.lineTo(9, y + 32); ctx.lineTo(0, y + 54); ctx.lineTo(-9, y + 32); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C.deep; ctx.fillRect(-10, y + 57, 20, 4);
    ctx.strokeStyle = C.gold; ctx.lineWidth = 1.2;
    for (var i = -8; i <= 8; i += 2.6) { var tw = reduce ? 0 : Math.sin(now * 2 + i) * 1.5; ctx.beginPath(); ctx.moveTo(i, y + 61); ctx.lineTo(i * 1.15 + tw, y + 88); ctx.stroke(); }
    ctx.restore();
  }
  function drawEmbers(dt) {
    embers.forEach(function (e, i) {
      if (!reduce) { e.y -= e.vy * dt; e.x += Math.sin(now * e.f + e.p) * 8 * dt; if (e.y < -6) embers[i] = e = newEmber(false); }
      var a = 0.3 + 0.3 * Math.sin(now * 2 * e.f + e.p), near = 0;
      if (mouse) { var d = Math.hypot(mouse.x - e.x, mouse.y - e.y); if (d < 140) near = 1 - d / 140; }
      ctx.fillStyle = 'rgba(255,170,70,' + (0.16 * (a + near)).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (3 + near * 2), 0, 6.2832); ctx.fill();
      ctx.fillStyle = 'rgba(255,225,160,' + Math.min(1, a + near * 0.6).toFixed(3) + ')';
      ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, 6.2832); ctx.fill();
    });
  }
  function launch() {
    rockets.push({ x: W * rand(0.12, 0.88), y: H + 4, vy: -rand(H * 1.1, H * 1.4), top: H * rand(0.1, 0.38), col: STAR_COLS[Math.floor(rand(0, STAR_COLS.length))] });
  }
  function drawFireworks(dt) {
    if (!reduce && peak) {
      nextRocket -= dt;
      if (nextRocket <= 0) { nextRocket = rand(0.4, 0.85); launch(); }
    }
    if (!rockets.length && !stars.length) return;
    ctx.save(); ctx.globalCompositeOperation = 'lighter';
    rockets = rockets.filter(function (r) {
      r.y += r.vy * dt;
      ctx.strokeStyle = 'rgba(255,220,170,.55)'; ctx.lineWidth = 1.2;
      ctx.beginPath(); ctx.moveTo(r.x, r.y); ctx.lineTo(r.x, r.y + 16); ctx.stroke();
      if (r.y > r.top) return true;
      var n = Math.round(rand(60, 85)), alt = STAR_COLS[Math.floor(rand(0, STAR_COLS.length))], sp = rand(H * 0.45, H * 0.6);
      for (var i = 0; i < n; i++) {
        var a = (i / n) * 6.2832 + rand(-0.08, 0.08), v = sp * rand(0.45, 1);
        stars.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(1.1, 1.7), col: i % 3 ? r.col : alt });
      }
      flash = 0.35; return false;
    });
    stars = stars.filter(function (p) {
      p.vx *= 1 - 1.6 * dt; p.vy = p.vy * (1 - 1.6 * dt) + 40 * dt;
      var px = p.x, py = p.y; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
      if (p.life <= 0) return false;
      ctx.globalAlpha = Math.min(1, p.life / 0.8) * (p.life < 0.5 && Math.random() < 0.3 ? 0.3 : 0.9);
      ctx.strokeStyle = p.col; ctx.lineWidth = 1.7; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(px - p.vx * dt * 3, py - p.vy * dt * 3); ctx.lineTo(p.x, p.y); ctx.stroke();
      return true;
    });
    ctx.restore();
  }
  var flash = 0;

  // ---------- anaar: fountain crackers in the bottom corners ----------
  var ANAAR_BURN = 7;
  function drawFountains(dt) {
    fountains.forEach(function (F) {
      var s = F.s, tipX = F.x, tipY = F.y - 30 * s;
      if (F.t >= 0) { F.t += dt; if (F.t > ANAAR_BURN) F.t = -1; }
      // light it with a burning sparkler
      if (F.t < 0 && mouse && sparkler.lit && sparkler.t > CATCH && Math.hypot(mouse.x - tipX, mouse.y - tipY) < 44 * s) F.t = 0;
      var k = F.t < 0 ? 0 : F.t < 0.6 ? F.t / 0.6 : F.t > ANAAR_BURN - 1.5 ? (ANAAR_BURN - F.t) / 1.5 : 1;
      if (k > 0 && !reduce) {
        var n = Math.round(14 * k);
        for (var i = 0; i < n; i++) {
          var a = -Math.PI / 2 + rand(-0.28, 0.28), v = rand(260, 560) * (0.55 + 0.45 * k) * s * Math.min(1, H / 800 + 0.3);
          F.sparks.push({ x: tipX + rand(-2, 2), y: tipY, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.9, 1.7), col: Math.random() < 0.25 ? 1 : 0 });
        }
      }
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      if (k > 0) {
        var g = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 120 * s);
        g.addColorStop(0, 'rgba(255,210,120,' + (0.4 * k).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,150,50,0)');
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(tipX, tipY, 120 * s, 0, 6.2832); ctx.fill();
      }
      F.sparks = F.sparks.filter(function (p) {
        var px = p.x, py = p.y; p.vy += 300 * dt; p.vx *= 1 - 0.6 * dt; p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
        if (p.life <= 0 || p.y > H + 10) return false;
        var al = Math.min(1, p.life * 1.4);
        ctx.strokeStyle = p.col ? 'rgba(255,255,240,' + al.toFixed(3) + ')' : 'rgba(255,' + (160 + Math.round(70 * p.life)) + ',60,' + al.toFixed(3) + ')';
        ctx.lineWidth = 1.4; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(p.x, p.y); ctx.stroke();
        return true;
      });
      ctx.restore();
      // the clay pot: a squat cone with a paper band, wick on top
      ctx.save(); ctx.translate(F.x, F.y); ctx.scale(s, s);
      ctx.fillStyle = 'rgba(0,0,0,.35)'; ctx.beginPath(); ctx.ellipse(0, 2, 22, 5, 0, 0, 6.2832); ctx.fill();
      var body = ctx.createLinearGradient(-18, 0, 18, 0); body.addColorStop(0, '#7a2c14'); body.addColorStop(0.45, '#c2552a'); body.addColorStop(1, '#6a2410');
      ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(-18, 0); ctx.lineTo(-5, -30); ctx.lineTo(5, -30); ctx.lineTo(18, 0); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.gold; ctx.beginPath(); ctx.moveTo(-13.6, -10); ctx.lineTo(-10.2, -18); ctx.lineTo(10.2, -18); ctx.lineTo(13.6, -10); ctx.closePath(); ctx.fill();
      ctx.fillStyle = C.leaf; ctx.fillRect(-11.5, -15, 23, 2);
      ctx.fillStyle = '#3a1608'; ctx.fillRect(-5.5, -31.5, 11, 2.5);
      if (F.t < 0) { ctx.strokeStyle = '#d9d2c4'; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(0, -31); ctx.quadraticCurveTo(3, -36, 1, -40); ctx.stroke(); }
      ctx.restore();
    });
  }

  // ---------- sparkler (front layer, follows the pointer) ----------
  function drawSparkler(dt) {
    var f = front.x;
    if (sparkler.lit) { sparkler.t += dt; if (sparkler.t >= BURN) sparkler.lit = false; }
    var st = sparkler.t, strength = !sparkler.lit || st < CATCH ? 0
      : st < RAMP ? 0.12 + 0.88 * Math.pow((st - CATCH) / (RAMP - CATCH), 2)
      : st > BURN - FADE ? (BURN - st) / FADE : 1;
    peak = strength >= 1;
    document.body.classList.toggle('diwali-on', strength > 0.6 || fountains.some(function (F) { return F.t >= 0; }));
    if (mouse && !sparkler.lit && scene.flames.some(function (fl) { return Math.hypot(fl.x - mouse.x, fl.y - mouse.y) < LIGHT_RADIUS; })) {
      sparkler.lit = true; sparkler.t = 0; sparkler.everLit = true; document.body.classList.add('festive-lit');
    }
    if (mouse && !mouse.ui && sparkler.lit && !reduce) {
      var n = strength < 0.3 ? (Math.random() < strength * 2.5 ? 1 : 0) : Math.round(rand(5, 9) * strength);
      for (var i = 0; i < n; i++) { var a = rand(0, 6.2832), v = rand(50, 190) * (0.45 + 0.55 * strength); sparkles.push({ x: mouse.x, y: mouse.y, px: mouse.x, py: mouse.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: rand(0.25, 0.55) }); }
    }
    sparkles = sparkles.filter(function (s) { return s.life > 0; });
    f.lineCap = 'round';
    sparkles.forEach(function (s) {
      s.px = s.x; s.py = s.y; s.vy += 140 * dt; s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
      // warm amber sparks: the complement of the blue page, so they read clearly
      f.strokeStyle = 'rgba(255,' + (150 + Math.round(90 * s.life)) + ',' + (40 + Math.round(60 * s.life)) + ',' + Math.min(1, s.life * 2.4).toFixed(3) + ')'; f.lineWidth = 1.5;
      f.beginPath(); f.moveTo(s.px, s.py); f.lineTo(s.x, s.y); f.stroke();
      if (s.life > 0.3 && Math.random() < 0.05) { f.beginPath(); f.moveTo(s.x, s.y); f.lineTo(s.x + rand(-5, 5), s.y + rand(-5, 5)); f.stroke(); }
    });
    if (!mouse || mouse.touch || mouse.ui) return;
    var len = 54, ang = 1.05, ex = mouse.x + Math.cos(ang) * len, ey = mouse.y + Math.sin(ang) * len;
    var coat = sparkler.lit ? 1 - Math.max(0, sparkler.t - CATCH) / (BURN - CATCH) : sparkler.everLit ? 0 : 1;
    f.strokeStyle = 'rgba(218,221,228,.95)'; f.lineWidth = 2;
    f.beginPath(); f.moveTo(mouse.x, mouse.y); f.lineTo(ex, ey); f.stroke();
    if (coat > 0) {
      var cx = mouse.x + Math.cos(ang) * len * 0.62 * (1 - coat), cy = mouse.y + Math.sin(ang) * len * 0.62 * (1 - coat);
      f.strokeStyle = '#9a9590'; f.lineWidth = 3.8;
      f.beginPath(); f.moveTo(cx, cy); f.lineTo(mouse.x + Math.cos(ang) * len * 0.62, mouse.y + Math.sin(ang) * len * 0.62); f.stroke();
    }
    if (sparkler.lit) {
      var catchK = Math.min(1, st / CATCH), rad = strength > 0 ? 8 + 14 * strength : 3 + 4 * catchK;
      var core = strength > 0 ? 'rgba(255,248,225,1)' : 'rgba(255,140,40,' + (0.5 + 0.5 * catchK).toFixed(3) + ')';
      var g = f.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, rad);
      g.addColorStop(0, core); g.addColorStop(0.35, 'rgba(255,160,50,' + (0.2 + 0.3 * Math.max(strength, catchK * 0.4)).toFixed(3) + ')'); g.addColorStop(1, 'rgba(255,160,60,0)');
      f.fillStyle = g; f.beginPath(); f.arc(mouse.x, mouse.y, rad, 0, 6.2832); f.fill();
    } else {
      f.fillStyle = sparkler.everLit ? 'rgba(160,155,150,.95)' : '#c9c4bd';
      f.beginPath(); f.arc(mouse.x, mouse.y, 2.6, 0, 6.2832); f.fill();
    }
  }

  function frame(ts) {
    var dt = last ? Math.min(0.05, (ts - last) / 1000) : 0.016; last = ts; now = ts / 1000;
    var waiting = document.body.classList.contains('intro-on');
    back.x.clearRect(0, 0, W, H); front.x.clearRect(0, 0, W, H);
    if (!waiting) {
      if (flash > 0) { flash -= dt; back.x.fillStyle = 'rgba(255,200,140,' + (Math.max(0, flash) * 0.12).toFixed(3) + ')'; back.x.fillRect(0, 0, W, H); }
      drawFireworks(dt); drawDiyaStrings(); scene.lanterns.forEach(lantern); drawBunting(); drawFountains(dt); drawSparkler(dt);
    }
    if (!document.hidden) requestAnimationFrame(frame);
  }
  document.addEventListener('visibilitychange', function () { if (!document.hidden) { last = 0; requestAnimationFrame(frame); } });
  addEventListener('resize', resize);
  // over a tile, button, link or open sheet the sparkler hides and the real cursor shows
  function overUI(e) { return !!(e.target && e.target.closest && e.target.closest('button, a, .scrim')); }
  addEventListener('pointermove', function (e) { mouse = { x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch', ui: overUI(e) }; });
  addEventListener('pointerdown', function (e) { mouse = { x: e.clientX, y: e.clientY, touch: e.pointerType === 'touch' }; });
  document.addEventListener('pointerleave', function () { mouse = null; });
  resize(); requestAnimationFrame(frame);
})();
