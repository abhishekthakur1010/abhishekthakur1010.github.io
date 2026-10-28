/* Ask Abhi: a small illustrated "mini-me" that answers questions about Abhishek's work.
   Offline first: answers come from the knowledge base below, never from a model, so it
   can't invent anything. A real model can plug in later through ASK_ABHI_ENDPOINT.
   Include css/ask-abhi.css and this file on any page. */
(function () {
  'use strict';
  if (window.__askAbhi) return;
  window.__askAbhi = true;

  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PAGE = (location.pathname.split('/').pop() || 'profile').replace(/\.html$/, '') || 'profile';
  var onProfile = PAGE === 'profile' || PAGE === 'index' || PAGE === '';
  var HOME = './profile.html';

  var LINKS = {
    email: 'mailto:abhishekiit2k12@gmail.com',
    call: 'https://cal.com/abhishek-thakur-adhbch/30min',
    linkedin: 'https://www.linkedin.com/in/abhishekthakur1010/',
    resume: './resume.pdf?v=3',
    behance: 'https://www.behance.net/abhishekthakur1010/',
    dribbble: 'https://dribbble.com/abhishek_thakur_'
  };

  var PROJECTS = {
    discovery: { t: 'Making product discovery seamless', org: 'JioMart', m: '+28% add-to-cart', img: './images/feature-project-02.webp', href: './jiomart-discovery.html' },
    checkout: { t: 'Streamlining the checkout experience', org: 'JioMart', m: '+20.54% conversion', img: './images/feature-project-01.webp', href: './jio-checkout.html' },
    delfin: { t: 'DelFin: a 0→1 financial services platform', org: 'Delhivery', m: 'Launched in ~8 weeks', img: './images/delfin/delfin-cover.png', href: './delfin.html' },
    lastmile: { t: 'Last Mile Express', org: 'Delhivery', m: 'QR payments 21% → 32%', img: './images/feature-project-04.webp', href: './delhivery-case-study-v2.html' }
  };

  /* ---------- knowledge base: every fact here is on the site ---------- */
  // k: words that point to this answer. a: the reply. Optional: cards, links, spot (a section on the profile).
  var KB = [
    { id: 'hi', k: ['hi', 'hello', 'hey', 'hola', 'namaste', 'yo', 'sup'],
      a: "Hey! I'm a mini Abhishek. Ask me about his work, impact or how he designs, and I'll show you the receipts." },
    { id: 'pitch', k: ['30', 'second', 'pitch', 'summary', 'tldr', 'recruiter', 'hire', 'why', 'quick', 'elevator', 'overview', 'short'],
      a: "**The 30-second version:**\n• **10 years** designing products used by **100M+ people**: Swiggy Dineout, Jio (JioMart, MyJio, Netmeds) and now Delhivery.\n• **Data-led**: starts from analytics, proves with numbers. JioMart discovery **+28% add-to-cart**, checkout **+20.54% conversion**.\n• **Leads teams**: a team of 7 at Delhivery; shipped a 0→1 fintech product in ~8 weeks.\n• **Engineer by degree** (IIIT Allahabad), so he speaks the dev team's language.",
      cards: ['discovery', 'checkout'], links: ['call', 'resume'] },
    { id: 'who', k: ['who', 'about', 'yourself', 'introduce', 'intro', 'abhishek', 'background', 'story'],
      a: "Abhishek is an **AI Product Design Leader** with **10 years** in design. He's led design at **Delhivery** (2023 – now), was **Senior UX Manager at Jio Platforms** (JioMart, MyJio, Netmeds), and before that designed at **Swiggy Dineout** and **Travacations**. Engineer by degree, designer by instinct.",
      links: ['story'], spot: '#experience' },
    { id: 'work', k: ['work', 'projects', 'project', 'case', 'studies', 'portfolio', 'best', 'show', 'favourite', 'favorite'],
      a: "Here are his **4 case studies**. Each one starts with a real problem and ends with measured impact:",
      cards: ['discovery', 'checkout', 'delfin', 'lastmile'], spot: '#featured' },
    { id: 'discovery', k: ['discovery', 'plp', 'pdp', 'listing', 'product', 'page', 'search', 'browse', 'browsing', 'add-to-cart', 'cart'],
      a: "**JioMart product discovery (Jan – Mar 2023).** Shoppers could find products but struggled to choose. Analytics showed searchers were **4× likelier** to add to cart, so he put search first and moved price, rating and discount onto every card.\n**Result:** sessions with add-to-cart **+28%**, add-to-cart from search **+21%**, pages **29% faster**. His V1 listing even appeared in JioMart's ad film.",
      cards: ['discovery'] },
    { id: 'checkout', k: ['checkout', 'payment', 'payments', 'conversion', 'address', 'order', 'coupon', 'coupons'],
      a: "**JioMart checkout.** He rebuilt cart, address, payment and confirmation into a faster, clearer flow.\n**Result:** conversion **+20.54%**, new users **+29%**, orders **+8.15%**.",
      cards: ['checkout'] },
    { id: 'delfin', k: ['delfin', 'fastag', 'gps', 'fintech', 'finance', 'financial', 'zero', '0→1', '0-1', 'scratch', 'startup'],
      a: "**DelFin by Delhivery.** A **0→1** financial services platform for Delhivery's fleet ecosystem (FASTag, GPS and more), designed and shipped from scratch in **about 8 weeks**.",
      cards: ['delfin'] },
    { id: 'lastmile', k: ['last', 'mile', 'delhivery', 'express', 'field', 'qr', 'partner', 'logistics', 'delivery', 'ops'],
      a: "**Delhivery Last Mile Express (Oct 2023 – Feb 2025).** He led a **team of 7** across field exec, partner and ops tools for a ₹8,000 Cr+ network.\n**Result:** QR payment adoption **21% → 32%**, about **₹2.5L/day** saved in cash handling, and **~2×** design throughput.",
      cards: ['lastmile'] },
    { id: 'impact', k: ['impact', 'numbers', 'metrics', 'results', 'kpi', 'kpis', 'growth', 'data', 'outcome', 'outcomes'],
      a: "**Impact, in numbers:**\n• JioMart discovery: **+28%** add-to-cart sessions\n• JioMart checkout: **+20.54%** conversion\n• Delhivery: QR payments **21% → 32%**, ~**₹2.5L/day** saved\n• DelFin: 0→1 launch in **~8 weeks**\nAcross products used by **100M+** people.",
      cards: ['discovery', 'lastmile'] },
    { id: 'process', k: ['process', 'approach', 'how', 'method', 'research', 'think', 'framework', 'design'],
      a: "**How he works: measure → audit → benchmark → test → re-measure.**\nHe starts from analytics to find where people drop off, audits the screens, studies the leaders, tests with real users, then checks the numbers after launch. Decisions are made with PM and engineering, not handed over.",
      cards: ['discovery'] },
    { id: 'ai', k: ['ai', 'artificial', 'intelligence', 'llm', 'gpt', 'chatgpt', 'claude', 'ml', 'machine', 'genai'],
      a: "Abhishek designs as an **AI Product Design Leader**: data first, then design that people can trust. This assistant is a small example: it answers only from his portfolio, so it never makes things up. For his AI product work in depth, the best route is a quick call.",
      links: ['call'] },
    { id: 'lead', k: ['lead', 'leader', 'leadership', 'team', 'manage', 'manager', 'mentor', 'mentoring', 'people'],
      a: "He leads the **Gurgaon design team at Delhivery** and led a **team of 7** on Last Mile, roughly **doubling design throughput** with weekly sprints. Colleagues describe him as a supportive mentor who brings out the best in the team.",
      spot: '#recommendations' },
    { id: 'exp', k: ['experience', 'years', 'career', 'companies', 'company', 'worked', 'jobs', 'job', 'jio', 'swiggy', 'dineout', 'reliance'],
      a: "**Career:**\n• **Delhivery**: Lead, Gurgaon Design Team (2023 – now)\n• **Jio Platforms (Reliance)**: Senior UX Manager (2022 – 23)\n• **Travacations**: Design Strategy (2019 – 22)\n• **Swiggy Dineout**: Senior UX Designer, Manager II (2016 – 19)",
      spot: '#experience' },
    { id: 'apps', k: ['apps', 'products', 'myjio', 'netmeds', 'users', 'millions', 'scale', 'urban', 'ladder'],
      a: "He's shaped apps used by **100M+** people: **MyJio** (500M+ downloads), **JioMart** (100M+), **Netmeds**, **Swiggy Dineout**, **Delhivery** and **Urban Ladder**.",
      spot: '#products' },
    { id: 'edu', k: ['education', 'college', 'degree', 'iiit', 'iit', 'allahabad', 'study', 'studied', 'btech', 'engineer', 'engineering'],
      a: "**B.Tech in Information Technology** from **IIIT Allahabad** (2012 – 16). An engineer by degree, so design and build talk the same language.",
      spot: '#education' },
    { id: 'awards', k: ['award', 'awards', 'recognition', 'won', 'spotlight', 'hackathon', 'prize'],
      a: "**Awards:**\n• **Spotlight Award**, Jio Platforms (Q4 2022–23)\n• **Design Nerds Hackathon** winner, Jio (Sep 2022)\n• **JioMart Best Team Award**, Jio\n• **Mega Mind Award**, Swiggy Dineout (Jul 2017)",
      spot: '#about' },
    { id: 'recs', k: ['recommendation', 'recommendations', 'testimonial', 'testimonials', 'say', 'reviews', 'colleagues', 'reference'],
      a: "From people who've worked with him:\n“**Collaborative, skilled and impact driven**”, Santanu Shyam, Product Leader\n“**Award-winning, conversion-focused UX expert**”, Nirmal Biswas, Associate Design Director\n“**Supportive mentor with sharp problem-solving**”, Anirban Borah, Lead UX Designer",
      spot: '#recommendations' },
    { id: 'skills', k: ['skills', 'skill', 'strengths', 'strength', 'good', 'expertise', 'speciality', 'specialty', 'tools'],
      a: "**Strengths:** product discovery and conversion, data-led decisions, information architecture, design systems at scale, 0→1 products, and leading design teams.",
      cards: ['discovery', 'delfin'] },
    { id: 'visual', k: ['ui', 'visual', 'visuals', 'dribbble', 'behance', 'gallery', 'aesthetic', 'screens'],
      a: "There's a gallery of his **UI & visual design** on the profile, and more on Behance and Dribbble.",
      links: ['behance', 'dribbble'], spot: '#ui-visual' },
    { id: 'contact', k: ['contact', 'email', 'mail', 'call', 'meet', 'reach', 'talk', 'connect', 'book', 'linkedin', 'available', 'availability', 'open', 'roles', 'role', 'hiring', 'opportunity'],
      a: "The fastest way is a **30-minute call**. You can also email or message him on LinkedIn; he replies personally.",
      links: ['call', 'email', 'linkedin'] },
    { id: 'resume', k: ['resume', 'cv', 'pdf'],
      a: "Here's his resume:", links: ['resume'] },
    { id: 'life', k: ['hobbies', 'hobby', 'fun', 'beyond', 'travel', 'cycling', 'dogs', 'dog', 'outside', 'personal', 'free', 'weekend'],
      a: "Beyond work: he's travelled **6–7 countries**, rode **solo from Gurgaon to Dehradun** on a bicycle, gives back with **CRY Foundation** and **Robin Hood Army**, and is usually outdoors with his dogs **Luna & Bruno**.",
      spot: '#interests' },
    { id: 'where', k: ['where', 'based', 'location', 'city', 'live', 'gurgaon', 'gurugram', 'india', 'relocate', 'remote'],
      a: "He leads the **Gurgaon** design team at Delhivery. For location or remote questions, it's best to ask him directly.",
      links: ['call'] },
    { id: 'thanks', k: ['thanks', 'thank', 'cool', 'great', 'awesome', 'nice', 'ok', 'okay', 'bye'],
      a: "Anytime! If you'd like to talk to the real Abhishek, a 30-minute call is the quickest way.", links: ['call'] }
  ];

  var LINK_LABEL = { call: 'Book a 30-min call', email: 'Email him', linkedin: 'LinkedIn', resume: 'Open resume', behance: 'Behance', dribbble: 'Dribbble', story: 'Read his story' };
  var LINK_HREF = function (k) { return k === 'story' ? './about-us.html' : LINKS[k]; };

  /* page-aware openers */
  var CONTEXT = {
    profile: { nudge: "Short on time? I'll give you the 30-second version.", chips: ['30-second pitch', 'Best case studies', 'Impact in numbers', 'How does he work?'] },
    'jiomart-discovery': { nudge: 'Want the 3 key decisions behind this project?', chips: ['Explain this project', 'What was the impact?', 'How does he work?', 'Other projects'] },
    'jio-checkout': { nudge: 'Curious how checkout got +20% conversion?', chips: ['Explain this project', 'What was the impact?', 'Other projects', 'Contact him'] },
    delfin: { nudge: 'Want to know how a 0→1 product shipped in 8 weeks?', chips: ['Explain this project', 'Leadership', 'Other projects', 'Contact him'] },
    'delhivery-case-study-v2': { nudge: 'Ask me how QR payments went from 21% to 32%.', chips: ['Explain this project', 'Leadership', 'Other projects', 'Contact him'] }
  };
  var PAGE_TOPIC = { 'jiomart-discovery': 'discovery', 'jio-checkout': 'checkout', delfin: 'delfin', 'delhivery-case-study-v2': 'lastmile' };
  var ctx = CONTEXT[PAGE] || CONTEXT.profile;

  /* ---------- matching ---------- */
  function norm(s) { return s.toLowerCase().replace(/[^a-z0-9→\-\s]/g, ' ').replace(/\s+/g, ' ').trim(); }
  function answerFor(q) {
    var t = norm(q);
    if (/this project|explain this|this case/.test(t) && PAGE_TOPIC[PAGE]) return byId(PAGE_TOPIC[PAGE]);
    if (/other projects|best case|case stud/.test(t)) return byId('work');
    var words = t.split(' '), best = null, score = 0;
    KB.forEach(function (e) {
      var s = 0;
      e.k.forEach(function (k) {
        if (k.indexOf(' ') > -1 ? t.indexOf(k) > -1 : words.indexOf(k) > -1) s += 2;
        else if (k.length > 4 && t.indexOf(k) > -1) s += 1;
      });
      if (s > score) { score = s; best = e; }
    });
    return score ? best : null;
  }
  function byId(id) { for (var i = 0; i < KB.length; i++) if (KB[i].id === id) return KB[i]; return null; }

  /* ---------- avatar (mini Abhishek) ---------- */
  function avatar(cls) {
    return '<svg class="aa-av ' + (cls || '') + '" viewBox="0 0 120 120" aria-hidden="true">' +
      '<path class="aa-tee" d="M14 120c2-20 18-31 46-31s44 11 46 31z"/>' +
      '<path class="aa-skin" d="M51 78h18v16c-3 4-15 4-18 0z"/>' +
      '<ellipse class="aa-skin" cx="34" cy="60" rx="5" ry="7"/><ellipse class="aa-skin" cx="86" cy="60" rx="5" ry="7"/>' +
      '<path class="aa-skin" d="M35 50c0-17 11-27 25-27s25 10 25 27v12c0 15-11 27-25 27S35 77 35 62z"/>' +
      '<path class="aa-stubble" d="M37 66c3 13 12 21 23 21s20-8 23-21c-4 6-10 9-14 8-3 4-15 4-18 0-4 1-10-2-14-8z"/>' +
      '<path class="aa-hair" d="M34 58C30 42 33 28 42 21c4-9 16-14 28-11 10-1 19 5 21 14 5 5 6 14 2 22-2 5-5 9-8 11 0-8-3-14-8-17-9 4-22 4-31 0-5 4-8 10-9 18z"/>' +
      '<path class="aa-hair" d="M44 16c4-9 18-13 30-8 7 2 11 7 11 12-6-6-15-8-24-6-7 1-13 4-17 2z"/>' +
      '<path class="aa-hair-hi" d="M52 22c8-6 20-6 28 1M47 30c9-5 22-6 32 0"/>' +
      '<path class="aa-brow" d="M43 50c4-3 10-3 13-1"/><path class="aa-brow" d="M64 49c4-2 9-2 13 1"/>' +
      '<g class="aa-eyes"><ellipse class="aa-white" cx="50" cy="58" rx="5.2" ry="4"/><ellipse class="aa-white" cx="70" cy="58" rx="5.2" ry="4"/>' +
      '<g class="aa-pupils"><circle cx="50" cy="58" r="2.6"/><circle cx="70" cy="58" r="2.6"/></g>' +
      '<rect class="aa-lid" x="43" y="53" width="34" height="0"/></g>' +
      '<path class="aa-nose" d="M60 61c-1 5-2 8 1 9"/>' +
      '<path class="aa-mouth" d="M52 75c5 3 11 3 16 0"/>' +
      '<g class="aa-hand"><path class="aa-skin" d="M98 86c-3-9-1-17 3-19 2-1 4 1 3 4l-1 6 3-9c1-3 4-3 5 0l-2 9 4-7c2-3 5-1 4 2l-5 10 4-4c2-2 5 0 3 3-4 6-9 9-14 9z"/></g>' +
      '</svg>';
  }

  /* ---------- DOM ---------- */
  var root = document.createElement('div');
  root.className = 'aa';
  root.innerHTML =
    '<div class="aa-nudge" role="status" hidden><span></span><button type="button" class="aa-nudge-x" aria-label="Dismiss">×</button></div>' +
    '<button type="button" class="aa-launch" aria-haspopup="dialog" aria-expanded="false" aria-label="Ask Abhi, a mini assistant about Abhishek">' +
      '<span class="aa-peek">' + avatar() + '</span><span class="aa-label">Ask Abhi</span></button>' +
    '<section class="aa-panel" role="dialog" aria-modal="false" aria-labelledby="aa-title" hidden>' +
      '<header class="aa-head"><span class="aa-head-av">' + avatar('sm') + '</span>' +
        '<div><b id="aa-title">Ask Abhi</b><span class="aa-sub"><i class="aa-dot"></i>Answers from Abhishek\'s portfolio</span></div>' +
        '<button type="button" class="aa-x" aria-label="Close">×</button></header>' +
      '<div class="aa-log" aria-live="polite"></div>' +
      '<div class="aa-chips"></div>' +
      '<form class="aa-form"><label class="aa-sr" for="aa-in">Ask a question</label>' +
        '<input id="aa-in" type="text" autocomplete="off" placeholder="Ask about his work, impact, process…" maxlength="200" />' +
        '<button type="submit" aria-label="Send"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>' +
    '</section>';
  document.body.appendChild(root);

  var launch = root.querySelector('.aa-launch'), panel = root.querySelector('.aa-panel'), log = root.querySelector('.aa-log');
  var chipsEl = root.querySelector('.aa-chips'), form = root.querySelector('.aa-form'), input = root.querySelector('#aa-in');
  var nudge = root.querySelector('.aa-nudge');

  /* eyes follow the cursor; blink now and then */
  var pupils = root.querySelectorAll('.aa-pupils');
  if (!reduce) {
    document.addEventListener('pointermove', function (e) {
      pupils.forEach(function (g) {
        var r = g.ownerSVGElement.getBoundingClientRect();
        if (!r.width) return;
        var dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height * 0.48);
        var d = Math.max(1, Math.hypot(dx, dy)), m = Math.min(2.4, d / 60);
        g.setAttribute('transform', 'translate(' + (dx / d * m).toFixed(2) + ' ' + (dy / d * m * 0.8).toFixed(2) + ')');
      });
    }, { passive: true });
    (function blink() {
      setTimeout(function () { root.classList.add('aa-blink'); setTimeout(function () { root.classList.remove('aa-blink'); blink(); }, 140); }, 2600 + Math.random() * 3200);
    })();
  }

  /* ---------- rendering ---------- */
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function fmt(s) { return esc(s).replace(/\*\*(.+?)\*\*/g, '<b>$1</b>').replace(/\n/g, '<br>'); }
  function scrollLog() { log.scrollTop = log.scrollHeight; }

  function addUser(text) {
    var d = document.createElement('div'); d.className = 'aa-msg me'; d.textContent = text; log.appendChild(d); scrollLog();
  }
  function addBot(entry) {
    var d = document.createElement('div'); d.className = 'aa-msg bot';
    var html = '<div class="aa-txt">' + fmt(entry.a) + '</div>';
    if (entry.cards) {
      html += '<div class="aa-cards">' + entry.cards.map(function (k) {
        var p = PROJECTS[k];
        return '<a class="aa-card" href="' + p.href + '"><img src="' + p.img + '" alt="" loading="lazy"><span><b>' + esc(p.t) + '</b><i>' + esc(p.org) + ' · <em>' + esc(p.m) + '</em></i></span></a>';
      }).join('') + '</div>';
    }
    var acts = (entry.links || []).map(function (k) {
      var ext = /^https?:/.test(LINK_HREF(k));
      return '<a class="aa-act" href="' + LINK_HREF(k) + '"' + (ext ? ' target="_blank" rel="noopener"' : '') + '>' + LINK_LABEL[k] + ' →</a>';
    });
    if (entry.spot) acts.push(onProfile && document.querySelector(entry.spot)
      ? '<button type="button" class="aa-act aa-spot" data-spot="' + entry.spot + '">Show me on the page ↓</button>'
      : '<a class="aa-act" href="' + HOME + entry.spot + '">See it on the profile →</a>');
    if (acts.length) html += '<div class="aa-acts">' + acts.join('') + '</div>';
    d.innerHTML = html; log.appendChild(d);
    // long answers: show their start, not their end
    log.scrollTop = Math.max(0, d.offsetTop - log.offsetTop - 64);
  }
  function fallback() {
    return { a: "I only answer from Abhishek's portfolio, and I don't have that one. Try one of these, or ask him directly:", links: ['call', 'email'] };
  }

  function typing(on) {
    root.classList.toggle('aa-talking', on);
    var t = log.querySelector('.aa-typing');
    if (on && !t) { t = document.createElement('div'); t.className = 'aa-msg bot aa-typing'; t.innerHTML = '<i></i><i></i><i></i>'; log.appendChild(t); scrollLog(); }
    if (!on && t) t.remove();
  }

  var history = [];
  function save() { try { sessionStorage.setItem('aa-log', JSON.stringify(history.slice(-24))); } catch (e) {} }

  function ask(q) {
    q = (q || '').trim(); if (!q) return;
    addUser(q); history.push({ me: q }); save();
    input.value = '';
    typing(true);
    var e = answerFor(q) || fallback();
    setTimeout(function () {
      typing(false); addBot(e); history.push({ id: e.id || null }); save();
      setChips(e.id);
      setTimeout(function () { root.classList.remove('aa-talking'); }, 900);
    }, reduce ? 50 : 420 + Math.min(700, e.a.length * 2));
  }

  // follow-up chips change with the conversation
  var FOLLOW = {
    pitch: ['Best case studies', 'Leadership', 'Contact him'], work: ['Impact in numbers', 'How does he work?', 'Contact him'],
    discovery: ['How does he work?', 'Other projects', 'Contact him'], checkout: ['Other projects', 'Impact in numbers', 'Contact him'],
    delfin: ['Leadership', 'Other projects', 'Contact him'], lastmile: ['Leadership', 'Other projects', 'Contact him'],
    impact: ['How does he work?', 'Best case studies', 'Contact him'], process: ['Explain a project', 'Awards', 'Contact him'],
    contact: ['30-second pitch', 'Open resume', 'Beyond work']
  };
  var CHIP_Q = { 'Explain a project': 'Tell me about JioMart discovery', 'Open resume': 'resume', 'Leadership': 'leadership', 'Awards': 'awards', 'Beyond work': 'beyond work', 'Contact him': 'contact' };
  function setChips(id) {
    var list = (id && FOLLOW[id]) || ctx.chips;
    chipsEl.innerHTML = list.map(function (c) { return '<button type="button" class="aa-chip">' + esc(c) + '</button>'; }).join('');
  }

  /* ---------- open / close ---------- */
  var greeted = false;
  function open() {
    hideNudge(true);
    panel.hidden = false; root.classList.add('aa-open'); launch.setAttribute('aria-expanded', 'true');
    if (!greeted) {
      greeted = true;
      var past; try { past = JSON.parse(sessionStorage.getItem('aa-log') || '[]'); } catch (e) { past = []; }
      if (past.length) {
        past.forEach(function (h) { if (h.me) addUser(h.me); else addBot(h.id ? byId(h.id) : fallback()); });
        history = past;
      } else {
        addBot({ a: "Hi, I'm **mini Abhishek** 👋 Ask me anything about his work. I answer only from his portfolio, with links to the proof." });
      }
      setChips();
    }
    setTimeout(function () { input.focus({ preventScroll: true }); }, 60);
  }
  function close() { panel.hidden = true; root.classList.remove('aa-open'); launch.setAttribute('aria-expanded', 'false'); launch.focus({ preventScroll: true }); }

  launch.addEventListener('click', function () { panel.hidden ? open() : close(); });
  root.querySelector('.aa-x').addEventListener('click', close);
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !panel.hidden) close(); });
  form.addEventListener('submit', function (e) { e.preventDefault(); ask(input.value); });
  chipsEl.addEventListener('click', function (e) { var b = e.target.closest('.aa-chip'); if (b) ask(CHIP_Q[b.textContent] || b.textContent); });

  // "Show me on the page": close, scroll, and spotlight the section
  log.addEventListener('click', function (e) {
    var b = e.target.closest('.aa-spot'); if (!b) return;
    var el = document.querySelector(b.getAttribute('data-spot')); if (!el) return;
    if (matchMedia('(max-width: 640px)').matches) close();
    el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });
    el.classList.remove('aa-spotlight'); void el.offsetWidth; el.classList.add('aa-spotlight');
    setTimeout(function () { el.classList.remove('aa-spotlight'); }, 2600);
  });

  /* ---------- page-aware nudge, once per page per session ---------- */
  function hideNudge(forever) {
    nudge.hidden = true; root.classList.remove('aa-wave');
    if (forever) try { sessionStorage.setItem('aa-nudged-' + PAGE, '1'); } catch (e) {}
  }
  nudge.querySelector('span').textContent = ctx.nudge;
  nudge.addEventListener('click', function (e) { if (e.target.closest('.aa-nudge-x')) hideNudge(true); else open(); });
  var seen; try { seen = sessionStorage.getItem('aa-nudged-' + PAGE); } catch (e) {}
  function ready() { return !document.documentElement.classList.contains('splash-on') && !document.documentElement.classList.contains('cat-mode'); }
  if (!seen) {
    var tries = 0;
    setTimeout(function wait() {
      if (!panel.hidden) return;
      if (!ready() && tries++ < 40) return setTimeout(wait, 1000);
      nudge.hidden = false; root.classList.add('aa-wave');
      setTimeout(function () { if (!nudge.hidden) hideNudge(false); }, 9000);
    }, 5000);
  }

  // arrive with a little peek once the page has settled
  setTimeout(function () { root.classList.add('aa-in'); }, reduce ? 0 : 900);
})();
