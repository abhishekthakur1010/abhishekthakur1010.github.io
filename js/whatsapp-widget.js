/* =============================================================
   WhatsApp click-to-chat widget (self-contained, no backend)
   - Floating launcher button (bottom-right)
   - Small panel with a friendly greeting + prefilled message
   - "Send on WhatsApp" opens wa.me on app/web with the typed text
   To configure: set WA_NUMBER to your full number, digits only,
   including country code (e.g. India +91 98765 43210 -> "919876543210").
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

  if (window.__waWidgetLoaded) return;
  window.__waWidgetLoaded = true;

  var css =
    "" +
    ".wa-fab{position:fixed;right:58px;bottom:118px;z-index:10000;width:56px;height:56px;border:none;border-radius:50%;" +
    "background:#25D366;box-shadow:0 8px 24px rgba(0,0,0,.22);cursor:pointer;display:flex;align-items:center;justify-content:center;" +
    "transition:transform .25s cubic-bezier(.22,1,.36,1),box-shadow .25s ease;}" +
    ".wa-fab:hover{transform:scale(1.06);box-shadow:0 12px 30px rgba(0,0,0,.28);}" +
    ".wa-fab svg{width:32px;height:32px;}" +
    ".wa-fab .wa-badge{position:absolute;top:-3px;right:-3px;width:18px;height:18px;background:#ff3b30;color:#fff;" +
    "border-radius:50%;font:700 11px/18px 'Poppins',sans-serif;text-align:center;border:2px solid #fff;}" +
    ".wa-panel{position:fixed;right:58px;bottom:184px;z-index:10001;width:340px;max-width:calc(100vw - 32px);" +
    "background:#fff;border-radius:18px;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.26);font-family:'Poppins',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;" +
    "opacity:0;transform:translateY(12px) scale(.98);transform-origin:bottom right;pointer-events:none;transition:opacity .22s ease,transform .22s cubic-bezier(.22,1,.36,1);}" +
    ".wa-panel.wa-open{opacity:1;transform:none;pointer-events:auto;}" +
    ".wa-head{background:#075E54;color:#fff;padding:16px 18px;display:flex;align-items:center;gap:12px;}" +
    ".wa-head .wa-av{width:42px;height:42px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;flex:0 0 auto;font-weight:700;color:#fff;}" +
    ".wa-head .wa-nm{font-size:15px;font-weight:700;line-height:1.2;}" +
    ".wa-head .wa-rl{font-size:12px;opacity:.8;margin-top:2px;}" +
    ".wa-head .wa-x{margin-left:auto;background:none;border:none;color:#fff;font-size:20px;cursor:pointer;opacity:.85;line-height:1;padding:4px;}" +
    ".wa-head .wa-x:hover{opacity:1;}" +
    ".wa-body{background:#e5ddd5;padding:18px;min-height:96px;}" +
    ".wa-bubble{background:#fff;border-radius:0 12px 12px 12px;padding:11px 13px;font-size:13.5px;line-height:1.5;color:#222;box-shadow:0 1px 1px rgba(0,0,0,.08);max-width:88%;}" +
    ".wa-foot{padding:12px;display:flex;gap:8px;align-items:flex-end;border-top:1px solid #eee;background:#fff;}" +
    ".wa-foot textarea{flex:1;resize:none;border:1px solid #e2e2e2;border-radius:20px;padding:10px 14px;font:400 13.5px/1.4 'Poppins',sans-serif;max-height:96px;outline:none;}" +
    ".wa-foot textarea:focus{border-color:#25D366;}" +
    ".wa-send{flex:0 0 auto;width:42px;height:42px;border:none;border-radius:50%;background:#25D366;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:transform .2s ease;}" +
    ".wa-send:hover{transform:scale(1.06);}" +
    ".wa-send svg{width:20px;height:20px;fill:#fff;}" +
    "@media (max-width:768px){.wa-fab{right:18px;bottom:104px;width:52px;height:52px;}.wa-fab svg{width:28px;height:28px;}.wa-panel{right:14px;left:14px;width:auto;max-width:none;bottom:166px;}}";

  var style = document.createElement("style");
  style.textContent = css;
  document.head.appendChild(style);

  var waIcon =
    '<svg viewBox="0 0 32 32" fill="#fff" xmlns="http://www.w3.org/2000/svg"><path d="M16.02 3.2c-7.06 0-12.8 5.73-12.8 12.79 0 2.25.59 4.45 1.71 6.39L3.2 28.8l6.6-1.72a12.76 12.76 0 0 0 6.21 1.58h.01c7.05 0 12.79-5.73 12.79-12.79 0-3.42-1.33-6.63-3.75-9.05a12.7 12.7 0 0 0-9.04-3.62zm0 23.31h-.01a10.6 10.6 0 0 1-5.4-1.48l-.39-.23-3.92 1.03 1.05-3.82-.25-.4a10.57 10.57 0 0 1-1.62-5.65c0-5.86 4.77-10.63 10.64-10.63 2.84 0 5.51 1.11 7.52 3.12a10.56 10.56 0 0 1 3.11 7.52c0 5.87-4.77 10.64-10.63 10.64zm5.83-7.96c-.32-.16-1.89-.93-2.18-1.04-.29-.11-.5-.16-.72.16-.21.32-.82 1.04-1.01 1.25-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.59-.95-.85-1.59-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.15-.14.32-.37.48-.56.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.56-.08-.16-.72-1.74-.99-2.38-.26-.62-.52-.54-.72-.55-.19-.01-.4-.01-.61-.01-.21 0-.56.08-.85.4-.29.32-1.11 1.09-1.11 2.66 0 1.57 1.14 3.08 1.3 3.29.16.21 2.25 3.44 5.46 4.82.76.33 1.36.53 1.83.68.77.24 1.47.21 2.02.13.62-.09 1.89-.77 2.16-1.52.27-.75.27-1.39.19-1.52-.08-.13-.29-.21-.61-.37z"/></svg>';
  var sendIcon =
    '<svg viewBox="0 0 24 24"><path d="M3.4 20.4l17.45-7.48a1 1 0 0 0 0-1.84L3.4 3.6a1 1 0 0 0-1.4.92V9.1c0 .5.37.92.87.98l11.13 1.42-11.13 1.42a1 1 0 0 0-.87.98v4.58a1 1 0 0 0 1.4.92z"/></svg>';

  var initials = WA_NAME.split(" ")
    .map(function (w) {
      return w.charAt(0);
    })
    .join("")
    .slice(0, 2)
    .toUpperCase();

  var fab = document.createElement("button");
  fab.className = "wa-fab";
  fab.setAttribute("aria-label", "Chat on WhatsApp");
  fab.innerHTML = waIcon + '<span class="wa-badge">1</span>';

  var panel = document.createElement("div");
  panel.className = "wa-panel";
  panel.setAttribute("role", "dialog");
  panel.setAttribute("aria-label", "WhatsApp chat");
  panel.innerHTML =
    '<div class="wa-head">' +
    '<div class="wa-av">' + initials + "</div>" +
    "<div><div class=\"wa-nm\">" + WA_NAME + "</div><div class=\"wa-rl\">" + WA_ROLE + "</div></div>" +
    '<button class="wa-x" aria-label="Close chat">&times;</button>' +
    "</div>" +
    '<div class="wa-body"><div class="wa-bubble">' + WA_GREETING + "</div></div>" +
    '<div class="wa-foot">' +
    '<textarea rows="1" placeholder="Write a message..."></textarea>' +
    '<button class="wa-send" aria-label="Send on WhatsApp">' + sendIcon + "</button>" +
    "</div>";

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var textarea = panel.querySelector("textarea");
  var badge = fab.querySelector(".wa-badge");

  function open() {
    panel.classList.add("wa-open");
    if (badge) badge.style.display = "none";
    if (!textarea.value) textarea.value = WA_DEFAULT_MSG;
    setTimeout(function () {
      textarea.focus();
    }, 150);
  }
  function close() {
    panel.classList.remove("wa-open");
  }
  function toggle() {
    panel.classList.contains("wa-open") ? close() : open();
  }
  function send() {
    var msg = (textarea.value || WA_DEFAULT_MSG).trim();
    var url =
      "https://wa.me/" + WA_NUMBER + "?text=" + encodeURIComponent(msg);
    window.open(url, "_blank", "noopener");
  }

  fab.addEventListener("click", toggle);
  panel.querySelector(".wa-x").addEventListener("click", close);
  panel.querySelector(".wa-send").addEventListener("click", send);
  textarea.addEventListener("input", function () {
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 96) + "px";
  });
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
