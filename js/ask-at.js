/* Ask AT: a right-side assistant drawer. UI preview only: answers come from the mock set below, no AI is connected.
   Chat history lives in this tab (sessionStorage), so closing and reopening the drawer keeps the conversation. */
(function () {
  if (window.__askAT) return; window.__askAT = true;

  var ORB = '<span class="aat-orb" aria-hidden="true"></span>';
  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  var SUGGESTIONS = [
    'What does Abhishek do at Delhivery?',
    'Walk me through his career so far',
    'Which case study should I read first?',
    'Is he open to new roles?'
  ];

  /* Mock answers: matched by keywords, written from what the portfolio already says. */
  var MOCK = [
    { k: ['delhivery', 'current', 'now', 'today'], a: [
      'Abhishek leads the Gurgaon design team at **Delhivery**, where he has been since 2023.',
      'His team designs the products behind Delhivery\'s logistics network. The Delhivery work on this page has the details.'],
      f: ['Walk me through his career so far', 'Which case study should I read first?'] },
    { k: ['career', 'journey', 'experience', 'background', 'walk'], a: [
      'Here is the road so far:',
      '- **2012**, B.Tech in IT at IIIT Allahabad\n- **2016**, Senior UX Designer, then Manager II at Swiggy Dineout (Times Internet)\n- **2019**, Design strategy at Travacations\n- **2022**, Senior UX Manager at Jio Platforms (JioMart, Netmeds, Urban Ladder)\n- **2023**, Lead designer at Delhivery',
      'Ten years, seven brands and products used by 100M+ people.'],
      f: ['What did he do at Jio?', 'Is he open to new roles?'] },
    { k: ['jio', 'jiomart', 'netmeds'], a: [
      'At **Jio Platforms** Abhishek was a Senior UX Manager across JioMart, Netmeds and Urban Ladder.',
      'One highlight: JioMart had ~95M visitors but only 1 in 10 sessions added to cart, so he led a redesign of browsing and discovery. The full story is in the JioMart case study.'],
      f: ['Which case study should I read first?', 'How does he approach design?'] },
    { k: ['case', 'study', 'read', 'work', 'project'], a: [
      'Start with **JioMart**. It shows the full arc: the business problem, the research, the decisions and the results.',
      'After that, the Delhivery work shows how he designs for operations at scale. There are 4 case studies in the Featured section of this page.'],
      f: ['How does he approach design?', 'Is he open to new roles?'] },
    { k: ['approach', 'process', 'design', 'philosophy', 'how'], a: [
      'He starts with the business number that matters and the people closest to the problem, then works in small, testable steps.',
      'Colleagues describe him as methodical with complex problems and generous as a mentor. There are 12 recommendations further up this page.'],
      f: ['Is he open to new roles?', 'Walk me through his career so far'] },
    { k: ['open', 'role', 'hire', 'hiring', 'job', 'available', 'contact', 'connect', 'reach'], a: [
      'He is always happy to talk about interesting problems. The best way to reach him is on [LinkedIn](https://www.linkedin.com/in/abhishekthakur1010/).',
      'You can also grab his [resume](./resume.pdf?v=3) for the full details.'],
      f: ['Walk me through his career so far'] }
  ];
  var FALLBACK = { a: [
    'Good question. I\'m running on preview answers for now, so I can only cover his work, career, case studies and how to reach him.',
    'Try one of these:'], f: SUGGESTIONS.slice(0, 3) };

  function pick(q) {
    var t = q.toLowerCase(), best = null, score = 0;
    MOCK.forEach(function (m) { var s = m.k.filter(function (k) { return t.indexOf(k) > -1; }).length; if (s > score) { score = s; best = m; } });
    return best || FALLBACK;
  }

  /* Tiny, safe formatter: escape, then **bold**, [links](url), "- " lists and paragraphs. */
  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function inline(s) {
    return esc(s).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/\[([^\]]+)\]\(((?:https:\/\/|\.\/)[^)\s]+)\)/g, function (_, t, u) { return '<a href="' + u + '"' + (u.charAt(0) === 'h' ? ' target="_blank" rel="noopener"' : '') + '>' + t + '</a>'; });
  }
  function block(p) {
    var lines = p.split('\n');
    if (lines.every(function (l) { return /^- /.test(l); })) return '<ul>' + lines.map(function (l) { return '<li>' + inline(l.slice(2)) + '</li>'; }).join('') + '</ul>';
    return '<p>' + inline(p) + '</p>';
  }

  /* ---------- markup ---------- */
  var root = document.createElement('div');
  root.className = 'aat';
  root.innerHTML =
    '<button type="button" class="aat-launch" aria-haspopup="dialog" aria-controls="aat-drawer" aria-expanded="false">' + ORB + '<span>Ask AT</span><kbd aria-hidden="true"></kbd></button>' +
    '<div class="aat-scrim" aria-hidden="true"></div>' +
    '<section class="aat-drawer" id="aat-drawer" role="dialog" aria-modal="true" aria-labelledby="aat-title" aria-describedby="aat-sub" inert>' +
      '<header class="aat-head">' + ORB +
        '<div class="aat-head-txt"><h2 class="aat-title" id="aat-title">Ask AT</h2><p class="aat-sub" id="aat-sub">Abhishek\'s portfolio assistant · preview</p></div>' +
        '<button type="button" class="aat-icon-btn aat-reset" aria-label="New chat" title="New chat" hidden>' + ICON.reset + '</button>' +
        '<button type="button" class="aat-icon-btn aat-close" aria-label="Close assistant" title="Close (Esc)">' + ICON.close + '</button>' +
      '</header>' +
      '<div class="aat-log" tabindex="-1" aria-live="polite" aria-relevant="additions">' +
        '<div class="aat-welcome">' + ORB +
          '<h3>Hi, I\'m AT\'s assistant</h3>' +
          '<p>Ask me about Abhishek\'s work, the brands he has designed for, or how to get in touch.</p>' +
          '<ul class="aat-sugs">' + SUGGESTIONS.map(function (s) { return '<li><button type="button" class="aat-sug"><span>' + esc(s) + '</span>' + ICON.arrow + '</button></li>'; }).join('') + '</ul>' +
        '</div>' +
        '<ol class="aat-msgs" aria-label="Conversation"></ol>' +
      '</div>' +
      '<footer class="aat-foot">' +
        '<form class="aat-form"><label class="sr-only" for="aat-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Message</label>' +
          '<textarea class="aat-input" id="aat-input" rows="1" placeholder="Ask about Abhishek\'s work…" autocomplete="off"></textarea>' +
          '<button type="submit" class="aat-send" aria-label="Send" disabled>' + ICON.send + '</button></form>' +
        '<p class="aat-note">Preview with sample answers.<span class="aat-keys"> Enter to send, Shift + Enter for a new line.</span></p>' +
      '</footer>' +
    '</section>';
  document.body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var launch = $('.aat-launch'), drawer = $('.aat-drawer'), scrim = $('.aat-scrim'), log = $('.aat-log'), welcome = $('.aat-welcome'),
      list = $('.aat-msgs'), form = $('.aat-form'), input = $('.aat-input'), send = $('.aat-send'), reset = $('.aat-reset'),
      headOrb = $('.aat-head .aat-orb');
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $('.aat-launch kbd').textContent = isMac ? '⌘K' : 'Ctrl K';
  launch.title = 'Ask AT (' + (isMac ? '⌘K' : 'Ctrl+K') + ')';

  /* ---------- history ---------- */
  var KEY = 'aat-chat-v1', history = [], busy = false, lastFocus = null;
  try { history = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history)); } catch (e) {} }

  function render(m, animate) {
    var li = document.createElement('li');
    li.className = 'aat-msg aat-msg--' + m.who;
    if (!animate) li.style.animation = 'none';
    if (m.who === 'user') li.innerHTML = '<div class="aat-bubble">' + esc(m.text) + '</div>';
    else li.innerHTML = ORB + '<div class="aat-bubble">' + m.parts.map(block).join('') + followHTML(m.follow) + '</div>';
    list.appendChild(li);
    return li;
  }
  function followHTML(f) { return f && f.length ? '<div class="aat-follow">' + f.map(function (q) { return '<button type="button">' + esc(q) + '</button>'; }).join('') + '</div>' : ''; }
  function syncChrome() { var has = history.length > 0; welcome.hidden = has; reset.hidden = !has; }
  function toBottom() { log.scrollTop = log.scrollHeight; }
  history.forEach(function (m) { render(m, false); });
  syncChrome();

  /* ---------- sending (mock streaming) ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    busy = true; send.disabled = true;
    var u = { who: 'user', text: text }; history.push(u); save();
    syncChrome(); render(u, true);
    input.value = ''; grow();

    var r = pick(text), bot = { who: 'bot', parts: r.a, follow: r.f };
    var li = document.createElement('li');
    li.className = 'aat-msg aat-msg--bot';
    li.innerHTML = ORB + '<div class="aat-bubble"><span class="aat-typing" aria-label="Typing"><i></i><i></i><i></i></span></div>';
    list.appendChild(li); toBottom();
    var orbs = [li.querySelector('.aat-orb'), headOrb];
    orbs.forEach(function (o) { o.classList.add('is-thinking'); });
    var bubble = li.querySelector('.aat-bubble');

    setTimeout(function () {
      var full = r.a.join('\n\n'), i = 0;
      function done() {
        bubble.innerHTML = r.a.map(block).join('') + followHTML(r.f);
        orbs.forEach(function (o) { o.classList.remove('is-thinking'); });
        history.push(bot); save(); busy = false; send.disabled = !input.value.trim(); toBottom();
      }
      if (reduce) return done();
      (function tick() {
        i = Math.min(full.length, i + 3 + Math.floor(Math.random() * 4));
        bubble.innerHTML = full.slice(0, i).split('\n\n').map(block).join('').replace(/<\/(p|ul)>$/, '<span class="aat-caret"></span></$1>');
        toBottom();
        if (i < full.length) setTimeout(tick, 18); else done();
      })();
    }, reduce ? 0 : 650);
  }

  /* ---------- open / close, focus ---------- */
  function focusables() { return Array.prototype.filter.call(drawer.querySelectorAll('button, [href], textarea, [tabindex]:not([tabindex="-1"])'), function (el) { return !el.disabled && !el.hidden && el.offsetParent !== null; }); }
  function open() {
    if (root.classList.contains('is-open')) return;
    lastFocus = document.activeElement;
    drawer.removeAttribute('inert');
    root.classList.add('is-open'); document.documentElement.classList.add('aat-lock');
    launch.setAttribute('aria-expanded', 'true');
    toBottom();
    setTimeout(function () { input.focus({ preventScroll: true }); }, reduce ? 0 : 120);
  }
  function close() {
    if (!root.classList.contains('is-open')) return;
    root.classList.remove('is-open'); document.documentElement.classList.remove('aat-lock');
    launch.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('inert', '');
    (lastFocus && lastFocus.focus ? lastFocus : launch).focus({ preventScroll: true });
  }

  launch.addEventListener('click', open);
  $('.aat-close').addEventListener('click', close);
  scrim.addEventListener('click', close);
  reset.addEventListener('click', function () {
    if (busy) return;
    history = []; save(); list.innerHTML = ''; syncChrome(); log.scrollTop = 0; input.focus();
  });
  root.addEventListener('click', function (e) {
    var b = e.target.closest('.aat-sug, .aat-follow button');
    if (b) ask(b.textContent);
  });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });

  function grow() { input.style.height = 'auto'; input.style.height = Math.min(input.scrollHeight, 160) + 'px'; }
  input.addEventListener('input', function () { grow(); send.disabled = busy || !input.value.trim(); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) { e.preventDefault(); ask(input.value); }
  });

  document.addEventListener('keydown', function (e) {
    var isOpen = root.classList.contains('is-open');
    if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) { e.preventDefault(); isOpen ? close() : open(); return; }
    if (!isOpen) return;
    if (e.key === 'Escape') { e.preventDefault(); close(); return; }
    if (e.key === 'Tab') {               // keep focus inside the dialog
      var f = focusables(); if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      else if (!drawer.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    }
  });
})();
