// Adds a running gray shimmer to every image and video until it has loaded (see css/shimmer.css).
(function () {
  function done(el) { el.classList.remove('sk'); }
  function mark(el) {
    if (el.tagName === 'IMG') {
      if (!el.getAttribute('src') && !el.getAttribute('srcset')) return;
      if (el.complete && el.naturalWidth) return;
      el.classList.add('sk');
      el.addEventListener('load', function () { done(el); }, { once: true });
      el.addEventListener('error', function () { done(el); }, { once: true });
    } else if (el.tagName === 'VIDEO') {
      if (el.readyState >= 2 || el.poster) return;
      el.classList.add('sk');
      el.addEventListener('loadeddata', function () { done(el); }, { once: true });
      el.addEventListener('error', function () { done(el); }, { once: true });
    }
  }
  function scan(root) { root.querySelectorAll('img, video').forEach(mark); }
  scan(document);
  new MutationObserver(function (list) {
    list.forEach(function (m) {
      m.addedNodes.forEach(function (n) {
        if (n.nodeType !== 1) return;
        if (n.tagName === 'IMG' || n.tagName === 'VIDEO') mark(n); else scan(n);
      });
      if (m.type === 'attributes' && (m.target.tagName === 'IMG' || m.target.tagName === 'VIDEO')) mark(m.target);
    });
  }).observe(document.documentElement, { childList: true, subtree: true, attributes: true, attributeFilter: ['src'] });
})();
