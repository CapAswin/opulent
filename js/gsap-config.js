/**
 * Shared motion tokens for GSAP / ScrollTrigger (homepage).
 * Tweak once for consistent “slow confidence” choreography.
 */
(function () {
  'use strict';

  if (!window.gsap) return;

  window.OpulentMotion = {
    scrub: {
      /* Higher scrub ≈ more inertia — reads smoother with Lenis wheel scroll */
      card: 1.12,
      text: 1.28,
      parallaxLayer: 1.05,
      parallaxDeep: 1.22,
      /* First stack panel (“Why Dubai” + headline) — extra-smooth */
      cardFirst: 1.55,
      textFirst: 1.85,
      parallaxFirst: 1.45
    },
    card: {
      scale: 0.94,
      y: -28,
      opacity: 0.9,
      blur: 'blur(1.5px)'
    },
    /* Gentler handoff for the layered Dubai card */
    cardFirst: {
      scale: 0.97,
      y: -16,
      opacity: 0.96,
      blur: 'blur(0.6px)'
    },
    text: {
      fromOpacity: 0.2,
      fromY: 22,
      start: 'top 76%',
      end: 'top 40%'
    },
    textFirst: {
      fromOpacity: 0.4,
      fromY: 14,
      start: 'top 82%',
      end: 'top 38%'
    },
    stackParallaxImg: { yFrom: 5, yTo: -10 },
    stackParallaxImgFirst: { yFrom: 2, yTo: -5 },
    ease: {
      scroll: 'none',
      micro: 'power2.out'
    }
  };

  gsap.config({ nullTargetWarn: false });

  if (window.ScrollTrigger) {
    ScrollTrigger.config({ ignoreMobileResize: true });
    ScrollTrigger.defaults({
      invalidateOnRefresh: true
    });
  }
})();
