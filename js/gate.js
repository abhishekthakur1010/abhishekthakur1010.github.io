// Content gate for the story and the case studies (css/gate.css). Each page wraps its private part in
//   <div class="st-locked" data-gate-pill="…" data-gate-title="…" data-gate-sub="…"><div class="st-locked-body">…</div></div>
// and this script adds the unlock block under it. One unlock opens every gated page in that browser.
// A light gate only: the text is still in the page source. Same preview password as the categories.
(function () {
  var PASS_HASH = 'e2855c23afcb9cdde9a6bbb315fc71376be098e28e4f8a5b8576cddc9179e3f0', KEY = 'story-unlocked';
  var LINKEDIN = 'https://www.linkedin.com/in/abhishekthakur1010/';
  var locks = [].slice.call(document.querySelectorAll('.st-locked'));
  if (!locks.length) return;
  var unlocked = false;
  try { unlocked = localStorage.getItem(KEY) === '1'; } catch (e) {}
  if (unlocked) { locks.forEach(function (l) { l.classList.add('open'); }); return; }
  document.documentElement.classList.add('gate-on');

  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
  var LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="4.5" y="10.5" width="15" height="10" rx="2"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3"/></svg>';
  var LI = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.06 2.06 0 1 1 0-4.13 2.06 2.06 0 0 1 0 4.13ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0Z"/></svg>';
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function sha256(text) {
    if (!window.crypto || !crypto.subtle || !window.TextEncoder) return Promise.resolve('');
    return crypto.subtle.digest('SHA-256', new TextEncoder().encode(text)).then(function (buf) {
      return Array.prototype.map.call(new Uint8Array(buf), function (b) { return ('0' + b.toString(16)).slice(-2); }).join('');
    });
  }
  function openAll() {
    try { localStorage.setItem(KEY, '1'); } catch (e) {}
    document.querySelectorAll('.st-locked-body').forEach(function (b) { b.removeAttribute('inert'); });
    locks.forEach(function (l) { l.classList.add('opening'); });
    setTimeout(function () {
      document.documentElement.classList.remove('gate-on');
      locks.forEach(function (l) { l.classList.add('open'); l.classList.remove('opening'); });
    }, 400);
  }

  locks.forEach(function (lock, n) {
    var body = lock.querySelector('.st-locked-body'), d = lock.dataset, id = 'gate-' + n;
    body.setAttribute('inert', '');
    var gate = document.createElement('div');
    gate.className = 'st-gate'; gate.setAttribute('role', 'region'); gate.setAttribute('aria-labelledby', id + '-h');
    gate.innerHTML =
      '<div class="st-gate-card">' +
        '<span class="st-gate-pill">' + LOCK + esc(d.gatePill || 'Private') + '</span>' +
        '<h2 id="' + id + '-h">' + esc(d.gateTitle || 'Read the rest.') + '</h2>' +
        (d.gateSub ? '<p class="st-gate-sub">' + esc(d.gateSub) + '</p>' : '') +
        '<ul class="st-gate-list"><li>' + CHECK + 'Have the password? Unlock it below.</li><li>' + CHECK + 'No password? Ask me for one on LinkedIn.</li></ul>' +
        '<form class="st-gate-form" novalidate><label class="sr-only" for="' + id + '-p">Password</label>' +
          '<input id="' + id + '-p" name="pass" type="password" autocomplete="off" placeholder="Enter password" required />' +
          '<button type="submit" class="st-gate-go">Unlock</button></form>' +
        '<p class="st-gate-err" role="alert"></p>' +
        '<div class="st-gate-or"><span>or</span></div>' +
        '<a class="st-gate-li" href="' + LINKEDIN + '" target="_blank" rel="noopener">' + LI + 'Connect on LinkedIn</a>' +
      '</div>';
    lock.appendChild(gate);
    var form = gate.querySelector('form'), err = gate.querySelector('.st-gate-err');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var val = form.pass.value.trim();
      form.classList.remove('wrong');
      if (!val) { err.textContent = 'Enter the password first.'; form.pass.focus(); return; }
      sha256(val).then(function (h) {
        if (h !== PASS_HASH) {
          void form.offsetWidth; form.classList.add('wrong');
          err.textContent = "That's not it. Ask me on LinkedIn for the right one.";
          form.pass.select(); return;
        }
        err.textContent = ''; openAll();
      });
    });
    // in-page links that point into the locked part go to the password box until it's open
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      var t = a.getAttribute('href').length > 1 && document.querySelector(a.getAttribute('href'));
      if (!t || !body.contains(t)) return;
      a.addEventListener('click', function (e) {
        if (lock.classList.contains('open')) return;
        e.preventDefault(); gate.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { form.pass.focus({ preventScroll: true }); }, 500);
      });
    });
  });
})();
