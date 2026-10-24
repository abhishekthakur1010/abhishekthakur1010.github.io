// Visitor line on the cover: today's date, the visitor's city and their visitor number.
// Each browser is counted once and keeps its number on later visits.
(function () {
  var card = document.getElementById('visitor-card');
  if (!card) return;
  var numWrap = document.getElementById('vc-num-wrap');
  var numEl = document.getElementById('vc-num');
  var dateEl = document.getElementById('vc-date');
  var placeEl = document.getElementById('vc-place');

  var COUNTER = 'https://api.counterapi.dev/v1/abhishekthakur1010-portfolio/visitors';
  var GEO = 'https://get.geojs.io/v1/ip/geo.json';
  var KEY = 'at-visitor-number';

  dateEl.textContent = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  function get(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    });
  }
  function show(n) {
    numEl.textContent = '#' + String(n).padStart(5, '0');
    numWrap.hidden = false;
  }

  var saved = null;
  try { saved = +localStorage.getItem(KEY) || null; } catch (e) {}

  function remember(n) {
    try { localStorage.setItem(KEY, String(n)); } catch (e) {}
    show(n);
  }

  // Inside a claude.ai preview the page keeps its own shared counter; on the live
  // site it uses the public counter service.
  function countWithPreviewStore() {
    if (!window.claude || !window.claude.use) return Promise.reject(new Error('not a preview'));
    return window.claude.use('db').then(function (db) {
      if (!db) throw new Error('no store');
      var ref = db.doc('counters/visitors');
      return ref.get().then(function (snap) {
        var n = ((snap.exists && snap.data().count) || 0) + 1;
        return ref.set({ count: n }).then(function () { return n; });
      });
    });
  }
  function countWithService() {
    return get(COUNTER + '/up').then(function (d) {
      var n = d && (d.count != null ? d.count : d.value);
      if (!n) throw new Error('no count');
      return n;
    });
  }

  if (saved) {
    show(saved);
  } else {
    countWithPreviewStore().catch(countWithService).then(remember).catch(function () {
      // No counter reachable: the line simply shows the date (and city if known).
    });
  }

  get(GEO).then(function (g) {
    var place = [g.city, g.country_code].filter(Boolean).join(', ');
    if (place) { placeEl.textContent = place; placeEl.hidden = false; }
  }).catch(function () {});
})();
