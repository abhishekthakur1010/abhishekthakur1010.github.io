/* Look: the visitor chooses how the profile looks (a social-platform style, light or dark, an accent colour).
   Loaded in <head> without defer so the saved look is on <html> before the first paint; the panel is built
   once the page is parsed. ?skin=, ?mode= and ?accent= in the link override what this device has saved. */
(function () {
  var KEY = "pf-look";
  var SKINS = {
    linkedin: { name: "LinkedIn", tag: "Professional", accent: "#0a66c2" },
    instagram: { name: "Instagram", tag: "Visual grid", accent: "#0095f6" },
    x: { name: "X", tag: "Feed", accent: "#1d9bf0" },
    behance: { name: "Behance", tag: "Portfolio", accent: "#0057ff" }
  };
  var MODES = { light: "Light", dark: "Dark", auto: "Auto" };
  var ACCENTS = ["#7c3aed", "#db2777", "#ea580c", "#16a34a", "#0d9488"];
  var root = document.documentElement;
  var dark = window.matchMedia ? matchMedia("(prefers-color-scheme: dark)") : null;

  function hex(v) {
    v = String(v || "").trim().replace(/^#?/, "#").toLowerCase();
    return /^#[0-9a-f]{6}$/.test(v) ? v : "";
  }
  function clean(p) {
    return {
      skin: SKINS[p.skin] ? p.skin : "linkedin",
      mode: MODES[p.mode] ? p.mode : "light",
      accent: hex(p.accent)
    };
  }
  function load() {
    var p = {};
    try { p = JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) {}
    try {
      var q = new URLSearchParams(location.search);
      ["skin", "mode", "accent"].forEach(function (k) { if (q.get(k)) p[k] = q.get(k); });
    } catch (e) {}
    return clean(p);
  }
  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }
  function apply(p) {
    var m = p.mode === "auto" ? (dark && dark.matches ? "dark" : "light") : p.mode;
    root.setAttribute("data-skin", p.skin);
    root.setAttribute("data-mode", m);
    root.style.colorScheme = m;
    if (p.accent) {
      root.style.setProperty("--accent", p.accent);
      root.style.setProperty("--accent-hover", "color-mix(in srgb, " + p.accent + " 78%, #000)");
      root.style.setProperty("--accent-soft", "color-mix(in srgb, " + p.accent + " 12%, transparent)");
    } else {
      ["--accent", "--accent-hover", "--accent-soft"].forEach(function (k) { root.style.removeProperty(k); });
    }
  }

  var look = load();
  apply(look);
  if (dark && dark.addEventListener) dark.addEventListener("change", function () { if (look.mode === "auto") apply(look); });

  /* ---------- Panel ---------- */
  function radio(group, value, checked, label, inner, cls) {
    return '<label class="lk-opt ' + (cls || "") + '"><input type="radio" name="' + group + '" value="' + value + '"' +
      (checked ? " checked" : "") + ' aria-label="' + label + '" />' + inner + "</label>";
  }
  function build() {
    if (document.getElementById("lk")) return;
    var wrap = document.createElement("div");
    wrap.className = "lk";
    wrap.id = "lk";
    var skins = Object.keys(SKINS).map(function (k) {
      var s = SKINS[k];
      return radio("lk-skin", k, look.skin === k, s.name + ", " + s.tag,
        '<span class="lk-prev lk-prev-' + k + '" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></span>' +
        '<span class="lk-name">' + s.name + '</span><span class="lk-tag">' + s.tag + "</span>", "lk-skin");
    }).join("");
    var modes = Object.keys(MODES).map(function (k) {
      return radio("lk-mode", k, look.mode === k, MODES[k], "<span>" + MODES[k] + "</span>", "lk-seg");
    }).join("");
    var accents = radio("lk-accent", "", !look.accent, "Style default", '<span class="lk-sw lk-sw-auto"></span>', "lk-dot") +
      ACCENTS.map(function (c) {
        return radio("lk-accent", c, look.accent === c, "Accent " + c, '<span class="lk-sw" style="background:' + c + '"></span>', "lk-dot");
      }).join("");
    wrap.innerHTML =
      '<button type="button" class="lk-btn" aria-expanded="false" aria-controls="lk-panel" aria-label="Customize this page">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.9 1.9-1.9H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor" stroke="none"/><circle cx="10" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none"/></svg>' +
        '<span class="lk-btn-label">Customize</span></button>' +
      '<p class="lk-nudge" hidden>See this profile as Instagram, X or Behance <button type="button" aria-label="Dismiss">×</button></p>' +
      '<div class="lk-panel" id="lk-panel" role="dialog" aria-labelledby="lk-title" hidden>' +
        '<div class="lk-head"><div><h2 id="lk-title">Make it yours</h2><p>Saved on this device.</p></div>' +
          '<button type="button" class="lk-close" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6 6 18"/></svg></button></div>' +
        '<fieldset><legend>View as</legend><div class="lk-skins">' + skins + "</div></fieldset>" +
        '<fieldset><legend>Theme</legend><div class="lk-segs">' + modes + "</div></fieldset>" +
        '<fieldset><legend>Accent</legend><div class="lk-dots">' + accents + "</div></fieldset>" +
        '<div class="lk-foot"><button type="button" class="lk-reset">Reset</button>' +
          '<button type="button" class="lk-share"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1"/><path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1"/></svg><span>Copy link to this look</span></button></div>' +
      "</div>";
    document.body.appendChild(wrap);

    var btn = wrap.querySelector(".lk-btn"), panel = wrap.querySelector(".lk-panel"), nudge = wrap.querySelector(".lk-nudge");
    var share = wrap.querySelector(".lk-share span");

    function open(on) {
      panel.hidden = !on;
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      if (on) {
        hideNudge();
        var cur = panel.querySelector("input:checked");
        if (cur) cur.focus();
      }
    }
    function hideNudge() {
      nudge.hidden = true;
      try { localStorage.setItem(KEY + "-nudged", "1"); } catch (e) {}
    }
    function sync() {
      panel.querySelectorAll("input").forEach(function (i) {
        var k = i.name.slice(3);
        i.checked = (look[k] || "") === i.value;
      });
    }
    function set(k, v) {
      look[k] = v;
      look = clean(look);
      save(look);
      var go = function () { apply(look); };
      // a soft cross-fade between styles where the browser supports it
      if (k === "skin" && document.startViewTransition && !matchMedia("(prefers-reduced-motion: reduce)").matches) document.startViewTransition(go);
      else go();
    }

    btn.addEventListener("click", function () { open(panel.hidden); });
    wrap.querySelector(".lk-close").addEventListener("click", function () { open(false); btn.focus(); });
    panel.addEventListener("change", function (e) {
      if (e.target.name) set(e.target.name.slice(3), e.target.value);
    });
    wrap.querySelector(".lk-reset").addEventListener("click", function () {
      look = clean({});
      try { localStorage.removeItem(KEY); } catch (e) {}
      apply(look);
      sync();
    });
    wrap.querySelector(".lk-share").addEventListener("click", function () {
      var u = new URL(location.href);
      ["skin", "mode", "accent"].forEach(function (k) { u.searchParams.delete(k); });
      u.searchParams.set("skin", look.skin);
      if (look.mode !== "light") u.searchParams.set("mode", look.mode);
      if (look.accent) u.searchParams.set("accent", look.accent.slice(1));
      u.hash = "";
      var done = function () { share.textContent = "Link copied"; setTimeout(function () { share.textContent = "Copy link to this look"; }, 1800); };
      if (navigator.clipboard) navigator.clipboard.writeText(u.toString()).then(done, function () { prompt("Copy this link", u.toString()); });
      else prompt("Copy this link", u.toString());
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !panel.hidden) { open(false); btn.focus(); }
    });
    document.addEventListener("click", function (e) {
      if (!panel.hidden && !wrap.contains(e.target)) open(false);
    });
    nudge.querySelector("button").addEventListener("click", hideNudge);

    // one gentle hint per device, a few seconds after the profile shows
    var nudged = false;
    try { nudged = localStorage.getItem(KEY + "-nudged") === "1" || !!localStorage.getItem(KEY); } catch (e) {}
    if (!nudged) setTimeout(function () {
      if (panel.hidden && !root.classList.contains("cat-mode")) {
        nudge.hidden = false;
        setTimeout(function () { if (!nudge.hidden) nudge.hidden = true; }, 9000);
      }
    }, 5000);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build);
  else build();
})();
