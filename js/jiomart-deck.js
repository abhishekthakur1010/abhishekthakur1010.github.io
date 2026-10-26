/* ============================================================
   JioMart Discovery — interview deck engine
   Reads window.DECK. Scene + beat model, section navigator,
   BEFORE→V1→V2 evolution, decision rationale chain,
   evidence overlay, presenter notes (N).
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
  function esc(s) {
    return s == null ? "" : String(s).replace(/\{\{([^|}]+)\|([^}]+)\}\}/g, function (m, t, k) {
      return "<button type='button' class='ev-link' data-proof='" + k + "' title='See evidence'>" + t + "</button>";
    });
  }
  var PROOFS = D.proofs || {};
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
  // Saw → Learned → Bet → Built → Result (evidence → insight → hypothesis → decision → impact)
  function rationale(r) {
    if (!r) return "";
    var rows = [["Saw", r.evidence, "saw"], ["Learned", r.insight, "learned"], ["Bet", r.hypothesis, "bet"], ["Built", r.decision, "built"]];
    return "<div class='rat'>" + rows.map(function (x) {
      return x[1] ? "<div class='rat-row rat-" + x[2] + "'><span class='rat-k'>" + x[0] + "</span><span class='rat-v'>" + esc(x[1]) + "</span></div>" : "";
    }).join("") +
      (r.observed || r.metric ? "<div class='rat-row rat-measure'><span class='rat-k'>Result</span><span class='rat-v'>" +
        (r.observed ? "<b>" + esc(r.observed) + "</b>" : "") +
        (r.metric ? "<em>Goal metric · " + esc(r.metric) + "</em>" : "") + "</span></div>" : "") + "</div>";
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
      case "funnel": return sc.stages.length + 1;
      case "framing": return sc.lenses.length + 1;
      case "columns": return sc.cols.length;
      case "alternatives": return sc.rows.length;
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
      case "uxfunnel": return 1;
      case "discovery-funnel": return (sc.funnel ? sc.funnel.length : 0) + 1;
      case "opportunity": return (sc.objectives ? sc.objectives.length : 0) + 1;
      case "voice": return sc.quotes.length;
      case "recognition": return 2;
      case "transform": return 0;
      case "brief": return 2;
      case "journey": return sc.steps.length + 1;
      case "board": return sc.cards.length + (sc.foot ? 1 : 0);
      case "synthesis": return sc.rows.length + 1;
      case "oppmatrix": return sc.rows.length + 1;
      case "ideas": return sc.pairs.length;
      case "decisions": return sc.rows.length;
      case "showcase": return sc.pairs.length;
      case "kpis": return sc.groups.length + 1;
      case "close": return 2;
      case "qa": return sc.qs.length + 1;
      case "contextinfo": return sc.flow.length + 1;
      default: return 0;
    }
  }

  /* ============================================================
     TEMPLATES
     ============================================================ */
  var T = {
    opening: function (sc) {
      // headline can be a plain array, or use `highlight` to lift one word to full contrast
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
        (sc.cta ? "<div class='cta-hint'>" + esc(sc.cta) + "</div>" : "") + "</div>" +
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

    funnel: function (sc) {
      // discovery funnel: measured bars solid, illustrative bars dashed + tagged
      var max = sc.stages[0].v || 100;
      var rows = sc.stages.map(function (st, i) {
        var drop = st.drop ? "<div class='fn-drop reveal' data-step='" + (i + 1) + "'>" +
          "<span class='fn-pct'>" + (sc.stages[i - 1] ? "−" + Math.round((1 - st.v / sc.stages[i - 1].v) * 100) + "%" : "") + "</span>" +
          "<span class='fn-q'>“" + esc(st.drop.q) + "”</span><span class='fn-c'>" + esc(st.drop.c) + "</span></div>" : "";
        return drop + "<div class='fn-row reveal' data-step='" + (i + 1) + "'>" +
          "<div class='fn-stage'><b>" + esc(st.k) + "</b><span>" + esc(st.s) + "</span></div>" +
          "<div class='fn-track'><div class='fn-bar " + (st.illus ? "illus" : "measured") + "' style='--w:" + Math.max(st.v / max * 100, 3) + "%'></div>" +
          "<span class='fn-val'>" + esc(st.label || st.v) + (st.illus ? "<i>illustrative</i>" : "") + "</span></div></div>";
      }).join("");
      var last = sc.stages.length + 1;
      var cmp = (sc.compare || []).map(function (c, i) {
        return "<div class='fn-cmp-i" + (i === 0 ? " hi" : "") + "'><b>" + esc(c.n) + "</b><span>" + esc(c.l) + "</span></div>";
      }).join("<span class='fn-vs'>vs</span>");
      return "<div class='sl split funnel-slide'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='fn-insight reveal' data-step='" + last + "'><div class='fn-cmp'>" + cmp + "</div>" +
        "<p class='fn-read'>" + esc(sc.read) + "</p></div>" +
        (sc.source ? "<p class='disclaimer'>" + esc(sc.source) + "</p>" : "") + "</div>" +
        "<div class='c-visual'><div class='fn'>" + rows + "</div>" +
        "<div class='fn-legend'><span><i class='sw measured'></i>" + esc(sc.legend.measured) + "</span><span><i class='sw illus'></i>" + esc(sc.legend.illus) + "</span>" +
        (sc.legend.drop ? "<span><i class='sw drop'></i>" + esc(sc.legend.drop) + "</span>" : "") + "</div></div></div>";
    },

    framing: function (sc) {
      var cards = sc.lenses.map(function (l, i) {
        return "<div class='fr-card tone-" + l.tone + " reveal' data-step='" + (i + 1) + "'><span class='fr-k'>" + esc(l.k) + "</span>" +
          "<b class='fr-t'>" + esc(l.t) + "</b><p class='fr-d'>" + esc(l.d) + "</p></div>";
      }).join("");
      var last = sc.lenses.length + 1;
      var why = (sc.why || []).map(function (w) { return "<li>" + esc(w) + "</li>"; }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        "<div class='fr-grid'>" + cards + "</div>" +
        "<div class='fr-foot reveal' data-step='" + last + "'><div class='fr-why'><span class='tier-label'>Why it was worth solving</span><ul>" + why + "</ul></div>" +
        "<blockquote class='fr-hmw'><span class='tier-label'>How might we</span>" + esc(sc.hmw) + "</blockquote></div></div>";
    },

    columns: function (sc) {
      var cols = sc.cols.map(function (c, i) {
        return "<div class='col-card tone-" + (c.tone || "neutral") + " reveal' data-step='" + (i + 1) + "'><span class='col-k'>" + esc(c.k) + "</span><ul>" +
          c.items.map(function (it) { return "<li>" + esc(it) + "</li>"; }).join("") + "</ul></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        "<div class='col-grid'>" + cols + "</div></div>";
    },

    alternatives: function (sc) {
      var head = "<div class='alt-row alt-head'><span>Surface</span><span>Considered</span><span>Chose</span><span>Why</span></div>";
      var rows = sc.rows.map(function (r, i) {
        return "<div class='alt-row reveal' data-step='" + (i + 1) + "'><b class='alt-s'>" + esc(r.s) + "</b>" +
          "<span class='alt-no'>" + esc(r.no) + "</span><span class='alt-yes'>" + esc(r.yes) + "</span><span class='alt-why'>" + esc(r.why) + "</span></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        "<div class='alt-table'>" + head + rows + "</div></div>";
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
        rationale(sc.rationale) +
        evidencePill(sc.evidence) +
        (sc.punch ? "<div class='punch reveal' data-step='3'>" + esc(sc.punch) + "</div>" : "") +
        (sc.flowLine ? "<div class='flow-line'>" + esc(sc.flowLine) + "</div>" : "") +
        (sc.rationale ? "" : "<div class='evo-signals reveal' data-step='3'>" + sig(sc.signal) + "</div>") + "</div>" +
        "<div class='evo-stage'>" +
        phone("Before", sc.before, 1, "before") +
        phone("V1 · DS 2.0", sc.v1, 2, "v1") +
        phone("V2 · Current", sc.v2, 3, "v2") +
        "</div></div>";
    },

    usability: function (sc) {
      var stats = (sc.stats || []).map(function (s) { return "<div class='ustat'><div class='un'>" + esc(s.n) + "</div><div class='ul'>" + esc(s.l) + "</div></div>"; }).join("");
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
        "<div class='pdpq-questions" + (sc.rationale ? " compact" : "") + "'>" + qs + "</div>" +
        rationale(sc.rationale) +
        (sc.rationale ? "" : "<div class='evo-signals reveal' data-step='3'>" + sig(sc.signal) + "</div>") + "</div>" +
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

    uxfunnel: function (sc) {
      // evidence slide: real pre/post improvement table as a zoomable artifact
      return "<div class='sl split uxcompare-slide'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<ul class='uxf-takeaways'>" + (sc.takeaways || []).map(function (t) { return "<li>" + esc(t) + "</li>"; }).join("") + "</ul>" +
        evidencePill(sc.evidence) + "</div>" +
        "<div class='c-visual'><div class='uxc-head-label'>" + esc(sc.tableLabel) + "</div>" +
        "<figure class='uxc-artifact zoomable' title='Click to enlarge'><img src='" + img(sc.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></figure>" +
        (sc.disclaimer ? "<p class='disclaimer'>" + esc(sc.disclaimer) + "</p>" : "") + "</div></div>";
    },

    /* ---- data-driven discovery funnel (where were we losing shoppers) ---- */
    "discovery-funnel": function (sc) {
      var maxN = sc.funnel[0].n;
      var bars = sc.funnel.map(function (f, i) {
        var w = Math.max(6, Math.round((f.n / maxN) * 100));
        var drop = f.drop != null
          ? "<span class='df-drop'><b>\u2212" + f.drop + "%</b> drop-off</span>" : "";
        return "<div class='df-row reveal' data-step='" + (i + 1) + "'>" +
          "<div class='df-stage'>" + esc(f.stage) + "</div>" +
          "<div class='df-barwrap'>" +
          "<div class='df-bar' style='--w:" + w + "%'>" +
          "<span class='df-count'>" + esc(f.label) + "</span></div>" +
          "<span class='df-pct'>" + f.pct + "%</span></div>" +
          drop + "</div>";
      }).join("");
      var hyps = (sc.hypotheses || []).map(function (h) {
        return "<div class='df-hyp'><div class='df-hyp-top'><span class='df-hyp-stage'>" + esc(h.stage) +
          "</span><span class='df-hyp-drop'>\u2212" + h.drop + "%</span></div>" +
          "<div class='df-hyp-q'>" + esc(h.hypothesis) + "</div></div>";
      }).join("");
      return "<div class='sl discovery-funnel-slide'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        "<div class='df-grid'>" +
        "<div class='df-funnel'>" + bars +
        "<div class='df-key reveal' data-step='" + (sc.funnel.length + 1) + "'>" + esc(sc.key) + "</div>" +
        (sc.disclaimer ? "<p class='disclaimer'>" + esc(sc.disclaimer) + "</p>" : "") + "</div>" +
        "<div class='df-hyps'><div class='df-hyps-label'>Where users left \u2192 what might be wrong</div>" + hyps +
        "<p class='df-caveat'>Funnel analytics show <b>where</b> users leave, not <b>why</b>. These are hypotheses, not confirmed findings.</p></div>" +
        "</div></div>";
    },

    /* ---- opportunity: HMW + scannable objective cards (number-led) ---- */
    opportunity: function (sc) {
      var objs = (sc.objectives || []).map(function (o, i) {
        return "<div class='op-card reveal' data-step='" + (i + 1) + "'>" +
          "<div class='op-head'>" +
          "<span class='op-drop'>\u2212" + o.drop + "%</span>" +
          "<span class='op-stage'>" + esc(o.stage) + "</span>" +
          "</div>" +
          "<div class='op-hyp'>" + esc(o.hypothesis) + "</div>" +
          "<div class='op-fix'><span class='op-l'>Fix</span>" + esc(o.decision) + "</div>" +
          "<div class='op-measure'><span class='op-l'>Measure</span>" + esc(o.metric) + "</div>" +
          "</div>";
      }).join("");
      var rows = (sc.metricsTable || []).map(function (m) {
        return "<span class='opt-chip'><b>" + esc(m.metric) + "</b>" +
          "<span class='opt-move'>" + esc(m.base) + " <i>\u2192</i> <em>" + esc(m.target) + "</em></span></span>";
      }).join("");
      var table = rows ? "<div class='op-strip reveal' data-step='" + ((sc.objectives||[]).length + 1) + "'>" +
        "<span class='op-strip-label'>" + esc(sc.tableLabel || "Targets") + "</span>" + rows + "</div>" +
        (sc.tableNote ? "<p class='disclaimer op-note'>" + esc(sc.tableNote) + "</p>" : "") : "";
      return "<div class='sl opportunity-slide'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        L(sc.headline, "h2") +
        (sc.hmw ? "<p class='op-hmw'>\u201C" + esc(sc.hmw) + "\u201D</p>" : "") + "</div>" +
        "<div class='op-cards'>" + objs + "</div>" + table + "</div>";
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
          "<figcaption class='award-cap'>" + (sc.award.title ? "<span class='award-title'>" + esc(sc.award.title) + "</span>" : "") + esc(sc.award.caption) + "</figcaption></figure>";
      var ctas = sc.cta.map(function (c) { return "<a class='btn " + (c.primary ? "primary" : "ghost") + "' href='" + c.href + "'>" + esc(c.label) + "</a>"; }).join("");
      return "<div class='sl split recognition'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) +
        "<div class='reflection'>" + sc.reflection.map(function (r, i) { return "<p class='reveal' data-step='" + (i === 2 ? 2 : 1) + "'>" + esc(r) + "</p>"; }).join("") + "</div>" +
        "<div class='close-cta reveal' data-step='2'>" + ctas + "</div></div>" +
        "<div class='c-visual'>" + award + "</div></div>";
    },

    /* ============================================================
       Interview deck v3 templates — evidence-tagged storytelling
       ============================================================ */

    /* 01 · authentic before → after with the two measured KPIs */
    transform: function (sc) {
      var kpis = sc.kpis.map(function (k) {
        return "<div class='tf-kpi'><span class='tf-k'>" + esc(k.k) + "</span>" +
          "<span class='tf-v'>" + esc(k.from) + "<i>→</i><b>" + esc(k.to) + "</b></span>" +
          "<span class='tf-d'>" + esc(k.d) + "</span></div>";
      }).join("");
      var meta = "<div class='op-meta'>" + sc.meta.map(function (m) {
        return "<div><span class='ml'>" + esc(m.l) + "</span><span class='mv'>" + esc(m.v) + "</span></div>";
      }).join("") + "</div>";
      var phone = function (o, tone) {
        return "<figure class='tf-col " + tone + "'><figcaption>" + esc(o.label) + "</figcaption>" +
          "<span class='evo-media zoomable' title='Click to enlarge'>" + device(o.img, 0, "big") + "</span></figure>";
      };
      return "<div class='sl transform'><div class='tf-top'>" +
        "<div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline) +
        "<p class='body'>" + esc(sc.body) + "</p>" +
        "<div class='tf-kpis'>" + kpis + "</div>" +
        "<p class='disclaimer'>" + esc(sc.caveat) + "</p></div>" +
        "<div class='tf-stage'>" + phone(sc.before, "before") + "<span class='tf-arrow'>→</span>" + phone(sc.after, "v1") + "</div>" +
        "</div>" + meta + "</div>";
    },

    /* 02 · original brief vs reframed question + context facts */
    brief: function (sc) {
      var card = function (o, tone, st) {
        return "<div class='bf-card tone-" + tone + " reveal' data-step='" + st + "'><span class='col-k'>" + esc(o.k) + "</span>" +
          "<p class='bf-t'>" + esc(o.t) + "</p><span class='src'>" + esc(o.src) + "</span></div>";
      };
      var facts = sc.facts.map(function (f) {
        return "<div class='bf-fact'><span class='ml'>" + esc(f.k) + "</span><span class='mv'>" + esc(f.v) + "</span></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" +
        "<div class='bf-pair'>" + card(sc.asked, "neutral", 0) + "<span class='bf-arrow'>→</span>" + card(sc.investigated, "info", 1) + "</div>" +
        "<div class='bf-facts reveal' data-step='2'>" + facts + "</div></div>";
    },

    /* 03 · discovery journey with source-tagged friction */
    journey: function (sc) {
      var cols = sc.steps.map(function (s, i) {
        var iss = s.issues.map(function (x) {
          return "<li>" + (x.tag ? "<span class='tag " + tagTone(x.tag) + "'>" + esc(x.tag) + "</span>" : "") + esc(x.t) + "</li>";
        }).join("");
        var stat = s.stat ? "<div class='jr-stat'><b>" + esc(s.stat) + "</b>" + (s.est ? "<i>est.</i>" : "") + "<span>" + esc(s.statL || "") + "</span></div>" : "";
        return "<div class='jr-step reveal' data-step='" + (i + 1) + "'><div class='jr-node'><span>" + pad(i + 1) + "</span>" + esc(s.k) + "</div>" + stat + "<ul>" + iss + "</ul></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" +
        "<div class='jr'>" + cols + "</div>" +
        "<p class='note reveal' data-step='" + (sc.steps.length + 1) + "'>" + esc(sc.foot) + "</p></div>";
    },

    /* 04 / 10 · evidence board: question · learned · still uncertain */
    board: function (sc) {
      var cards = sc.cards.map(function (c, i) {
        return "<div class='bd-card reveal' data-step='" + (i + 1) + "'>" +
          "<span class='bd-img zoomable' title='Click to enlarge'><img src='" + img(c.img) + "'" + (c.pos ? " style='object-position:" + c.pos + "'" : "") + " onerror=\"this.parentElement.classList.add('failed')\"></span>" +
          "<div class='bd-body'><div class='bd-top'><b>" + esc(c.k) + "</b>" + (c.tag ? "<span class='tag " + tagTone(c.tag) + "'>" + esc(c.tag) + "</span>" : "") + "</div>" +
          (c.stat ? "<div class='bd-stat'><b>" + esc(c.stat) + "</b>" + (c.est ? "<i>est.</i>" : "") + "</div>" : "") +
          (c.q ? "<p class='bd-q'>" + esc(c.q) + "</p>" : "") +
          "<p class='bd-l'>" + esc(c.learned) + "</p>" +
          (c.gap ? "<p class='bd-gap'><span>Uncertain</span>" + esc(c.gap) + "</p>" : "") + "</div></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" +
        "<div class='bd-grid'>" + cards + "</div>" +
        (sc.foot ? "<p class='note reveal' data-step='" + (sc.cards.length + 1) + "'>" + esc(sc.foot) + "</p>" : "") + "</div>";
    },

    /* 05 · symptom → evidence → cause → problem statement */
    synthesis: function (sc) {
      var head = "<div class='sy-row sy-head'><span></span>" + sc.cols.map(function (c) { return "<span>" + esc(c) + "</span>"; }).join("") + "</div>";
      var rows = sc.rows.map(function (r, i) {
        return "<div class='sy-row reveal' data-step='" + (i + 1) + "'><b class='sy-theme'>" + esc(r.theme) + "</b>" +
          "<span class='sy-sym'>" + esc(r.symptom) + "</span>" + (r.evidence ? "<span class='sy-ev'>" + esc(r.evidence) + "</span>" : "") + "<span class='sy-cause'>" + esc(r.cause) + "</span></div>";
      }).join("");
      var last = sc.rows.length + 1;
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" +
        "<div class='sy-table" + (sc.cols.length === 2 ? " two" : "") + "'>" + head + rows + "</div>" +
        (sc.from ? "<div class='sy-from reveal' data-step='" + last + "'><span class='sy-was'>" + esc(sc.from) + "</span><span class='sy-arrow'>→</span><span class='sy-now'>" + esc(sc.to || "") + "</span></div>" : "") +
        "<blockquote class='sy-statement reveal' data-step='" + last + "'><span class='tier-label'>Refined problem</span>" + esc(sc.statement) +
        (sc.goals ? "<span class='sy-goals'>" + sc.goals.map(function (g) { return "<span class='sy-goal'><b>" + esc(g.k) + "</b>" + esc(g.v) + "</span>"; }).join("") + "</span>" : "") +
        (sc.status ? "<span class='sy-status'><span class='tag warn'>Hypothesis</span>" + esc(sc.status) + "</span>" : "") + "</blockquote></div>";
    },

    /* 06 · need → lever → metric, with the real prioritisation artifact */
    oppmatrix: function (sc) {
      var hd = sc.heads || ["Shopper need", "Design lever", "Success metric"];
      var head = "<div class='om-row om-head'><span>" + esc(hd[0]) + "</span><span>" + esc(hd[1]) + "</span><span>" + esc(hd[2]) + "</span></div>";
      var rows = sc.rows.map(function (r, i) {
        var tone = /^(Primary|Target|High)/.test(r.tier) ? "pos" : /^(Supporting|Medium)/.test(r.tier) ? "info" : "neutral";
        return "<div class='om-row reveal' data-step='" + (i + 1) + "'><b>" + esc(r.need) + "</b><span>" + esc(r.lever) + "</span>" +
          "<span class='om-metric'>" + esc(r.metric) + "<span class='tag " + tone + "'>" + esc(r.tier) + "</span></span></div>";
      }).join("");
      var p = sc.prioritise;
      var pts = p.points.map(function (x) { return "<li>" + esc(x) + "</li>"; }).join("");
      return "<div class='sl split om-slide'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") +
        "<div class='om-table'>" + head + rows + "</div></div>" +
        "<div class='c-visual reveal' data-step='" + (sc.rows.length + 1) + "'><figure class='rv-shot zoomable' title='Click to enlarge'><img src='" + img(p.img) + "' onerror=\"this.parentElement.classList.add('failed')\"><figcaption>" + esc(p.cap) + "</figcaption></figure>" +
        "<ul class='om-points'>" + pts + "</ul></div></div>";
    },

    /* 07 · benchmark observation → design bet, with real artifacts */
    ideas: function (sc) {
      var pairs = sc.pairs.map(function (p, i) {
        var pl = sc.pairLabels || ["Saw", "Bet"];
        return "<div class='id-pair reveal' data-step='" + (i + 1) + "'><p class='id-saw'><span class='tag neutral'>" + esc(pl[0]) + "</span>" + esc(p.saw) + "</p>" +
          "<p class='id-bet'><span class='tag info'>" + esc(pl[1]) + "</span>" + esc(p.bet) + "</p></div>";
      }).join("");
      var tiles = sc.tiles.map(function (t) {
        return "<button class='tile' data-img='" + img(t.img) + "'><span class='tile-img' style='--crop:20%'><img src='" + img(t.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></span>" +
          "<span class='tile-t'>" + esc(t.t) + "</span></button>";
      }).join("");
      return "<div class='sl split'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") +
        "<div class='id-pairs'>" + pairs + "</div></div>" +
        "<div class='c-visual'><div class='tile-grid id-tiles'>" + tiles + "</div></div></div>";
    },

    /* 08 · evidence → choice → value → trade-off */
    decisions: function (sc) {
      var cmp = !!sc.compact;
      var head = cmp ? "<div class='dc-row dc-head'><span></span><span>We chose</span><span>Because</span><span>Trade-off</span></div>"
        : "<div class='dc-row dc-head'><span></span><span>Evidence</span><span>Design choice</span><span>Shopper value</span><span>Trade-off</span></div>";
      var rows = sc.rows.map(function (r, i) {
        return "<div class='dc-row reveal' data-step='" + (i + 1) + "'>" +
          "<div class='dc-s'><span class='dc-thumb zoomable' title='Click to enlarge'><img src='" + img(r.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></span><b>" + esc(r.s) + "</b></div>" +
          (cmp ? "<span class='dc-ch'>" + esc(r.choice) + "</span><span class='dc-ev'>" + esc(r.ev) + "</span>"
            : "<span class='dc-ev'>" + esc(r.ev) + "</span><span class='dc-ch'>" + esc(r.choice) + "</span><span class='dc-val'>" + esc(r.value) + "</span>") +
          "<span class='dc-tr'>" + esc(r.trade) + "</span></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" +
        "<div class='dc-table" + (cmp ? " compact" : "") + "'>" + head + rows + "</div></div>";
    },

    /* 09 · three before/after pairs of the shipped DS 2.0 screens */
    showcase: function (sc) {
      var pairs = sc.pairs.map(function (p, i) {
        return "<div class='sc-pair reveal' data-step='" + (i + 1) + "'><div class='sc-k'>" + esc(p.k) + "</div>" +
          "<div class='sc-phones'><figure class='before'><figcaption>" + esc((sc.labels || [])[0] || "Before") + "</figcaption><span class='evo-media zoomable'>" + device(p.before, 0, "sc") + "</span></figure>" +
          "<figure class='v1'><figcaption>" + esc((sc.labels || [])[1] || "After") + "</figcaption><span class='evo-media zoomable'>" + device(p.after, 0, "sc") + "</span></figure></div>" +
          "<p class='sc-note'>" + esc(p.note) + "</p></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head sc-head'><div><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" + evidencePill(sc.evidence) + "</div>" +
        "<div class='sc-grid'>" + pairs + "</div>" +
        (sc.chips ? "<div class='sc-chips'>" + sc.chips.map(function (c) { return "<span class='sc-chip'><b>" + esc(c.k) + "</b>" + esc(c.v) + "</span>"; }).join("") + "</div>" : "") + "</div>";
    },

    /* 11 · accurately scaled pre/post bars, grouped */
    kpis: function (sc) {
      var fmt = function (v, r) {
        if (r.fmt === "ms") { var m = Math.floor(v / 60), s = Math.round(v % 60); return m + "m " + (s < 10 ? "0" : "") + s + "s"; }
        return (r.unit === "%" ? v.toFixed(2) : String(v)) + (r.unit === "s" ? "s" : r.unit);
      };
      var groups = sc.groups.map(function (g, gi) {
        var rows = g.rows.map(function (r) {
          var max = Math.max(r.pre, r.post);
          return "<div class='kp-row'><span class='kp-l'>" + esc(r.l) + "</span>" +
            "<div class='kp-bars'><div class='kp-bar pre' style='--w:" + (r.pre / max * 100).toFixed(1) + "%'><span>" + fmt(r.pre, r) + "</span></div>" +
            "<div class='kp-bar post' style='--w:" + (r.post / max * 100).toFixed(1) + "%'><span>" + fmt(r.post, r) + "</span></div></div>" +
            "<span class='kp-d'><b>" + esc(r.d) + "</b>" + (r.rel ? "<i>" + esc(r.rel) + " relative</i>" : (r.lowerBetter ? "<i>lower is better</i>" : "")) + "</span></div>";
        }).join("");
        return "<div class='kp-group reveal' data-step='" + (gi + 1) + "'><div class='tier-label'>" + esc(g.k) + "</div>" + rows + "</div>";
      }).join("");
      var last = sc.groups.length + 1;
      return "<div class='sl'><div class='sl-head kp-headrow'><div><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + "</div>" +
        "<div class='kp-legend'><span><i class='sw pre'></i>Before</span><span><i class='sw post'></i>After</span></div></div>" +
        (sc.checks ? "<div class='kp-checks'>" + sc.checks.map(function (c) { return "<span class='kp-check'><b>" + esc(c.n) + "</b>" + (c.est ? "<i>est.</i>" : "") + "<span>" + esc(c.l) + "</span></span>"; }).join("") + "</div>" : "") +
        "<div class='kp-grid'>" + groups + "</div>" +
        "<div class='kp-foot reveal' data-step='" + last + "'><p class='disclaimer'>" + esc(sc.disclaimer) + "</p>" + (sc.context ? "<p class='disclaimer'>" + esc(sc.context) + "</p>" : "") + "</div></div>";
    },

    /* business context as an infographic: who → ask → north star, then ground reality */
    contextinfo: function (sc) {
      var ic = {
        people: "<path d='M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2'/><circle cx='9' cy='7' r='4'/><path d='M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75'/>",
        brief: "<path d='M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z'/><path d='M14 2v6h6M16 13H8M16 17H8M10 9H8'/>",
        star: "<polygon points='12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2'/>",
        cart: "<circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/><path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/>"
      };
      var svg = function (k) { return "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'>" + (ic[k] || "") + "</svg>"; };
      var flow = sc.flow.map(function (f, i) {
        return (i ? "<span class='ci-arrow reveal' data-step='" + (i + 1) + "'>→</span>" : "") +
          "<div class='ci-step tone-" + (f.tone || "neutral") + " reveal' data-step='" + (i + 1) + "'><span class='ci-ic'>" + svg(f.icon) + "</span>" +
          "<span class='ci-k'>" + esc(f.k) + "</span><p class='ci-t'>" + esc(f.t) + "</p>" +
          (f.pts ? "<ul class='ci-pts'>" + f.pts.map(function (x) { return "<li><b>" + esc(x[0]) + "</b>" + esc(x[1]) + "</li>"; }).join("") + "</ul>" : "") + "</div>";
      }).join("");
      var r = sc.reality || { dots: 0 }, dots = "";
      for (var d = 0; d < r.dots; d++) dots += "<span class='ci-dot" + (d < r.hit ? " hit" : "") + "'>" + svg("cart") + "</span>";
      var stats = (sc.stats || []).map(function (x) { return "<div class='ci-stat'><b>" + esc(x.n) + "</b><span>" + esc(x.l) + "</span></div>"; }).join("");
      var bounds = (sc.bounds || []).map(function (x) { return "<span class='sc-chip'><b>" + esc(x.k) + "</b>" + esc(x.v) + "</span>"; }).join("");
      var last = sc.flow.length + 1;
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        (sc.define ? "<div class='ci-define'><span class='ci-def-k'>" + esc(sc.define.k) + "</span><div class='ci-path'>" +
          sc.define.steps.map(function (st, i) { return (i ? "<span class='ci-path-arrow'>→</span>" : "") + "<span class='ci-path-step" + (i === sc.define.steps.length - 1 ? " end" : "") + "'>" + esc(st) + "</span>"; }).join("") +
          "</div>" + (sc.define.note ? "<span class='ci-def-note'>" + esc(sc.define.note) + "</span>" : "") +
          (sc.define.shots ? "<button type='button' class='ci-chev' aria-label='Show before screens' title='Before screens' onclick=\"this.closest('.ci-define').classList.toggle('open')\">" +
            "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg></button>" +
            "<div class='ci-drop'><div class='ci-drop-head'><span class='tier-label'>Before the redesign</span><span class='ci-drop-hint'>Click a screen to view it in full</span></div><div class='ci-drop-grid'>" +
            sc.define.shots.map(function (sh, i) {
              return "<button type='button' class='ci-shot' data-shot='" + i + "'><span class='ci-shot-k'>" + pad(i + 1) + " · " + esc(sh.k) + "</span>" +
                "<span class='ci-shot-media'>" + device(sh.img, 0, "sc") + "<span class='ci-shot-zoom'>View full screen</span></span>" +
                (sh.pain ? "<span class='ci-pain'>" + esc(sh.pain) + "</span>" : "") + "</button>";
            }).join("") + "</div></div>" : "") + "</div>" : "") +
        "<div class='ci-flow'>" + flow + "</div>" +
        (sc.paths ? pathsViz(sc, last) : "<div class='ci-reality reveal' data-step='" + last + "'><span class='tier-label'>Ground reality</span>" +
        "<div class='ci-row'><div class='ci-big'><b>" + esc(r.big) + "</b><span>" + esc(r.l) + "</span><div class='ci-dots'>" + dots + "</div></div>" +
        "<div class='ci-stats'>" + stats + "</div></div>" +
        (sc.bounds ? "<div class='ci-bounds'>" + bounds + "</div>" : "") + "</div>") + "</div>";
    },

    /* questions we asked of the brief → what we agreed */
    qa: function (sc) {
      var cards = sc.qs.map(function (x, i) {
        return "<div class='qa-card reveal' data-step='" + (i + 1) + "'><div class='qa-top'><span class='qa-n'>" + pad(i + 1) + "</span>" +
          (x.tag ? "<span class='tag " + ({ Business: "info", Shopper: "pos", Scope: "neutral" }[x.tag] || "neutral") + "'>" + esc(x.tag) + "</span>" : "") + "</div>" +
          "<p class='qa-q'>" + esc(x.q) + "</p><p class='qa-a'>" + esc(x.a) + "</p></div>";
      }).join("");
      return "<div class='sl'><div class='sl-head'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") + sub(sc.sub) + "</div>" +
        "<div class='qa-grid'>" + cards + "</div>" +
        pathsViz(sc, sc.qs.length + 1) +
        (sc.from ? "<div class='qa-shift reveal' data-step='" + (sc.qs.length + 1) + "'><div class='qa-was'><span class='tier-label'>" + esc(sc.fromL || "The brief") + "</span><span class='qa-strike'>" + esc(sc.from) + "</span></div>" +
          "<span class='qa-arrow'>→</span><div class='qa-now'><span class='tier-label'>" + esc(sc.toL || "What it became") + "</span>" + esc(sc.to) + "</div></div>" : "") +
        (sc.foot ? "<p class='qa-foot reveal' data-step='" + (sc.qs.length + 1) + "'>" + esc(sc.foot) + "</p>" : "") + "</div>";
    },

    /* 12 · contribution, learning, next time + award */
    close: function (sc) {
      var blocks = sc.blocks.map(function (b, i) {
        return "<div class='cl-block reveal' data-step='" + (i < 2 ? 0 : 1) + "'><span class='col-k'>" + esc(b.k) + "</span><p>" + esc(b.d) + "</p></div>";
      }).join("");
      var ctas = sc.cta.map(function (c) { return "<a class='btn " + (c.primary ? "primary" : "ghost") + "' href='" + c.href + "'>" + esc(c.label) + "</a>"; }).join("");
      return "<div class='sl split recognition'><div class='c-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" + L(sc.headline, "h2") +
        "<div class='cl-grid'>" + blocks + "</div>" +
        "<div class='close-cta reveal' data-step='2'>" + ctas + "</div></div>" +
        "<div class='c-visual'><figure class='award'><span class='award-frame zoomable' title='Click to enlarge'><img src='" + img(sc.award.img) + "' onerror=\"this.parentElement.classList.add('failed')\"></span>" +
        "<figcaption class='award-cap'>" + esc(sc.award.caption) + "</figcaption></figure></div></div>";
    }
  };

  function pathsViz(sc, stepN) {
    if (!sc.paths) return "";
    return (function () {
          var cart = "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'><circle cx='9' cy='21' r='1'/><circle cx='20' cy='21' r='1'/><path d='M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6'/></svg>";
          var rows = sc.paths.rows.map(function (r) {
            var d = ""; for (var k = 0; k < 10; k++) d += "<span class='ci-dot" + (k < r.lit ? " hit" : "") + "'>" + cart + "</span>";
            return "<div class='pv-row " + (r.tone || "") + "'><div class='pv-k'><b>" + esc(r.k) + "</b><span>" + esc(r.flow) + "</span></div>" +
              "<div class='pv-dots'>" + d + "</div><div class='pv-v'><b>" + esc(r.v) + "</b><span>" + esc(r.l) + "</span></div></div>";
          }).join("");
          return "<div class='pv reveal' data-step='" + stepN + "'><div class='pv-rows'>" + rows + "</div>" +
            "<div class='pv-big'><b>" + esc(sc.paths.big) + "</b><span>" + esc(sc.paths.bigL) + "</span></div></div>";
    })();
  }

  // evidence-source tag → semantic tone
  function tagTone(t) {
    return ({ Measured: "pos", Test: "pos", Research: "info", Audit: "warn", Observed: "warn",
      Benchmark: "neutral", Review: "neutral", Iteration: "info", Hypothesis: "warn", Validated: "pos", Assumption: "warn", Input: "info" })[t] || "neutral";
  }

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
    renderNotes();
    // keep the slide in the URL so a reload (or a shared link) lands on it
    try { history.replaceState(null, "", "#" + (i + 1)); } catch (e) {}
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
    var calc = ev.calc ? "<div class='ev-calc'>" + ev.calc.map(function (r) {
      return "<div class='ev-calc-row" + (r[2] ? " hi" : "") + "'><span>" + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>";
    }).join("") + "</div>" : "";
    panel.querySelector(".ev-body").innerHTML =
      "<div class='ev-tag" + (ev.est ? " est" : "") + "'>" + esc(ev.tag || (ev.est ? "Estimate" : "Real project artifact")) + "</div>" +
      "<div class='ev-method'>" + esc(ev.method) + "</div>" +
      (ev.img ? "<div class='ev-img" + (ev.pending ? " pending" : "") + "' style='--crop:" + Math.round((ev.crop || 0.3) * 100) + "%'>" +
        "<span class='ev-imgbox'><img src='" + img(ev.img) + "' onerror=\"this.closest('.ev-img').classList.add('failed')\">" +
        (ev.hl ? ev.hl.map(function (r) {
          return "<span class='ev-hl' style='top:" + (r[0] / ev.hlH * 100).toFixed(2) + "%;height:" + ((r[1] - r[0]) / ev.hlH * 100).toFixed(2) + "%'></span>";
        }).join("") : "") + "</span>" +
        (ev.pending ? "<span class='ev-pending'>Artifact image to be added</span>" : "") + "</div>" : "") +
      calc +
      (ev.observed ? "<div class='ev-block'><span class='ev-l'>" + esc(ev.observedL || "What we observed") + "</span>" + esc(ev.observed) + "</div>" : "") +
      (ev.takeaway ? "<div class='ev-block'><span class='ev-l'>" + esc(ev.takeawayL || "One takeaway") + "</span>" + esc(ev.takeaway) + "</div>" : "") +
      (ev.implication ? "<div class='ev-block impl'><span class='ev-l'>" + esc(ev.implicationL || "Design implication") + "</span>" + esc(ev.implication) + "</div>" : "");
    panel.classList.add("open");
  }
  function closeEvidence() { if (panel) panel.classList.remove("open"); }
  function evidenceOpen() { return panel && panel.classList.contains("open"); }
  if (panel) panel.addEventListener("click", function (e) {
    if (e.target.closest(".ev-close") || e.target.classList.contains("ev-backdrop")) closeEvidence();
    if (e.target.tagName === "IMG" && e.target.closest(".ev-img")) openLightbox(e.target.src, (panel.querySelector(".ev-method") || {}).textContent || "");
  });

  document.addEventListener("click", function (e) {
    var l = e.target.closest && e.target.closest(".ev-link");
    if (!l) return;
    e.preventDefault(); e.stopPropagation();
    var pr = PROOFS[l.getAttribute("data-proof")];
    if (pr) openEvidence(pr);
  }, true);

  /* ---------- presenter notes (N to toggle) ---------- */
  var notesEl = document.createElement("aside");
  notesEl.className = "notes-panel";
  notesEl.setAttribute("aria-live", "polite");
  document.body.appendChild(notesEl);
  function renderNotes() {
    var n = slides[index] && slides[index].notes;
    notesEl.innerHTML = "<span class='np-l'>Presenter notes · " + pad(index + 1) + "</span>" + (n ? esc(n) : "<em>No notes for this slide.</em>");
  }
  function toggleNotes() { notesEl.classList.toggle("open"); }

  /* ---------- centered image lightbox (middle-of-screen popup) ---------- */
  var lb = document.createElement("div");
  lb.className = "lightbox";
  var IC = function (d) { return "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round'><path d='" + d + "'/></svg>"; };
  lb.innerHTML = "<div class='lb-backdrop'></div>" +
    "<button class='lb-x' aria-label='Close'>" + IC("M18 6L6 18M6 6l12 12") + "<span>Esc</span></button>" +
    "<figure class='lb-card'><button class='lb-close' aria-label='Close'>×</button>" +
    "<button class='lb-nav lb-prev' aria-label='Previous screen'>" + IC("M15 18l-6-6 6-6") + "</button><div class='lb-imgwrap'><img alt=''></div><button class='lb-nav lb-next' aria-label='Next screen'>" + IC("M9 18l6-6-6-6") + "</button>" +
    "<figcaption class='lb-cap'></figcaption><div class='lb-dots'></div></figure>";
  var gal = null; // { list: [{src, cap}], i }
  document.body.appendChild(lb);
  function openLightbox(src, caption, tall) {
    var li = lb.querySelector("img");
    lb.classList.remove("fit");
    li.onload = function () { lb.classList.toggle("fit", !!tall && li.naturalHeight / li.naturalWidth <= 2.4); };
    li.src = src;
    lb.querySelector(".lb-cap").textContent = caption || "";
    lb.classList.toggle("tall", !!tall);
    lb.classList.toggle("gallery", !!gal);
    var w = lb.querySelector(".lb-imgwrap"); if (w) w.scrollTop = 0;
    lb.classList.add("open");
  }
  function showGal(i) {
    if (!gal) return;
    gal.i = (i + gal.list.length) % gal.list.length;
    var it = gal.list[gal.i];
    openLightbox(it.src, "", true);
    lb.querySelector(".lb-cap").innerHTML = "<span class='lb-n'>" + pad(gal.i + 1) + " / " + pad(gal.list.length) + "</span>" +
      "<span class='lb-t'>" + esc(it.title || it.cap) + "</span>" + (it.pain ? "<span class='lb-p'>" + esc(it.pain) + "</span>" : "");
    lb.querySelector(".lb-dots").innerHTML = gal.list.map(function (x, k) {
      return "<button class='lb-dot" + (k === gal.i ? " on" : "") + "' data-k='" + k + "' aria-label='Screen " + (k + 1) + "'></button>";
    }).join("");
  }
  function openGallery(list, i) { gal = { list: list, i: 0 }; showGal(i); }
  function closeLightbox() { lb.classList.remove("open"); gal = null; }
  function lightboxOpen() { return lb.classList.contains("open"); }
  lb.addEventListener("click", function (e) {
    var dot = e.target.closest(".lb-dot");
    if (dot) { showGal(parseInt(dot.getAttribute("data-k"), 10)); return; }
    if (e.target.closest(".lb-x")) { closeLightbox(); return; }
    if (e.target.closest(".lb-prev")) { showGal(gal ? gal.i - 1 : 0); return; }
    if (e.target.closest(".lb-next")) { showGal(gal ? gal.i + 1 : 0); return; }
    if (e.target.closest(".lb-close") || e.target.classList.contains("lb-backdrop") || (!lb.classList.contains("tall") && e.target.classList.contains("lb-imgwrap"))) closeLightbox();
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
    if (lightboxOpen()) {
      if (e.key === "Escape") closeLightbox();
      else if (gal && e.key === "ArrowRight") { e.preventDefault(); showGal(gal.i + 1); }
      else if (gal && e.key === "ArrowLeft") { e.preventDefault(); showGal(gal.i - 1); }
      return;
    }
    if (evidenceOpen()) { if (e.key === "Escape") closeEvidence(); return; }
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "n" || e.key === "N") toggleNotes();
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(TOTAL - 1);
  });
  stage.addEventListener("click", function (e) {
    if (evidenceOpen() || lightboxOpen()) return;
    if (e.target.closest("a, button, video, .zoomable, .device, .tile, .ci-drop")) return;
    var x = e.clientX / window.innerWidth;
    if (x < 0.24) prev(); else next();
  });
  // click artifact/matrix to zoom
  stage.addEventListener("click", function (e) {
    var shot = e.target.closest(".ci-shot");
    if (shot) {
      var sh = (slides[index].define || {}).shots || [];
      openGallery(sh.map(function (x) { return { src: img(x.img), cap: x.k, title: x.k, pain: x.pain }; }), parseInt(shot.getAttribute("data-shot"), 10) || 0);
      return;
    }
    var rv = e.target.closest(".rv-shot, .bd-img, .dc-thumb");
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
    var forced = (location.search.match(/[?&]theme=(dark|light)/) || [])[1];   // ?theme=light to share a fixed theme
    document.body.setAttribute("data-theme", forced || saved || "dark");
    if (t) t.addEventListener("click", function () {
      var nt = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", nt);
      try { localStorage.setItem("deckTheme", nt); } catch (e) {}
    });
  })();

  // #N deep-link → open slide N with all of its beats revealed
  var startAt = parseInt((location.hash || "").slice(1), 10);
  if (startAt > 1 && startAt <= TOTAL) { go(startAt - 1); step = stepsOnSlide; applyStep(); }
  else go(0);
})();
