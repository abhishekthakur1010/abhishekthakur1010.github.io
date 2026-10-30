/* Look: the visitor chooses how the profile looks (LinkedIn or Instagram style, light or dark, an accent colour).
   Loaded in <head> without defer so the saved look is on <html> before the first paint; the panel is built
   once the page is parsed. ?skin=, ?mode= and ?accent= in the link override what this device has saved. */
(function () {
  var KEY = "pf-look";
  var SKINS = {
    linkedin: { name: "LinkedIn", tag: "Professional", accent: "#0a66c2" },
    instagram: { name: "Instagram", tag: "Visual grid", accent: "#0095f6" }
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
      '<button type="button" class="lk-btn" aria-expanded="false" aria-controls="lk-panel" aria-label="Customize this page" title="Customize">' +
        '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 1.8-.9 1.8-1.9 0-.5-.2-.9-.5-1.3-.3-.3-.5-.8-.5-1.3 0-1 .8-1.9 1.9-1.9H17a4 4 0 0 0 4-4C21 6.4 17 3 12 3Z"/><circle cx="7.5" cy="11" r="1.2" fill="currentColor" stroke="none"/><circle cx="10" cy="7" r="1.2" fill="currentColor" stroke="none"/><circle cx="15" cy="7" r="1.2" fill="currentColor" stroke="none"/></svg>' +
        '</button>' +
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

    var btn = wrap.querySelector(".lk-btn"), panel = wrap.querySelector(".lk-panel");
    var share = wrap.querySelector(".lk-share span");

    function open(on) {
      panel.hidden = !on;
      btn.setAttribute("aria-expanded", on ? "true" : "false");
      if (on) {
        var cur = panel.querySelector("input:checked");
        if (cur) cur.focus();
      }
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
      if (k === "skin") window.dispatchEvent(new Event("scroll")); // light the Instagram tab in view
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

  }
  /* ---------- Instagram tab bar: sticky, jumps to a section, lights up the one in view ---------- */
  var TABS = [
    ["featured", "Work", '<rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>'],
    ["ui-visual", "Visuals", '<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="9" r="1.8"/><path d="m21 15-5-5L5 21"/>'],
    ["experience", "Experience", '<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 13h18"/>'],
    ["about", "Awards", '<circle cx="12" cy="9" r="6"/><path d="m8.5 14-1.5 7 5-3 5 3-1.5-7"/>'],
    ["recommendations", "Reviews", '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-5A8 8 0 1 1 21 12Z"/>'],
    ["interests", "Beyond", '<path d="M12 20s-7.5-4.6-7.5-10A4.4 4.4 0 0 1 12 7.4 4.4 4.4 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10Z"/>']
  ];
  function buildTabs() {
    var main = document.querySelector(".main"), first = document.getElementById("featured");
    if (!main || !first || document.getElementById("ig-tabs")) return;
    var nav = document.createElement("nav");
    nav.className = "ig-tabs";
    nav.id = "ig-tabs";
    nav.setAttribute("aria-label", "Sections");
    nav.innerHTML = TABS.filter(function (t) { return document.getElementById(t[0]); }).map(function (t) {
      return '<a href="#' + t[0] + '" data-tab="' + t[0] + '"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
        t[2] + "</svg><span>" + t[1] + "</span></a>";
    }).join("");
    main.insertBefore(nav, first);
    var links = [].slice.call(nav.querySelectorAll("a")), current = null, ticking = false;
    function spy() {
      ticking = false;
      if (root.getAttribute("data-skin") !== "instagram") return;
      var edge = nav.getBoundingClientRect().bottom + 24, on = links[0];
      links.forEach(function (a) {
        var sec = document.getElementById(a.getAttribute("data-tab"));
        if (sec && sec.getBoundingClientRect().top <= edge) on = a;
      });
      if (on !== current) {
        links.forEach(function (a) { a.classList.toggle("is-on", a === on); if (a === on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current"); });
        current = on;
      }
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(spy); } }, { passive: true });
    spy();
  }

  function init() { build(); buildTabs(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
