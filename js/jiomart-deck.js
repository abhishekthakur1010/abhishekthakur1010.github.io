/* ============================================================
   JioMart Discovery — 16-slide interview deck engine
   Reads window.DECK. Scene + beat model, section navigator,
   BEFORE→V1→V2 evolution, evidence overlay.
   ============================================================ */
(function () {
  "use strict";
  var D = window.DECK;
  if (!D) return;
  var IMG = D.imgBase || "";
  var slides = D.slides || [];
  var SECTIONS = D.sections || [];
  var TOTAL = slides.length;

  var stage = document.getElementById("deckStage");
  var rail = document.getElementById("sectionRail");
  var nowEl = document.getElementById("slideNow");
  var totEl = document.getElementById("slideTotal");
  var prevBtn = document.getElementById("navPrev");
  var nextBtn = document.getElementById("navNext");
  var panel = document.getElementById("evidencePanel");

  var index = 0, step = 0, stepsOnSlide = 0, slideEl = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function img(n) { return n ? IMG + n : ""; }
  function esc(s) { return s == null ? "" : String(s); }
  function ph(s) { return /^\[ADD/.test(String(s)); } // is a placeholder token
  function L(arr, tag) { tag = tag || "h1"; return "<" + tag + ">" + (arr || []).map(esc).join("<br>") + "</" + tag + ">"; }
  function sub(s) { return s ? "<p class='sub'>" + esc(s) + "</p>" : ""; }
  function device(src, focus, extra) {
    return "<div class='device " + (extra || "") + "'><div class='dn'></div><div class='ds'>" +
      "<img src='" + img(src) + "' data-focus='" + (focus || 0) + "'></div></div>";
  }
  function videoDevice(src, poster, extra) {
    return "<div class='device " + (extra || "") + "'><div class='dn'></div><div class='ds'>" +
      "<video src='" + img(src) + "' muted loop playsinline preload='metadata' poster='" + img(poster) + "'></video></div></div>";
  }
  function pendingDevice(label) {
    return "<div class='device pending'><div class='dn'></div><div class='ds'><span class='ph-note'>" + esc(label || "[ADD SCREEN]") + "</span></div></div>";
  }
  function sig(list) {
    return (list || []).map(function (s) {
      return "<span class='sig " + s.dir + "'>" + esc(s.t) + " " + (s.dir === "up" ? "↑" : "↓") + "</span>";
    }).join("");
  }
  function evidencePill(ev) {
    if (!ev) return "";
    return "<button class='ev-pill' data-ev='1'><span>Evidence · " + esc(ev.method) + "</span>" +
      "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M7 17L17 7M17 7H8M17 7v9'/></svg></button>";
  }

  if (totEl) totEl.textContent = pad(TOTAL);

  /* ---------- section rail ---------- */
  function renderRail(activeSection) {
    if (!rail) return;
    rail.innerHTML = SECTIONS.map(function (s) {
      return "<button type='button' class='sr-item" + (s.id === activeSection ? " on" : "") + "' data-section='" + esc(s.id) + "' title='Go to " + esc(s.label) + "'><span class='sr-n'>" + esc(s.n) + "</span><span class='sr-l'>" + esc(s.label) + "</span></button>";
    }).join("");
  }
  // first slide index of a given section
  function sectionStart(id) {
    for (var k = 0; k < slides.length; k++) { if (slides[k].section === id) return k; }
    return -1;
  }

  /* ---------- steps per slide ---------- */
  function stepsFor(sc) {
    switch (sc.type) {
      case "opening": return 0;
      case "categories": return 2;
      case "problem-flow": return sc.problems.length + sc.chain.length;
      case "toolkit": return sc.tiles.length;
      case "personas": return sc.personas.length;
      case "findings": return sc.findings.length + 1;
      case "prioritise": return sc.tiers.length + 2;
      case "review": return (sc.points ? sc.points.length : 0) + 1;
      case "evolution": return 4; // 1=collapse heading+before, 2=v1, 3=v2, +notes
      case "usability": return 3;
      case "pdp-questions": return sc.questions.length + 1;
      case "pdp-scroll": return sc.layers.length - 1;
      case "impact": return Math.max(sc.experience.length, sc.metrics.length + 2) + 1;
      case "voice": return sc.quotes.length;
      case "recognition": return 2;
      default: return 0;
    }
  }

  /* ============================================================
     TEMPLATES
     ============================================================ */
  var T = {
    opening: function (sc) {
      // headline can be a plain array, or use `highlight` to accent one word in red
      var head;
      if (sc.highlight) {
        head = "<h1>" + (sc.headline || []).map(function (part) {
          return part === sc.highlight ? "<span class='hl'>" + esc(part) + "</span>" : esc(part);
        }).join("") + "</h1>";
      } else {
        head = L(sc.headline);
      }
      var meta = "<div class='op-meta'>" + sc.meta.map(function (m) {
        return "<div><span class='ml'>" + esc(m.l) + "</span><span class='mv'>" + esc(m.v) + "</span></div>";
      }).join("") + "</div>";
      var badge = sc.badge ? "<div class='op-badge'><b>" + esc(sc.badge.n) + "</b><span>" + esc(sc.badge.l) + "</span></div>" : "";
      // back-layer phones (Home + PLP) that fan out behind the PDP on hover
      var back = "";
      if (sc.hero && sc.backShots && sc.backShots.length) {
        back = "<div class='op-back'>" + sc.backShots.map(function (s, i) {
          return "<div class='op-back-" + i + "'>" + device(s, 0, "big") + "</div>";
        }).join("") + "</div>";
      }
      var visual = sc.hero
        ? "<div class='op-hero'>" + back + "<div class='op-front'>" + device(sc.hero, 0, "big") + "</div>" + badge + "</div>"
        : "<div class='op-shots'>" + (sc.shots || []).map(function (s, i) { return device(s, 0, "sm shot-" + i); }).join("") + "</div>";
      return "<div class='sl opening'>" +
        "<div class='op-top'>" +
        "<div class='op-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + head +
        "<p class='body'>" + esc(sc.body) + "</p>" +
        "<div class='cta-hint'>" + esc(sc.cta) + "</div></div>" +
        visual + "</div>" +
        meta + "</div>";
    },

    categories: function (sc) {
      var cats = sc.cats.map(function (c, i) { return "<span class='cat reveal' data-step='1'>" + esc(c) + "</span>"; }).join("");
      var snap = sc.snapshot.map(function (s) {
        var shot = s.img ? "<span class='snap-shot zoomable' title='Click to enlarge'><img src='" + img(s.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></span>" : "";
        return "<div class='snap'>" + shot +
          "<div class='snap-meta'><div class='snap-store'>" + esc(s.store) + "</div>" +
          "<div class='snap-rating'>" + esc(s.rating) + "<span>★</span></div>" +
          "<div class='snap-stat'>" + esc(s.stat) + "</div>" +
          "<div class='snap-sub'>" + esc(s.sub) + "</div></div></div>";
      }).join("");
      var reasons = sc.reasons.map(function (r) { return "<span class='reason'>" + esc(r) + "</span>"; }).join("");
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline) + sub(sc.sub) +
        "<div class='reasons reveal' data-step='2'>" + reasons + "</div></div>" +
        "<div class='c-visual'><div class='cat-grid'>" + cats + "</div><div class='snaps reveal' data-step='2'>" + snap + "</div></div></div>";
    },

    "problem-flow": function (sc) {
      var flow = sc.flow.map(function (f) { return "<span class='pf-node'>" + esc(f) + "</span>"; }).join("<span class='pf-arrow'>→</span>");
      var probs = sc.problems.map(function (p, i) { return "<div class='prob reveal' data-step='" + (i + 1) + "'><span class='prob-n'>" + pad(i + 1) + "</span>" + esc(p) + "</div>"; }).join("");
      var cs = sc.problems.length;
      var chain = sc.chain.map(function (c, i) { return "<span class='ch reveal' data-step='" + (cs + i + 1) + "'>" + esc(c) + "</span>"; }).join("<span class='ch-arrow'>↓</span>");
      // right side: the three real screens in phone mockups (Home / PLP / PDP). PDP is tall → scrolls inside the frame.
      var screens = (sc.screens || []).map(function (s) {
        return "<figure class='pf-screen'>" +
          "<figcaption>" + esc(s.label) + "</figcaption>" +
          "<span class='pf-media zoomable" + (s.tall ? " tall" : "") + "' title='Click to enlarge'>" +
          "<div class='device big'><div class='dn'></div>" +
          "<div class='ds'><img src='" + img(s.img) + "' onerror=\"this.closest('.device').classList.add('failed')\"></div>" +
          "</div></span></figure>";
      }).join("");
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='pf-flow'>" + flow + "</div>" +
        "<div class='probs'>" + probs + "</div>" +
        "<div class='chain'>" + chain + "</div>" +
        "<p class='note reveal' data-step='" + (cs + sc.chain.length) + "'>" + esc(sc.end) + "</p></div>" +
        "<div class='c-visual'><div class='pf-screens'>" + screens + "</div></div></div>";
    },

    toolkit: function (sc) {
      var tiles = sc.tiles.map(function (t, i) {
        return "<button class='tile reveal' data-step='" + (i + 1) + "' data-img='" + img(t.img) + "' data-crop='" + Math.round((t.crop || 0.3) * 100) + "'>" +
          "<span class='tile-img' style='--crop:" + Math.round((t.crop || 0.3) * 100) + "%'><img src='" + img(t.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></span>" +
          "<span class='tile-t'>" + esc(t.t) + "</span></button>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        "<div class='tile-grid'>" + tiles + "</div>" +
        "<p class='note'>" + esc(sc.statement) + "</p></div>";
    },

    personas: function (sc) {
      var cards = sc.personas.map(function (p, i) {
        return "<div class='persona reveal' data-step='" + (i + 1) + "'><div class='p-name'>" + esc(p.name) + "</div><div class='p-type'>" + esc(p.type) + "</div>" +
          "<div class='p-row'><span>Need</span>" + esc(p.need) + "</div><div class='p-row'><span>Friction</span>" + esc(p.friction) + "</div></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + evidencePill(sc.evidence) + "</div>" +
        "<div class='persona-grid'>" + cards + "</div>" +
        "<p class='note reveal' data-step='" + sc.personas.length + "'>" + esc(sc.end) + "</p></div>";
    },

    findings: function (sc) {
      var f = sc.findings.map(function (x, i) { return "<div class='finding reveal' data-step='" + (i + 1) + "'><b>" + esc(x.k) + "</b><span>" + esc(x.d) + "</span></div>"; }).join("");
      var eqStep = sc.findings.length + 1;
      var eq = sc.equation.map(function (e) { return "<span class='eq-k'>" + esc(e) + "</span>"; }).join("<span class='eq-op'>+</span>");
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='equation reveal' data-step='" + eqStep + "'>" + eq + "<span class='eq-op'>=</span><span class='eq-r'>" + esc(sc.equationResult) + "</span></div></div>" +
        "<div class='c-visual'><div class='findings'>" + f + "</div></div></div>";
    },

    prioritise: function (sc) {
      var tiers = sc.tiers.map(function (t, i) { return "<div class='ptier reveal' data-step='" + (i + 2) + "'><b>" + esc(t.k) + "</b><span>" + esc(t.d) + "</span></div>"; }).join("");
      var road = sc.roadmap.map(function (r) { return "<span class='road'><b>" + esc(r.s) + "</b>" + esc(r.d) + "</span>"; }).join("<span class='road-sep'>·</span>");
      var last = sc.tiers.length + 2;
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='reveal reframe' data-step='1'>" + esc(sc.reveal) + "</div>" +
        "<div class='ptiers'>" + tiers + "</div>" +
        "<div class='roadmap reveal' data-step='" + last + "'>" + road + "</div>" +
        "<p class='note reveal' data-step='" + last + "'>" + esc(sc.end) + "</p></div>" +
        "<div class='c-visual'><div class='artifact zoomable' style='--crop:" + Math.round((sc.crop || 0.35) * 100) + "%'><img src='" + img(sc.img) + "' onerror=\"this.parentElement.classList.add('failed')\"><span class='art-tag'>Impact / effort matrix</span></div></div></div>";
    },

    evolution: function (sc) {
      // each column: label pill (above) · phone · short notes (below)
      var phone = function (title, obj, stepN, tone) {
        var media = obj.video ? videoDevice(obj.video, obj.poster, "big")
          : obj.pending ? pendingDevice((obj.notes && obj.notes[0]) || "[ADD SCREEN]")
          : device(obj.img, obj.focus, "big");
        var notes = (obj.notes || []).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
        return "<figure class='evo-col " + tone + "'>" +
          "<figcaption>" + title + "</figcaption>" +
          "<span class='evo-media zoomable' title='Click to enlarge'>" + media + "</span>" +
          "<ul class='evo-notes reveal' data-step='" + stepN + "'>" + notes + "</ul></figure>";
      };
      // LEFT = heading + sub + evidence + signals.  RIGHT = the three phones (label above, notes below).
      return "<div class='sl evo-slide'>" +
        "<div class='evo-left'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        evidencePill(sc.evidence) +
        (sc.punch ? "<div class='punch reveal' data-step='3'>" + esc(sc.punch) + "</div>" : "") +
        (sc.flowLine ? "<div class='flow-line'>" + esc(sc.flowLine) + "</div>" : "") +
        "<div class='evo-signals reveal' data-step='3'>" + sig(sc.signal) + "</div></div>" +
        "<div class='evo-stage'>" +
        phone("Before", sc.before, 1, "before") +
        phone("V1 · DS 2.0", sc.v1, 2, "v1") +
        phone("V2 · Current", sc.v2, 3, "v2") +
        "</div></div>";
    },

    usability: function (sc) {
      var stats = sc.stats.map(function (s) { return "<div class='ustat'><div class='un'>" + esc(s.n) + "</div><div class='ul'>" + esc(s.l) + "</div></div>"; }).join("");
      var chain = sc.chain.map(function (c, i) { return "<div class='uchain reveal' data-step='" + (i + 1) + "'><b>" + esc(c.k) + "</b><span>" + esc(c.d) + "</span></div>"; }).join("");
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='ustats'>" + stats + "</div>" +
        "<blockquote class='uquote'>\u201C" + esc(sc.quote) + "\u201D</blockquote>" +
        "<div class='uchains'>" + chain + "</div></div>" +
        "<div class='c-visual'><div class='artifact zoomable' style='--crop:" + Math.round((sc.crop || 0.4) * 100) + "%'><img src='" + img(sc.img) + "' onerror=\"this.parentElement.classList.add('failed')\"><span class='art-tag'>Usability test · PLP</span></div></div></div>";
    },

    "pdp-questions": function (sc) {
      // LEFT = heading + sub + shopper questions + signals.  RIGHT = 3 phones (label above, notes below) — same as the other evolution slides.
      var qs = sc.questions.map(function (q, i) { return "<span class='pq reveal' data-step='" + (i + 1) + "'>\u201C" + esc(q) + "\u201D</span>"; }).join("");
      var phone = function (title, media, tone, stepN, notes) {
        var nl = (notes || []).map(function (n) { return "<li>" + esc(n) + "</li>"; }).join("");
        return "<figure class='evo-col " + tone + "'>" +
          "<figcaption>" + title + "</figcaption>" +
          "<span class='evo-media zoomable' title='Click to enlarge'>" + media + "</span>" +
          (nl ? "<ul class='evo-notes reveal' data-step='" + stepN + "'>" + nl + "</ul>" : "") + "</figure>";
      };
      return "<div class='sl evo-slide'>" +
        "<div class='evo-left'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='pdpq-questions'>" + qs + "</div>" +
        "<div class='evo-signals reveal' data-step='3'>" + sig(sc.signal) + "</div></div>" +
        "<div class='evo-stage'>" +
        phone("Before", device(sc.before.img, sc.before.focus, "big"), "before", 1, sc.before.notes) +
        phone("V1 · DS 2.0", device(sc.v1.img, sc.v1.focus, "big"), "v1", 2, sc.v1.notes) +
        phone("V2 · Current", videoDevice(sc.v2.video, sc.v2.poster, "big"), "v2", 3, sc.v2.notes) +
        "</div></div>";
    },

    "pdp-scroll": function (sc) {
      var layers = sc.layers.map(function (l, i) { return "<div class='pl reveal' data-step='" + i + "'><span class='pl-tag'>" + esc(l.tag) + "</span><span class='pl-q'>" + esc(l.q) + "</span><span class='pl-d'>" + esc(l.d) + "</span></div>"; }).join("");
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        evidencePill(sc.evidence) +
        "<div class='pls'>" + layers + "</div>" +
        "<div class='evo-signals'>" + sig(sc.signal) + "</div></div>" +
        "<div class='c-visual'>" + device(sc.img, 0) + "</div></div>";
    },

    review: function (sc) {
      var pts = (sc.points || []).map(function (p, i) {
        return "<div class='rv-point reveal' data-step='" + (i + 1) + "'><b>" + esc(p.k) + "</b><span>" + esc(p.d) + "</span></div>";
      }).join("");
      var end = sc.points ? sc.points.length + 1 : 1;
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='rv-points'>" + pts + "</div>" +
        (sc.end ? "<p class='note reveal' data-step='" + end + "'>" + esc(sc.end) + "</p>" : "") + "</div>" +
        "<div class='c-visual'><figure class='rv-shot zoomable' title='Click to enlarge'>" +
        "<img src='" + img(sc.img) + "' onerror=\"this.parentElement.classList.add('failed')\">" +
        (sc.caption ? "<figcaption>" + esc(sc.caption) + "</figcaption>" : "") + "</figure></div></div>";
    },

    impact: function (sc) {
      var exp = sc.experience.map(function (e, i) { return "<li class='reveal' data-step='" + (i + 1) + "'><span class='chk'>\u2713</span>" + esc(e) + "</li>"; }).join("");
      var m = sc.metrics.map(function (x, i) {
        var down = /^[-\u2212]/.test(String(x.n));   // negative → reduction (still a win)
        return "<div class='metric reveal" + (i < 3 ? " hero" : "") + "' data-step='" + (2 + i) + "'>" +
          "<div class='mn" + (ph(x.n) ? " ph" : "") + (down ? " down" : "") + "'>" + esc(x.n) + "</div>" +
          "<div class='ml'>" + esc(x.l) + "</div></div>";
      }).join("");
      var last = 2 + sc.metrics.length;
      return "<div class='sl split impact-slide'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='tier-label'>Experience impact</div><ul class='exp-list'>" + exp + "</ul>" + evidencePill(sc.evidence) + "</div>" +
        "<div class='c-visual'><div class='tier-label reveal' data-step='2'>" + esc(sc.metricsLabel) + "</div>" +
        "<div class='metrics'>" + m + "</div>" +
        "<p class='disclaimer reveal' data-step='" + last + "'>" + esc(sc.disclaimer) + "</p></div></div>";
    },

    voice: function (sc) {
      var q = sc.quotes.map(function (x, i) {
        // color any run of ★/☆ stars gold
        var cap = esc(x.src).replace(/([\u2605\u2606]+)/g, "<span class='stars'>$1</span>");
        return "<figure class='vq reveal" + (ph(x.q) ? " ph" : "") + "' data-step='" + (i + 1) + "'><blockquote>\u201C" + esc(x.q) + "\u201D</blockquote><figcaption>" + cap + "</figcaption></figure>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + evidencePill(sc.evidence) + "</div>" +
        "<div class='vq-grid'>" + q + "</div><p class='note'>" + esc(sc.end) + "</p></div>";
    },

    recognition: function (sc) {
      var award = sc.award.pending
        ? "<div class='award ph'><span>🏆</span><span class='ph-note'>" + esc(sc.award.caption) + "</span></div>"
        : "<figure class='award'><span class='award-frame zoomable' title='Click to enlarge'><img src='" + img(sc.award.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></span>" +
          "<figcaption class='award-cap'>" + esc(sc.award.caption) + "</figcaption></figure>";
      var ctas = sc.cta.map(function (c) { return "<a class='btn " + (c.primary ? "primary" : "ghost") + "' href='" + c.href + "'>" + esc(c.label) + "</a>"; }).join("");
      return "<div class='sl split recognition'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='reflection'>" + sc.reflection.map(function (r, i) { return "<p class='reveal' data-step='" + (i === 2 ? 2 : 1) + "'>" + esc(r) + "</p>"; }).join("") + "</div>" +
        "<div class='close-cta reveal' data-step='2'>" + ctas + "</div></div>" +
        "<div class='c-visual'>" + award + "</div></div>";
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */
  function build(i) {
    var sc = slides[i];
    stepsOnSlide = stepsFor(sc);
    var el = document.createElement("section");
    el.className = "slide sec-" + sc.section + " type-" + sc.type;
    el.innerHTML = (T[sc.type] || T.opening)(sc);
    return el;
  }

  function focusImgs(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll(".ds img[data-focus]"), function (im) {
      var apply = function () {
        var s = im.closest(".ds"); if (!s) return;
        var vh = s.clientHeight, ih = im.offsetHeight;
        if (!ih) { requestAnimationFrame(apply); return; }
        var f = parseFloat(im.getAttribute("data-focus")) || 0;
        var shift = Math.min(Math.max(f * ih - vh / 2, 0), Math.max(0, ih - vh));
        im.style.transform = "translateY(" + -shift + "px)";
      };
      if (im.complete) apply(); else im.onload = apply;
    });
  }

  function applyStep() {
    if (!slideEl) return;
    var sc = slides[index];
    Array.prototype.forEach.call(slideEl.querySelectorAll(".reveal"), function (r) {
      var raw = r.getAttribute("data-step");
      var st = raw == null ? 1 : parseFloat(raw);
      if (isNaN(st)) st = 1;
      r.classList.toggle("in", step >= st);
    });
    if (sc.type === "pdp-scroll") {
      var im = slideEl.querySelector(".ds img");
      if (im && sc.layers[step]) setTimeout(function () { setFocus(im, sc.layers[step].focus); }, 0);
    }
    // play V2 video when its reveal is reached; pause otherwise
    var vids = slideEl.querySelectorAll("video");
    Array.prototype.forEach.call(vids, function (v) {
      var fig = v.closest(".reveal");
      var visible = !fig || fig.classList.contains("in");
      if (visible) { var p = v.play(); if (p && p.catch) p.catch(function () {}); }
      else v.pause();
    });
  }
  function setFocus(im, f) {
    var s = im.closest(".ds"); if (!s) return;
    var vh = s.clientHeight, ih = im.offsetHeight;
    if (!ih) return;
    var shift = Math.min(Math.max(f * ih - vh / 2, 0), Math.max(0, ih - vh));
    im.style.transform = "translateY(" + -shift + "px)";
  }

  var cur = null;
  function go(i) {
    if (i < 0 || i > TOTAL - 1) return;
    var old = cur;
    index = i; step = 0;
    var el = build(i);
    el.classList.add("enter");
    stage.appendChild(el);
    cur = el; slideEl = el;
    if (old) {
      var ov = old.querySelector("video"); if (ov) { try { ov.pause(); } catch (e) {} }
      old.classList.add("leave");
      setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 460);
    }
    requestAnimationFrame(function () {
      el.classList.remove("enter"); el.classList.add("active");
      focusImgs(el);
      wireEvidence(el, slides[i]);
      wireTiles(el);
      applyStep();
    });
    renderRail(slides[i].section);
    if (nowEl) nowEl.textContent = pad(i + 1);
    if (prevBtn) prevBtn.disabled = i === 0 && step === 0;
    if (nextBtn) nextBtn.disabled = i === TOTAL - 1 && step === stepsOnSlide;
  }
  function next() {
    if (evidenceOpen()) return;
    if (step < stepsOnSlide) { step++; applyStep(); return; }
    if (index < TOTAL - 1) go(index + 1);
  }
  function prev() {
    if (evidenceOpen()) return;
    if (step > 0) { step--; applyStep(); return; }
    if (index > 0) { go(index - 1); step = stepsOnSlide; applyStep(); }
  }

  /* ---------- evidence overlay ---------- */
  function wireEvidence(el, sc) {
    var pill = el.querySelector(".ev-pill");
    if (pill && sc.evidence) pill.addEventListener("click", function (e) { e.stopPropagation(); openEvidence(sc.evidence); });
  }
  function openEvidence(ev) {
    if (!panel) return;
    panel.querySelector(".ev-body").innerHTML =
      "<div class='ev-tag'>Real project artifact</div>" +
      "<div class='ev-method'>" + esc(ev.method) + "</div>" +
      "<div class='ev-img" + (ev.pending ? " pending" : "") + "' style='--crop:" + Math.round((ev.crop || 0.3) * 100) + "%'>" +
      "<img src='" + img(ev.img) + "' onerror=\"this.parentElement.classList.add('failed')\">" +
      (ev.pending ? "<span class='ev-pending'>Artifact image to be added</span>" : "") + "</div>" +
      "<div class='ev-block'><span class='ev-l'>What we observed</span>" + esc(ev.observed) + "</div>" +
      "<div class='ev-block'><span class='ev-l'>One takeaway</span>" + esc(ev.takeaway) + "</div>" +
      "<div class='ev-block impl'><span class='ev-l'>Design implication</span>" + esc(ev.implication) + "</div>";
    panel.classList.add("open");
  }
  function closeEvidence() { if (panel) panel.classList.remove("open"); }
  function evidenceOpen() { return panel && panel.classList.contains("open"); }
  if (panel) panel.addEventListener("click", function (e) {
    if (e.target.closest(".ev-close") || e.target.classList.contains("ev-backdrop")) closeEvidence();
    if (e.target.tagName === "IMG" && e.target.closest(".ev-img")) e.target.closest(".ev-img").classList.toggle("zoom");
  });

  /* ---------- centered image lightbox (middle-of-screen popup) ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  lb.innerHTML = "<div class='lb-backdrop'></div><figure class='lb-card'><button class='lb-close' aria-label='Close'>×</button><div class='lb-imgwrap'><img alt=''></div><figcaption class='lb-cap'></figcaption></figure>";
  document.body.appendChild(lb);
  function openLightbox(src, caption) {
    lb.querySelector("img").src = src;
    lb.querySelector(".lb-cap").textContent = caption || "";
    lb.classList.add("open");
  }
  function closeLightbox() { lb.classList.remove("open"); }
  function lightboxOpen() { return lb.classList.contains("open"); }
  lb.addEventListener("click", function (e) {
    if (e.target.closest(".lb-close") || e.target.classList.contains("lb-backdrop") || e.target.classList.contains("lb-imgwrap")) closeLightbox();
  });

  /* ---------- toolkit tiles → enlarge in centered popup ---------- */
  function wireTiles(el) {
    Array.prototype.forEach.call(el.querySelectorAll(".tile"), function (t) {
      t.addEventListener("click", function (e) {
        e.stopPropagation();
        openLightbox(t.getAttribute("data-img"), t.querySelector(".tile-t").textContent);
      });
    });
  }

  /* ---------- controls ---------- */
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);
  // section rail → jump to first slide of that section
  if (rail) rail.addEventListener("click", function (e) {
    var item = e.target.closest(".sr-item");
    if (!item) return;
    var idx = sectionStart(item.getAttribute("data-section"));
    if (idx >= 0) go(idx);
  });
  document.addEventListener("keydown", function (e) {
    if (lightboxOpen()) { if (e.key === "Escape") closeLightbox(); return; }
    if (evidenceOpen()) { if (e.key === "Escape") closeEvidence(); return; }
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(TOTAL - 1);
  });
  stage.addEventListener("click", function (e) {
    if (evidenceOpen() || lightboxOpen()) return;
    if (e.target.closest("a, button, video, .zoomable, .device, .tile")) return;
    var x = e.clientX / window.innerWidth;
    if (x < 0.24) prev(); else next();
  });
  // click artifact/matrix to zoom
  stage.addEventListener("click", function (e) {
    var rv = e.target.closest(".rv-shot");
    if (rv && rv.querySelector("img")) {
      var cap = rv.querySelector("figcaption");
      openLightbox(rv.querySelector("img").src, cap ? cap.textContent : "");
      return;
    }
    var z = e.target.closest(".zoomable");
    if (z) z.classList.toggle("zoom");
  });
  window.addEventListener("resize", function () { if (slideEl) focusImgs(slideEl); });

  /* ---------- theme ---------- */
  (function () {
    var t = document.getElementById("themeToggle");
    var saved; try { saved = localStorage.getItem("deckTheme"); } catch (e) {}
    document.body.setAttribute("data-theme", saved || "dark");
    if (t) t.addEventListener("click", function () {
      var nt = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", nt);
      try { localStorage.setItem("deckTheme", nt); } catch (e) {}
    });
  })();

  go(0);
})();
