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

  /* Personas: the visitor says who they are, and the suggested questions change to fit. The choice is remembered. */
  var LI = '[LinkedIn](https://www.linkedin.com/in/abhishekthakur1010/)', CV = '[resume](./resume.pdf?v=3)';
  var PERSONAS = [
    { id: 'recruiter', label: 'Recruiter / HR', qs: [
      ['Give me a 30-second summary of Abhishek', ['Abhishek is a **Lead Product Designer at Delhivery** with 10+ years across B2C, B2B and platform companies: Jio, Swiggy Dineout, Times Internet and a few startups.', 'His work has reached 100M+ users. He has an engineering degree (B.Tech IT, IIIT Allahabad), which shows in how he works with tech teams.']],
      ['What kind of roles is he a fit for?', ['Senior and lead product design roles where design is tied to business outcomes: leading a team, owning a product area, or building something 0 to 1.', 'For anything specific about level or timing, it is best to ask him directly on ' + LI + '.']],
      ['Where is he based and how do I reach him?', ['He leads the Gurgaon design team at Delhivery. The quickest way to reach him is ' + LI + '.']],
      ['Can I get his resume?', ['Of course. Here is his ' + CV + '. It opens as a PDF.']]
    ] },
    { id: 'hiring', label: 'Hiring manager', qs: [
      ['How does he lead and grow a design team?', ['He leads the Gurgaon design team at Delhivery, and earlier managed designers at Swiggy Dineout and Jio.', 'His recommendations call him a mentor who brings out the best in people. There are 12 of them on this page, from managers, peers and reports.']],
      ['Which case study shows his best thinking?', ['Start with **JioMart**: it goes from a business problem (only 1 in 10 sessions added to cart) to research, decisions and a **+28% add-to-cart** result.', 'Then **DelFin**, a 0 to 1 financial services platform at Delhivery that reached **80.4% self-serve activation**.']],
      ['What do his past managers say?', ['Words that come up again and again: methodical with complex problems, a natural sense for users, strong leadership on long projects, and easy to work with.', 'Read them in full in the Recommendations section.']],
      ['How does he measure design impact?', ['He starts from the business number that matters, then sets a design goal people can see move. On JioMart that was add-to-cart (+28%), and on DelFin it was self-serve activation (80.4%).']]
    ] },
    { id: 'product', label: 'Product manager', qs: [
      ['How does he work with PMs on priorities?', ['He likes to start from the shared goal, then reframe the ask together. On JioMart, "refresh 3 pages" became "help shoppers choose", which changed what got built first.']],
      ['Which results has his design moved?', ['- **+28% add-to-cart** on JioMart\n- **80.4% self-serve activation** on DelFin at Delhivery\n- Products used by **100M+ people** across his career']],
      ['How does he balance business and user needs?', ['He puts the business ask, the product ask and the user\'s question side by side, then looks for the design that answers all three. The JioMart case study shows this step by step.']],
      ['How does he run research on a tight timeline?', ['Small and fast: existing data first, a few quick conversations with users, then testable prototypes rather than long reports. The case studies show the research behind each decision.']]
    ] },
    { id: 'engineer', label: 'Engineer', qs: [
      ['Is he technical?', ['Yes. He has a B.Tech in Information Technology from IIIT Allahabad, so he is comfortable talking constraints, APIs and edge cases with engineers.']],
      ['How does he hand off designs?', ['Clear specs with states, edge cases and real data, plus walkthroughs with the team before build. He stays close during development to make calls quickly.']],
      ['How does he handle technical constraints?', ['He brings engineers in early, before designs are final, so trade-offs are decided together rather than discovered late.']],
      ['What is it like to work with him?', ['His recommendations describe him as collaborative, patient and quick to shift focus when a team needs help. You can read 12 of them on this page.']]
    ] },
    { id: 'founder', label: 'Founder', qs: [
      ['Has he built a product from 0 to 1?', ['Yes. **DelFin** at Delhivery is a 0 to 1 financial services platform for truckers and fleet owners. It reached **80.4% self-serve activation**.']],
      ['Can he work in a small, scrappy team?', ['He has worked at large companies like Jio and with startups like Travacations, so he is used to both scale and speed.']],
      ['How fast can he show results?', ['He works in small, measurable steps so there is something real to look at early. Ask him about timelines on ' + LI + '.']],
      ['How do I start a conversation?', ['Message him on ' + LI + '. You can also skim his ' + CV + ' first.']]
    ] },
    { id: 'browsing', label: 'Just browsing', qs: [
      ['What does Abhishek do at Delhivery?', null],
      ['Walk me through his career so far', null],
      ['Which case study should I read first?', null],
      ['What is his story?', ['He grew up in the hills of Himachal, studied engineering at IIIT Allahabad and found his way into design. The full story is on the [My story](./about-us.html) page.']]
    ] }
  ];
  var ANSWERS = {};
  PERSONAS.forEach(function (p) { p.qs.forEach(function (q) { if (q[1]) ANSWERS[q[0].toLowerCase()] = { a: q[1], p: p }; }); });
  function personaById(id) { for (var i = 0; i < PERSONAS.length; i++) if (PERSONAS[i].id === id) return PERSONAS[i]; return null; }
  var SUGGESTIONS = PERSONAS[5].qs.map(function (q) { return q[0]; });

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
    var t = q.toLowerCase().trim(), hit = ANSWERS[t];
    if (hit) return { a: hit.a, f: nextQs(2) };
    var best = null, score = 0;
    MOCK.forEach(function (m) { var s = m.k.filter(function (k) { return t.indexOf(k) > -1; }).length; if (s > score) { score = s; best = m; } });
    if (best) return { a: best.a, f: persona ? nextQs(2) : best.f };
    return { a: FALLBACK.a, f: nextQs(3) };
  }
  function nextQs(n) {
    var p = persona || PERSONAS[5], asked = {};
    history.forEach(function (m) { if (m.who === 'user') asked[m.text.toLowerCase()] = 1; });
    return p.qs.map(function (q) { return q[0]; }).filter(function (q) { return !asked[q.toLowerCase()]; }).slice(0, n);
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
          '<p class="aat-who" id="aat-who">Who\'s asking? I\'ll tailor the questions.</p>' +
          '<div class="aat-personas" role="group" aria-labelledby="aat-who">' + PERSONAS.map(function (p) { return '<button type="button" class="aat-persona" data-p="' + p.id + '" aria-pressed="false">' + esc(p.label) + '</button>'; }).join('') + '</div>' +
          '<ul class="aat-sugs" aria-live="polite"></ul>' +
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
  var KEY = 'aat-chat-v1', PKEY = 'aat-persona', history = [], busy = false, lastFocus = null, persona = null;
  try { persona = personaById(localStorage.getItem(PKEY)); } catch (e) {}
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
  var sugs = $('.aat-sugs'), sub = $('.aat-sub');
  function setPersona(p, animate) {
    persona = p;
    try { p ? localStorage.setItem(PKEY, p.id) : localStorage.removeItem(PKEY); } catch (e) {}
    Array.prototype.forEach.call(root.querySelectorAll('.aat-persona'), function (b) { b.setAttribute('aria-pressed', String(!!p && b.getAttribute('data-p') === p.id)); });
    var qs = (p || PERSONAS[5]).qs.map(function (q) { return q[0]; });
    sugs.innerHTML = qs.map(function (q) { return '<li' + (animate ? '' : ' style="animation:none"') + '><button type="button" class="aat-sug"><span>' + esc(q) + '</span>' + ICON.arrow + '</button></li>'; }).join('');
    sub.textContent = p && p.id !== 'browsing' ? 'Asking as ' + p.label : 'Abhishek\'s portfolio assistant · preview';
  }
  setPersona(persona, true);
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
    var pb = e.target.closest('.aat-persona');
    if (pb) { setPersona(personaById(pb.getAttribute('data-p')), true); return; }
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
