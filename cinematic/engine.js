/* ============================================================
   Scroll-controlled frame-sequence engine (vanilla, no build step)
   - Maps scroll progress -> frame index
   - Draws active frame to <canvas> with aspect-correct cover
   - Windowed intelligent preloading
   - GSAP ScrollTrigger if present, else native-scroll fallback
   - Synced text beats, progress HUD, missing-asset message
   - prefers-reduced-motion + keyboard support
   Portable: the frame<->progress model maps 1:1 to a future
   React + GSAP implementation.
   ============================================================ */
(function () {
  "use strict";
  var CFG = window.CINEMATIC_CONFIG;
  if (!CFG) { console.error("[cinematic] config missing"); return; }
  var chapter = CFG.chapters[0];

  var isMobile = window.matchMedia("(max-width: 640px)").matches;
  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  var stage = document.getElementById("stage01");
  var canvas = document.getElementById("canvas01");
  var ctx = canvas.getContext("2d", { alpha: false });
  var beatsEl = document.getElementById("beats01");
  var notice = document.getElementById("notice01");
  var noticeBar = document.getElementById("noticeBar");
  var noticeMsg = document.getElementById("noticeMsg");
  var hudBar = document.getElementById("hudBar");
  var scrollcue = document.getElementById("scrollcue");
  var rmToggle = document.getElementById("rmToggle");

  var dpr = Math.min(window.devicePixelRatio || 1, 2);
  var frames = [];          // image objects (lazy)
  var frameStatus = [];     // 'none' | 'loading' | 'ok' | 'error'
  var loadedCount = 0;
  var anyLoaded = false;
  var currentIndex = -1;
  var progress = 0;

  var total = chapter.frameCount;
  for (var i = 0; i < total; i++) { frames.push(null); frameStatus.push("none"); }

  // ---- filename builder ----
  function pad(n) { var s = String(n); while (s.length < chapter.pad) s = "0" + s; return s; }
  function framePath(idx, ext) {
    var tmpl = isMobile ? chapter.pathMobile : chapter.pathDesktop;
    var n = pad(chapter.startIndex + idx);
    return tmpl.replace("{n}", n).replace("{ext}", ext || chapter.ext);
  }

  // ---- load a single frame, trying webp then fallbacks ----
  function loadFrame(idx) {
    if (idx < 0 || idx >= total) return;
    if (frameStatus[idx] === "ok" || frameStatus[idx] === "loading") return;
    frameStatus[idx] = "loading";
    var exts = [chapter.ext].concat(chapter.fallbackExts || []);
    var ei = 0;
    var img = new Image();
    img.decoding = "async";
    function tryNext() {
      if (ei >= exts.length) { frameStatus[idx] = "error"; maybeFirstReady(); return; }
      img.src = framePath(idx, exts[ei++]);
    }
    img.onload = function () {
      frames[idx] = img; frameStatus[idx] = "ok"; loadedCount++;
      if (!anyLoaded) { anyLoaded = true; onFirstFrame(); }
      if (idx === currentIndex) draw(idx);
      maybeFirstReady();
    };
    img.onerror = function () { tryNext(); };
    tryNext();
  }

  // ---- windowed preloading around current index ----
  function preloadAround(idx) {
    var ahead = CFG.preload.aheadWindow, behind = CFG.preload.behindWindow;
    for (var k = idx - behind; k <= idx + ahead; k++) loadFrame(k);
  }

  // ---- aspect-correct cover draw ----
  function resize() {
    var w = stage.clientWidth, h = stage.clientHeight;
    canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
    canvas.style.width = w + "px"; canvas.style.height = h + "px";
    if (currentIndex >= 0) draw(currentIndex, true);
  }
  function draw(idx, force) {
    var img = frames[idx];
    if (!img) {
      // nearest loaded frame so scrubbing never blanks out
      for (var d = 1; d < total; d++) {
        if (frames[idx - d]) { img = frames[idx - d]; break; }
        if (frames[idx + d]) { img = frames[idx + d]; break; }
      }
    }
    if (!img) return; // placeholder gradient (CSS) shows through
    var cw = canvas.width, ch = canvas.height;
    var ir = img.width / img.height, cr = cw / ch;
    var dw, dh, dx, dy;
    if (ir > cr) { dh = ch; dw = ch * ir; dx = (cw - dw) / 2; dy = 0; }
    else { dw = cw; dh = cw / ir; dx = 0; dy = (ch - dh) / 2; }
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  // ---- map progress (0..1) -> frame, draw, preload, beats ----
  function render(p) {
    progress = Math.max(0, Math.min(1, p));
    var idx = Math.round(progress * (total - 1));
    if (idx !== currentIndex) {
      currentIndex = idx;
      preloadAround(idx);
      draw(idx);
    }
    updateBeats(progress);
    if (hudBar) hudBar.style.width = (progress * 100).toFixed(1) + "%";
    if (scrollcue) scrollcue.classList.toggle("hide", progress > 0.04);
  }

  // ---- narrative beats ----
  var beatNodes = [];
  (chapter.beats || []).forEach(function (b) {
    var el = document.createElement("div");
    el.className = "beat";
    el.innerHTML = (b.kicker ? '<div class="kicker">' + b.kicker + "</div>" : "") +
      '<div class="line">' + b.line.replace(/\n/g, "\n") + "</div>";
    beatsEl.appendChild(el);
    beatNodes.push({ el: el, at: b.at });
  });
  function updateBeats(p) {
    var win = 0.14; // fade window around each beat's `at`
    beatNodes.forEach(function (bn) {
      var dist = Math.abs(p - bn.at);
      var vis = dist < win ? 1 - dist / win : 0;
      bn.el.style.opacity = vis.toFixed(3);
      bn.el.style.transform = "translateY(" + ((1 - vis) * 18).toFixed(1) + "px)";
    });
  }

  // ---- first frame ready / loading UI ----
  function onFirstFrame() { notice.classList.add("hide"); }
  function maybeFirstReady() {
    var done = 0, errored = 0;
    for (var k = 0; k < Math.min(total, CFG.preload.initialBatch); k++) {
      if (frameStatus[k] === "ok") done++;
      if (frameStatus[k] === "error") errored++;
    }
    var pct = Math.round((done / Math.min(total, CFG.preload.initialBatch)) * 100);
    if (noticeBar) noticeBar.style.width = pct + "%";
    // If the whole initial batch errored, show the missing-asset guidance.
    if (errored >= Math.min(total, CFG.preload.initialBatch) && !anyLoaded) showMissing();
  }
  function showMissing() {
    noticeBar.parentElement.style.display = "none";
    var dir = (isMobile ? chapter.pathMobile : chapter.pathDesktop).replace("frame_{n}.{ext}", "");
    noticeMsg.innerHTML =
      "Cinematic frames not found yet.<br>" +
      "Drop <b>" + chapter.frameCount + "</b> rendered frames into <code>cinematic/" + dir + "</code><br>" +
      "named <code>frame_" + pad(chapter.startIndex) + "." + chapter.ext + "</code> … <code>frame_" + pad(chapter.startIndex + chapter.frameCount - 1) + "." + chapter.ext + "</code><br>" +
      "<span style='opacity:.7'>The scroll engine is live — the scene will play the moment the frames exist.</span>";
    notice.classList.remove("hide");
  }

  // ---- scroll wiring: GSAP ScrollTrigger, else native ----
  function initScroll() {
    // set the scroll length of the chapter via a spacer height
    var vh = chapter.scrollVH;
    document.getElementById("chapter-01").style.height = vh + "vh";

    if (window.gsap && window.ScrollTrigger && !prefersReduced) {
      gsap.registerPlugin(ScrollTrigger);
      ScrollTrigger.create({
        trigger: "#chapter-01",
        start: "top top",
        end: "bottom bottom",
        scrub: 0.6,
        onUpdate: function (self) { render(self.progress); },
      });
      // keep canvas pinned via the sticky .stage (CSS handles pinning)
    } else {
      // native fallback: compute progress from scroll position
      var chapterEl = document.getElementById("chapter-01");
      function onScroll() {
        var rect = chapterEl.getBoundingClientRect();
        var totalScroll = chapterEl.offsetHeight - window.innerHeight;
        var scrolled = Math.min(Math.max(-rect.top, 0), totalScroll);
        render(totalScroll > 0 ? scrolled / totalScroll : 0);
      }
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();
    }
  }

  // ---- keyboard: arrows/space page through the story ----
  window.addEventListener("keydown", function (e) {
    var step = window.innerHeight * 0.5;
    if (e.key === "ArrowDown" || e.key === " " || e.key === "PageDown") { window.scrollBy(0, step); }
    else if (e.key === "ArrowUp" || e.key === "PageUp") { window.scrollBy(0, -step); }
  });

  // ---- reduced-motion toggle ----
  function applyReduced(on) {
    prefersReduced = on;
    rmToggle.setAttribute("aria-pressed", String(on));
    rmToggle.textContent = "Reduced motion: " + (on ? "on" : "off");
  }
  rmToggle.addEventListener("click", function () {
    applyReduced(!prefersReduced);
    // in reduced mode, jump straight to key beats instead of scrubbing
    if (prefersReduced) { render(0); }
  });
  applyReduced(prefersReduced);

  // ---- boot ----
  window.addEventListener("resize", resize);
  resize();
  // kick off initial preload immediately so we know if assets exist
  for (var b = 0; b < Math.min(total, CFG.preload.initialBatch); b++) loadFrame(b);
  initScroll();
  render(0);

  // If after 2.5s nothing loaded and nothing errored (e.g. slow), keep message friendly
  setTimeout(function () { if (!anyLoaded) maybeFirstReady(); }, 2500);
})();
