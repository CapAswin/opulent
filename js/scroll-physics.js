/**
 * Lenis smooth scroll + ScrollTrigger sync (when GSAP is present).
 */
(function () {
  'use strict';

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (typeof Lenis === 'undefined') return;

  var lenis = new Lenis({
    duration: 1.7,
    easing: function (t) {
      return 1 - Math.pow(1 - t, 4);
    },
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 0.72,
    touchMultiplier: 0.98,
    syncTouch: true,
    syncTouchLerp: 0.08,
    touchInertiaMultiplier: 1.1,
    infinite: false
  });

  window.__opulentLenis = lenis;

  lenis.on('scroll', function () {
    document.dispatchEvent(new CustomEvent('opulent:scroll'));
  });

  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(function () {
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    }, 180);
  });

  if (window.gsap && window.ScrollTrigger) {
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(function (time) {
      lenis.raf(time * 1000);
    });
    gsap.ticker.lagSmoothing(0);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  if (window.ScrollTrigger) {
    ScrollTrigger.refresh();
  }
})();
