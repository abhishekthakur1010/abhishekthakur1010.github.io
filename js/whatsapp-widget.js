/* =============================================================
   WhatsApp click-to-chat widget (self-contained, no backend)
   - A floating round launcher that SLIDES OUT from behind the
     right edge of the fixed bottom strip when the strip appears,
     and slides back / hides behind it when the strip hides.
   - It is NOT embedded in the pill; it emerges beside it, aligned
     to the strip's baseline and right edge.
   - Panel with greeting + prefilled message; Send opens wa.me.
   Configure WA_NUMBER below (country code + number, digits only).
   ============================================================= */
(function () {
  "use strict";

  var WA_NUMBER = "919560402668"; // +91 95604 02668
  var WA_NAME = "Abhishek Thakur";
  var WA_ROLE = "Product & UX Designer";
  var WA_GREETING =
    "Hi! \uD83D\uDC4B Thanks for stopping by. Drop a message and I'll get back to you shortly.";
  var WA_DEFAULT_MSG =
    "Hi Abhishek, I came across your portfolio and would love to connect!";
  var GAP = 12; // gap between strip's right edge and the button

  if (window.__waWidgetLoaded) return;
  window.__waWidgetLoaded = true;

  var css =
    "" +
    /* launcher: fixed, positioned each frame beside the strip.
       Hidden state = tucked left (behind the strip) + faded/scaled;
       shown state = slid out to its resting spot on the right. */
    /* the launcher glides horizontally out from BEHIND the strip's right
       edge. Hidden = tucked left under the strip (translateX negative),
       shown = slid right to its resting slot. z-index below the strip so
       it visually slips out from underneath it. */
    ".wa-fab{position:fixed;z-index:9990;width:48px;height:48px;border:none;border-radius:50%;" +
    "background:#25D366;box-shadow:0 8px 22px rgba(37,211,102,.42);cursor:pointer;display:flex;align-items:center;justify-content:center;" +
    "transform:translateX(var(--wa-hidden-x,-64px));opacity:0;pointer-events:none;" +
    "transition:transform .4s ease-in,opacity .25s ease,box-shadow .3s ease;}" +
    ".wa-fab.wa-in{transform:translateX(0);opacity:1;pointer-events:auto;" +
    "transition:transform .45s ease-out,opacity .25s ease,box-shadow .3s ease;}" +
    "@media (hover:hover){.wa-fab.wa-in:hover{box-shadow:0 12px 28px rgba(37,211,102,.55);transform:translateX(0) scale(1.06);}}" +
    ".wa-fab svg{position:absolute;transition:opacity .25s ease,transform .3s cubic-bezier(.22,1,.36,1);}" +
    ".wa-fab svg.wa-ic{width:26px;height:26px;opacity:1;transform:rotate(0) scale(1);}" +
    ".wa-fab svg.wa-close-ic{width:24px;height:24px;opacity:0;transform:rotate(-90deg) scale(.6);}" +
    ".wa-fab.wa-active svg.wa-ic{opacity:0;transform:rotate(90deg) scale(.6);}" +
    ".wa-fab.wa-active svg.wa-close-ic{opacity:1;transform:rotate(0) scale(1);stroke:#fff;}" +
    ".wa-fab.wa-active{background:#ff3b30;box-shadow:0 8px 22px rgba(255,59,48,.42);}" +
    ".wa-fab.wa-in::after{content:'';position:absolute;inset:0;border-radius:50%;pointer-events:none;" +
    "box-shadow:0 0 0 0 rgba(37,211,102,.5);animation:waPulse 2.6s ease-out 1.8s 3;}" +
    "@keyframes waPulse{0%{box-shadow:0 0 0 0 rgba(37,211,102,.45);}70%{box-shadow:0 0 0 12px rgba(37,211,102,0);}100%{box-shadow:0 0 0 0 rgba(37,211,102,0);}}" +
    /* when active (X state) the ripple/pulse turns red to match */
    ".wa-fab.wa-active.wa-in::after{animation:waPulseRed 1.6s ease-out infinite;}" +
    "@keyframes waPulseRed{0%{box-shadow:0 0 0 0 rgba(255,59,48,.5);}70%{box-shadow:0 0 0 12px rgba(255,59,48,0);}100%{box-shadow:0 0 0 0 rgba(255,59,48,0);}}" +
    /* chat panel — positioned in JS to sit just above the launcher */
    ".wa-panel{position:fixed;z-index:10001;width:250px;max-width:calc(100vw - 32px);" +
    "background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.26);font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
    "opacity:0;transform:translateY(12px) scale(.98);transform-origin:bottom right;pointer-events:none;transition:opacity .22s ease,transform .22s cubic-bezier(.22,1,.36,1);}" +
    ".wa-panel.wa-open{opacity:1;transform:none;pointer-events:auto;}" +
    ".wa-head{background:#075E54;color:#fff;padding:12px 14px;display:flex;align-items:center;gap:10px;}" +
    ".wa-head .wa-av{width:36px;height:36px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-weight:700;font-size:13px;color:#fff;}" +
    ".wa-head .wa-nm{font-size:14px;font-weight:700;line-height:1.2;}" +
    ".wa-head .wa-rl{font-size:11px;opacity:.8;margin-top:2px;}" +
    ".wa-head .wa-x{margin-left:auto;background:none;border:none;color:#fff;font-size:19px;cursor:pointer;opacity:.85;line-height:1;padding:2px 4px;}" +
    ".wa-head .wa-x:hover{opacity:1;}" +
    ".wa-body{background:#e5ddd5;padding:14px;min-height:230px;display:flex;flex-direction:column;justify-content:flex-end;}" +
    ".wa-bubble{background:#fff;border-radius:0 12px 12px 12px;padding:9px 11px;font-size:12.5px;line-height:1.45;color:#222;box-shadow:0 1px 1px rgba(0,0,0,.08);max-width:90%;}" +
    ".wa-foot{padding:9px 10px;display:flex;gap:7px;align-items:flex-end;border-top:1px solid #eee;background:#fff;}" +
    ".wa-foot textarea{flex:1;resize:none;border:1px solid #e2e2e2;border-radius:16px;padding:9px 12px;font:400 12.5px/1.45 'Poppins',sans-serif;min-height:60px;max-height:120px;overflow-y:auto;outline:none;}" +
    ".wa-foot textarea:focus{border-color:#25D366;}" +
    ".wa-send{flex:0 0 auto;width:38px;height:38px;border:none;border-radius:50%;background:#25D366;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s ease;}" +
    ".wa-send:hover{transform:scale(1.06);}" +
    ".wa-send svg{width:20px;height:20px;fill:#fff;}" +
    "@media (max-width:768px){.wa-panel{right:14px;left:14px;width:auto;max-width:none;bottom:150px;}}" +
    "@media (prefers-reduced-motion:reduce){.wa-fab{transition:opacity .3s ease;}.wa-fab.wa-in{transform:none;}.wa-fab.wa-in::after{animation:none;}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var waIcon =
    '<svg class="wa-ic" viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M16.02 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.59 4.45 1.71 6.39L3.2 28.8l6.6-1.72a12.76 12.76 0 0 0 6.21 1.58h.01c7.05 0 12.79-5.73 12.79-12.79 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.04-3.62zm0 23.31h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.92 1.03 1.05-3.82-.25-.4a10.57 10.57 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.87-4.77 10.64-10.63 10.64zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55-.19-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z"/></svg>';
  var sendIcon =
    '<svg viewBox="0 0 24 24"><path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.4.92V9.1c0 .5.37.92.87.98l11.13 1.42-11.13 1.42a1 1 0 0 0-.87.98v4.58a1 1 0 0 0 1.4.92z"/></svg>';

  var initials = WA_NAME.split(" ")
    .map(function (w) {
      return w.charAt(0);
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();

  var closeIcon =
    '<svg class="wa-close-ic" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>';

  var fab = document.createElement("button");
  fab.type = "button";
  fab.className = "wa-fab";
  fab.setAttribute("aria-label", "Chat on WhatsApp");
  fab.innerHTML = waIcon + closeIcon;

  var panel = document.createElement("div");
  panel.className = "wa-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "WhatsApp chat");
  panel.innerHTML =
    '<div class="wa-head">' +
    '<div class="wa-av">' + initials + "</div>" +
    "<div><div class=\"wa-nm\">" + WA_NAME + "</div><div class=\"wa-rl\">" + WA_ROLE + "</div></div>" +
    "</div>" +
    '<div class="wa-body"><div class="wa-bubble">' + WA_GREETING + "</div></div>" +
    '<div class="wa-foot">' +
    '<textarea rows="1" placeholder="Write a message..."></textarea>' +
    '<button class="wa-send" aria-label="Send on WhatsApp">' + sendIcon + "</button>" +
    "</div>";

  document.body.appendChild(fab);
  document.body.appendChild(panel);
  var textarea = panel.querySelector("textarea");

  var strip = document.getElementById("userBottomFixed");
  // ensure the strip renders ABOVE the launcher so the button appears to
  // slide out from behind it (and tuck back under it when hiding)
  if (strip) {
    strip.style.position = strip.style.position || "fixed";
    strip.style.zIndex = "9995";
  }

  /* Keep the button parked just to the RIGHT of the strip, centered
     on the strip's vertical middle. Recomputed on resize/scroll so it
     always tucks against / emerges from the strip's right edge. */
  function place() {
    var sz = fab.offsetWidth || 48;
    if (strip) {
      var r = strip.getBoundingClientRect();
      var left = r.right + GAP;
      var maxLeft = window.innerWidth - sz - 10;
      if (left > maxLeft) left = maxLeft; // don't run off screen
      fab.style.left = left + "px";
      fab.style.right = "auto";
      fab.style.top = r.top + r.height / 2 - sz / 2 + "px";
      fab.style.bottom = "auto";
      // hidden X = distance to slide left so the button tucks fully back
      // behind the strip's right edge (it emerges from under the pill)
      var hide = -(left - r.right + sz + 8);
      fab.style.setProperty("--wa-hidden-x", hide + "px");
    } else {
      fab.style.right = "22px";
      fab.style.left = "auto";
      fab.style.bottom = "22px";
      fab.style.top = "auto";
      fab.style.setProperty("--wa-hidden-x", "-64px");
    }
    placePanel();
  }

  /* Anchor the panel just above the launcher, right edges aligned,
     clamped so it never runs off either side of the viewport. */
  function placePanel() {
    var fr = fab.getBoundingClientRect();
    if (!fr.width) return;
    // On small screens use a near full-width sheet anchored to the bottom.
    if (window.innerWidth <= 768) {
      panel.style.left = "14px";
      panel.style.right = "14px";
      panel.style.bottom = window.innerHeight - fr.top + 12 + "px";
      return;
    }
    var pw = panel.offsetWidth || 250;
    var margin = 14;
    // align the panel's LEFT edge with the button's left edge so it
    // opens out to the right from the launcher
    var left = fr.left;
    if (left + pw > window.innerWidth - margin) {
      left = window.innerWidth - margin - pw; // keep it on-screen
    }
    if (left < margin) left = margin;
    panel.style.left = left + "px";
    panel.style.right = "auto";
    panel.style.transformOrigin = "bottom left";
    panel.style.bottom = window.innerHeight - fr.top + 12 + "px"; // sit above the button
  }

  function show() {
    place();
    fab.classList.add("wa-in");
  }
  function hide() {
    fab.classList.remove("wa-in");
    panel.classList.remove("wa-open");
    fab.classList.remove("wa-active");
    fab.setAttribute("aria-label", "Chat on WhatsApp");
  }

  if (strip && "MutationObserver" in window) {
    var sync = function () {
      strip.classList.contains("showFixed") ? show() : hide();
    };
    new MutationObserver(sync).observe(strip, {
      attributes: true,
      attributeFilter: ["class"],
    });
    window.addEventListener("resize", place, { passive: true });
    window.addEventListener("scroll", place, { passive: true });
    sync();
  } else {
    // no strip on this page: simple reveal after scroll
    place();
    var onScroll = function () {
      if (window.pageYOffset > 400) {
        show();
        window.removeEventListener("scroll", onScroll);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    setTimeout(show, 1200);
  }

  function autosize() {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  }
  function open() {
    placePanel();
    panel.classList.add("wa-open");
    fab.classList.add("wa-active");
    fab.setAttribute("aria-label", "Close chat");
    if (!textarea.value) textarea.value = WA_DEFAULT_MSG;
    setTimeout(function () {
      autosize();
      textarea.focus();
      textarea.setSelectionRange(
        textarea.value.length,
        textarea.value.length
      );
    }, 160);
  }
  function close() {
    panel.classList.remove("wa-open");
    fab.classList.remove("wa-active");
    fab.setAttribute("aria-label", "Chat on WhatsApp");
  }
  function toggle() {
    panel.classList.contains("wa-open") ? close() : open();
  }
  function send() {
    var msg = (textarea.value || WA_DEFAULT_MSG).trim();
    var url = "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  }

  fab.addEventListener("click", function (e) {
    e.preventDefault();
    toggle();
  });
  panel.querySelector(".wa-send").addEventListener("click", send);
  textarea.addEventListener("input", autosize);
  textarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") close();
  });
})();
