// Categories: the Diwali banner fills the screen with a circle for each way in.
// Every move is staged so nothing overlaps:
//   Professional  the other circles fade out first, then the banner shrinks while the
//                 chosen circle travels into the avatar, then the profile rises in.
//   Back          the page glides to the top, the profile content slides away, the banner
//                 grows while the circle travels back to the middle, and only then do the
//                 other circles rise in, one after another.
//   Gamified,     still being built: a dialog says so and offers to request a password.
//   Story
//   +             the feedback dialog fades and lifts in, and fades out when closed.
// Opened with profile.html#categories (the home page redirects there); a script in
// <head> sets the first state so the profile never flashes before the circles, then shows
// clean addresses: the circles at the site root ("/") and the profile at "/profile".
(function () {
  var root = document.documentElement;
  var cover = document.querySelector('.card.profile .cover');
  var cats = document.getElementById('cats');
  var avatar = document.querySelector('.profile-body .avatar');
  if (!cover || !cats || !avatar) return;

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  // Timings (ms); keep MOVE in step with --cat-move in categories.css.
  var T = reduce ? { out: 0, quiet: 0, move: 0, rise: 0, settle: 0, away: 0 }
    : { out: 380, quiet: 320, move: 820, rise: 620, settle: 700, away: 650 };
  // Both pages are still being built: they open through a password dialog.
  var WIP = { gamified: 'Gamified', scrolly: 'Scrollytelling' };
  var ROUTES = { gamified: './ghar/index.html', scrolly: './scrolly/index.html' };
  // SHA-256 of the shared preview password. A light gate only: the pages themselves stay public.
  var PASS_HASH = 'e2855c23afcb9cdde9a6bbb315fc71376be098e28e4f8a5b8576cddc9179e3f0';
  var EMAIL = 'abhishekiit2k12@gmail.com';
  var resume = cats.querySelector('[data-key="resume"]');
  var pic = resume.querySelector('.cat-pic');
  var busy = false;

  // ---------- Game-menu sounds: a soft tick as you move between circles, a bright confirm on pick ----------
  // Synthesised, quiet, and muted along with the archery game's sound toggle.
  var ui = (function () {
    var AC = window.AudioContext || window.webkitAudioContext, ac = null, last = 0;
    function enabled() { try { return localStorage.getItem('at-archery-sound') !== 'off'; } catch (e) { return true; } }
    function unlock() {
      if (!AC || !enabled()) return;
      if (!ac) ac = new AC();
      if (ac.state === 'suspended') ac.resume();
    }
    function ready() { return ac && ac.state === 'running' && enabled(); }
    // A click can be the page's very first gesture: the context is still waking up then,
    // so wait for it instead of dropping the sound.
    function play(fn) {
      if (!AC || !enabled()) return;
      if (!ac) ac = new AC();
      if (ac.state === 'running') return fn();
      var p = ac.resume(); if (p && p.then) p.then(function () { if (ac.state === 'running') fn(); }, function () {});
    }
    function blip(t, dur, type, f0, f1, peak, dest) {
      var o = ac.createOscillator(), g = ac.createGain();
      o.type = type; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(peak, t + 0.006);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(dest || ac.destination); o.start(t); o.stop(t + dur + 0.05);
    }
    return {
      unlock: unlock,
      // Moving focus: a short, muted wooden tick.
      move: function () {
        if (!ready()) return;
        var t = ac.currentTime; if (t - last < 0.05) return; last = t;
        var f = ac.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 2400; f.connect(ac.destination);
        blip(t, 0.05, 'triangle', 1500, 900, 0.07, f);
        blip(t, 0.03, 'sine', 380, 260, 0.05, f);
      },
      // Picking: a low thump under two rising notes that ring out.
      pick: function () {
        play(function () {
          var t = ac.currentTime;
          blip(t, 0.18, 'sine', 140, 60, 0.22);
          blip(t + 0.02, 0.22, 'triangle', 523, 523, 0.07);
          blip(t + 0.11, 0.55, 'sine', 784, 780, 0.08);
          blip(t + 0.11, 0.4, 'triangle', 1568, 1560, 0.02);
        });
      },
      // Going back to the categories: the same notes, falling.
      back: function () {
        play(function () {
          var t = ac.currentTime;
          blip(t, 0.16, 'sine', 120, 70, 0.18);
          blip(t + 0.02, 0.24, 'triangle', 784, 784, 0.06);
          blip(t + 0.12, 0.5, 'sine', 523, 520, 0.08);
        });
      }
    };
  })();
  ['pointerdown', 'keydown'].forEach(function (ev) { document.addEventListener(ev, ui.unlock, { passive: true }); });
  var hoverOk = window.matchMedia && matchMedia('(hover: hover)').matches;
  cats.querySelectorAll('.cat').forEach(function (b) {
    if (hoverOk) b.addEventListener('pointerenter', function () { if (!busy && has('cat-mode')) ui.move(); });
    b.addEventListener('focus', function () { if (!busy && b.matches(':focus-visible')) ui.move(); });
  });

  var curtain = document.createElement('div');
  curtain.className = 'cat-curtain';
  document.body.appendChild(curtain);

  // The profile sets scroll-behavior: smooth on <html>; these jumps must be instant.
  function jump(y) { window.scrollTo({ top: y, left: 0, behavior: 'instant' }); }
  function later(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function frame() { return new Promise(function (r) { requestAnimationFrame(function () { requestAnimationFrame(r); }); }); }
  function on() { for (var i = 0; i < arguments.length; i++) root.classList.add(arguments[i]); }
  function off() { for (var i = 0; i < arguments.length; i++) root.classList.remove(arguments[i]); }
  function has(c) { return root.classList.contains(c); }

  function fitHeight() {
    // The banner fills whatever is left of the screen below its top edge.
    var top = cover.getBoundingClientRect().top + window.scrollY;
    root.style.setProperty('--cat-h', Math.max(420, window.innerHeight - top) + 'px');
  }
  // The profile gets its own history entry, so the browser's back button returns to the circles
  // (the popstate below plays the way back) and forward opens the profile again.
  // GitHub Pages serves profile.html at /profile; elsewhere (local previews) keep the extension.
  var BASE = location.pathname.replace(/[^\/]*$/, '');
  var PAGE = /github\.io$/.test(location.hostname) ? 'profile' : 'profile.html';
  function atRoot() { return location.pathname === BASE && (!location.hash || location.hash === '#categories'); }
  var pushed = false;
  function leaveHash(fromHistory) {
    if (fromHistory || !atRoot() || !history.pushState) return;
    history.pushState(null, '', BASE + PAGE + location.search);
    pushed = true;
  }
  function markHash() {
    if (!atRoot() && history.replaceState) history.replaceState(null, '', BASE + location.search);
  }

  // Where the avatar sits at the banner's normal height, relative to the circle in the middle.
  // Measured with transitions off, so flipping the classes for a moment never paints.
  function avatarDelta() {
    var keep = has('cat-mode'), t = pic.style.transform;
    on('cat-measure', 'cat-mode'); pic.style.transform = '';
    var p = pic.getBoundingClientRect();
    off('cat-mode');
    var a = avatar.getBoundingClientRect();
    if (keep) on('cat-mode');
    pic.style.transform = t;
    void cover.offsetWidth;
    off('cat-measure');
    return { x: a.left + a.width / 2 - (p.left + p.width / 2), y: a.top + a.height / 2 - (p.top + p.height / 2), s: a.width / p.width };
  }
  function place(d, instant) {
    if (instant) pic.style.transition = 'none';
    pic.style.transform = d ? 'translate(' + d.x + 'px,' + d.y + 'px) scale(' + d.s + ')' : '';
    if (instant) { void pic.offsetWidth; pic.style.transition = ''; }
  }

  // Ease the page back to the top before anything else moves.
  function toTop() {
    var y0 = window.scrollY;
    if (y0 < 2 || reduce) { jump(0); return Promise.resolve(); }
    var dur = Math.min(900, 320 + y0 * 0.22), t0 = performance.now();
    return new Promise(function (done) {
      (function step(now) {
        var k = Math.min(1, (now - t0) / dur), e = k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2;
        jump(Math.round(y0 * (1 - e)));
        if (k < 1) requestAnimationFrame(step); else done();
      })(t0);
    });
  }

  // ---------- Professional: circles out, banner down to size, profile in ----------
  function toProfile(fromHistory) {
    if (busy) return; busy = true;
    var d = avatarDelta();
    resume.classList.add('picked');
    on('cat-anim', 'cat-out', 'cat-quiet');
    later(T.out).then(function () {
      off('cat-mode');                 // banner shrinks; the profile sits lowered and faded underneath
      place(d);                        // the circle travels into the avatar at the same pace
      return later(T.move * 0.55);
    }).then(function () {
      off('cat-quiet');                // the profile rises in as the banner settles
      return later(T.settle);
    }).then(function () {
      off('cat-anim', 'cat-out');      // the real avatar takes over from the circle on the same spot
      resume.classList.remove('picked');
      place(null, true);
      leaveHash(fromHistory);
      busy = false;
    });
  }

  // ---------- Back: page up, profile away, banner up, circle home, the rest rise in ----------
  function toCategories(animate) {
    if (busy) return;
    markHash();
    if (!animate || reduce) {
      jump(0); fitHeight(); on('cat-mode'); off('cat-out', 'cat-anim', 'cat-quiet'); place(null, true);
      return;
    }
    busy = true;
    toTop().then(function () {
      fitHeight();
      // Hide the other circles before the layer is shown at all, so they never flash over the profile.
      resume.classList.add('picked');
      on('cat-out');
      var d = avatarDelta();
      on('cat-anim');
      place(d, true);                  // the circle sits exactly on the avatar, so the swap can't be seen
      return frame();
    }).then(function () {
      on('cat-quiet');                 // the white section slides away first
      return later(T.quiet);
    }).then(function () {
      on('cat-mode');                  // the banner grows to the full screen
      place(null);                     // and the circle travels back to the middle
      return later(T.move);
    }).then(function () {
      off('cat-out');                  // only now do the other circles rise in
      return later(T.rise);
    }).then(function () {
      off('cat-anim', 'cat-quiet');
      resume.classList.remove('picked');
      busy = false;
    });
  }

  // ---------- Gamified and Story, once they open: the banner dims to night, then the page loads ----------
  function away(btn, url) {
    if (busy) return; busy = true;
    btn.classList.add('picked');
    on('cat-anim', 'cat-out');
    later(T.out * 0.6).then(function () { on('cat-away'); return later(T.away); })
      .then(function () { window.location.href = url; });
  }
  // Coming back with the browser's back button shows the circles again, not the curtain.
  window.addEventListener('pageshow', function (e) {
    if (!e.persisted) return;
    off('cat-away', 'cat-anim', 'cat-out');
    cats.querySelectorAll('.picked').forEach(function (b) { b.classList.remove('picked'); });
    busy = false;
  });

  // ---------- the feedback dialog ----------
  var fbDlg = document.getElementById('cat-feedback');
  function open(dlg) {
    if (!dlg) return;
    dlg.classList.remove('closing');
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function close(dlg) {
    if (!dlg || !dlg.hasAttribute('open') || dlg.classList.contains('closing')) return Promise.resolve();
    return new Promise(function (done) {
      function end() { dlg.classList.remove('closing'); if (dlg.close) dlg.close(); else dlg.removeAttribute('open'); done(); }
      if (reduce) return end();
      dlg.classList.add('closing');
      setTimeout(end, 230);
    });
  }
  var wipDlg = document.getElementById('cat-wip');
  [fbDlg, wipDlg].forEach(function (dlg) {
    if (!dlg) return;
    dlg.addEventListener('click', function (e) { if (e.target === dlg || e.target.closest('[data-close]')) close(dlg); });
    dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(dlg); });
  });
  var wipKey = null;
  function sha256(text) {
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) return Promise.resolve('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  var wipForm = wipDlg && wipDlg.querySelector('.wip-form');
  if (wipForm) wipForm.addEventListener('submit', function (e) {
    e.preventDefault();
    var val = wipForm.pass.value.trim(), err = wipForm.querySelector('.wip-error');
    wipForm.classList.remove('wrong');
    if (!val) { err.textContent = 'Enter the password first.'; wipForm.pass.focus(); return; }
    sha256(val).then(function (h) {
      if (h !== PASS_HASH) {
        void wipForm.offsetWidth; wipForm.classList.add('wrong');
        err.textContent = "That's not it. Check with Abhishek for the right one.";
        wipForm.pass.select();
        return;
      }
      var btn = cats.querySelector('[data-key="' + wipKey + '"]');
      close(wipDlg).then(function () { away(btn, ROUTES[wipKey]); });
    });
  });
  function openWip(key) {
    if (!wipDlg) return;
    var name = WIP[key]; wipKey = key;
    if (wipForm) { wipForm.reset(); wipForm.classList.remove('wrong'); wipForm.querySelector('.wip-error').textContent = ''; }
    wipDlg.querySelector('[data-wip-name]').textContent = name;
    wipDlg.querySelector('[data-wip-mail]').href = 'mailto:' + EMAIL +
      '?subject=' + encodeURIComponent('Password for ' + name) +
      '&body=' + encodeURIComponent('Hi Abhishek,\n\nI\'d love a look at ' + name + ' on your portfolio. Could you share the password and how it\'s going?\n\nThanks!');
    open(wipDlg);
    if (wipForm && !('ontouchstart' in window)) setTimeout(function () { wipForm.pass.focus(); }, 60);
  }

  cats.addEventListener('click', function (e) {
    var b = e.target.closest('.cat'); if (!b || busy) return;
    var key = b.getAttribute('data-key');
    ui.unlock(); ui.pick();
    if (key === 'resume') return toProfile(false);
    // Work-in-progress categories ask for the password every time.
    if (WIP[key]) return openWip(key);
    if (key === 'feedback') { fbDlg.classList.remove('sent'); open(fbDlg); }
  });

  // Feedback goes to a Google Sheet through an Apps Script web app (the script also emails
  // Abhishek each response; its source is feedback-to-sheet.gs). A Formspree link works here too.
  // If the send fails, the thank-you screen offers a ready-written email instead.
  var FEEDBACK_ENDPOINT = 'https://script.google.com/macros/s/AKfycbweB7cxb6T0gSomUHRXz77wklLyX0uUag7-6MIgSr7KIdG7E51ik10Wd_Yo9ni_IZcA/exec';
  function postViaForm(url, data) {
    try {
      var name = 'fb-sink-' + Date.now(), frame = document.createElement('iframe');
      frame.name = name; frame.hidden = true; frame.setAttribute('aria-hidden', 'true'); document.body.appendChild(frame);
      var f = document.createElement('form'); f.method = 'POST'; f.action = url; f.target = name; f.hidden = true;
      Object.keys(data).forEach(function (k) {
        var i = document.createElement('input'); i.type = 'hidden'; i.name = k; i.value = data[k]; f.appendChild(i);
      });
      document.body.appendChild(f); f.submit();
      setTimeout(function () { f.remove(); frame.remove(); }, 15000);
      return true;
    } catch (e) { return false; }
  }
  var form = fbDlg && fbDlg.querySelector('form');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault();
    var mood = (form.querySelector('input[name="mood"]:checked') || {}).value || '';
    var note = form.note.value.trim();
    var from = form.from.value.trim();
    if (!note) { form.note.focus(); return; }
    var msg = fbDlg.querySelector('[data-thanks-msg]');
    function mailHref() {
      var lines = ['Rating: ' + mood, '', note];
      if (from) lines.push('', 'From: ' + from);
      return 'mailto:' + EMAIL + '?subject=' + encodeURIComponent('Portfolio feedback: ' + mood) +
        '&body=' + encodeURIComponent(lines.join('\n'));
    }
    function done(ok) {
      // Never navigate away: if the note couldn't be saved, offer a ready-made email instead.
      var head = fbDlg.querySelector('.cd-thanks h2');
      if (head) head.textContent = ok ? 'Thank you!' : 'Almost there';
      if (msg) {
        if (ok) msg.textContent = 'Your note is on its way to my inbox. I read every one.';
        else {
          msg.innerHTML = 'It didn\u2019t go through this time. <a target="_blank" rel="noopener">Email it to me instead</a>, it\u2019s already written for you.';
          msg.querySelector('a').href = mailHref();
        }
      }
      fbDlg.classList.add('sent'); form.reset();
    }
    if (!FEEDBACK_ENDPOINT || !window.fetch) return done(false);
    var btn = form.querySelector('[type="submit"]'), label = btn.textContent;
    btn.disabled = true; btn.textContent = 'Sending…';
    var payload = { rating: mood, feedback: note, from: from, page: location.href, _subject: 'Portfolio feedback: ' + mood };
    // A Google Apps Script web app (writes to a Sheet) doesn't answer cross-site requests readably,
    // so it gets a fire-and-forget post; Formspree gets a normal JSON request.
    if (/script\.google\.com/.test(FEEDBACK_ENDPOINT)) {
      return fetch(FEEDBACK_ENDPOINT, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify(payload) })
        .then(function () { done(true); }, function (err) {
          // Some pages and extensions block scripted requests; a plain form post still gets through.
          console.warn('Feedback fetch blocked, posting the form instead', err);
          postViaForm(FEEDBACK_ENDPOINT, payload) ? done(true) : done(false);
        })
        .then(function () { btn.disabled = false; btn.textContent = label; });
    }
    fetch(FEEDBACK_ENDPOINT, {
      method: 'POST', headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      if (r.ok) return done(true);
      // Log Formspree's reason (e.g. form not yet activated) for debugging, then offer email.
      return r.json().catch(function () { return {}; }).then(function (j) { console.warn('Feedback not saved', r.status, j); done(false); });
    }).catch(function (err) { console.warn('Feedback not sent', err); done(false); })
      .then(function () { btn.disabled = false; btn.textContent = label; });
  });

  // Every "All categories" link plays the way back.
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href="#categories"]');
    if (!a) return;
    e.preventDefault();
    ui.back();
    var panel = document.getElementById('toc-panel'), rail = document.querySelector('.toc-rail');
    if (panel && !panel.hidden && rail) rail.click();
    // Step back through the profile's own history entry when there is one, so back and
    // forward keep matching what is on screen; popstate then plays the way back.
    if (pushed && !location.hash) history.back();
    else toCategories(true);
  });
  window.addEventListener('resize', function () { if (has('cat-mode') && !busy) fitHeight(); });
  function route() {
    if (atRoot() && !has('cat-mode')) { pushed = false; toCategories(true); }
    else if (!atRoot() && has('cat-mode')) { pushed = true; toProfile(true); }
  }
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);

  // First visit: the banner is already full screen (set in <head>); the circles rise in.
  if (location.hash === '#categories' || has('cat-mode')) {
    fitHeight(); on('cat-mode');
    // When the splash plays, the circles rise as it dissolves (js/splash.js).
    (window.splashDone || Promise.resolve()).then(function () {
      if (reduce) off('cat-out');
      else frame().then(function () { off('cat-out'); });
    });
  }
})();
