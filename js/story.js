/* ============================================================
   JioMart Discovery — interactive editorial story engine
   Data-driven: reads window.STORY (js/story-slides.js)
   One slide on screen at a time. Progressive disclosure via
   "steps": ArrowRight advances the next hidden reveal, then
   the next slide. ArrowLeft steps back / previous slide.
   ============================================================ */
(function () {
  "use strict";

  var DATA = window.STORY;
  if (!DATA) return;
  var IMG = DATA.imgBase || "";
  var slides = DATA.slides || [];
  var TOTAL = slides.length;

  // ---- DOM refs ----
  var stage = document.getElementById("stage");
  var bar = document.getElementById("progressBar");
  var nowEl = document.getElementById("slideNow");
  var totEl = document.getElementById("slideTotal");
  var prevBtn = document.getElementById("navPrev");
  var nextBtn = document.getElementById("navNext");
  var dotsWrap = document.getElementById("dots");
  var overviewEl = document.getElementById("overview");

  var index = 0;
  var step = 0; // reveal step within current slide
  var stepsOnSlide = 0;
  var slideEl = null;

  function pad(n) { return (n < 10 ? "0" : "") + n; }
  function img(name) { return IMG + name; }
  function esc(s) { return s == null ? "" : String(s); }

  if (totEl) totEl.textContent = pad(TOTAL);

  // build dots
  var dots = [];
  slides.forEach(function (s, i) {
    var d = document.createElement("button");
    d.className = "dot";
    d.setAttribute("aria-label", "Slide " + (i + 1));
    d.addEventListener("click", function () { goto(i); });
    dotsWrap.appendChild(d);
    dots.push(d);
  });

  /* ============================================================
     TEMPLATES — each returns { html, steps }
     "steps" = number of progressive reveals (extra to the base).
     Revealable elements get class .reveal and data-step="N".
     ============================================================ */

  function lines(arr, cls) {
    if (!arr) return "";
    return "<" + (cls || "h1") + ">" + arr.map(esc).join("<br>") + "</" + (cls || "h1") + ">";
  }
  function eyebrow(s) {
    return s.eyebrow ? "<div class='eyebrow'>" + esc(s.eyebrow) + "</div>" : "";
  }
  function device(name, focus, extraClass) {
    return (
      "<div class='device " + (extraClass || "") + "'>" +
      "<div class='device-notch'></div>" +
      "<div class='device-screen'><img src='" + img(name) + "' alt='' data-focus='" + (focus || 0) + "'></div>" +
      "</div>"
    );
  }

  var T = {
    cover: function (s) {
      return {
        steps: 0,
        html:
          "<div class='slide-cover'>" +
          "<div class='cover-copy'>" +
          eyebrow(s) +
          lines(s.headline, "h1") +
          "<p class='body'>" + esc(s.body) + "</p>" +
          "<div class='meta'>" +
          s.meta.map(function (m) {
            return "<div><div class='m-l'>" + esc(m.l) + "</div><div class='m-v'>" + esc(m.v) + "</div></div>";
          }).join("") +
          "</div>" +
          "<div class='cta-hint'>" + esc(s.cta) + "</div>" +
          "</div>" +
          "<div class='cover-visual'>" + device(s.img, 0) + "</div>" +
          "</div>"
      };
    },

    statement: function (s) {
      return {
        steps: 1,
        html:
          "<div class='slide-statement'>" +
          eyebrow(s) +
          lines(s.headline, "h1") +
          (s.body ? "<p class='body reveal' data-step='1'>" + esc(s.body) + "</p>" : "") +
          (s.note ? "<p class='note reveal' data-step='1'>" + esc(s.note) + "</p>" : "") +
          "</div>"
      };
    },

    priya: function (s) {
      var mods = s.modules.map(function (m, i) {
        return "<div class='mod reveal' data-step='" + (i + 1) + "'><div class='mod-l'>" + esc(m.l) + "</div><div class='mod-v'>" + esc(m.v) + "</div></div>";
      }).join("");
      return {
        steps: s.modules.length + 1,
        html:
          "<div class='slide-split " + (s.side === "right" ? "flip" : "") + "'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<p class='body'>" + esc(s.body) + "</p>" +
          "<p class='note reveal' data-step='" + (s.modules.length + 1) + "'>" + esc(s.note) + "</p></div>" +
          "<div class='col-visual'><div class='mods'>" + mods + "</div></div>" +
          "</div>"
      };
    },

    friction: function (s) {
      var items = s.reveals.map(function (r, i) {
        return "<li class='reveal' data-step='" + (i + 1) + "'>" + esc(r) + "</li>";
      }).join("");
      var endStep = s.reveals.length + 1;
      return {
        steps: endStep,
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<ul class='friction-list'>" + items + "</ul>" +
          "<div class='end-lines reveal' data-step='" + endStep + "'>" + lines(s.end, "h2") + "</div></div>" +
          "<div class='col-visual dim'>" + device(s.img, 0.22) + "</div>" +
          "</div>"
      };
    },

    reframe: function (s) {
      var qs = s.questions.map(function (q, i) {
        return "<div class='q-row reveal' data-step='" + (i + 3) + "'><span class='q'>" + esc(q.q) + "</span><span class='q-t'>" + esc(q.t) + "</span></div>";
      }).join("");
      return {
        steps: s.questions.length + 3,
        html:
          "<div class='slide-statement center'>" +
          eyebrow(s) +
          "<div class='reframe-pre'>" + lines(s.pre, "h1") + "</div>" +
          "<div class='reframe-reveal reveal' data-step='1'>" + esc(s.reveal) + "</div>" +
          "<div class='q-list'>" + qs + "</div>" +
          "<p class='note reveal' data-step='" + (s.questions.length + 3) + "'>" + esc(s.note) + "</p>" +
          "</div>"
      };
    },

    hotspots: function (s) {
      var cards = s.hotspots.map(function (h, i) {
        return "<button class='hotspot' data-i='" + i + "'><span class='hs-n'>" + esc(h.n) + "</span><span class='hs-t'>" + esc(h.t) + "</span><span class='hs-q'>" + esc(h.q) + "</span></button>";
      }).join("");
      return {
        steps: 0,
        interactive: "hotspots",
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='hotspot-grid'>" + cards + "</div></div>" +
          "<div class='col-visual'>" + device(s.hotspots[0].img, s.hotspots[0].focus, "dim") + "</div>" +
          "</div>"
      };
    },

    research: function (s) {
      var cards = s.cards.map(function (c, i) {
        return "<div class='research-card reveal' data-step='" + (i + 1) + "'><h3>" + esc(c.t) + "</h3><p>" + esc(c.d) + "</p></div>";
      }).join("");
      return {
        steps: s.cards.length,
        html:
          "<div class='slide-statement'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='research-grid'>" + cards + "</div></div>"
      };
    },

    findings: function (s) {
      var items = s.reveals.map(function (r, i) {
        return "<div class='finding reveal' data-step='" + (i + 1) + "'><span class='f-n'>" + pad(i + 1) + "</span><span>" + esc(r) + "</span></div>";
      }).join("");
      var endStep = s.reveals.length + 1;
      return {
        steps: endStep,
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") + "</div>" +
          "<div class='col-visual'><div class='findings'>" + items + "</div>" +
          "<div class='end-lines big reveal' data-step='" + endStep + "'>" + lines(s.end, "h2") + "</div></div>" +
          "</div>"
      };
    },

    equation: function (s) {
      var pills = s.pillars.map(function (p, i) {
        return "<button class='pillar' data-i='" + i + "'><span class='p-k'>" + esc(p.k) + "</span><span class='p-d'>" + esc(p.d) + "</span></button>";
      }).join("<span class='p-plus'>+</span>");
      return {
        steps: 0,
        interactive: "equation",
        html:
          "<div class='slide-statement center'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='equation'><span class='eq-trust'>Trust</span><span class='eq-eq'>=</span>" + pills + "</div>" +
          "<p class='note'>" + esc(s.note) + "</p></div>"
      };
    },

    "principle-text": function (s) {
      return {
        steps: 2,
        html:
          "<div class='slide-statement'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='contrast'>" +
          "<div class='c-bad reveal' data-step='1'>" + esc(s.contrast.bad) + "</div>" +
          "<div class='c-good reveal' data-step='2'>" + esc(s.contrast.good) + "</div></div>" +
          "<p class='body reveal' data-step='2'>" + esc(s.body) + "</p></div>"
      };
    },

    "principle-morph": function (s) {
      var pts = s.points.map(function (p, i) {
        return "<li class='reveal' data-step='" + (i + 2) + "'>" + esc(p) + "</li>";
      }).join("");
      return {
        steps: s.points.length + 2,
        interactive: "morph",
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<ul class='point-list'>" + pts + "</ul>" +
          "<p class='note reveal' data-step='" + (s.points.length + 2) + "'>" + esc(s.note) + "</p></div>" +
          "<div class='col-visual'><div class='morph'>" +
          "<div class='device'><div class='device-notch'></div><div class='device-screen'><img class='m-before' src='" + img(s.before) + "' data-focus='" + s.focus + "'></div></div>" +
          "<div class='device m-after-wrap'><div class='device-notch'></div><div class='device-screen'><img class='m-after' src='" + img(s.after) + "' data-focus='" + s.focus + "'></div></div>" +
          "<span class='morph-tag before'>Before</span><span class='morph-tag after'>After</span>" +
          "</div></div></div>"
      };
    },

    "principle-stack": function (s) {
      var items = s.stack.map(function (t, i) {
        return "<div class='stack-item reveal' data-step='" + (i + 1) + "'>" + esc(t) + "</div>";
      }).join("<span class='stack-arrow'>↓</span>");
      return {
        steps: s.stack.length + 1,
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<p class='note reveal' data-step='" + (s.stack.length + 1) + "'>" + esc(s.note) + "</p></div>" +
          "<div class='col-visual'><div class='stack'>" + items + "</div></div></div>"
      };
    },

    journey: function (s) {
      var steps = s.steps.map(function (st, i) {
        return "<div class='jstep reveal' data-step='" + (i + 1) + "'><span class='js-s'>" + esc(st.s) + "</span><span class='js-d'>" + esc(st.d) + "</span></div>";
      }).join("<span class='jstep-arrow'>→</span>");
      return {
        steps: s.steps.length + 1,
        html:
          "<div class='slide-statement'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<p class='body'>" + esc(s.body) + "</p>" +
          "<div class='journey'>" + steps + "</div>" +
          "<p class='note reveal' data-step='" + (s.steps.length + 1) + "'>" + esc(s.note) + "</p></div>"
      };
    },

    ui: function (s) {
      var ann = s.annotations.map(function (a, i) {
        return "<li class='reveal' data-step='" + (i + 1) + "'>" + esc(a) + "</li>";
      }).join("");
      var noteStep = s.annotations.length + 1;
      return {
        steps: noteStep,
        interactive: "morph",
        html:
          "<div class='slide-split " + (s.side === "right" ? "flip" : "") + "'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          (s.sub ? "<p class='sub'>" + esc(s.sub) + "</p>" : "") +
          "<ul class='ann-list'>" + ann + "</ul>" +
          "<p class='note reveal' data-step='" + noteStep + "'>" + esc(s.note) + "</p></div>" +
          "<div class='col-visual'><div class='morph'>" +
          "<div class='device'><div class='device-notch'></div><div class='device-screen'><img class='m-before' src='" + img(s.before) + "' data-focus='" + s.focus + "'></div></div>" +
          "<div class='device m-after-wrap'><div class='device-notch'></div><div class='device-screen'><img class='m-after' src='" + img(s.after) + "' data-focus='" + s.focus + "'></div></div>" +
          "<span class='morph-tag before'>Before</span><span class='morph-tag after'>After</span>" +
          "</div></div></div>"
      };
    },

    "icon-guess": function (s) {
      var icons = ["\u25A6", "\u2317", "\u25C9", "\u25A3", "\u2318"];
      var labels = ["Categories", "Scan", "Voice", "Offers", "Account"];
      var g = icons.map(function (ic, i) {
        return "<div class='ig'><span class='ig-ico'>" + ic + "</span><span class='ig-label reveal' data-step='2'>" + labels[i] + "</span></div>";
      }).join("");
      return {
        steps: 2,
        html:
          "<div class='slide-statement center'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='icon-row'>" + g + "</div>" +
          "<p class='reveal reframe-reveal small' data-step='1'>" + esc(s.reveal) + "</p>" +
          "<p class='note reveal' data-step='2'>" + esc(s.final) + "</p></div>"
      };
    },

    "social-proof": function (s) {
      var chips = s.chips.map(function (c, i) {
        return "<span class='sp-chip reveal' data-step='" + (i + 1) + "'>" + esc(c) + "</span>";
      }).join("");
      var flowStep = s.chips.length + 1;
      return {
        steps: flowStep,
        html:
          "<div class='slide-split " + (s.side === "right" ? "flip" : "") + "'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='sp-chips'>" + chips + "</div>" +
          "<p class='body'>" + esc(s.body) + "</p>" +
          "<div class='sp-flow reveal' data-step='" + flowStep + "'><span>" + esc(s.flow.a) + "</span><span class='sp-arrow'>↓</span><span>" + esc(s.flow.b) + "</span></div></div>" +
          "<div class='col-visual'>" + device(s.img, s.focus) + "</div></div>"
      };
    },

    "pdp-transition": function (s) {
      var qs = s.questions.map(function (q, i) {
        return "<span class='pq reveal' data-step='" + (i + 2) + "'>" + esc(q) + "</span>";
      }).join("");
      return {
        steps: s.questions.length + 2,
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) +
          "<div class='reframe-pre'>" + lines(s.pre, "h1") + "</div>" +
          "<div class='reframe-reveal reveal' data-step='1'>" + esc(s.reveal) + "</div>" +
          "<p class='note reveal' data-step='" + (s.questions.length + 2) + "'>" + esc(s.note) + "</p></div>" +
          "<div class='col-visual'><div class='pq-wrap'>" + device(s.img, s.focus) + "<div class='pq-list'>" + qs + "</div></div></div>" +
          "</div>"
      };
    },

    "pdp-scroll": function (s) {
      var layers = s.layers.map(function (l, i) {
        return "<div class='pdp-layer reveal' data-step='" + (i + 1) + "'><span class='pl-q'>" + esc(l.q) + "</span><span class='pl-d'>" + esc(l.d) + "</span></div>";
      }).join("");
      return {
        steps: s.layers.length,
        interactive: "pdpscroll",
        layers: s.layers,
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='pdp-layers'>" + layers + "</div></div>" +
          "<div class='col-visual'>" + device(s.img, 0) + "</div></div>"
      };
    },

    load: function (s) {
      var before = s.before.map(function (t, i) {
        return "<div class='load-item bad reveal' data-step='" + (i + 1) + "'>" + esc(t) + "</div>";
      }).join("<span class='load-arrow'>→</span>");
      var afterStep = s.before.length + 1;
      var after = s.after.map(function (t) {
        return "<div class='load-item good'>" + esc(t) + "</div>";
      }).join("<span class='load-arrow good'>→</span>");
      return {
        steps: afterStep,
        html:
          "<div class='slide-statement'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='load-block'><div class='load-label'>Old experience</div><div class='load-row'>" + before + "</div></div>" +
          "<div class='load-block reveal' data-step='" + afterStep + "'><div class='load-label good'>New experience</div><div class='load-row'>" + after + "</div></div>" +
          "<p class='note reveal' data-step='" + afterStep + "'>" + esc(s.note) + "</p></div>"
      };
    },

    impact: function (s) {
      var exp = s.experience.map(function (e, i) {
        return "<li class='reveal' data-step='" + (i + 1) + "'>" + esc(e) + "</li>";
      }).join("");
      var mStep = s.experience.length + 1;
      var metrics = s.metrics.map(function (m) {
        return "<div class='metric'><div class='mn' data-count='" + m.n + "' data-suffix='" + m.suffix + "' data-sign='" + m.sign + "'>" + m.sign + "0<em>" + m.suffix + "</em></div><div class='ml'>" + esc(m.l) + "</div></div>";
      }).join("");
      return {
        steps: mStep,
        html:
          "<div class='slide-split'>" +
          "<div class='col-copy'>" + eyebrow(s) + lines(s.headline, "h1") +
          "<div class='tier-label'>Experience impact</div><ul class='exp-list'>" + exp + "</ul></div>" +
          "<div class='col-visual'><div class='tier-label reveal' data-step='" + mStep + "'>Platform signals</div>" +
          "<div class='metrics reveal' data-step='" + mStep + "'>" + metrics + "</div>" +
          "<p class='disclaimer reveal' data-step='" + mStep + "'>" + esc(s.disclaimer) + "</p></div></div>"
      };
    },

    closing: function (s) {
      var ctas = s.cta.map(function (c) {
        return "<a class='btn " + (c.primary ? "primary" : "ghost") + "' href='" + c.href + "'>" + esc(c.label) + "</a>";
      }).join("");
      return {
        steps: 2,
        html:
          "<div class='slide-statement center closing'>" +
          "<div class='reframe-pre'>" + lines(s.pre, "h1") + "</div>" +
          "<div class='closing-reveal reveal' data-step='1'>" + lines(s.reveal, "h1") + "</div>" +
          "<p class='note reveal' data-step='2'>" + esc(s.note) + "</p>" +
          "<blockquote class='reveal' data-step='2'>" + esc(s.quote) + "</blockquote>" +
          "<div class='close-cta reveal' data-step='2'>" + ctas + "</div></div>"
      };
    }
  };

  /* ============================================================
     RENDER
     ============================================================ */
  function build(i) {
    var s = slides[i];
    var tpl = (T[s.type] || T.statement)(s);
    stepsOnSlide = tpl.steps || 0;
    var wrap = document.createElement("section");
    wrap.className = "slide type-" + s.type;
    wrap.innerHTML = tpl.html;
    return { el: wrap, tpl: tpl, data: s };
  }

  function focusImages(scope) {
    // position tall screenshots to their data-focus point
    var imgs = scope.querySelectorAll(".device-screen img[data-focus]");
    Array.prototype.forEach.call(imgs, function (im) {
      var apply = function () {
        var screen = im.parentElement;
        var vh = screen.clientHeight, ih = im.offsetHeight;
        if (!ih) { requestAnimationFrame(apply); return; }
        var f = parseFloat(im.getAttribute("data-focus")) || 0;
        var max = Math.max(0, ih - vh);
        var shift = Math.min(Math.max(f * ih - vh / 2, 0), max);
        im.style.transform = "translateY(" + -shift + "px)";
      };
      if (im.complete) apply(); else im.onload = apply;
    });
  }

  function applyStep() {
    if (!slideEl) return;
    var revs = slideEl.querySelectorAll(".reveal");
    Array.prototype.forEach.call(revs, function (el) {
      var st = parseInt(el.getAttribute("data-step"), 10) || 1;
      el.classList.toggle("in", step >= st);
    });
    // impact count-up when its final step shows
    if (slides[index].type === "impact" && step >= stepsOnSlide) countUp(slideEl);
  }

  var current = null;
  function goto(i, dir) {
    if (i < 0 || i > TOTAL - 1) return;
    var old = current;
    index = i;
    step = 0;
    var built = build(i);
    current = built;
    slideEl = built.el;
    built.el.classList.add("enter");
    stage.appendChild(built.el);

    // fade out old
    if (old) {
      old.el.classList.add("leave");
      setTimeout(function () { if (old.el.parentNode) old.el.parentNode.removeChild(old.el); }, 500);
    }
    requestAnimationFrame(function () {
      built.el.classList.remove("enter");
      built.el.classList.add("active");
      focusImages(built.el);
      wireInteractive(built);
      applyStep();
    });

    // chrome
    dots.forEach(function (d, k) { d.classList.toggle("active", k === i); });
    if (bar) bar.style.width = (TOTAL > 1 ? (i / (TOTAL - 1)) * 100 : 0) + "%";
    if (nowEl) nowEl.textContent = pad(i + 1);
    if (prevBtn) prevBtn.disabled = i === 0 && step === 0;
    if (nextBtn) nextBtn.disabled = false;
    closeOverview();
  }

  function next() {
    if (step < stepsOnSlide) { step++; applyStep(); syncPrev(); return; }
    if (index < TOTAL - 1) goto(index + 1, 1);
  }
  function prev() {
    if (step > 0) { step--; applyStep(); syncPrev(); return; }
    if (index > 0) {
      // land on previous slide fully revealed
      goto(index - 1, -1);
      step = stepsOnSlide;
      applyStep();
    }
  }
  function syncPrev() {
    if (prevBtn) prevBtn.disabled = index === 0 && step === 0;
  }

  /* ---- interactive behaviours ---- */
  function wireInteractive(built) {
    var kind = built.tpl.interactive;
    var s = built.data;
    if (kind === "hotspots") {
      var deviceImg = built.el.querySelector(".device-screen img");
      var btns = built.el.querySelectorAll(".hotspot");
      Array.prototype.forEach.call(btns, function (b) {
        b.addEventListener("click", function () {
          Array.prototype.forEach.call(btns, function (x) { x.classList.remove("on"); });
          b.classList.add("on");
          var h = s.hotspots[+b.getAttribute("data-i")];
          if (deviceImg) {
            deviceImg.src = img(h.img);
            deviceImg.setAttribute("data-focus", h.focus);
            deviceImg.onload = function () { focusImages(built.el); };
          }
        });
      });
    } else if (kind === "equation") {
      var pills = built.el.querySelectorAll(".pillar");
      Array.prototype.forEach.call(pills, function (p) {
        p.addEventListener("click", function () {
          Array.prototype.forEach.call(pills, function (x) { x.classList.remove("on"); });
          p.classList.add("on");
        });
      });
    } else if (kind === "morph") {
      // click device to toggle before/after
      var morph = built.el.querySelector(".morph");
      if (morph) {
        morph.addEventListener("click", function () { morph.classList.toggle("show-after"); });
      }
    } else if (kind === "pdpscroll") {
      // each reveal step scrolls the device to that layer's focus
      built._layers = s.layers;
    }
  }

  // pdp-scroll: hook step changes to scroll the device
  var _applyStep = applyStep;
  applyStep = function () {
    _applyStep();
    if (!slideEl) return;
    if (slides[index].type === "pdp-scroll" && current && current._layers) {
      var im = slideEl.querySelector(".device-screen img");
      var layer = current._layers[Math.max(0, step - 1)];
      if (im && layer) {
        im.setAttribute("data-focus", layer.focus);
        focusImages(slideEl);
      }
    }
  };

  function countUp(scope) {
    var nums = scope.querySelectorAll(".mn[data-count]");
    Array.prototype.forEach.call(nums, function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var sign = el.getAttribute("data-sign") || "+";
      var start = null;
      function stepf(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / 1000, 1);
        var v = Math.round(target * (1 - Math.pow(1 - p, 3)));
        el.innerHTML = sign + v + "<em>" + suffix + "</em>";
        if (p < 1) requestAnimationFrame(stepf);
      }
      requestAnimationFrame(stepf);
    });
  }

  /* ---- overview (ESC) ---- */
  function openOverview() {
    if (!overviewEl) return;
    overviewEl.innerHTML = slides.map(function (s, i) {
      var title = (s.headline ? s.headline.join(" ") : s.pre ? s.pre.join(" ") : s.type);
      return "<button class='ov-item" + (i === index ? " current" : "") + "' data-i='" + i + "'><span class='ov-n'>" + pad(i + 1) + "</span><span class='ov-t'>" + esc(title) + "</span></button>";
    }).join("");
    Array.prototype.forEach.call(overviewEl.querySelectorAll(".ov-item"), function (b) {
      b.addEventListener("click", function () { goto(+b.getAttribute("data-i")); });
    });
    overviewEl.classList.add("open");
    document.body.classList.add("overview-open");
  }
  function closeOverview() {
    if (!overviewEl) return;
    overviewEl.classList.remove("open");
    document.body.classList.remove("overview-open");
  }
  function toggleOverview() {
    if (overviewEl && overviewEl.classList.contains("open")) closeOverview();
    else openOverview();
  }

  /* ---- controls ---- */
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === " ") { e.preventDefault(); next(); }
    else if (e.key === "ArrowLeft") { e.preventDefault(); prev(); }
    else if (e.key === "Home") goto(0);
    else if (e.key === "End") goto(TOTAL - 1);
    else if (e.key === "Escape") toggleOverview();
  });

  // click to advance (ignore interactive + controls)
  stage.addEventListener("click", function (e) {
    if (e.target.closest("a, button, .hotspot, .pillar, .morph, .device")) return;
    var x = e.clientX / window.innerWidth;
    if (x < 0.25) prev(); else next();
  });

  window.addEventListener("resize", function () { if (slideEl) focusImages(slideEl); });

  // theme toggle (persisted)
  (function () {
    var t = document.getElementById("themeToggle");
    var saved;
    try { saved = localStorage.getItem("storyTheme"); } catch (e) {}
    document.body.setAttribute("data-theme", saved || "dark");
    if (t) t.addEventListener("click", function () {
      var nt = document.body.getAttribute("data-theme") === "light" ? "dark" : "light";
      document.body.setAttribute("data-theme", nt);
      try { localStorage.setItem("storyTheme", nt); } catch (e) {}
    });
  })();

  goto(0);
})();
