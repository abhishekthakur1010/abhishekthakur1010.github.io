/* The walk: drives scroll progress for the hero, each chapter and the trail. */
(function () {
  var root = document.documentElement;
  var hero = document.querySelector('.hero');
  var bar = document.getElementById('bar');
  var trail = document.querySelector('.trail');
  var fill = document.getElementById('trailFill');
  var countNow = document.getElementById('countNow');
  var chapters = Array.prototype.slice.call(document.querySelectorAll('.ch'));
  var links = Array.prototype.slice.call(document.querySelectorAll('.trail a'));
  var story = document.getElementById('story');
  var ticking = false;

  function clamp(v) { return v < 0 ? 0 : v > 1 ? 1 : v; }

  function update() {
    ticking = false;
    var vh = window.innerHeight;
    var y = window.scrollY || window.pageYOffset;

    // Hero drifts and fades as you start walking
    var h = clamp(y / (hero.offsetHeight * 0.8));
    hero.style.setProperty('--hero', h.toFixed(3));

    var current = 0;
    chapters.forEach(function (ch, i) {
      var top = ch.offsetTop;
      var run = ch.offsetHeight - vh;
      var p = clamp((y - top + vh * 0.35) / (run + vh * 0.35));
      // copy reveals in the first third, holds, then the scene dims into the next one
      var inn = clamp((y - top + vh * 0.55) / (vh * 0.6));
      var out = i === chapters.length - 1 ? 0 : clamp((y - top - run + vh * 0.25) / (vh * 0.25));
      ch.style.setProperty('--p', p.toFixed(3));
      ch.style.setProperty('--in', inn.toFixed(3));
      ch.style.setProperty('--out', (out * 0.85).toFixed(3));
      if (y + vh * 0.5 >= top) current = i + 1;
    });

    // Trail: overall progress through the seven stops
    var start = story.offsetTop - vh * 0.5;
    var end = story.offsetTop + story.offsetHeight - vh;
    var total = clamp((y - start) / (end - start));
    var mobile = window.matchMedia('(max-width: 860px)').matches;
    if (mobile) {
      fill.style.height = '';
      fill.style.setProperty('--total', (total * 100).toFixed(1) + '%');
    } else {
      // Snap the walker between stops so it sits on the current dot, easing within a chapter
      var lineH = fill.parentNode.offsetHeight;
      var stop = 0;
      if (current > 0) {
        var ch = chapters[current - 1];
        var local = clamp((y - ch.offsetTop) / (ch.offsetHeight - vh));
        stop = (current - 1 + (current < chapters.length ? local : 0)) / (chapters.length - 1);
      }
      fill.style.height = (clamp(stop) * lineH).toFixed(1) + 'px';
    }

    links.forEach(function (a) {
      var i = +a.getAttribute('data-i');
      a.classList.toggle('now', i === current);
      a.classList.toggle('past', i < current);
      if (i === current) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
    });
    var on = current > 0;
    trail.classList.toggle('on', on);
    bar.classList.toggle('on', on);
    countNow.textContent = ('0' + current).slice(-2);
  }

  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', update);
  update();
})();
