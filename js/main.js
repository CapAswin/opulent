(function () {
  'use strict';

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function navInit() {
    var header = document.querySelector('.nav');
    var toggle = document.querySelector('.nav__toggle');
    var drawer = document.getElementById('nav-menu');
    if (!header || !toggle || !drawer) return;

    function setOpen(open) {
      header.classList.toggle('nav--open', open);
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
      document.body.classList.toggle('nav-open', open);
    }

    toggle.addEventListener('click', function () {
      setOpen(!header.classList.contains('nav--open'));
    });

    drawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        setOpen(false);
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') setOpen(false);
    });

    document.addEventListener('click', function (e) {
      if (!header.classList.contains('nav--open')) return;
      if (header.contains(e.target)) return;
      setOpen(false);
    });
  }

  function scrollRevealInit() {
    if (mqReduce.matches) return;

    var sections = document.querySelectorAll('body > section');
    if (!sections.length) return;

    sections.forEach(function (el, i) {
      if (i === 0) return;
      el.classList.add('js-reveal');
    });

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('js-reveal--visible');
          io.unobserve(entry.target);
        });
      },
      { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    document.querySelectorAll('.js-reveal').forEach(function (el) {
      io.observe(el);
    });
  }

  function barMeterInit() {
    var track = document.querySelector('.js-strategy-bar');
    if (!track) return;

    var fills = track.querySelectorAll('.js-bar-seg');
    if (!fills.length) return;

    if (mqReduce.matches) return;

    fills.forEach(function (fill) {
      fill.style.width = '0%';
    });
    track.classList.add('bar--meter');

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          fills.forEach(function (fill) {
            var v = fill.getAttribute('data-meter');
            if (v) fill.style.width = v + '%';
          });
          track.classList.add('bar--meter-done');
          io.disconnect();
        });
      },
      { threshold: 0.35 }
    );
    io.observe(track);
  }

  function countUpInit() {
    var nodes = document.querySelectorAll('.js-count[data-target]');
    if (!nodes.length || mqReduce.matches) {
      nodes.forEach(function (n) {
        var t = n.getAttribute('data-target');
        var sfx = n.getAttribute('data-suffix') || '';
        if (t) n.textContent = t + sfx;
      });
      return;
    }

    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var el = entry.target;
          var target = parseInt(el.getAttribute('data-target'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          var start = performance.now();
          var dur = 1100;

          function tick(now) {
            var p = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - p, 3);
            var val = Math.round(eased * target);
            el.textContent = val + suffix;
            if (p < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
          io.unobserve(el);
        });
      },
      { threshold: 0.4 }
    );

    nodes.forEach(function (n) {
      io.observe(n);
    });
  }

  function navScrollInit() {
    var header = document.querySelector('.nav');
    if (!header || mqReduce.matches) return;
    if (!header.classList.contains('nav--solid')) return;

    function scrollY() {
      return window.__opulentLenis ? window.__opulentLenis.scroll : window.scrollY;
    }

    function onScroll() {
      header.classList.toggle('nav--scrolled', scrollY() > 24);
    }

    onScroll();
    if (window.__opulentLenis) {
      document.addEventListener('opulent:scroll', onScroll);
    } else {
      window.addEventListener('scroll', onScroll, { passive: true });
    }
  }

  function ecoTiltInit() {
    if (
      mqReduce.matches ||
      window.matchMedia('(max-width: 980px)').matches ||
      !window.matchMedia('(pointer: fine)').matches
    ) {
      return;
    }

    document.querySelectorAll('.eco--tilt').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        var r = card.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        card.style.setProperty('--tilt-x', (y * -6).toFixed(2) + 'deg');
        card.style.setProperty('--tilt-y', (x * 8).toFixed(2) + 'deg');
      });
      card.addEventListener('pointerleave', function () {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
      });
    });
  }

  function heroParallaxInit() {
    if (document.body.classList.contains('page-home')) return;
    var media = document.querySelector('.hero__media img');
    if (!media || mqReduce.matches) return;

    var frame;
    function update() {
      frame = null;
      var hero = document.querySelector('.hero');
      if (!hero) return;
      var rect = hero.getBoundingClientRect();
      var p = 1 - Math.min(1, Math.max(0, rect.bottom / (rect.height + 200)));
      media.style.transform = 'translateY(' + (p * 12).toFixed(1) + 'px) scale(1.03)';
    }

    window.addEventListener(
      'scroll',
      function () {
        if (!frame) frame = requestAnimationFrame(update);
      },
      { passive: true }
    );
    update();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    navInit();
    scrollRevealInit();
    barMeterInit();
    countUpInit();
    navScrollInit();
    ecoTiltInit();
    heroParallaxInit();
  }
})();
