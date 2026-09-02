/* Generations Wellness — minimal enhancement script (no dependencies) */
(function () {
  'use strict';

  var header = document.querySelector('.site-header');
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');

  /* Mobile navigation drawer */
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
      /* keep Tab focus inside the open drawer */
      if (e.key === 'Tab' && document.body.classList.contains('nav-open')) {
        var focusables = [toggle].concat(
          Array.prototype.slice.call(nav.querySelectorAll('a, button'))
        );
        var first = focusables[0];
        var last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    });
    /* click outside the drawer closes it */
    document.addEventListener('click', function (e) {
      if (!document.body.classList.contains('nav-open')) return;
      if (e.target.closest('.site-nav') || e.target.closest('.nav-toggle')) return;
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
    });
  }

  /* Header elevation on scroll */
  if (header) {
    var onScroll = function () {
      header.classList.toggle('is-scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* Scroll reveals — skipped entirely for reduced-motion users.
     A safety timer reveals everything shortly after load so content can
     never stay hidden if the observer is throttled or never fires. */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
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
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    items.forEach(function (el) { io.observe(el); });
    setTimeout(function () { revealAll(); io.disconnect(); }, 2500);
  } else {
    revealAll();
  }

  /* Keep only one FAQ item open at a time (progressive enhancement) */
  var groups = document.querySelectorAll('[data-accordion]');
  groups.forEach(function (group) {
    group.addEventListener('toggle', function (e) {
      if (e.target.tagName === 'DETAILS' && e.target.open) {
        group.querySelectorAll('details[open]').forEach(function (d) {
          if (d !== e.target) d.open = false;
        });
      }
    }, true);
  });
})();
