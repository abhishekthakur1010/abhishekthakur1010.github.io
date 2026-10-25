// Live strip on the Diwali banner: the visitor's city, current weather and local time.
// City comes from a free IP lookup (get.geojs.io, then ipapi.co), weather from Open-Meteo; no keys, nothing stored
// beyond this tab. Anything that fails stays hidden, and the clock always runs from the visitor's own browser.
(function () {
  var strip = document.querySelector('.cats-live');
  if (!strip) return;
  var timeEl = strip.querySelector('[data-live-time]');
  var tz = null;

  function tick() {
    var opts = { hour: 'numeric', minute: '2-digit', second: '2-digit' };
    if (tz) opts.timeZone = tz;
    try { timeEl.textContent = new Date().toLocaleTimeString('en-US', opts); }
    catch (e) { delete opts.timeZone; timeEl.textContent = new Date().toLocaleTimeString('en-US', opts); }
  }
  tick();
  setInterval(tick, 1000);

  if (!window.fetch) return;
  function getJSON(url) {
    return fetch(url, { cache: 'no-store' }).then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); });
  }
  // WMO weather codes → a small emoji; clear skies show a moon at night
  function icon(code, isDay) {
    if (code === 0) return isDay ? '☀️' : '🌙';
    if (code <= 3) return isDay ? '⛅' : '☁️';
    if (code === 45 || code === 48) return '🌫️';
    if (code >= 95) return '⛈️';
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) return '❄️';
    if (code >= 80) return '🌦️';
    return '🌧️';
  }

  var KEY = 'live-strip-place';
  var cached = null;
  try { cached = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
  var place = cached ? Promise.resolve(cached) : getJSON('https://get.geojs.io/v1/ip/geo.json')
    .then(function (d) { return { city: d.city, lat: +d.latitude, lon: +d.longitude, tz: d.timezone }; })
    .catch(function () {
      return getJSON('https://ipapi.co/json/').then(function (d) { return { city: d.city, lat: +d.latitude, lon: +d.longitude, tz: d.timezone }; });
    });

  place.then(function (p) {
    if (!p) return;
    try { sessionStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
    if (p.tz) { tz = p.tz; tick(); }
    if (p.city) {
      strip.querySelector('[data-live-city]').textContent = p.city;
      strip.querySelector('.cl-city').hidden = false;
    }
    if (isFinite(p.lat) && isFinite(p.lon)) {
      return getJSON('https://api.open-meteo.com/v1/forecast?latitude=' + p.lat + '&longitude=' + p.lon + '&current=temperature_2m,weather_code,is_day')
        .then(function (w) {
          var c = w && w.current;
          if (!c || typeof c.temperature_2m !== 'number') return;
          strip.querySelector('[data-live-temp]').textContent = Math.round(c.temperature_2m) + '°C';
          strip.querySelector('[data-live-icon]').textContent = icon(c.weather_code, c.is_day);
          strip.querySelector('.cl-temp').hidden = false;
        });
    }
  }).catch(function () { /* city and weather stay hidden; the clock keeps running */ });
})();
