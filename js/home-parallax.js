/**
 * Depth parallax: [data-parallax] = intensity 0–1 (scroll-scrubbed).
 * Optional [data-parallax-axis="y"|"x"] (default y).
 */
(function () {
  'use strict';

  if (!window.gsap || !window.ScrollTrigger) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var cfg = window.OpulentMotion || {};
  var scrubDefault = (cfg.scrub && cfg.scrub.parallaxLayer) || 1.05;

  gsap.registerPlugin(ScrollTrigger);

  document.querySelectorAll('[data-parallax]').forEach(function (el) {
    var raw = parseFloat(el.getAttribute('data-parallax'));
    if (isNaN(raw) || raw <= 0) return;

    var axis = el.getAttribute('data-parallax-axis') || 'y';
    var scrubAttr = el.getAttribute('data-parallax-scrub');
    var scrub = scrubAttr != null ? parseFloat(scrubAttr) : scrubDefault;
    var rootSel = el.getAttribute('data-parallax-root');
    var trigger = rootSel ? document.querySelector(rootSel) : el.closest('section, article, .hero, .strategy');
    if (!trigger) trigger = el.parentElement;

    var amp = raw * 14;
    var from = {};
    var to = { ease: 'none', scrollTrigger: {
      trigger: trigger,
      start: 'top bottom',
      end: 'bottom top',
      scrub: scrub
    }};

    if (axis === 'x') {
      from.xPercent = amp * 0.45;
      to.xPercent = -amp * 0.45;
    } else {
      from.yPercent = amp * 0.5;
      to.yPercent = -amp * 0.5;
    }

    gsap.fromTo(el, from, to);
  });

  window.addEventListener(
    'load',
    function () {
      ScrollTrigger.refresh();
    },
    { once: true }
  );
})();
