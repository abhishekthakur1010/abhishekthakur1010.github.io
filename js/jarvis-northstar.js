/* =============================================================
   Jarvis 2.0 · North star vision (self-contained component)
   A ticket = a conversation + actions + intelligence, and the seven
   product pillars that ladder up to it. Always rendered as a dark
   starfield panel, so it reads the same in the deck and the case study.
   Mount: <div data-jv-northstar></div>, or JarvisNorthStar.mount(el).
   ============================================================= */
(function () {
  "use strict";
  if (window.JarvisNorthStar) return;

  var TOKENS = {
    conv: { label: "Conversation", c: "#62a8ff" },
    act: { label: "Actions", c: "#ff5257" },
    intel: { label: "Intelligence", c: "#b18cff" }
  };
  var IC = {
    layers: '<path d="m12 3 9 5-9 5-9-5 9-5z"/><path d="m3 13 9 5 9-5"/>',
    chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12z"/>',
    bolt: '<path d="M13 2 4 14h7l-1 8 9-12h-7l1-8z"/>',
    focus: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="3"/>',
    spark: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
    shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3z"/><path d="m9 12 2 2 4-4"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
    left: '<path d="m15 18-6-6 6-6"/>',
    right: '<path d="m9 18 6-6-6-6"/>'
  };
  var PILLARS = [
    { t: "Unified information access", s: "Everything in one view", d: "Everything in one view.", f: ["Zero tool switching", "P0 upfront"], k: "act", ic: "layers" },
    { t: "Conversation-centric resolution", s: "Chat-first resolution", d: "A chat, not an email thread.", f: ["Chat-first", "Internal notes"], k: "conv", ic: "chat" },
    { t: "Action efficiency", s: "One-click actions", d: "Key actions at the fingertips.", f: ["One-click actions", "Escalation levels"], k: "act", ic: "bolt" },
    { t: "Zero cognitive load", s: "Zero cognitive load", d: "Makes sense at a glance.", f: ["Smart grouping", "Clear hierarchy"], k: "conv", ic: "focus" },
    { t: "Intelligence + insights", s: "AI insights", d: "Predict needs, guide the agent.", f: ["AI replies", "RTO risk"], k: "intel", ic: "spark" },
    { t: "Trust and transparency", s: "Trust and transparency", d: "Every detail is trustworthy.", f: ["Verified labels", "Geofence verified"], k: "intel", ic: "shield" },
    { t: "Operational predictability", s: "Predictable for Ops", d: "Consistent for Ops and CS.", f: ["Ageing in hours", "Dispatch count"], k: "act", ic: "clock" }
  ];

  var css =
    ".jns{--ns-bg:#07080f;position:relative;isolation:isolate;overflow:hidden;border-radius:22px;background:radial-gradient(120% 80% at 50% -10%,#1a1c33 0%,#0b0c18 45%,var(--ns-bg) 100%);color:#eef0f6;padding:clamp(22px,3vw,40px) clamp(16px,2.6vw,36px) clamp(22px,3vw,36px);border:1px solid rgba(255,255,255,.07);font-family:inherit;text-align:center;}" +
    ".jns-sky{position:absolute;inset:0;z-index:-1;pointer-events:none;}" +
    ".jns-sky i{position:absolute;width:2px;height:2px;border-radius:50%;background:#fff;opacity:.55;animation:jnsTw 4s ease-in-out infinite;}" +
    ".jns-sky i.b{width:3px;height:3px;box-shadow:0 0 6px 1px rgba(200,190,255,.7);opacity:.8;}" +
    ".jns-sky b{position:absolute;width:14px;height:14px;opacity:.75;animation:jnsTw 5s ease-in-out infinite;background:linear-gradient(transparent 45%,#cfd3ff 45%,#cfd3ff 55%,transparent 55%),linear-gradient(90deg,transparent 45%,#cfd3ff 45%,#cfd3ff 55%,transparent 55%);filter:drop-shadow(0 0 4px #9aa3ff);border-radius:50%;}" +
    "@keyframes jnsTw{0%,100%{opacity:.25}50%{opacity:.9}}" +
    ".jns-orb{width:clamp(38px,4vw,54px);aspect-ratio:1;margin:0 auto;border-radius:50%;background:radial-gradient(circle at 40% 38%,#fff 0%,#eaf2ff 45%,#b8ccff 75%,rgba(160,180,255,.4) 100%);box-shadow:0 0 22px 8px rgba(190,210,255,.55),0 0 90px 34px rgba(120,140,255,.28);animation:jnsGlow 5s ease-in-out infinite;}" +
    "@keyframes jnsGlow{50%{box-shadow:0 0 24px 8px rgba(190,210,255,.7),0 0 90px 30px rgba(120,140,255,.3)}}" +
    ".jns-k{display:block;margin-top:14px;font-size:11px;font-weight:700;letter-spacing:.32em;text-transform:uppercase;color:#a9adc4;}" +
    ".jns-eq{margin:10px 0 0;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:10px 12px;font-size:clamp(20px,2.3vw,32px);font-weight:700;line-height:1.2;letter-spacing:-.01em;}" +
    ".jns-eq .op{color:#7e8299;font-weight:500;}" +
    ".jns-tok{--c:#fff;padding:.18em .6em;border-radius:999px;color:#fff;background:color-mix(in srgb,var(--c) 16%,transparent);border:1px solid color-mix(in srgb,var(--c) 55%,transparent);box-shadow:0 0 22px color-mix(in srgb,var(--c) 30%,transparent),inset 0 0 12px color-mix(in srgb,var(--c) 18%,transparent);}" +
    ".jns-legend{margin:12px 0 0;font-size:12px;color:#8d91a8;display:flex;flex-wrap:wrap;justify-content:center;gap:4px 16px;}" +
    ".jns-legend span{display:inline-flex;align-items:center;gap:6px;}" +
    ".jns-legend span::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--c);box-shadow:0 0 6px var(--c);}" +
    ".jns-track{--jns-inset:4px;margin-top:clamp(20px,3vh,32px);}" +
    ".jns-bar{display:flex;align-items:center;gap:16px;padding:0 var(--jns-inset);margin-bottom:14px;}" +
    ".jns-label{flex:none;font-size:11px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:#8d91a8;}" +
    ".jns-nav{flex:none;display:flex;gap:8px;margin-left:auto;}" +
    ".jns-nav button{width:34px;height:34px;border-radius:50%;border:1px solid rgba(255,255,255,.16);background:rgba(255,255,255,.05);color:#eef0f6;cursor:pointer;display:grid;place-items:center;transition:border-color .2s,opacity .2s;}" +
    ".jns-nav button:hover:not(:disabled){border-color:rgba(255,255,255,.45);}.jns-nav button:disabled{opacity:.28;cursor:default;}" +
    ".jns-nav svg{width:14px;height:14px;}" +
    ".jns-grid{display:flex;align-items:stretch;gap:16px;overflow-x:auto;scroll-snap-type:x mandatory;scroll-padding:0 var(--jns-inset);padding:4px var(--jns-inset) 6px;text-align:left;scrollbar-width:none;overscroll-behavior-x:contain;cursor:grab;}" +
    ".jns-grid::-webkit-scrollbar{display:none;}" +
    ".jns-grid.is-drag{cursor:grabbing;scroll-snap-type:none;user-select:none;}" +
    ".jns-grid:focus-visible{outline:2px solid rgba(255,255,255,.35);outline-offset:4px;border-radius:12px;}" +
    ".jns-card{--c:#fff;flex:0 0 280px;scroll-snap-align:start;position:relative;padding:13px 14px 12px;border-radius:14px;background:linear-gradient(180deg,rgba(255,255,255,.075),rgba(255,255,255,.03));border:1px solid rgba(255,255,255,.09);-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);display:flex;flex-direction:column;gap:6px;}" +
    ".jns-card::before{content:'';position:absolute;left:14px;right:14px;top:-1px;height:2px;border-radius:2px;background:var(--c);box-shadow:0 0 10px var(--c);opacity:.9;}" +
    ".jns-top{display:flex;align-items:center;gap:9px;}" +
    ".jns-ic{flex:none;width:30px;height:30px;border-radius:9px;display:grid;place-items:center;color:var(--c);background:color-mix(in srgb,var(--c) 14%,transparent);border:1px solid color-mix(in srgb,var(--c) 35%,transparent);}" +
    ".jns-ic svg{width:16px;height:16px;}" +
    ".jns-n{font-size:11px;font-weight:700;color:#7e8299;font-variant-numeric:tabular-nums;}" +
    ".jns-t{margin:0;font-size:15px;line-height:1.25;font-weight:700;color:#fff;}" +
    ".jns-d{margin:0;font-size:13px;line-height:1.4;color:#b9bdd0;}" +
    ".jns-f{display:flex;flex-wrap:wrap;gap:5px;margin-top:auto;padding-top:4px;}" +
    ".jns-f span{white-space:nowrap;font-size:11.5px;line-height:1.2;padding:3px 7px;border-radius:999px;color:#d6d9e6;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);}" +
    ".jns-mark{position:absolute;left:50%;bottom:-.28em;transform:translateX(-50%);z-index:-1;font-size:clamp(56px,8vw,118px);font-weight:800;letter-spacing:.02em;line-height:1;white-space:nowrap;color:rgba(255,255,255,.022);pointer-events:none;}" +
    "@media (max-width:560px){.jns-card{flex-basis:78vw;}}" +
    "@media (max-width:520px){.jns-card{padding:12px 11px 11px;}.jns-t{font-size:14px;}.jns-d{font-size:12.5px;}.jns-f span{font-size:11px;}}" +
    ".jns.jns-bleed{border:0;border-radius:0;background:transparent;padding:clamp(64px,8vw,104px) 0 clamp(56px,6vw,84px);}" +
    ".jns.jns-bleed .jns-track{--jns-inset:var(--jns-col,max(20px,calc((100% - 1100px)/2)));margin-top:clamp(32px,4vw,48px);}" +
    // the deck in light mode: the same layout on a light sky, so the slide follows the theme
    "body.deck[data-theme=light] .jns{background:radial-gradient(90% 70% at 50% 0%,#eef1fb 0%,#f7f8fc 45%,rgba(255,255,255,0) 100%);border-color:#ececf2;color:#0b0b0c;}" +
    "body.deck[data-theme=light] .jns-sky i{background:#7a82a8;opacity:.28;}" +
    "body.deck[data-theme=light] .jns-sky i.b{box-shadow:none;opacity:.4;}" +
    "body.deck[data-theme=light] .jns-sky b{background:linear-gradient(transparent 45%,#9aa3c7 45%,#9aa3c7 55%,transparent 55%),linear-gradient(90deg,transparent 45%,#9aa3c7 45%,#9aa3c7 55%,transparent 55%);filter:none;opacity:.5;}" +
    "body.deck[data-theme=light] .jns-orb{background:radial-gradient(circle at 40% 38%,#fff 0%,#f1f5ff 45%,#cfdcff 80%,rgba(160,180,255,.5) 100%);box-shadow:0 0 0 1px rgba(120,140,220,.18),0 10px 40px 8px rgba(120,140,255,.28);animation:none;}" +
    "body.deck[data-theme=light] .jns-k{color:#6b6f85;}" +
    "body.deck[data-theme=light] .jns-eq{color:#0b0b0c;}" +
    "body.deck[data-theme=light] .jns-eq .op{color:#a3a6b8;}" +
    "body.deck[data-theme=light] .jns-tok{color:#0b0b0c;background:color-mix(in srgb,var(--c) 12%,#fff);border-color:color-mix(in srgb,var(--c) 50%,#fff);box-shadow:0 6px 18px color-mix(in srgb,var(--c) 18%,transparent);}" +
    "body.deck[data-theme=light] .jns-legend{color:#6b6f85;}" +
    "body.deck[data-theme=light] .jns-label{color:#8a8a90;}" +
    "body.deck[data-theme=light] .jns-card{background:#fff;border-color:#e8e8ef;-webkit-backdrop-filter:none;backdrop-filter:none;box-shadow:0 10px 30px rgba(20,24,60,.06);}" +
    "body.deck[data-theme=light] .jns-card::before{box-shadow:none;}" +
    "body.deck[data-theme=light] .jns-t{color:#0b0b0c;}" +
    "body.deck[data-theme=light] .jns-d{color:#55586a;}" +
    "body.deck[data-theme=light] .jns-n{color:#9a9db0;}" +
    "body.deck[data-theme=light] .jns-f span{color:#3a3d4a;background:#f5f6fa;border-color:#e6e7ee;}" +
    "body.deck[data-theme=light] .jns-nav button{background:#fff;border-color:#dcdde6;color:#0b0b0c;}" +
    "body.deck[data-theme=light] .jns-mark{color:rgba(10,12,40,.035);}" +
    // panel version (deck): cards fade out at the right edge instead of a hard clip, as a scroll cue
    ".jns:not(.jns-bleed) .jns-grid{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 56px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 56px),transparent);}" +
    // simple (deck): the equation with each pillar listed under its pill, nothing to scroll
    ".jns.jns-simple{padding:clamp(28px,5vh,56px) clamp(16px,2.6vw,36px);}" +
    ".jns-simple .jns-k{margin-top:0;}" +
    ".jns-sgrid{display:inline-grid;grid-template-columns:repeat(7,auto);align-items:center;justify-items:center;column-gap:12px;row-gap:clamp(18px,3.4vh,32px);margin-top:12px;font-size:clamp(20px,2.3vw,32px);font-weight:700;line-height:1.2;letter-spacing:-.01em;}" +
    ".jns-sgrid .op{color:#7e8299;font-weight:500;}" +
    ".jns-col{--c:#fff;align-self:start;list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;width:100%;}" +
    ".jns-col li{font-size:clamp(14px,1.15vw,17px);font-weight:600;line-height:1.3;letter-spacing:0;color:#e4e6f0;padding:10px 14px;border-radius:12px;background:color-mix(in srgb,var(--c) 10%,transparent);border-left:3px solid var(--c);text-align:left;white-space:nowrap;}" +
    "body.deck[data-theme=light] .jns-sgrid{color:#0b0b0c;}" +
    "body.deck[data-theme=light] .jns-sgrid .op{color:#a3a6b8;}" +
    "body.deck[data-theme=light] .jns-col li{color:#1a1b22;background:color-mix(in srgb,var(--c) 9%,#fff);}" +
    "@media (max-width:760px){.jns-sgrid{display:flex;flex-direction:column;align-items:stretch;gap:10px;}.jns-sgrid > .jns-gap,.jns-sgrid > .op,.jns-sgrid > .jns-lead{display:none;}.jns-sgrid .jns-tok{align-self:flex-start;margin-top:8px;}.jns-col li{white-space:normal;}.jns-sgrid>:nth-child(3){order:1}.jns-sgrid>:nth-child(10){order:2}.jns-sgrid>:nth-child(5){order:3}.jns-sgrid>:nth-child(12){order:4}.jns-sgrid>:nth-child(7){order:5}.jns-sgrid>:nth-child(14){order:6}}" +
    "@media (prefers-reduced-motion:reduce){.jns-sky i,.jns-sky b,.jns-orb{animation:none;}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function esc(t) { return String(t).replace(/[&<>"']/g, function (c) { return "&#" + c.charCodeAt(0) + ";"; }); }
  function svg(k) { return "<svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' aria-hidden='true'>" + IC[k] + "</svg>"; }

  // a fixed scatter of stars (a seeded sequence, so it looks the same on every load)
  function sky() {
    var out = "", s = 7;
    function rnd() { s = (s * 9301 + 49297) % 233280; return s / 233280; }
    for (var i = 0; i < 46; i++) {
      out += "<i class='" + (i % 7 === 0 ? "b" : "") + "' style='left:" + (rnd() * 100).toFixed(1) + "%;top:" + (rnd() * 100).toFixed(1) + "%;animation-delay:" + (rnd() * 4).toFixed(2) + "s'></i>";
    }
    [[88, 9], [93, 22], [79, 15], [6, 10]].forEach(function (p, i) {
      out += "<b style='left:" + p[0] + "%;top:" + p[1] + "%;animation-delay:" + i * 1.2 + "s'></b>";
    });
    return out;
  }

  // simple layout: row 1 is the equation, row 2 puts each pillar under its own pill
  function mountSimple(root) {
    root.classList.add("jns-simple");
    var keys = ["conv", "act", "intel"];
    var row1 = "<span class='jns-lead'>A ticket</span><span class='op'>=</span>" + keys.map(function (k, i) {
      return (i ? "<span class='op'>+</span>" : "") + "<span class='jns-tok' style='--c:" + TOKENS[k].c + "'>" + TOKENS[k].label + "</span>";
    }).join("");
    var cols = keys.map(function (k, i) {
      var list = PILLARS.filter(function (p) { return p.k === k; }).map(function (p) { return "<li>" + esc(p.s || p.t) + "</li>"; }).join("");
      return (i ? "<span class='jns-gap'></span>" : "") + "<ul class='jns-col' style='--c:" + TOKENS[k].c + "'>" + list + "</ul>";
    }).join("");
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "North star vision: a ticket equals a conversation plus actions plus intelligence, with the product pillars under each");
    root.innerHTML = "<span class='jns-k'>North star vision</span><div class='jns-sgrid'>" + row1 + "<span class='jns-gap'></span><span class='jns-gap'></span>" + cols + "</div>";
  }

  function mount(root, opts) {
    if (!root || root.__jns) return;
    root.__jns = true;
    root.classList.add("jns");
    if (opts && opts.simple) { mountSimple(root); return; }
    if (root.hasAttribute("data-bleed")) root.classList.add("jns-bleed");   // edge to edge: no panel, row runs off the screen
    var eq = "<span>A ticket</span><span class='op'>=</span>" + ["conv", "act", "intel"].map(function (k, i) {
      return (i ? "<span class='op'>+</span>" : "") + "<span class='jns-tok' style='--c:" + TOKENS[k].c + "'>" + TOKENS[k].label + "</span>";
    }).join("");
    var legend = ["conv", "act", "intel"].map(function (k) {
      var n = PILLARS.map(function (p, i) { return p.k === k ? i + 1 : 0; }).filter(Boolean).join(", ");
      return "<span style='--c:" + TOKENS[k].c + "'>" + TOKENS[k].label + ": pillars " + n + "</span>";
    }).join("");
    var cards = PILLARS.map(function (p, i) {
      return "<article class='jns-card' style='--c:" + TOKENS[p.k].c + "'><div class='jns-top'><span class='jns-ic'>" + svg(p.ic) + "</span><span class='jns-n'>" + (i < 9 ? "0" : "") + (i + 1) + "</span></div>" +
        "<h4 class='jns-t'>" + esc(p.t) + "</h4><p class='jns-d'>" + esc(p.d) + "</p>" +
        "<div class='jns-f'>" + p.f.map(function (f) { return "<span>" + esc(f) + "</span>"; }).join("") + "</div></article>";
    }).join("");
    root.setAttribute("role", "group");
    root.setAttribute("aria-label", "North star vision: a ticket equals a conversation plus actions plus intelligence, with seven product pillars");
    root.innerHTML = "<div class='jns-sky' aria-hidden='true'>" + sky() + "</div>" +
      "<div class='jns-orb' aria-hidden='true'></div><span class='jns-k'>North star vision</span>" +
      "<p class='jns-eq'>" + eq + "</p><p class='jns-legend'>" + legend + "</p>" +
      "<div class='jns-track'><div class='jns-bar'><span class='jns-label'>7 product pillars</span>" +
      "<div class='jns-nav'><button type='button' data-d='-1' aria-label='Previous pillars'>" + svg("left") + "</button>" +
      "<button type='button' data-d='1' aria-label='Next pillars'>" + svg("right") + "</button></div></div>" +
      "<div class='jns-grid' tabindex='0' aria-label='Product pillars'>" + cards + "</div></div>" +
      "<span class='jns-mark' aria-hidden='true'>TDP VISION</span>";
    wire(root);
  }

  // the pillar row: arrows, drag (mouse), wheel and swipe; the native scrollbar is hidden
  function wire(root) {
    var track = root.querySelector(".jns-grid"), btns = root.querySelectorAll(".jns-nav button");
    function update() {
      var max = track.scrollWidth - track.clientWidth;
      btns[0].disabled = track.scrollLeft < 4;
      btns[1].disabled = track.scrollLeft > max - 4;
    }
    track.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    root.querySelector(".jns-track").addEventListener("click", function (e) {
      e.stopPropagation();   // clicks in the row belong to it, not to the deck's slide navigation
      var b = e.target.closest("[data-d]");
      if (b) track.scrollBy({ left: +b.getAttribute("data-d") * 296, behavior: "smooth" });   // one card + gap
    });
    track.addEventListener("keydown", function (e) { if (e.key === "ArrowLeft" || e.key === "ArrowRight") e.stopPropagation(); });
    track.addEventListener("wheel", function (e) {   // a vertical wheel over the row scrolls it sideways until an end
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      var max = track.scrollWidth - track.clientWidth;
      if ((e.deltaY > 0 && track.scrollLeft < max - 1) || (e.deltaY < 0 && track.scrollLeft > 1)) { e.preventDefault(); track.scrollLeft += e.deltaY; }
    }, { passive: false });
    var drag = null;   // click and drag with a mouse; touch keeps its native swipe
    track.addEventListener("pointerdown", function (e) {
      if (e.pointerType !== "mouse" || e.button !== 0) return;
      drag = { x: e.clientX, left: track.scrollLeft, moved: false };
    });
    window.addEventListener("pointermove", function (e) {
      if (!drag) return;
      var dx = e.clientX - drag.x;
      if (!drag.moved && Math.abs(dx) > 4) { drag.moved = true; track.classList.add("is-drag"); }
      if (drag.moved) track.scrollLeft = drag.left - dx;
    });
    window.addEventListener("pointerup", function () {
      if (!drag) return;
      var moved = drag.moved; drag = null;
      if (moved) {
        track.classList.remove("is-drag");
        var w = 296, i = Math.round(track.scrollLeft / w);   // settle on the nearest card
        track.scrollTo({ left: i * w, behavior: "smooth" });
      }
    });
    update();
  }

  window.JarvisNorthStar = { mount: mount };
  function auto() { Array.prototype.forEach.call(document.querySelectorAll("[data-jv-northstar]"), mount); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
