/* ============================================================
   JioMart Discovery — "Come shopping with Priya"
   Scene + Beat engine (Growth.Design style walkthrough)
   ============================================================ */
(function () {
  "use strict";

  var S = window.STORY;
  if (!S) return;
  var IMG = S.imgBase || "";
  var scenes = S.scenes || [];
  var MICRO = S.microLabels || [];
  var JOURNEY = S.journey || [];

  /* Flatten scenes into a linear list of "frames".
     Each frame = { sceneIndex, beatIndex(-1 for whole scene), step }.
     Walkthrough scenes expand into one frame per beat.
     Other scenes expand into (steps+1) frames for progressive reveal. */
  var frames = [];
  scenes.forEach(function (sc, si) {
    if (sc.type === "walkthrough") {
      sc.beats.forEach(function (b, bi) { frames.push({ si: si, bi: bi }); });
    } else {
      var steps = stepsFor(sc);
      for (var k = 0; k <= steps; k++) frames.push({ si: si, step: k });
    }
  });
  var TOTAL = frames.length;

  function stepsFor(sc) {
    switch (sc.type) {
      case "cover": return 0;
      case "journey-map": return 1;
      case "priya": return 2;
      case "pdp-trust": return (sc.questions.length + 1);
      case "trust-framework": return sc.pillars.length;
      case "pdp-scroll": return sc.layers.length - 1;
      case "spot-issue": return sc.reveals.length + 1;
      case "prioritise": return (sc.tiers.length + 1);
      case "mental-model": return 2;
      case "impact": return 2;
      case "closing": return 2;
      default: return 0;
    }
  }

  // DOM
  var stage = document.getElementById("stage");
  var railJourney = document.getElementById("railJourney");
  var railMicro = document.getElementById("railMicro");
  var bar = document.getElementById("progressBar");
  var nowEl = document.getElementById("slideNow");
  var totEl = document.getElementById("slideTotal");
  var prevBtn = document.getElementById("navPrev");
  var nextBtn = document.getElementById("navNext");
  var dotsWrap = document.getElementById("dots");
  var overviewEl = document.getElementById("overview");

  var fi = 0; // frame index
  var curSceneEl = null;
  var curSceneIndex = -1;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function img(n) { return IMG + n; }
  function esc(s) { return s == null ? "" : String(s); }
  function linesHTML(arr, tag) { tag = tag || "h1"; return "<" + tag + ">" + arr.map(esc).join("<br>") + "</" + tag + ">"; }

  if (totEl) totEl.textContent = pad(scenes.length);

  // scene dots (one per scene)
  var dots = [];
  scenes.forEach(function (sc, i) {
    var d = document.createElement("button");
    d.className = "dot";
    d.addEventListener("click", function () { gotoScene(i); });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  /* ---------- device + highlight helpers ---------- */
  function deviceHTML(beforeSrc, afterSrc) {
    var after = afterSrc
      ? "<div class='layer after'><img src='" + img(afterSrc) + "' data-focus='0'></div>"
      : "";
    return (
      "<div class='device'><div class='device-notch'></div>" +
      "<div class='device-screen'>" +
      "<div class='layer before'><img src='" + img(beforeSrc) + "' data-focus='0'></div>" +
      after +
      "<div class='hi-layer'></div>" +
      "</div></div>"
    );
  }

  function setFocus(im, f) {
    var apply = function () {
      var screen = im.closest(".device-screen");
      if (!screen) return;
      var vh = screen.clientHeight, ih = im.offsetHeight;
      if (!ih) { requestAnimationFrame(apply); return; }
      var max = Math.max(0, ih - vh);
      var shift = Math.min(Math.max(f * ih - vh / 2, 0), max);
      im.style.transform = "translateY(" + -shift + "px)";
    };
    if (im.complete) apply(); else im.onload = apply;
  }

  /* ============================================================
     SCENE TEMPLATES (non-walkthrough)
     ============================================================ */
  var T = {
    cover: function (sc) {
      return "<div class='slide-cover'><div class='cover-copy'>" +
        "<div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        linesHTML(sc.headline) +
        "<p class='body'>" + esc(sc.body) + "</p>" +
        "<div class='cta-hint'>" + esc(sc.cta) + "</div></div>" +
        "<div class='cover-visual'>" + deviceHTML(sc.img) + "</div></div>";
    },
    "journey-map": function (sc) {
      var flow = sc.flow.map(function (f) {
        var on = sc.active.indexOf(f) >= 0;
        return "<span class='jm-node" + (on ? " on reveal' data-step='1'" : "'") + ">" + esc(f) + "</span>";
      }).join("<span class='jm-arrow'>→</span>");
      return "<div class='slide-statement center'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        linesHTML(sc.headline) +
        "<div class='jm-flow'>" + flow + "</div>" +
        "<p class='note reveal' data-step='1'>" + esc(sc.note) + "</p></div>";
    },
    priya: function (sc) {
      return "<div class='slide-statement center priya'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        "<h1>" + esc(sc.name) + "</h1>" +
        "<p class='body reveal' data-step='1'>" + esc(sc.body) + "</p>" +
        "<div class='thought reveal' data-step='2'>" + esc(sc.thought) + "</div>" +
        "<div class='cta-hint reveal' data-step='2'>" + esc(sc.cta) + "</div></div>";
    },
    "pdp-trust": function (sc) {
      var qs = sc.questions.map(function (q, i) {
        return "<span class='pq reveal' data-step='" + (i + 1) + "'>\u201C" + esc(q) + "\u201D</span>";
      }).join("");
      var rStep = sc.questions.length + 1;
      return "<div class='slide-split'><div class='col-copy'>" +
        "<div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        "<div class='pq-list'>" + qs + "</div>" +
        "<div class='reframe-reveal reveal' data-step='" + rStep + "'>" + esc(sc.reveal) + "</div></div>" +
        "<div class='col-visual'>" + deviceHTML(sc.img) + "</div></div>";
    },
    "trust-framework": function (sc) {
      var pills = sc.pillars.map(function (p, i) {
        return "<div class='pillar reveal' data-step='" + (i + 1) + "'><span class='p-k'>" + esc(p.k) + "</span><span class='p-d'>" + esc(p.d) + "</span></div>";
      }).join("<span class='p-plus'>+</span>");
      return "<div class='slide-statement center'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        linesHTML(sc.headline) +
        "<div class='equation'><span class='eq-trust'>Trust</span><span class='eq-eq'>=</span>" + pills + "</div></div>";
    },
    "pdp-scroll": function (sc) {
      var layers = sc.layers.map(function (l, i) {
        return "<div class='pdp-layer reveal' data-step='" + i + "'><span class='pl-tag'>" + esc(l.tag) + "</span><span class='pl-q'>" + esc(l.q) + "</span><span class='pl-d'>" + esc(l.d) + "</span>" +
          (l.signal ? "<span class='sig " + l.signal.dir + "'>" + esc(l.signal.t) + " " + (l.signal.dir === "up" ? "↑" : "↓") + "</span>" : "") + "</div>";
      }).join("");
      return "<div class='slide-split'><div class='col-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        "<div class='pdp-layers'>" + layers + "</div></div>" +
        "<div class='col-visual'>" + deviceHTML(sc.img) + "</div></div>";
    },
    "spot-issue": function (sc) {
      var chips = sc.reveals.map(function (r, i) {
        return "<span class='spot-chip reveal' data-step='" + (i + 1) + "'>" + esc(r) + "</span>";
      }).join("");
      var endStep = sc.reveals.length + 1;
      return "<div class='slide-split'><div class='col-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        linesHTML(sc.headline) +
        "<div class='spot-chips'>" + chips + "</div>" +
        "<p class='note reveal' data-step='" + endStep + "'>" + esc(sc.end) + "</p></div>" +
        "<div class='col-visual'>" + deviceHTML(sc.img) + "</div></div>";
    },
    "mental-model": function (sc) {
      var before = sc.before.map(function (t) { return "<span class='mm bad'>" + esc(t) + "</span>"; }).join("<span class='mm-arrow'>→</span>");
      var after = sc.after.map(function (t) { return "<span class='mm good'>" + esc(t) + "</span>"; }).join("<span class='mm-arrow good'>→</span>");
      return "<div class='slide-statement'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        linesHTML(sc.headline) +
        "<div class='mm-block'><div class='mm-label'>Old experience</div><div class='mm-row reveal' data-step='1'>" + before + "</div></div>" +
        "<div class='mm-block'><div class='mm-label good'>New experience</div><div class='mm-row reveal' data-step='2'>" + after + "</div></div>" +
        "<p class='note reveal' data-step='2'>" + esc(sc.note) + "</p></div>";
    },
    impact: function (sc) {
      var exp = sc.experience.map(function (e, i) {
        return "<li class='reveal' data-step='1'>" + esc(e.t) + " <span class='sig up'>" + (e.dir === "up" ? "↑" : "↓") + "</span></li>";
      }).join("");
      var metrics = sc.metrics.map(function (m) {
        return "<div class='metric'><div class='mn' data-count='" + m.n + "' data-suffix='" + m.suffix + "' data-sign='" + m.sign + "'>" + m.sign + "0<em>" + m.suffix + "</em></div><div class='ml'>" + esc(m.l) + "</div></div>";
      }).join("");
      return "<div class='slide-split'><div class='col-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        linesHTML(sc.headline) +
        "<div class='tier-label'>Experience improvements</div><ul class='exp-list'>" + exp + "</ul></div>" +
        "<div class='col-visual'><div class='tier-label reveal' data-step='2'>" + esc(sc.metricsLabel) + "</div>" +
        "<div class='metrics reveal' data-step='2'>" + metrics + "</div>" +
        "<p class='disclaimer reveal' data-step='2'>" + esc(sc.disclaimer) + "</p></div></div>";
    },
    prioritise: function (sc) {
      var tiers = sc.tiers.map(function (t, i) {
        return "<div class='ptier reveal' data-step='" + (i + 2) + "'><span class='pt-k'>" + esc(t.k) + "</span><span class='pt-d'>" + esc(t.d) + "</span></div>";
      }).join("");
      return "<div class='slide-split'><div class='col-copy'>" +
        "<div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
        "<div class='reframe-pre'>" + lines(sc.pre) + "</div>" +
        "<div class='reframe-reveal reveal' data-step='1'>" + esc(sc.reveal) + "</div>" +
        "<div class='ptiers'>" + tiers + "</div></div>" +
        "<div class='col-visual'><div class='ev-img artifact' style='--crop:" + Math.round((sc.crop || 0.3) * 100) + "%'>" +
        "<img src='" + img(sc.img) + "' alt='' onerror=\"this.parentElement.classList.add('failed')\"><span class='artifact-tag'>Impact / effort matrix</span></div></div></div>";
    },

    closing: function (sc) {
      var ctas = sc.cta.map(function (c) { return "<a class='btn " + (c.primary ? "primary" : "ghost") + "' href='" + c.href + "'>" + esc(c.label) + "</a>"; }).join("");
      return "<div class='slide-statement center closing'>" +
        "<div class='reframe-pre'>" + linesHTML(sc.pre) + "</div>" +
        "<div class='closing-reveal reveal' data-step='1'>" + linesHTML(sc.reveal) + "</div>" +
        "<p class='note reveal' data-step='2'>" + esc(sc.note) + "</p>" +
        "<div class='close-cta reveal' data-step='2'>" + ctas + "</div></div>";
    }
  };

  function walkthroughHTML(sc) {
    return "<div class='slide-split walkthrough'>" +
      "<div class='col-copy'><div class='eyebrow'>" + esc(sc.eyebrow) + "</div>" +
      "<div class='wt-react'></div>" +
      "<div class='wt-note'></div>" +
      "<div class='wt-research'></div>" +
      "<div class='wt-evidence'></div>" +
      "<div class='wt-signals'></div></div>" +
      "<div class='col-visual'>" + deviceHTML(sc.before, sc.after) + "</div></div>";
  }

  /* ============================================================
     RENDER
     ============================================================ */
  function renderScene(si) {
    var sc = scenes[si];
    var el = document.createElement("section");
    el.className = "slide type-" + sc.type;
    el.innerHTML = sc.type === "walkthrough" ? walkthroughHTML(sc) : (T[sc.type] || T.closing)(sc);
    return el;
  }

  function showFrame(newFi, dir) {
    var f = frames[newFi];
    var sc = scenes[f.si];

    // build a new scene element only when the scene changes
    if (f.si !== curSceneIndex) {
      var old = curSceneEl;
      var el = renderScene(f.si);
      el.classList.add("enter");
      stage.appendChild(el);
      if (old) {
        old.classList.add("leave");
        setTimeout(function () { if (old.parentNode) old.parentNode.removeChild(old); }, 460);
      }
      curSceneEl = el;
      curSceneIndex = f.si;
      requestAnimationFrame(function () {
        el.classList.remove("enter");
        el.classList.add("active");
        applyFrame(f, sc);
      });
    } else {
      applyFrame(f, sc);
    }

    // journey rail
    renderJourney(sc);
    // chrome
    dots.forEach(function (d, k) { d.classList.toggle("active", k === f.si); });
    if (bar) bar.style.width = (TOTAL > 1 ? (newFi / (TOTAL - 1)) * 100 : 0) + "%";
    if (nowEl) nowEl.textContent = pad(f.si + 1);
    if (prevBtn) prevBtn.disabled = newFi === 0;
    if (nextBtn) nextBtn.disabled = newFi === TOTAL - 1;
    closeOverview();
  }

  function applyFrame(f, sc) {
    if (sc.type === "walkthrough") {
      applyWalkBeat(sc, f.bi);
    } else {
      applySteps(sc, f.step || 0);
      renderMicro(null);
    }
  }

  function applySteps(sc, step) {
    if (!curSceneEl) return;
    var revs = curSceneEl.querySelectorAll(".reveal");
    Array.prototype.forEach.call(revs, function (r) {
      var st = parseInt(r.getAttribute("data-step"), 10) || 1;
      r.classList.toggle("in", step >= st);
    });
    // pdp-scroll: scroll device to the active layer
    if (sc.type === "pdp-scroll") {
      var im = curSceneEl.querySelector(".before img");
      if (im && sc.layers[step]) setFocus(im, sc.layers[step].focus);
    }
    // spot-issue: focus device
    if (sc.type === "spot-issue") {
      var im2 = curSceneEl.querySelector(".before img");
      if (im2) setFocus(im2, sc.focus || 0);
    }
    if (sc.type === "pdp-trust") {
      var im3 = curSceneEl.querySelector(".before img");
      if (im3) setFocus(im3, sc.focus || 0);
    }
    if (sc.type === "cover") {
      var im4 = curSceneEl.querySelector(".before img");
      if (im4) setFocus(im4, 0);
    }
    if (sc.type === "impact" && step >= 2) countUp(curSceneEl);
  }

  function applyWalkBeat(sc, bi) {
    if (!curSceneEl) return;
    var beat = sc.beats[bi];
    var beforeLayer = curSceneEl.querySelector(".layer.before");
    var afterLayer = curSceneEl.querySelector(".layer.after");
    var showAfter = beat.view === "after";
    if (afterLayer) afterLayer.classList.toggle("show", showAfter);
    if (beforeLayer) beforeLayer.classList.toggle("hide", showAfter);

    // focus the visible image
    var vis = curSceneEl.querySelector((showAfter ? ".after" : ".before") + " img");
    if (vis) setFocus(vis, beat.focus || 0);

    // highlights
    var hiLayer = curSceneEl.querySelector(".hi-layer");
    if (hiLayer) {
      hiLayer.innerHTML = "";
      (beat.hi || []).forEach(function (h) {
        var b = document.createElement("div");
        b.className = "hi-box" + (showAfter ? " good" : "");
        b.style.left = h.x + "%"; b.style.top = h.y + "%";
        b.style.width = h.w + "%"; b.style.height = h.h + "%";
        hiLayer.appendChild(b);
      });
    }

    // react bubble
    var react = curSceneEl.querySelector(".wt-react");
    if (react) { react.textContent = beat.react ? "\u201C" + beat.react + "\u201D" : ""; react.classList.toggle("in", !!beat.react); }

    // note
    var note = curSceneEl.querySelector(".wt-note");
    if (note) { note.innerHTML = beat.note ? esc(beat.note) : ""; note.classList.toggle("in", !!beat.note); }

    // research tag
    var res = curSceneEl.querySelector(".wt-research");
    if (res) { res.innerHTML = beat.research ? "<span class='res-tag'>Observed through · " + esc(beat.research) + "</span>" : ""; }

    // signals
    var sig = curSceneEl.querySelector(".wt-signals");
    if (sig) {
      sig.innerHTML = (beat.signal || []).map(function (s) {
        return "<span class='sig " + s.dir + "'>" + esc(s.t) + " " + (s.dir === "up" ? "↑" : "↓") + "</span>";
      }).join("");
    }

    // evidence pill
    var ev = curSceneEl.querySelector(".wt-evidence");
    if (ev) {
      if (beat.evidence) {
        ev.innerHTML = "<button class='evidence-pill'>" +
          "<span>Behind the decision · " + esc(beat.evidence.method) + "</span>" +
          "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M7 17L17 7M17 7H8M17 7v9'/></svg></button>";
        ev.querySelector(".evidence-pill").addEventListener("click", function (e) {
          e.stopPropagation();
          openEvidence(beat.evidence);
        });
      } else {
        ev.innerHTML = "";
      }
    }

    renderMicro(beat.micro);
  }

  /* ---------- Evidence overlay ---------- */
  function openEvidence(ev) {
    var panel = document.getElementById("evidencePanel");
    if (!panel) return;
    var statsHTML = ev.stats
      ? "<div class='ev-stats'>" + ev.stats.map(function (s) { return "<span>" + esc(s) + "</span>"; }).join("") + "</div>"
      : "";
    var quoteHTML = ev.quote ? "<blockquote class='ev-quote'>\u201C" + esc(ev.quote) + "\u201D</blockquote>" : "";
    var qHTML = ev.question ? "<div class='ev-q'>" + esc(ev.question) + "</div>" : "";
    var statHTML = ev.stat ? "<div class='ev-bigstat'>" + esc(ev.stat) + "</div>" : "";
    var themesHTML = ev.themes
      ? "<div class='ev-themes'>" + ev.themes.map(function (t) { return "<div class='ev-theme'><b>" + esc(t.h) + "</b><span>" + esc(t.p) + "</span></div>"; }).join("") + "</div>"
      : "";
    var imgSrc = img(ev.img);
    var pendingClass = ev.pending ? " pending" : "";
    panel.querySelector(".ev-body").innerHTML =
      "<div class='ev-tag'>Real project artifact</div>" +
      "<div class='ev-method'>" + esc(ev.method) + "</div>" +
      "<div class='ev-img" + pendingClass + "' style='--crop:" + Math.round((ev.crop || 0.3) * 100) + "%'>" +
      "<img src='" + imgSrc + "' alt='' onerror=\"this.parentElement.classList.add('failed')\">" +
      (ev.pending ? "<span class='ev-pending'>Artifact image to be added</span>" : "") + "</div>" +
      qHTML + statHTML + statsHTML + quoteHTML + themesHTML +
      "<div class='ev-finding'><span class='ev-l'>What it revealed</span>" + esc(ev.finding) + "</div>" +
      "<div class='ev-impl'><span class='ev-l'>Design implication</span>" + esc(ev.implication) + "</div>";
    panel.classList.add("open");
    document.body.classList.add("evidence-open");
  }
  function closeEvidence() {
    var panel = document.getElementById("evidencePanel");
    if (panel) panel.classList.remove("open");
    document.body.classList.remove("evidence-open");
  }
  function evidenceOpen() {
    var panel = document.getElementById("evidencePanel");
    return panel && panel.classList.contains("open");
  }

  /* ---------- rails ---------- */
  function renderJourney(sc) {
    if (!railJourney) return;
    var stageKey = sc.stage || null;
    railJourney.innerHTML = JOURNEY.map(function (j) {
      var on = j.k === stageKey;
      return "<div class='jr-node" + (on ? " on" : "") + "'><span class='jr-dot'></span><span class='jr-s'>" + esc(j.s) + "</span><span class='jr-d'>" + esc(j.d) + "</span></div>";
    }).join("<span class='jr-line'></span>");
    railJourney.classList.toggle("show", !!stageKey);
  }

  function renderMicro(activeMicro) {
    if (!railMicro) return;
    if (activeMicro == null) { railMicro.classList.remove("show"); railMicro.innerHTML = ""; return; }
    railMicro.classList.add("show");
    railMicro.innerHTML = MICRO.map(function (m, i) {
      var cls = i < activeMicro ? "done" : i === activeMicro ? "on" : "";
      var mark = i < activeMicro ? "✓" : "○";
      if (i === activeMicro) mark = "●";
      return "<div class='mr-step " + cls + "'><span class='mr-mark'>" + mark + "</span><span class='mr-t'>" + esc(m) + "</span></div>";
    }).join("");
  }

  /* ---------- count up ---------- */
  function countUp(scope) {
    Array.prototype.forEach.call(scope.querySelectorAll(".mn[data-count]"), function (el) {
      if (el.dataset.done) return; el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var sign = el.getAttribute("data-sign") || "+";
      var start = null;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1000, 1);
        el.innerHTML = sign + Math.round(target * (1 - Math.pow(1 - p, 3))) + "<em>" + suffix + "</em>";
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  /* ---------- navigation ---------- */
  function go(n, dir) {
    if (n < 0 || n > TOTAL - 1) return;
    fi = n;
    showFrame(fi, dir);
  }
  function next() { go(fi + 1, 1); }
  function prev() { go(fi - 1, -1); }
  function gotoScene(si) {
    // jump to first frame of that scene
    for (var k = 0; k < frames.length; k++) {
      if (frames[k].si === si) { go(k, 1); return; }
    }
  }

  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", function (e) {
    // evidence panel intercepts ESC first
    if (e.key === "Escape" && evidenceOpen()) { closeEvidence(); return; }
    if (evidenceOpen()) { if (e.key === "Escape") closeEvidence(); return; }
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "Home") go(0);
    else if (e.key === "End") go(TOTAL - 1);
    else if (e.key === "Escape") toggleOverview();
  });

  stage.addEventListener("click", function (e) {
    if (evidenceOpen()) return;
    if (e.target.closest("a, button, .device, .pillar, .evidence-pill")) return;
    var x = e.clientX / window.innerWidth;
    if (x < 0.25) prev(); else next();
  });

  window.addEventListener("resize", function () {
    if (!curSceneEl) return;
    var vis = curSceneEl.querySelector(".layer.after.show img") || curSceneEl.querySelector(".before img");
    if (vis) setFocus(vis, parseFloat(vis.getAttribute("data-focus")) || 0);
  });

  /* ---------- overview ---------- */
  function openOverview() {
    if (!overviewEl) return;
    overviewEl.innerHTML = scenes.map(function (sc, i) {
      var title = sc.headline ? sc.headline.join(" ") : sc.eyebrow || sc.type;
      return "<button class='ov-item" + (i === curSceneIndex ? " current" : "") + "' data-i='" + i + "'><span class='ov-n'>" + pad(i + 1) + "</span><span class='ov-t'>" + esc(title) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(overviewEl.querySelectorAll(".ov-item"), function (b) {
      b.addEventListener("click", function () { gotoScene(+b.getAttribute("data-i")); });
    });
    overviewEl.classList.add("open");
  }
  function closeOverview() { if (overviewEl) overviewEl.classList.remove("open"); }
  function toggleOverview() { if (overviewEl && overviewEl.classList.contains("open")) closeOverview(); else openOverview(); }

  /* ---------- evidence panel close wiring ---------- */
  (function () {
    var panel = document.getElementById("evidencePanel");
    if (!panel) return;
    panel.addEventListener("click", function (e) {
      if (e.target.closest(".ev-close") || e.target.classList.contains("ev-backdrop")) closeEvidence();
      // click artifact image to toggle zoom
      if (e.target.tagName === "IMG" && e.target.closest(".ev-img")) e.target.closest(".ev-img").classList.toggle("zoom");
    });
  })();

  /* ---------- theme ---------- */
  (function () {
    var t = document.getElementById("themeToggle");
    var saved; try { saved = localStorage.getItem("storyTheme"); } catch (e) {}
    document.body.setAttribute("data-theme", saved || "dark");
    if (t) t.addEventListener("click", function () {
      var nt = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", nt);
      try { localStorage.setItem("storyTheme", nt); } catch (e) {}
    });
  })();

  go(0);
})();
