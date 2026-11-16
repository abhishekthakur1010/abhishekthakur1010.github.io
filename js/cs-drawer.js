// Right-side detail drawer: any [data-drawer="id"] opens <template id="id"> (data-title on the template = small label)
(function () {
  var root = document.documentElement, last = null;
  var wrap = document.createElement("div");
  wrap.innerHTML = '<div class="csd-scrim"></div><aside class="csd" role="dialog" aria-modal="true" aria-hidden="true" tabindex="-1">' +
    '<div class="csd-top"><p></p><button class="csd-x" type="button" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
    '<div class="csd-body"></div></aside>';
  while (wrap.firstChild) document.body.appendChild(wrap.firstChild);
  var panel = document.querySelector(".csd"), body = panel.querySelector(".csd-body"), label = panel.querySelector(".csd-top p");
  function open(id, from) {
    var t = document.getElementById(id); if (!t) return;
    body.innerHTML = ""; body.appendChild(t.content.cloneNode(true)); body.scrollTop = 0;
    label.textContent = t.getAttribute("data-title") || "";
    last = from; root.classList.add("csd-on"); panel.setAttribute("aria-hidden", "false");
    setTimeout(function () { panel.focus(); }, 50);
  }
  function close() { root.classList.remove("csd-on"); panel.setAttribute("aria-hidden", "true"); if (last) last.focus(); }
  document.addEventListener("click", function (e) {
    var b = e.target.closest("[data-drawer]");
    if (b) { e.preventDefault(); open(b.getAttribute("data-drawer"), b); return; }
    if (e.target.closest(".csd-x, .csd-scrim")) close();
  });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && root.classList.contains("csd-on")) close(); });
})();
