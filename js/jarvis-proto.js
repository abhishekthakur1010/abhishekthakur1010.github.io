/* =============================================================
   Jarvis 2.0 · V1 click-through prototype (self-contained)
   The V1 design screens, wired up like a Figma prototype: click the
   pulsing red dot (or the control it marks) to open the next screen.
   Used in the case study ([data-jv-proto]) and the deck (JarvisProto.mount).
   Hotspots are % boxes on the 2880×1720 exports: [left, top, width, height];
   dot is the pulse position inside that box, in %.
   ============================================================= */
(function () {
  "use strict";
  if (window.JarvisProto) return;

  var BASE = "./jarvis/img/v1/";
  var STEPS = [
    { t: "A ticket lands", d: "The customer's message comes first, with the queue and its SLA chips on the left. Start a reply.", act: "Reply", hot: [27.7, 86.6, 7.0, 3.7] },
    { t: "Draft the reply", d: "The composer opens in place with the recipient filled in. No new tab, no scrolling.", act: "Send", hot: [68.3, 93.3, 6.2, 3.9], dot: [6, 23] },
    { t: "Reply sent", d: "It joins the thread as a chat message, newest at the bottom. Now leave a note for Ops.", act: "Note", hot: [35.4, 86.6, 4.6, 3.7] },
    { t: "Write a private note", d: "Notes use the same composer, so switching between reply and note is one click.", act: "Add Note", hot: [68.5, 93.0, 6.0, 4.0] },
    { t: "The note is in the thread", d: "Private notes are yellow, so they never look like a customer reply. Next: escalate.", act: "Escalate to Ops", hot: [47.6, 86.6, 9.0, 3.7] },
    { t: "Escalate to Ops", d: "The system fills in the facility and the TL and ATL contacts. No Escalation Matrix, no Excel.", act: "Escalate", hot: [68.9, 93.0, 5.6, 4.0] },
    { t: "Escalated", d: "The escalation is logged in the thread and the button greys out, so nobody escalates twice.", act: "AI Summary", hot: [82.8, 17.0, 7.5, 3.5] },
    { t: "AI summary", d: "Key ticket and package facts at a glance, with a quick thumbs up or down on whether it helped.", act: "Voice reply", hot: [71.8, 94.1, 2.2, 3.5] },
    { t: "Reply by voice", d: "Agents can record a reply instead of typing it. Stop when you're done.", act: "Stop recording", hot: [65.2, 93.2, 2.0, 3.4] },
    { t: "Check the transcript", d: "The audio comes with an editable transcript, so the customer gets text as well.", act: "Send", hot: [68.3, 93.3, 6.2, 3.9] },
    { t: "Voice reply in the thread", d: "The recording and its transcript sit in the conversation like any other reply.", act: "Ticket Details", hot: [89.4, 24.4, 8.6, 3.6] },
    { t: "Ticket details", d: "SLA, shipment status, the current centre with its ageing, and consignee details in one panel. No HQ tab.", act: "Related Tickets", hot: [77.7, 94.3, 22.2, 4.5] },
    { t: "Related tickets", d: "Other tickets on the same shipment, one click away.", act: "Canned responses", hot: [69.9, 94.4, 2.2, 3.4], dot: [9, 62] },
    { t: "Canned responses", d: "Saved replies, searchable by folder, ready to drop into the composer.", act: "Close and start again", hot: [96.6, 24.4, 2.2, 3.7] }
  ];

  var css =
    ".jvp{--jvp-red:#d72f2f;display:grid;grid-template-columns:minmax(0,1fr) 250px;gap:24px;align-items:center;}" +
    ".jvp-stage{position:relative;justify-self:center;max-width:100%;}" +
    ".jvp-screen{position:relative;display:inline-block;max-width:100%;vertical-align:top;border-radius:12px;overflow:hidden;background:#fff;box-shadow:0 24px 60px rgba(0,0,0,.22);border:1px solid rgba(127,127,127,.25);}" +
    ".jvp-screen img{display:block;width:100%;height:auto;max-height:var(--jvp-max-h,none);object-fit:contain;transition:opacity .22s ease;}" +
    ".jvp-screen img.jvp-fade{opacity:.35;}" +
    ".jvp-hot{position:absolute;padding:0;margin:0;border:0;background:transparent;border-radius:6px;cursor:pointer;outline:2px solid transparent;outline-offset:2px;transition:outline-color .2s,background .2s;}" +
    ".jvp-hot:hover,.jvp-hot:focus-visible{outline-color:var(--jvp-red);background:rgba(215,47,47,.08);}" +
    ".jvp-hot::before{content:'';position:absolute;inset:-8px;}" +
    ".jvp-hot i{position:absolute;left:0;top:0;width:12px;height:12px;margin:-6px 0 0 -6px;border-radius:50%;background:var(--jvp-red);box-shadow:0 0 0 4px rgba(215,47,47,.22);pointer-events:none;}" +
    ".jvp-hot i::after{content:'';position:absolute;inset:-4px;border-radius:50%;border:2px solid var(--jvp-red);animation:jvpPulse 1.6s ease-out infinite;}" +
    "@keyframes jvpPulse{0%{transform:scale(.6);opacity:.9}100%{transform:scale(2.4);opacity:0}}" +
    ".jvp.jvp-nudge .jvp-hot{outline-color:var(--jvp-red);background:rgba(215,47,47,.14);animation:jvpNudge .5s ease 2;}" +
    "@keyframes jvpNudge{50%{transform:scale(1.08)}}" +
    ".jvp-side{display:flex;flex-direction:column;gap:10px;font-size:14px;line-height:1.5;}" +
    ".jvp-n{font-size:11px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--jvp-red);font-variant-numeric:tabular-nums;}" +
    ".jvp-t{font-size:18px;line-height:1.3;font-weight:700;color:inherit;margin:0;}" +
    ".jvp-d{margin:0;opacity:.8;}" +
    ".jvp-act{display:inline-flex;align-items:center;gap:8px;font-size:12.5px;font-weight:600;opacity:.9;}" +
    ".jvp-act::before{content:'';width:9px;height:9px;border-radius:50%;background:var(--jvp-red);box-shadow:0 0 0 3px rgba(215,47,47,.22);flex:none;}" +
    ".jvp-bar{display:flex;gap:4px;margin-top:6px;}" +
    ".jvp-bar span{flex:1;height:3px;border-radius:2px;background:currentColor;opacity:.15;transition:opacity .2s,background .2s;}" +
    ".jvp-bar span.on{background:var(--jvp-red);opacity:1;}" +
    ".jvp-nav{display:flex;gap:8px;margin-top:4px;}" +
    ".jvp-nav button{font:inherit;font-size:12.5px;font-weight:600;padding:7px 12px;border-radius:999px;border:1px solid rgba(127,127,127,.35);background:transparent;color:inherit;cursor:pointer;}" +
    ".jvp-nav button:hover:not(:disabled){border-color:var(--jvp-red);color:var(--jvp-red);}" +
    ".jvp-nav button:disabled{opacity:.35;cursor:default;}" +
    ".jvp-nav{flex-wrap:wrap;align-items:center;}.jvp-full{font-size:12.5px;font-weight:600;color:inherit;opacity:.8;text-decoration:underline;text-underline-offset:3px;margin-left:4px;}.jvp-full:hover{color:var(--jvp-red);opacity:1;}" +
    "@media (max-width:900px){.jvp{grid-template-columns:1fr;gap:14px;}.jvp-side{order:-1;}.jvp-hot i{width:10px;height:10px;margin:-5px 0 0 -5px;}}" +
    "@media (prefers-reduced-motion:reduce){.jvp-hot i::after{animation:none;}.jvp.jvp-nudge .jvp-hot{animation:none;}.jvp-screen img{transition:none;}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  function pad(n) { return (n < 10 ? "0" : "") + n; }

  function mount(root) {
    if (!root || root.__jvp) return;
    root.__jvp = true;
    var base = root.getAttribute("data-base") || BASE;
    var full = root.getAttribute("data-full");   // optional link to the standalone prototype page
    root.classList.add("jvp");
    root.innerHTML =
      "<div class='jvp-stage'><div class='jvp-screen'><img alt=''><button class='jvp-hot' type='button'><i></i></button></div></div>" +
      "<div class='jvp-side' aria-live='polite'><span class='jvp-n'></span><h4 class='jvp-t'></h4><p class='jvp-d'></p>" +
      "<span class='jvp-act'></span><div class='jvp-bar'>" + STEPS.map(function () { return "<span></span>"; }).join("") + "</div>" +
      "<div class='jvp-nav'><button type='button' data-go='back'>Back</button><button type='button' data-go='restart'>Start again</button>" +
      (full ? "<a class='jvp-full' href='" + full + "' target='_blank' rel='noopener'>Open full screen ↗</a>" : "") + "</div></div>";

    var img = root.querySelector(".jvp-screen img"), hot = root.querySelector(".jvp-hot");
    var bars = root.querySelectorAll(".jvp-bar span"), backBtn = root.querySelector("[data-go='back']");
    var i = 0, cache = {};

    function preload(k) { if (k < STEPS.length && !cache[k]) { cache[k] = new Image(); cache[k].src = base + pad(k + 1) + ".webp"; } }
    function show(k) {
      i = (k + STEPS.length) % STEPS.length;
      var s = STEPS[i];
      img.classList.add("jvp-fade");
      img.onload = function () { img.classList.remove("jvp-fade"); };
      img.src = base + pad(i + 1) + ".webp";
      img.alt = "Jarvis 2.0 V1, screen " + (i + 1) + ": " + s.t;
      hot.style.left = s.hot[0] + "%"; hot.style.top = s.hot[1] + "%";
      hot.style.width = s.hot[2] + "%"; hot.style.height = s.hot[3] + "%";
      var dot = hot.querySelector("i"), at = s.dot || [0, 0];   // sit on the design's own red dot where it has one
      dot.style.left = at[0] + "%"; dot.style.top = at[1] + "%";
      hot.setAttribute("aria-label", s.act + " (next screen)");
      root.querySelector(".jvp-n").textContent = pad(i + 1) + " / " + pad(STEPS.length) + " · V1 prototype";
      root.querySelector(".jvp-t").textContent = s.t;
      root.querySelector(".jvp-d").textContent = s.d;
      root.querySelector(".jvp-act").textContent = (window.innerWidth <= 600 ? "Tap the screen: " : "Click: ") + s.act;
      Array.prototype.forEach.call(bars, function (b, n) { b.classList.toggle("on", n <= i); });
      backBtn.disabled = i === 0;
      preload(i + 1);
    }

    // keep clicks inside the prototype from reaching the deck's click-to-advance
    root.addEventListener("click", function (e) {
      e.stopPropagation();
      if (e.target.closest(".jvp-full")) return;
      var go = e.target.closest("[data-go]");
      if (go) { show(go.getAttribute("data-go") === "back" ? i - 1 : 0); return; }
      // on a phone the controls are tiny, so a tap anywhere on the screen moves on
      if (e.target.closest(".jvp-hot") || (e.target.closest(".jvp-screen") && window.innerWidth <= 600)) { show(i + 1); return; }
      if (e.target.closest(".jvp-screen")) {   // a miss: show where to click
        root.classList.remove("jvp-nudge"); void root.offsetWidth; root.classList.add("jvp-nudge");
        setTimeout(function () { root.classList.remove("jvp-nudge"); }, 1100);
      }
    });
    show(0);
  }

  window.JarvisProto = { mount: mount, steps: STEPS };
  // mount (and start loading screens) only when the prototype is near the viewport
  function auto() {
    var els = document.querySelectorAll("[data-jv-proto]");
    if (!("IntersectionObserver" in window)) { Array.prototype.forEach.call(els, mount); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); mount(e.target); } });
    }, { rootMargin: "800px 0px" });
    Array.prototype.forEach.call(els, function (el) { io.observe(el); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", auto); else auto();
})();
