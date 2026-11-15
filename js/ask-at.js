/* Abhizag (Ask AT): a right-side assistant drawer. UI preview only: answers come from the mock set below, no AI is connected.
   It opens like a conversation: Abhishek says hi, asks who the visitor is, then suggests questions for that role.
   Chat history lives in this tab (sessionStorage); the visitor's role is remembered (localStorage). */
(function () {
  if (window.__askAT) return; window.__askAT = true;

  var ORB = '<span class="aat-orb" aria-hidden="true"></span>';
  var ICON = {
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg>',
    reset: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/></svg>',
    send: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 19V5M6 11l6-6 6 6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>'
  };

  /* ---------- content: Abhishek speaks in first person ---------- */
  var LI = '[LinkedIn](https://www.linkedin.com/in/abhishekthakur1010/)', CV = '[resume](./resume.pdf?v=3)';
  var PERSONAS = [
    { id: 'recruiter', as: 'a recruiter', label: 'Recruiter', who: 'recruiters', k: ['recruit', 'recruiter', 'hr', 'talent', 'recruiting'], qs: [
      ['Quick summary?', ['Lead Product Designer at Delhivery, 10+ years, products used by 100M+ people. Before this: Jio, Swiggy Dineout, Times Internet.']],
      ['Can I get your resume?', ['Sure, here it is: ' + CV + '.']],
      ['What roles interest you?', ['Senior and lead design roles where design moves real business numbers. Happy to chat on ' + LI + '.']],
      ['Where are you based?', ['Gurgaon. Easiest to reach me on ' + LI + '.']]
    ] },
    { id: 'hiring', as: 'a hiring manager', label: 'Hiring manager', who: 'hiring managers', k: ['hiring', 'hiring manager', 'design manager', 'head of design', 'director'], qs: [
      ['Best case study to read?', ['**JioMart**: one redesign, **+28% add-to-cart**. Then **DelFin**, a 0 to 1 product at 80.4% self-serve activation.']],
      ['How do you lead a team?', ['I lead the Gurgaon design team at Delhivery. I care most about helping people grow, and my recommendations on this page say it better than I can.']],
      ['How do you measure impact?', ['I pick the business number that matters and design to move it: add-to-cart on JioMart, activation on DelFin.']],
      ['What do past managers say?', ['Mostly: methodical, user-focused, and good to work with. The Recommendations section has 12 of them.']]
    ] },
    { id: 'product', as: 'a product manager', label: 'Product manager', who: 'product folks', k: ['product', 'pm', 'product manager', 'product owner'], qs: [
      ['What results have you moved?', ['**+28% add-to-cart** on JioMart and **80.4% self-serve activation** on DelFin.']],
      ['How do you work with PMs?', ['We start from the shared goal and reframe the ask together. On JioMart, "refresh 3 pages" became "help shoppers choose".']],
      ['Business vs user needs?', ['I put both side by side and look for the design that answers each. JioMart shows how.']],
      ['Research on a tight timeline?', ['Data first, a few quick user chats, then prototypes we can test.']]
    ] },
    { id: 'engineer', as: 'an engineer', label: 'Engineer', who: 'engineers', k: ['engineer', 'engineering', 'developer', 'dev', 'frontend', 'backend', 'cto', 'sde'], qs: [
      ['Are you technical?', ['Yes, I studied IT at IIIT Allahabad. Constraints, APIs and edge cases are fair game.']],
      ['How do you hand off designs?', ['Specs with states and edge cases, a walkthrough before build, and I stay close during dev.']],
      ['Tech constraints?', ['I bring engineers in early, so we decide trade-offs together, not late.']],
      ['What are you like to work with?', ['Collaborative and quick to jump in, according to my recommendations. I\'d like to think so too.']]
    ] },
    { id: 'founder', as: 'a founder', label: 'Founder', who: 'founders', k: ['founder', 'startup', 'ceo', 'co-founder', 'cofounder'], qs: [
      ['Built anything 0 to 1?', ['Yes, **DelFin** at Delhivery, a fintech product for truckers. It hit 80.4% self-serve activation.']],
      ['Startup speed?', ['I\'ve worked at Jio scale and at startups like Travacations, so I\'m used to both.']],
      ['How fast can you show results?', ['I ship in small, measurable steps, so there\'s something real early.']],
      ['How do we talk?', ['Ping me on ' + LI + '.']]
    ] },
    { id: 'browsing', as: 'just looking', label: 'Just exploring', who: 'people', k: ['browsing', 'curious', 'looking', 'exploring', 'student'], qs: [
      ['What do you do?', ['I lead the Gurgaon design team at **Delhivery**.']],
      ['Your career so far?', ['IIIT Allahabad, then Swiggy Dineout, Travacations, Jio and now Delhivery. Ten years, seven brands.']],
      ['Which case study first?', ['**JioMart**. It\'s the full story, from problem to +28% add-to-cart.']],
      ['What\'s your story?', ['Grew up in the Himachal hills, studied engineering, fell into design. Full version on my [story page](./about-us.html).']]
    ] }
  ];
  var ANSWERS = {};
  PERSONAS.forEach(function (p) { p.qs.forEach(function (q) { ANSWERS[q[0].toLowerCase()] = q[1]; }); });
  function personaById(id) { for (var i = 0; i < PERSONAS.length; i++) if (PERSONAS[i].id === id) return PERSONAS[i]; return null; }
  function personaFromText(t) {
    for (var i = 0; i < PERSONAS.length; i++) for (var j = 0; j < PERSONAS[i].k.length; j++) if (new RegExp('\\b' + PERSONAS[i].k[j] + '\\b', 'i').test(t)) return PERSONAS[i];
    return null;
  }

  /* Free-typed questions: matched by keywords. */
  var MOCK = [
    { k: ['delhivery', 'current', 'now', 'today'], q: 'What do you do?' },
    { k: ['career', 'journey', 'experience', 'background', 'walk'], q: 'Your career so far?' },
    { k: ['jio', 'jiomart', 'netmeds'], a: ['At Jio I was a Senior UX Manager on JioMart, Netmeds and Urban Ladder. Highlight: JioMart\'s redesign lifted add-to-cart by 28%.'] },
    { k: ['case', 'study', 'portfolio', 'project'], q: 'Which case study first?' },
    { k: ['resume', 'cv'], q: 'Can I get your resume?' },
    { k: ['open', 'role', 'hire', 'hiring', 'job', 'available'], q: 'What roles interest you?' },
    { k: ['contact', 'connect', 'reach', 'email', 'mail', 'linkedin', 'talk', 'call', 'phone', 'number', 'mobile', 'whatsapp'], a: ['Sure, here\'s how to reach me directly:'], c: 1 },
    { k: ['ctc', 'salary', 'compensation', 'package', 'pay', 'lpa', 'notice', 'expected', 'expectation', 'joining', 'offer'], a: ['That\'s best discussed with me directly. Pick whatever\'s easiest:'], c: 1 },
    { k: ['team', 'lead', 'manage', 'mentor'], q: 'How do you lead a team?' },
    { k: ['impact', 'metric', 'result', 'measure'], q: 'What results have you moved?' },
    { k: ['story', 'himachal', 'grew', 'about'], q: 'What\'s your story?' },
    { k: ['hi', 'hello', 'hey', 'namaste'], a: ['Hey! 👋 What would you like to know?'] }
  ];
  var FALLBACK = ['Good one, but that\'s better answered by me in person. Reach out here:'];

  function nextQs(n) {
    var p = persona || personaById('browsing'), asked = {};
    history.forEach(function (m) { if (m.who === 'user') asked[m.text.toLowerCase()] = 1; });
    return p.qs.map(function (q) { return q[0]; }).filter(function (q) { return !asked[q.toLowerCase()]; }).slice(0, n);
  }
  function answer(text) {
    var t = text.toLowerCase().trim();
    if (ANSWERS[t]) return { a: ANSWERS[t], f: nextQs(2) };
    var best = null, score = 0;
    MOCK.forEach(function (m) { var s = m.k.filter(function (k) { return new RegExp('\\b' + k + '\\b').test(t); }).length; if (s > score) { score = s; best = m; } });
    if (best) return { a: best.a || ANSWERS[best.q.toLowerCase()], f: best.c ? [] : nextQs(2), c: best.c };
    return { a: FALLBACK, f: [], c: 1 };  // can't answer: hand over to the real Abhishek
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
  if (/[?&]orb=mono\b/.test(location.search)) root.setAttribute('data-orb', 'mono');  // preview the black-and-white orb
  root.innerHTML =
    '<button type="button" class="aat-launch" aria-haspopup="dialog" aria-controls="aat-drawer" aria-expanded="false">' + ORB + '<span>Ask Abhizag</span><kbd aria-hidden="true"></kbd></button>' +
    '<div class="aat-scrim" aria-hidden="true"></div>' +
    '<section class="aat-drawer" id="aat-drawer" role="dialog" aria-modal="true" aria-labelledby="aat-title" aria-describedby="aat-sub" inert>' +
      '<header class="aat-head">' + ORB +
        '<div class="aat-head-txt"><h2 class="aat-title" id="aat-title">Abhizag</h2><p class="aat-sub" id="aat-sub"></p></div>' +
        '<button type="button" class="aat-icon-btn aat-reset" aria-label="Start over" title="Start over" hidden>' + ICON.reset + '</button>' +
        '<button type="button" class="aat-icon-btn aat-close" aria-label="Close" title="Close (Esc)">' + ICON.close + '</button>' +
      '</header>' +
      '<div class="aat-log" tabindex="-1" aria-live="polite" aria-relevant="additions">' +
        '<ol class="aat-msgs" aria-label="Conversation"></ol>' +
      '</div>' +
      '<footer class="aat-foot">' +
        '<form class="aat-form"><label for="aat-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Message</label>' +
          '<textarea class="aat-input" id="aat-input" rows="1" placeholder="Message Abhizag…" autocomplete="off"></textarea>' +
          '<button type="submit" class="aat-send" aria-label="Send" disabled>' + ICON.send + '</button></form>' +
        '<p class="aat-note">Preview with sample answers.<span class="aat-keys"> Enter to send, Shift + Enter for a new line.</span></p>' +
      '</footer>' +
    '</section>';
  document.body.appendChild(root);

  var $ = function (s) { return root.querySelector(s); };
  var launch = $('.aat-launch'), drawer = $('.aat-drawer'), scrim = $('.aat-scrim'), log = $('.aat-log'),
      list = $('.aat-msgs'), form = $('.aat-form'), input = $('.aat-input'), send = $('.aat-send'), reset = $('.aat-reset'),
      headOrb = $('.aat-head .aat-orb'), sub = $('.aat-sub');
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);
  $('.aat-launch kbd').textContent = isMac ? '⌘K' : 'Ctrl K';
  launch.title = 'Ask Abhizag (' + (isMac ? '⌘K' : 'Ctrl+K') + ')';

  /* ---------- state ---------- */
  var KEY = 'aat-chat-v2', PKEY = 'aat-persona', history = [], busy = false, lastFocus = null, persona = null, started = false;
  try { persona = personaById(localStorage.getItem(PKEY)); } catch (e) {}
  try { history = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history)); } catch (e) {} }
  function setPersona(p) {
    persona = p;
    try { p ? localStorage.setItem(PKEY, p.id) : localStorage.removeItem(PKEY); } catch (e) {}
    sub.textContent = p && p.id !== 'browsing' ? 'Chatting with ' + p.as : 'Abhishek\'s AI · preview';
  }
  setPersona(persona);

  /* chips: {t: label, p: personaId} for role choices, plain strings for questions */
  function chipsHTML(c, style) {
    if (!c || !c.length) return '';
    if (style === 'list') return '<div class="aat-qs">' + c.map(function (q) { return '<button type="button" class="aat-sug"><span>' + esc(q) + '</span>' + ICON.arrow + '</button>'; }).join('') + '</div>';
    return '<div class="aat-follow' + (style === 'roles' ? ' aat-roles' : '') + '">' + c.map(function (q) {
      return typeof q === 'string' ? '<button type="button">' + esc(q) + '</button>' : '<button type="button" data-p="' + q.p + '">' + esc(q.t) + '</button>';
    }).join('') + '</div>';
  }
  /* Contact card: shown whenever Abhizag can't (or shouldn't) answer */
  var CONTACT = [
    ['Email', 'mailto:abhishekiit2k12@gmail.com', '<path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/>'],
    ['Book a call', 'https://cal.com/abhishek-thakur-adhbch/30min', '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M8 3v4M16 3v4M4 10h16"/>'],
    ['LinkedIn', 'https://www.linkedin.com/in/abhishekthakur1010/', '<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M8 10v6M8 7.5v.01M12 16v-3.5a2 2 0 0 1 4 0V16M12 10v6"/>']
  ];
  function contactHTML() {
    return '<div class="aat-contact">' + CONTACT.map(function (c) {
      return '<a href="' + c[1] + '"' + (c[1].charAt(0) === 'h' ? ' target="_blank" rel="noopener"' : '') + '><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + c[2] + '</svg>' + c[0] + '</a>';
    }).join('') + '</div>';
  }
  function render(m, animate) {
    var li = document.createElement('li');
    li.className = 'aat-msg aat-msg--' + m.who;
    if (!animate) li.style.animation = 'none';
    if (m.who === 'user') li.innerHTML = '<div class="aat-bubble">' + esc(m.text) + '</div>';
    else li.innerHTML = ORB + '<div class="aat-bubble">' + m.parts.map(block).join('') + (m.contact ? contactHTML() : '') + chipsHTML(m.chips, m.style) + '</div>';
    list.appendChild(li);
    return li;
  }
  function syncChrome() { reset.hidden = !history.length; root.classList.toggle('aat-has-chat', history.length > 0); }
  function toBottom() { log.scrollTop = log.scrollHeight; }
  // Once the visitor answers or asks, the chips above are spent and fold away, like quick replies in a chat app.
  function retireChips() { Array.prototype.forEach.call(list.querySelectorAll('.aat-follow, .aat-qs'), function (c) { c.classList.add('is-spent'); }); }
  history.forEach(function (m, i) { render(m, false); if (m.who === 'user') retireChips(); });
  syncChrome();

  /* ---------- the bot "types" (mock streaming) ---------- */
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  function say(m, cb, delay) {
    busy = true; send.disabled = true;
    var li = document.createElement('li');
    li.className = 'aat-msg aat-msg--bot';
    li.innerHTML = ORB + '<div class="aat-bubble"><span class="aat-typing" aria-label="Typing"><i></i><i></i><i></i></span></div>';
    list.appendChild(li); toBottom();
    var orbs = [li.querySelector('.aat-orb'), headOrb];
    orbs.forEach(function (o) { o.classList.add('is-thinking'); });
    var bubble = li.querySelector('.aat-bubble');
    setTimeout(function () {
      var full = m.parts.join('\n\n'), i = 0;
      function done() {
        bubble.innerHTML = m.parts.map(block).join('') + (m.contact ? contactHTML() : '') + chipsHTML(m.chips, m.style);
        orbs.forEach(function (o) { o.classList.remove('is-thinking'); });
        history.push(m); save(); syncChrome();
        busy = false; send.disabled = !input.value.trim(); toBottom();
        if (cb) cb();
      }
      if (reduce) return done();
      (function tick() {
        i = Math.min(full.length, i + 3 + Math.floor(Math.random() * 4));
        bubble.innerHTML = full.slice(0, i).split('\n\n').map(block).join('').replace(/<\/(p|ul)>$/, '<span class="aat-caret"></span></$1>');
        toBottom();
        if (i < full.length) setTimeout(tick, 18); else done();
      })();
    }, reduce ? 0 : (delay == null ? 650 : delay));
  }
  function userSays(text) {
    var u = { who: 'user', text: text }; history.push(u); save(); render(u, true); retireChips(); syncChrome(); toBottom();
  }
  function roleChips() { return PERSONAS.map(function (p) { return { t: p.label, p: p.id }; }); }

  /* The opening: short, one bubble at a time, like a real chat. */
  function intro() {
    started = true;
    var back = persona && persona.id !== 'browsing';
    say({ who: 'bot', parts: [back ? 'Hey, welcome back 👋' : 'Hey, I\'m Abhizag, Abhishek\'s AI 👋'] }, function () {
      if (back) say({ who: 'bot', parts: ['Anything I can help with?'], chips: nextQs(2) }, null, 700);
      else say({ who: 'bot', parts: ['What describes you best?'], chips: roleChips(), style: 'roles' }, null, 700);
    }, 300);
  }
  function chooseRole(p, typed) {
    if (!typed) userSays(p.label);
    setPersona(p);
    say({ who: 'bot', parts: [p.id === 'browsing' ? 'Cool, have a look around! What would you like to know?' : 'Nice! What would you like to know?'], chips: nextQs(2) });
  }
  function ask(text) {
    text = text.trim();
    if (!text || busy) return;
    input.value = ''; grow();
    userSays(text);
    // If we're still waiting to hear who they are, a typed role counts as the answer.
    var awaitingRole = history.length >= 2 && history[history.length - 2].style === 'roles';
    var p = personaFromText(text);
    if (p && (awaitingRole || /\bi('| a)?m\b|\bi am\b/i.test(text))) return chooseRole(p, true);
    var r = answer(text);
    say({ who: 'bot', parts: r.a, chips: r.f, contact: r.c ? 1 : 0 });
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
    if (!history.length && !started) setTimeout(intro, reduce ? 0 : 380);
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
    history = []; save(); list.innerHTML = ''; setPersona(null); syncChrome(); log.scrollTop = 0; input.focus(); intro();
  });
  list.addEventListener('click', function (e) {
    var b = e.target.closest('.aat-sug, .aat-follow button');
    if (!b || busy || b.closest('.is-spent')) return;
    var pid = b.getAttribute('data-p');
    if (pid) chooseRole(personaById(pid)); else ask(b.textContent);
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
