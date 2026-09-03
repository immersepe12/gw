/* Generations Wellness — v2 enhancement script (no dependencies, ~7KB)
   Every module is optional enhancement; the page is complete without JS.
   Spec: docs/design-v2-spec.md */
(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  /* ---------------------------------------------- mobile navigation drawer */
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      var open = document.body.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        document.body.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.focus();
      }
      if (e.key === 'Tab' && document.body.classList.contains('nav-open')) {
        var focusables = [toggle].concat(
          Array.prototype.slice.call(nav.querySelectorAll('a, button'))
        );
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault(); last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault(); first.focus();
        }
      }
    });
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      if (e.target.closest('.site-nav') || e.target.closest('.nav-toggle')) return;
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* ---------------------------------------------- header: transparent-over-hero flip
     A sentinel sits at the hero's end; once it passes above the bar, the header
     flips from transparent-on-dark to the cream ledger bar. */
  var sentinel = document.querySelector('.hero-end-sentinel');
  if (header && sentinel && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      var e = entries[0];
      header.classList.toggle('past-hero', !e.isIntersecting && e.boundingClientRect.top < 0);
    }, { rootMargin: '-72px 0px 0px 0px' }).observe(sentinel);
  } else if (header) {
    header.classList.add('past-hero');
  }

  /* ---------------------------------------------- scroll-progress line (fallback)
     Pure-CSS scroll(root) timeline where supported; otherwise one rAF-throttled
     scroll handler writes --progress. */
  var progress = document.querySelector('.progress-line');
  var hasScrollTimeline = window.CSS && CSS.supports && CSS.supports('animation-timeline: scroll(root)');
  if (progress && !hasScrollTimeline) {
    progress.classList.add('js-progress');
    var ticking = false;
    var updateProgress = function () {
      ticking = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      progress.style.setProperty('--progress', max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(updateProgress); }
    }, { passive: true });
    updateProgress();
  }

  /* ---------------------------------------------- oxygen meridian (fallback draw) */
  var meridian = document.querySelector('.meridian');
  if (meridian && !hasScrollTimeline) {
    meridian.classList.add('js-meridian');
    var mTick = false;
    var updateMeridian = function () {
      mTick = false;
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      /* 1.35× overshoot keeps the drawn tip ahead of the viewport */
      meridian.style.setProperty('--p', max > 0 ? Math.min(1.35, 1.35 * window.scrollY / max) : 1);
    };
    window.addEventListener('scroll', function () {
      if (!mTick) { mTick = true; requestAnimationFrame(updateMeridian); }
    }, { passive: true });
    updateMeridian();
  }

  /* ---------------------------------------------- on-view reveals
     Fire once at 25% visibility; safety timer guarantees nothing stays hidden. */
  var items = document.querySelectorAll('.reveal');
  var revealAll = function () {
    items.forEach(function (el) { el.classList.add('is-visible'); });
  };
  if (!reduced && 'IntersectionObserver' in window && items.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.25 });
    items.forEach(function (el) { io.observe(el); });
    /* failsafe scoped to the current viewport: rescue stragglers the observer
       missed without cancelling below-fold entrances */
    setTimeout(function () {
      items.forEach(function (el) {
        if (!el.classList.contains('is-visible') &&
            el.getBoundingClientRect().top < window.innerHeight) {
          el.classList.add('is-visible');
          io.unobserve(el);
        }
      });
    }, 2500);
  } else {
    revealAll();
  }

  /* ---------------------------------------------- breath rings: pause off-screen */
  var breathers = document.querySelectorAll('[data-breathe]');
  if (breathers.length && 'IntersectionObserver' in window && !reduced) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        entry.target.classList.toggle('breathing', entry.isIntersecting);
      });
    }, { threshold: 0 });
    breathers.forEach(function (el) { bio.observe(el); });
  }

  /* ---------------------------------------------- steps axis + generic in-view hooks
     (fallback timing for scroll-linked fills where scroll timelines are missing) */
  var inviewEls = document.querySelectorAll('[data-inview]');
  if (inviewEls.length && 'IntersectionObserver' in window) {
    var vio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          vio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
    inviewEls.forEach(function (el) { vio.observe(el); });
  }

  /* ---------------------------------------------- pressure counters (truth-first)
     Canonical numbers live in the HTML. Only when scroll-timeline + @property
     support exists AND motion is allowed do we swap in animated counter spans.
     "100%" / "1st" are never wired (data-count guards). */
  var canCount = !reduced && window.CSS && CSS.supports &&
    CSS.supports('animation-timeline: view()') &&
    typeof window.CSSPropertyRule !== 'undefined';
  if (canCount) {
    document.querySelectorAll('.stat-real[data-count]').forEach(function (el) {
      var parts = el.textContent.split('–');
      var frag = document.createDocumentFragment();
      var ok = true;
      parts.forEach(function (p, i) {
        var n = parseInt(p, 10);
        if (isNaN(n)) { ok = false; return; }
        if (i > 0) frag.appendChild(document.createTextNode('–'));
        var s = document.createElement('span');
        s.className = 'stat-count';
        s.style.setProperty('--n', n);
        frag.appendChild(s);
      });
      if (!ok) return;
      var wrap = document.createElement('span');
      wrap.className = 'stat-anim';
      wrap.setAttribute('aria-hidden', 'true');
      wrap.appendChild(frag);
      el.parentNode.insertBefore(wrap, el.nextSibling);
      el.classList.add('stat-real--replaced');
    });
  }
})();
