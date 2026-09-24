/* ============================================================
   Case study deck controller
   Navigation: arrows, click, keyboard, swipe, dots
   Plus: progress bar, counter, dark-slide theming, count-up
   ============================================================ */
(function () {
  "use strict";

  var stage = document.getElementById("deckStage");
  if (!stage) return;

  var slides = Array.prototype.slice.call(stage.querySelectorAll(".slide"));
  var total = slides.length;
  var current = 0;

  var bar = document.getElementById("deckBar");
  var nowEl = document.getElementById("deckNow");
  var totalEl = document.getElementById("deckTotal");
  var prevBtn = document.getElementById("deckPrev");
  var nextBtn = document.getElementById("deckNext");
  var dotsWrap = document.getElementById("deckDots");

  if (totalEl) totalEl.textContent = total;

  // Build dots
  var dots = [];
  slides.forEach(function (s, i) {
    var b = document.createElement("button");
    b.setAttribute("aria-label", s.getAttribute("data-label") || "Slide " + (i + 1));
    b.addEventListener("click", function () {
      go(i);
    });
    dotsWrap.appendChild(b);
    dots.push(b);
  });

  function isDark(slide) {
    return (
      slide.classList.contains("slide-impact") ||
      slide.classList.contains("slide-close")
    );
  }

  function render() {
    slides.forEach(function (s, i) {
      s.classList.remove("is-active", "is-prev");
      if (i === current) s.classList.add("is-active");
      else if (i < current) s.classList.add("is-prev");
    });
    dots.forEach(function (d, i) {
      d.classList.toggle("active", i === current);
    });

    // progress + counter
    if (bar) bar.style.width = ((current + 1) / total) * 100 + "%";
    if (nowEl) nowEl.textContent = current + 1;

    // dark theming
    document.body.classList.toggle("on-dark", isDark(slides[current]));

    // arrow disabled states
    if (prevBtn) prevBtn.disabled = current === 0;
    if (nextBtn) nextBtn.disabled = current === total - 1;

    // trigger count-up on the impact slide
    if (slides[current].classList.contains("slide-impact")) {
      countUp(slides[current]);
    }
  }

  function go(i) {
    if (i < 0 || i > total - 1 || i === current) return;
    current = i;
    render();
  }
  function next() {
    go(current + 1);
  }
  function prev() {
    go(current - 1);
  }

  // ---- Count-up numbers ----
  function countUp(slide) {
    var nums = slide.querySelectorAll(".mn[data-count]");
    nums.forEach(function (el) {
      if (el.dataset.done) return;
      el.dataset.done = "1";
      var target = parseFloat(el.getAttribute("data-count"));
      var suffix = el.getAttribute("data-suffix") || "";
      var sign = el.textContent.trim().charAt(0) === "-" ? "-" : "+";
      var decimals = (String(target).split(".")[1] || "").length;
      var start = null;
      var dur = 1100;
      function step(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / dur, 1);
        var eased = 1 - Math.pow(1 - p, 3);
        var val = (target * eased).toFixed(decimals);
        el.innerHTML = sign + val + "<em>" + suffix + "</em>";
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }

  // ---- Controls ----
  if (nextBtn) nextBtn.addEventListener("click", next);
  if (prevBtn) prevBtn.addEventListener("click", prev);

  // Click-to-advance on the slide area (ignore links, buttons, dots)
  stage.addEventListener("click", function (e) {
    if (e.target.closest("a, button, .deck-nav, .deck-dots")) return;
    // click right half = next, left third = prev
    var x = e.clientX / window.innerWidth;
    if (x < 0.28) prev();
    else next();
  });

  // Keyboard
  document.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight" || e.key === "PageDown" || e.key === " ") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
      e.preventDefault();
      prev();
    } else if (e.key === "Home") {
      go(0);
    } else if (e.key === "End") {
      go(total - 1);
    } else if (e.key === "f" || e.key === "F") {
      toggleFullscreen();
    }
  });

  // Wheel (throttled) — treat vertical scroll as slide change
  var wheelLock = false;
  stage.addEventListener(
    "wheel",
    function (e) {
      if (wheelLock) return;
      if (Math.abs(e.deltaY) < 24) return;
      wheelLock = true;
      if (e.deltaY > 0) next();
      else prev();
      setTimeout(function () {
        wheelLock = false;
      }, 700);
    },
    { passive: true }
  );

  // Touch swipe
  var touchX = 0;
  var touchY = 0;
  stage.addEventListener(
    "touchstart",
    function (e) {
      touchX = e.changedTouches[0].clientX;
      touchY = e.changedTouches[0].clientY;
    },
    { passive: true }
  );
  stage.addEventListener(
    "touchend",
    function (e) {
      var dx = e.changedTouches[0].clientX - touchX;
      var dy = e.changedTouches[0].clientY - touchY;
      if (Math.abs(dx) < 40 || Math.abs(dx) < Math.abs(dy)) return;
      if (dx < 0) next();
      else prev();
    },
    { passive: true }
  );

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      (document.documentElement.requestFullscreen || function () {}).call(
        document.documentElement
      );
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  }

  render();
})();
