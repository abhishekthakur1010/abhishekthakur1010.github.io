(function () {
  // "…see more" on long text blocks: clamp only when the text actually overflows.
  document.querySelectorAll('.clamp').forEach(function (el) {
    var body = el.querySelector('.clamp-body');
    var btn = el.querySelector('.see-more');
    el.classList.add('is-clamped');
    if (body.scrollHeight <= body.clientHeight + 4) {
      el.classList.remove('is-clamped');
      return;
    }
    btn.addEventListener('click', function () {
      el.classList.remove('is-clamped');
    });
  });

  // "Show all" buttons reveal the extra items in a list.
  document.querySelectorAll('[data-show-all]').forEach(function (btn) {
    var list = document.getElementById(btn.getAttribute('data-show-all'));
    var label = btn.querySelector('span');
    var more = label.textContent;
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      list.querySelectorAll('[data-extra]').forEach(function (item) {
        item.classList.toggle('is-hidden', open);
      });
      btn.setAttribute('aria-expanded', String(!open));
      label.textContent = open ? more : 'Show less';
      if (open) list.closest('.card').scrollIntoView({ block: 'start' });
    });
  });

  // Durations for current roles, so they never go stale.
  document.querySelectorAll('[data-since]').forEach(function (el) {
    var p = el.getAttribute('data-since').split('-');
    var now = new Date();
    var months = (now.getFullYear() - +p[0]) * 12 + (now.getMonth() + 1 - +p[1]) + 1;
    var y = Math.floor(months / 12), m = months % 12, out = [];
    if (y) out.push(y + (y > 1 ? ' yrs' : ' yr'));
    if (m) out.push(m + (m > 1 ? ' mos' : ' mo'));
    el.textContent = out.join(' ');
  });

  // Show a compact name + avatar in the top bar once the profile card scrolls away.
  var topbar = document.querySelector('.topbar');
  var profile = document.querySelector('.profile');
  if (topbar && profile && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      topbar.classList.toggle('is-condensed', !entries[0].isIntersecting);
    }, { rootMargin: '-56px 0px 0px 0px', threshold: 0 }).observe(profile.querySelector('.actions'));
  }

  // More menu next to Resume: opens on click, closes on Esc or a click elsewhere.
  var moreBtn = document.querySelector('.more-btn');
  var moreMenu = document.getElementById('more-menu');
  if (moreBtn && moreMenu) {
    var setOpen = function (open, focusFirst) {
      moreMenu.hidden = !open;
      moreBtn.setAttribute('aria-expanded', String(open));
      if (open && focusFirst) moreMenu.querySelector('a').focus();
    };
    moreBtn.addEventListener('click', function (ev) {
      ev.stopPropagation();
      setOpen(moreMenu.hidden, ev.detail === 0);
    });
    document.addEventListener('click', function (ev) {
      if (!moreMenu.hidden && !moreMenu.contains(ev.target)) setOpen(false);
    });
    document.querySelectorAll('[data-open-more]').forEach(function (link) {
      link.addEventListener('click', function (ev) {
        ev.preventDefault(); ev.stopPropagation();
        setOpen(true, true);
      });
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === 'Escape' && !moreMenu.hidden) { setOpen(false); moreBtn.focus(); }
    });
    moreMenu.addEventListener('keydown', function (ev) {
      if (ev.key !== 'ArrowDown' && ev.key !== 'ArrowUp') return;
      var items = Array.prototype.slice.call(moreMenu.querySelectorAll('a'));
      var i = items.indexOf(document.activeElement);
      items[(i + (ev.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length].focus();
      ev.preventDefault();
    });
  }

  // Sideways rails (awards): arrow buttons scroll by one card and disable at the ends.
  document.querySelectorAll('[data-rail]').forEach(function (btn) {
    var rail = document.getElementById(btn.getAttribute('data-rail'));
    if (!rail) return;
    var dir = +btn.getAttribute('data-dir');
    function sync() {
      var max = rail.scrollWidth - rail.clientWidth - 2;
      btn.disabled = dir < 0 ? rail.scrollLeft <= 2 : rail.scrollLeft >= max;
    }
    btn.addEventListener('click', function () {
      var card = rail.firstElementChild;
      var step = card ? card.getBoundingClientRect().width + 16 : rail.clientWidth * 0.8;
      rail.scrollBy({ left: dir * step, behavior: 'smooth' });
    });
    rail.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    sync();
  });

  // Award cards open a media viewer with the full image and description.
  var modal = document.getElementById('media-modal');
  if (modal && typeof modal.showModal === 'function') {
    var mImg = modal.querySelector('.media-img img');
    document.querySelectorAll('.award-open').forEach(function (btn) {
      btn.addEventListener('click', function () {
        mImg.src = btn.getAttribute('data-media');
        mImg.alt = btn.querySelector('.award-title').textContent;
        modal.querySelector('#media-title').textContent = btn.querySelector('.award-title').textContent;
        modal.querySelector('.media-meta').textContent = btn.querySelector('.award-meta').textContent;
        modal.querySelector('.media-desc').textContent = btn.querySelector('.award-desc').textContent;
        modal.showModal();
      });
    });
    modal.querySelector('.media-close').addEventListener('click', function () { modal.close(); });
    modal.addEventListener('click', function (ev) { if (ev.target === modal) modal.close(); });
  }

  // Contents rail: ticks mark the section in view; clicking opens the list.
  var toc = document.querySelector('.toc');
  if (toc) {
    var rail = toc.querySelector('.toc-rail'), panel = toc.querySelector('.toc-panel');
    var ticks = toc.querySelectorAll('.toc-tick');
    var links = Array.prototype.slice.call(toc.querySelectorAll('.toc-list a'));
    // Ticks follow the section links only; "All categories" leads the list but is not a section.
    var sectionLinks = links.filter(function (a) { return !a.closest('.toc-back'); });
    function setToc(open) { panel.hidden = !open; rail.setAttribute('aria-expanded', open ? 'true' : 'false'); }
    rail.addEventListener('click', function () { setToc(panel.hidden); if (!panel.hidden) links[0].focus({ preventScroll: true }); });
    links.forEach(function (a) { a.addEventListener('click', function () { setToc(false); }); });
    document.addEventListener('click', function (ev) { if (!toc.contains(ev.target)) setToc(false); });
    document.addEventListener('keydown', function (ev) { if (ev.key === 'Escape' && !panel.hidden) { setToc(false); rail.focus(); } });
    if ('IntersectionObserver' in window) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (en) {
          if (!en.isIntersecting) return;
          sectionLinks.forEach(function (a, k) {
            var on = a.getAttribute('href') === '#' + en.target.id;
            a.classList.toggle('is-active', on);
            if (ticks[k]) ticks[k].classList.toggle('is-active', on);
          });
        });
      }, { rootMargin: '-35% 0px -60% 0px' });
      links.forEach(function (a) { var h = a.getAttribute('href'); if (h.charAt(0) === '#') { var el = document.getElementById(h.slice(1)); if (el) spy.observe(el); } });
    }
  }

  // Visitor count: 1,011 plus each browser counted once by the public counter service (shown in the intro and on the banner strip).
  var visitNums = document.querySelectorAll('[data-visit-num]');
  if (visitNums.length && window.fetch) {
    var BASE = 1011, COUNTER = 'https://api.counterapi.dev/v1/abhishekthakur1010-portfolio/profile-visitors';
    var seen = false;
    try { seen = localStorage.getItem('at-visit-counted') === '1'; } catch (e) {}
    fetch(COUNTER + (seen ? '/' : '/up'), { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (d) {
        var n = d && (d.count != null ? d.count : d.value);
        if (typeof n !== 'number') return;
        var shown = (BASE + n).toLocaleString('en-IN');
        visitNums.forEach(function (el) { el.textContent = shown; });
        if (!seen) { try { localStorage.setItem('at-visit-counted', '1'); } catch (e) {} }
      })
      .catch(function () { /* keep the starting number */ });
  }
})();
