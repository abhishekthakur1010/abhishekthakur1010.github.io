/* =============================================================
   Case-study image lightbox (self-contained, no dependencies)
   - Click any case-study image to open a full-screen close-up.
   - Zoom in / out with buttons, scroll wheel, or double-click;
     drag to pan when zoomed. Close via X, backdrop, or Esc.
   Scope: images inside .csv2 (showcase, before/after, research,
   team strips). Skips tiny icons.
   ============================================================= */
(function () {
  "use strict";
  if (window.__csLightbox) return;
  window.__csLightbox = true;

  var SELECTOR =
    ".csv2 .showgrid img, .csv2 .ba .shot img, .csv2 .research .shot img, .csv2 .teamrow img, .csv2 .phone-screen img";

  var css =
    "" +
    ".csl-zoomable{cursor:zoom-in;}" +
    ".csl-overlay{position:fixed;inset:0;z-index:100000;background:rgba(10,10,12,.92);" +
    "display:flex;align-items:center;justify-content:center;opacity:0;pointer-events:none;" +
    "transition:opacity .28s ease;backdrop-filter:blur(2px);}" +
    ".csl-overlay.csl-open{opacity:1;pointer-events:auto;}" +
    ".csl-stage{position:relative;width:100%;height:100%;overflow:hidden;display:flex;align-items:center;justify-content:center;}" +
    ".csl-img{max-width:92vw;max-height:88vh;border-radius:8px;box-shadow:0 30px 80px rgba(0,0,0,.5);" +
    "transform:scale(.9);opacity:0;transition:transform .3s cubic-bezier(.22,1,.36,1),opacity .28s ease;" +
    "will-change:transform;user-select:none;-webkit-user-drag:none;touch-action:none;}" +
    ".csl-open .csl-img{opacity:1;}" +
    ".csl-toolbar{position:fixed;top:18px;right:18px;z-index:100001;display:flex;gap:10px;}" +
    ".csl-btn{width:44px;height:44px;border:none;border-radius:50%;background:rgba(255,255,255,.14);color:#fff;" +
    "font-size:20px;line-height:1;cursor:pointer;display:flex;align-items:center;justify-content:center;" +
    "transition:background .2s ease,transform .15s ease;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px);}" +
    ".csl-btn:hover{background:rgba(255,255,255,.26);transform:scale(1.06);}" +
    ".csl-btn svg{width:20px;height:20px;fill:none;stroke:#fff;stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;}" +
    ".csl-hint{position:fixed;bottom:20px;left:0;right:0;text-align:center;color:rgba(255,255,255,.6);" +
    "font:500 12px/1 'Poppins',sans-serif;letter-spacing:.04em;pointer-events:none;}" +
    "@media (max-width:600px){.csl-toolbar{top:12px;right:12px;}.csl-btn{width:40px;height:40px;}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var overlay = document.createElement("div");
  overlay.className = "csl-overlay";
  overlay.setAttribute("role", "dialog");
  overlay.setAttribute("aria-label", "Image viewer");
  overlay.innerHTML =
    '<div class="csl-toolbar">' +
    '<button class="csl-btn" data-act="out" aria-label="Zoom out"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M8 11h6M21 21l-4.3-4.3"/></svg></button>' +
    '<button class="csl-btn" data-act="in" aria-label="Zoom in"><svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M11 8v6M8 11h6M21 21l-4.3-4.3"/></svg></button>' +
    '<button class="csl-btn" data-act="close" aria-label="Close"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18"/></svg></button>' +
    "</div>" +
    '<div class="csl-stage"><img class="csl-img" alt="" /></div>' +
    '<div class="csl-hint">Scroll or use +/- to zoom \u00b7 drag to pan \u00b7 Esc to close</div>';
  document.body.appendChild(overlay);

  var stage = overlay.querySelector(".csl-stage");
  var img = overlay.querySelector(".csl-img");

  var scale = 1,
    tx = 0,
    ty = 0,
    dragging = false,
    sx = 0,
    sy = 0;

  function apply(animate) {
    img.style.transition = animate
      ? "transform .3s cubic-bezier(.22,1,.36,1),opacity .28s ease"
      : "opacity .28s ease";
    img.style.transform =
      "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
    img.style.cursor = scale > 1 ? "grab" : "zoom-in";
  }
  function reset() {
    scale = 1;
    tx = 0;
    ty = 0;
    apply(true);
  }
  function zoom(delta, animate) {
    var prev = scale;
    scale = Math.min(4, Math.max(1, +(scale + delta).toFixed(2)));
    if (scale === 1) {
      tx = 0;
      ty = 0;
    }
    if (scale !== prev) apply(animate !== false);
  }

  function open(src, alt) {
    img.src = src;
    img.alt = alt || "";
    reset();
    overlay.classList.add("csl-open");
    document.documentElement.style.overflow = "hidden";
  }
  function close() {
    overlay.classList.remove("csl-open");
    document.documentElement.style.overflow = "";
    setTimeout(function () {
      img.src = "";
    }, 300);
  }

  // wire up clickable images
  function bind() {
    var imgs = document.querySelectorAll(SELECTOR);
    Array.prototype.forEach.call(imgs, function (el) {
      if (el.__cslBound) return;
      // skip very small images (icons, logos)
      if (el.naturalWidth && el.naturalWidth < 60) return;
      el.__cslBound = true;
      el.classList.add("csl-zoomable");
      el.addEventListener("click", function (e) {
        e.preventDefault();
        open(el.currentSrc || el.src, el.alt);
      });
    });
  }
  bind();
  // rebind after load in case of lazy images
  window.addEventListener("load", bind);

  // toolbar actions
  overlay.querySelector(".csl-toolbar").addEventListener("click", function (e) {
    var b = e.target.closest("[data-act]");
    if (!b) return;
    var act = b.getAttribute("data-act");
    if (act === "in") zoom(0.5);
    else if (act === "out") zoom(-0.5);
    else close();
  });

  // click backdrop (not the image) to close
  overlay.addEventListener("click", function (e) {
    if (e.target === overlay || e.target === stage) close();
  });

  // double-click toggles zoom
  img.addEventListener("dblclick", function () {
    scale > 1 ? reset() : zoom(1.5);
  });

  // wheel to zoom
  overlay.addEventListener(
    "wheel",
    function (e) {
      if (!overlay.classList.contains("csl-open")) return;
      e.preventDefault();
      zoom(e.deltaY < 0 ? 0.25 : -0.25, false);
    },
    { passive: false }
  );

  // drag to pan when zoomed
  img.addEventListener("mousedown", function (e) {
    if (scale <= 1) return;
    dragging = true;
    sx = e.clientX - tx;
    sy = e.clientY - ty;
    img.style.cursor = "grabbing";
    e.preventDefault();
  });
  window.addEventListener("mousemove", function (e) {
    if (!dragging) return;
    tx = e.clientX - sx;
    ty = e.clientY - sy;
    apply(false);
  });
  window.addEventListener("mouseup", function () {
    if (dragging) {
      dragging = false;
      apply(false);
    }
  });

  // keyboard
  document.addEventListener("keydown", function (e) {
    if (!overlay.classList.contains("csl-open")) return;
    if (e.key === "Escape") close();
    else if (e.key === "+" || e.key === "=") zoom(0.5);
    else if (e.key === "-") zoom(-0.5);
  });
})();
