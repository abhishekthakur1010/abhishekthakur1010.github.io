/* Ask AT: a right-side assistant drawer. UI preview only: answers come from the mock set below, no AI is connected.
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
    { id: 'recruiter', as: 'a recruiter', label: 'Recruiter / HR', me: 'I\'m a recruiter', who: 'recruiters', k: ['recruit', 'hr', 'talent', 'sourcer', 'people team'], qs: [
      ['Give me a quick summary', ['I\'m a **Lead Product Designer at Delhivery**, with 10+ years across B2C, B2B and platform companies: Jio, Swiggy Dineout, Times Internet and a few startups.', 'My work has reached 100M+ users. I also have an engineering degree (B.Tech IT, IIIT Allahabad), which helps a lot when working with tech teams.']],
      ['What roles are you looking for?', ['Senior and lead product design roles where design is tied to real business outcomes: leading a team, owning a product area, or building something 0 to 1.', 'For level and timing, let\'s talk directly on ' + LI + '.']],
      ['Where are you based?', ['I\'m in Gurgaon, where I lead the design team at Delhivery. The quickest way to reach me is ' + LI + '.']],
      ['Can I get your resume?', ['Of course, here\'s my ' + CV + '. It opens as a PDF.']]
    ] },
    { id: 'hiring', as: 'a hiring manager', label: 'Hiring manager', me: 'I\'m a hiring manager', who: 'hiring managers', k: ['hiring manager', 'design manager', 'head of design', 'design lead', 'director', 'vp'], qs: [
      ['How do you lead a design team?', ['I lead the Gurgaon design team at Delhivery, and managed designers at Swiggy Dineout and Jio before that.', 'I care most about growing people. The 12 recommendations on this page, from managers, peers and reports, say it better than I can.']],
      ['Which case study shows your best thinking?', ['Start with **JioMart**: it goes from a business problem (only 1 in 10 sessions added to cart) through research and decisions to a **+28% add-to-cart** result.', 'Then **DelFin**, a 0 to 1 financial services platform I designed at Delhivery that reached **80.4% self-serve activation**.']],
      ['What do past managers say?', ['The words that come up most: methodical with complex problems, a natural sense for users, strong leadership on long projects, and easy to work with.', 'You can read them in full in the Recommendations section.']],
      ['How do you measure design impact?', ['I start from the business number that matters, then set a design goal people can see move. On JioMart that was add-to-cart (+28%), and on DelFin it was self-serve activation (80.4%).']]
    ] },
    { id: 'product', as: 'a product manager', label: 'Product manager', me: 'I\'m a product manager', who: 'product managers', k: ['product manager', 'pm', 'product owner', 'product lead'], qs: [
      ['How do you work with PMs?', ['I like to start from the shared goal, then reframe the ask together. On JioMart, "refresh 3 pages" became "help shoppers choose", and that changed what we built first.']],
      ['What results has your design moved?', ['- **+28% add-to-cart** on JioMart\n- **80.4% self-serve activation** on DelFin at Delhivery\n- Products used by **100M+ people** across my career']],
      ['How do you balance business and user needs?', ['I put the business ask, the product ask and the user\'s real question side by side, then look for the design that answers all three. The JioMart case study shows it step by step.']],
      ['How do you research on a tight timeline?', ['Small and fast: existing data first, a few quick conversations with users, then prototypes we can test rather than long reports.']]
    ] },
    { id: 'engineer', as: 'an engineer', label: 'Engineer', me: 'I\'m an engineer', who: 'engineers', k: ['engineer', 'developer', 'dev', 'frontend', 'backend', 'tech lead', 'cto', 'sde'], qs: [
      ['Are you technical?', ['Yes. I have a B.Tech in Information Technology from IIIT Allahabad, so I\'m comfortable talking constraints, APIs and edge cases.']],
      ['How do you hand off designs?', ['Clear specs with states, edge cases and real data, plus a walkthrough with the team before build. I stay close during development so we can make calls quickly.']],
      ['How do you handle technical constraints?', ['I bring engineers in early, before designs are final, so we decide trade-offs together rather than finding them late.']],
      ['What are you like to work with?', ['My recommendations describe me as collaborative, patient and quick to jump in when a team needs help. You can read 12 of them on this page.']]
    ] },
    { id: 'founder', as: 'a founder', label: 'Founder', me: 'I\'m a founder', who: 'founders', k: ['founder', 'startup', 'ceo', 'co-founder', 'cofounder'], qs: [
      ['Have you built something 0 to 1?', ['Yes. **DelFin** at Delhivery is a 0 to 1 financial services platform for truckers and fleet owners. It reached **80.4% self-serve activation**.']],
      ['Can you work in a small team?', ['I\'ve worked at large companies like Jio and with startups like Travacations, so I\'m used to both scale and speed.']],
      ['How fast can you show results?', ['I work in small, measurable steps so there\'s something real to look at early. Happy to talk timelines on ' + LI + '.']],
      ['How do we start a conversation?', ['Message me on ' + LI + '. You can skim my ' + CV + ' first if you like.']]
    ] },
    { id: 'browsing', as: 'just browsing', label: 'Just browsing', me: 'Just browsing', who: 'visitors', k: ['browsing', 'curious', 'just looking', 'exploring', 'student', 'designer'], qs: [
      ['What do you do at Delhivery?', ['I lead the Gurgaon design team at **Delhivery**, where I\'ve been since 2023. My team designs the products behind Delhivery\'s logistics network.']],
      ['Walk me through your career', ['Here\'s the road so far:', '- **2012**, B.Tech in IT at IIIT Allahabad\n- **2016**, Senior UX Designer, then Manager II at Swiggy Dineout (Times Internet)\n- **2019**, Design strategy at Travacations\n- **2022**, Senior UX Manager at Jio Platforms (JioMart, Netmeds, Urban Ladder)\n- **2023**, Lead designer at Delhivery', 'Ten years, seven brands and products used by 100M+ people.']],
      ['Which case study should I read first?', ['Start with **JioMart**. It shows the full arc: the business problem, the research, the decisions and the results (+28% add-to-cart).']],
      ['What\'s your story?', ['I grew up in the hills of Himachal, studied engineering at IIIT Allahabad and found my way into design. The full story is on my [story page](./about-us.html).']]
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
    { k: ['delhivery', 'current', 'now', 'today'], q: 'What do you do at Delhivery?' },
    { k: ['career', 'journey', 'experience', 'background', 'walk'], q: 'Walk me through your career' },
    { k: ['jio', 'jiomart', 'netmeds'], a: ['At **Jio Platforms** I was a Senior UX Manager across JioMart, Netmeds and Urban Ladder.', 'One highlight: JioMart had ~95M visitors but only 1 in 10 sessions added to cart, so I led a redesign of browsing and discovery. It lifted add-to-cart by 28%.'] },
    { k: ['case', 'study', 'portfolio', 'project'], q: 'Which case study should I read first?' },
    { k: ['resume', 'cv'], q: 'Can I get your resume?' },
    { k: ['open', 'role', 'hire', 'hiring', 'job', 'available'], q: 'What roles are you looking for?' },
    { k: ['contact', 'connect', 'reach', 'email', 'linkedin', 'talk'], a: ['The quickest way to reach me is ' + LI + '. I reply there.'] },
    { k: ['team', 'lead', 'manage', 'mentor'], q: 'How do you lead a design team?' },
    { k: ['impact', 'metric', 'result', 'measure'], q: 'What results has your design moved?' },
    { k: ['story', 'himachal', 'grew', 'about'], q: 'What\'s your story?' },
    { k: ['hi', 'hello', 'hey', 'namaste'], a: ['Hey! 👋 Ask me anything about my work, or pick one of the questions below.'] }
  ];
  var FALLBACK = ['Good question! I\'m running on preview answers for now, so I can only cover my work, career, case studies and how to reach me.', 'Try one of these:'];

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
    if (best) return { a: best.a || ANSWERS[best.q.toLowerCase()], f: nextQs(2) };
    return { a: FALLBACK, f: nextQs(3) };
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
    '<button type="button" class="aat-launch" aria-haspopup="dialog" aria-controls="aat-drawer" aria-expanded="false">' + ORB + '<span>Ask AT</span><kbd aria-hidden="true"></kbd></button>' +
    '<div class="aat-scrim" aria-hidden="true"></div>' +
    '<section class="aat-drawer" id="aat-drawer" role="dialog" aria-modal="true" aria-labelledby="aat-title" aria-describedby="aat-sub" inert>' +
      '<header class="aat-head">' + ORB +
        '<div class="aat-head-txt"><h2 class="aat-title" id="aat-title">Ask AT</h2><p class="aat-sub" id="aat-sub"></p></div>' +
        '<button type="button" class="aat-icon-btn aat-reset" aria-label="Start over" title="Start over" hidden>' + ICON.reset + '</button>' +
        '<button type="button" class="aat-icon-btn aat-close" aria-label="Close" title="Close (Esc)">' + ICON.close + '</button>' +
      '</header>' +
      '<div class="aat-log" tabindex="-1" aria-live="polite" aria-relevant="additions">' +
        '<div class="aat-hero" aria-hidden="true">' + ORB + '</div>' +
        '<ol class="aat-msgs" aria-label="Conversation"></ol>' +
      '</div>' +
      '<footer class="aat-foot">' +
        '<form class="aat-form"><label for="aat-input" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)">Message</label>' +
          '<textarea class="aat-input" id="aat-input" rows="1" placeholder="Say hi, or ask me anything…" autocomplete="off"></textarea>' +
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
  launch.title = 'Ask AT (' + (isMac ? '⌘K' : 'Ctrl+K') + ')';

  /* ---------- state ---------- */
  var KEY = 'aat-chat-v2', PKEY = 'aat-persona', history = [], busy = false, lastFocus = null, persona = null, started = false;
  try { persona = personaById(localStorage.getItem(PKEY)); } catch (e) {}
  try { history = JSON.parse(sessionStorage.getItem(KEY)) || []; } catch (e) { history = []; }
  function save() { try { sessionStorage.setItem(KEY, JSON.stringify(history)); } catch (e) {} }
  function setPersona(p) {
    persona = p;
    try { p ? localStorage.setItem(PKEY, p.id) : localStorage.removeItem(PKEY); } catch (e) {}
    sub.textContent = p && p.id !== 'browsing' ? 'Chatting with ' + p.as : 'Abhishek\'s portfolio assistant · preview';
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
  function render(m, animate) {
    var li = document.createElement('li');
    li.className = 'aat-msg aat-msg--' + m.who;
    if (!animate) li.style.animation = 'none';
    if (m.who === 'user') li.innerHTML = '<div class="aat-bubble">' + esc(m.text) + '</div>';
    else li.innerHTML = ORB + '<div class="aat-bubble">' + m.parts.map(block).join('') + chipsHTML(m.chips, m.style) + '</div>';
    list.appendChild(li);
    return li;
  }
  function syncChrome() { reset.hidden = history.length < 3; root.classList.toggle('aat-has-chat', history.length > 0); }
  function toBottom() { log.scrollTop = log.scrollHeight; }
  // Once the visitor answers or asks, the chips above are spent: they stay readable but can't be clicked again.
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
        bubble.innerHTML = m.parts.map(block).join('') + chipsHTML(m.chips, m.style);
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
  function roleChips() { return PERSONAS.map(function (p) { return { t: p.me, p: p.id }; }); }

  /* The opening: hi, a line about me, then "who am I talking to?" */
  function intro() {
    started = true;
    var back = persona && persona.id !== 'browsing';
    say({ who: 'bot', parts: [back ? 'Hi again! 👋 Good to see you back.' : 'Hi, I\'m **Abhishek** 👋', 'I lead product design at Delhivery and have spent 10+ years designing for brands like Jio and Swiggy Dineout. Ask me anything about my work.'] }, function () {
      if (back) say({ who: 'bot', parts: ['Last time you said you\'re ' + persona.as + '. Here\'s what ' + persona.who + ' usually ask me:'], chips: persona.qs.map(function (q) { return q[0]; }), style: 'list' }, function () {
        say({ who: 'bot', parts: ['Not you? Tell me who you are.'], chips: roleChips(), style: 'roles' }, null, 350);
      }, 450);
      else say({ who: 'bot', parts: ['Before we start, who am I talking to?'], chips: roleChips(), style: 'roles' }, null, 500);
    }, 450);
  }
  function chooseRole(p, typed) {
    if (!typed) userSays(p.me);
    setPersona(p);
    var hi = p.id === 'browsing' ? 'Welcome, have a look around! People often start with these:' : 'Nice to meet you! Here\'s what ' + p.who + ' usually ask me:';
    say({ who: 'bot', parts: [hi], chips: p.qs.map(function (q) { return q[0]; }), style: 'list' });
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
    say({ who: 'bot', parts: r.a, chips: r.f });
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
