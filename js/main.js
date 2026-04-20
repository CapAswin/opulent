(function () {
  'use strict';

  var mqReduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  function navDropdownInit() {
    var dropdownItems = document.querySelectorAll('.nav__item--dropdown');
    if (!dropdownItems.length) return;

    var isMobile = function() {
      return window.matchMedia('(max-width: 980px)').matches;
    };

    dropdownItems.forEach(function (item) {
      var toggle = item.querySelector('.nav__link--dropdown-toggle');
      var dropdown = item.querySelector('.nav__dropdown');
      var links = dropdown ? dropdown.querySelectorAll('a') : [];

      if (!toggle || !dropdown) return;

      // Handle mouse enter/leave for desktop
      item.addEventListener('mouseenter', function () {
        if (isMobile()) return;
        dropdown.style.opacity = '1';
        dropdown.style.visibility = 'visible';
        dropdown.style.transform = 'translateY(0)';
      });

      item.addEventListener('mouseleave', function () {
        if (isMobile()) return;
        dropdown.style.opacity = '0';
        dropdown.style.visibility = 'hidden';
        dropdown.style.transform = 'translateY(-8px)';
      });

      // Handle click for mobile
      toggle.addEventListener('click', function (e) {
        if (!isMobile()) return;
        var isOpen = item.classList.contains('nav--dropdown-open');

        if (isOpen) return;

        e.preventDefault();
        
        // Close all other dropdowns
        dropdownItems.forEach(function (otherItem) {
          if (otherItem !== item) {
            otherItem.classList.remove('nav--dropdown-open');
          }
        });

        // Toggle current dropdown
        item.classList.toggle('nav--dropdown-open');
      });

      // Close dropdown when a link is clicked
      links.forEach(function (link) {
        link.addEventListener('click', function () {
          if (!isMobile()) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
            dropdown.style.transform = 'translateY(-8px)';
          }
          item.classList.remove('nav--dropdown-open');
          
          var header = document.querySelector('.site-header');
          if (header && header.classList.contains('nav--open')) {
            header.classList.remove('nav--open');
            document.body.classList.remove('nav-open');
          }
        });
      });
    });
  }

  function navInit() {
    var header = document.querySelector('.site-header');
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
          var dur = 1800;

          function tick(now) {
            var p = Math.min(1, (now - start) / dur);
            var eased = 1 - Math.pow(1 - p, 4.5);
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
    var header = document.querySelector('.site-header');
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

  function heroCarouselInit() {
    var carousel = document.querySelector('[data-hero-carousel]');
    if (!carousel) return;

    var track = carousel.querySelector('.hero-carousel__track');
    var slides = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-slide]'));
    var dots = Array.prototype.slice.call(carousel.querySelectorAll('[data-hero-dot]'));
    var prev = carousel.querySelector('[data-hero-prev]');
    var next = carousel.querySelector('[data-hero-next]');
    var progress = carousel.querySelector('[data-hero-progress]');
    if (!slides.length || !track) return;

    var activeIndex = slides.findIndex(function (slide) {
      return slide.classList.contains('is-active');
    });
    if (activeIndex < 0) activeIndex = 0;

    var timer = null;
    var textTimer = null;
    var interval = 5500;

    function restartProgress() {
      if (!progress) return;
      progress.classList.remove('is-animating');
      void progress.offsetWidth;
      progress.style.setProperty('--hero-progress-duration', interval + 'ms');
      progress.classList.add('is-animating');
    }

    function stopProgress() {
      if (!progress) return;
      progress.classList.remove('is-animating');
    }

    function updateTrack() {
      track.style.transform = 'translateX(-' + (activeIndex * 100) + '%)';
    }

    function setActive(index) {
      activeIndex = (index + slides.length) % slides.length;

      if (textTimer) {
        window.clearTimeout(textTimer);
        textTimer = null;
      }

      slides.forEach(function (slide, slideIndex) {
        var isActive = slideIndex === activeIndex;
        slide.classList.toggle('is-active', isActive);
        slide.classList.remove('is-text-visible');
        slide.setAttribute('aria-hidden', isActive ? 'false' : 'true');
      });

      dots.forEach(function (dot, dotIndex) {
        var isActive = dotIndex === activeIndex;
        dot.classList.toggle('is-active', isActive);
        dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
      });
      updateTrack();

      if (mqReduce.matches) {
        slides[activeIndex].classList.add('is-text-visible');
        return;
      }

      textTimer = window.setTimeout(function () {
        slides[activeIndex].classList.add('is-text-visible');
      }, 260);
    }

    function clearAuto() {
      if (!timer) return;
      window.clearInterval(timer);
      timer = null;
      stopProgress();
    }

    function startAuto() {
      if (mqReduce.matches || slides.length < 2) return;
      clearAuto();
      restartProgress();
      timer = window.setInterval(function () {
        setActive(activeIndex + 1);
        restartProgress();
      }, interval);
    }

    if (prev) {
      prev.addEventListener('click', function () {
        setActive(activeIndex - 1);
        startAuto();
      });
    }

    if (next) {
      next.addEventListener('click', function () {
        setActive(activeIndex + 1);
        startAuto();
      });
    }

    dots.forEach(function (dot, index) {
      dot.addEventListener('click', function () {
        setActive(index);
        startAuto();
      });
    });

    carousel.addEventListener('mouseenter', clearAuto);
    carousel.addEventListener('mouseleave', startAuto);
    carousel.addEventListener('focusin', clearAuto);
    carousel.addEventListener('focusout', function (event) {
      if (event.relatedTarget && carousel.contains(event.relatedTarget)) return;
      startAuto();
    });

    setActive(activeIndex);
    restartProgress();
    startAuto();
  }

  function storyModalInit() {
    var modal = document.getElementById('story-modal');
    if (!modal) return;

    var content = modal.querySelector('[data-modal-content]');
    var dialog = modal.querySelector('.story-modal__dialog');
    var templates = document.querySelector('.story-modal__templates');
    if (!content || !templates || !dialog) return;

    var titleId = 'story-modal-title';

    function closeModal() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('story-modal-open');
      dialog.setAttribute('aria-labelledby', titleId);
      content.innerHTML = '';
    }

    function openModal(targetId) {
      var template = templates.querySelector('[data-modal-template="' + targetId + '"]');
      if (!template) return;
      content.innerHTML = template.innerHTML;
      var title = content.querySelector('.story-modal__title');
      if (title) {
        title.id = titleId;
        dialog.setAttribute('aria-labelledby', titleId);
      }
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('story-modal-open');
    }

    document.querySelectorAll('[data-modal-open]').forEach(function (trigger) {
      trigger.addEventListener('click', function () {
        openModal(trigger.getAttribute('data-modal-open'));
      });
    });

    modal.querySelectorAll('[data-modal-close]').forEach(function (closer) {
      closer.addEventListener('click', closeModal);
    });

    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && modal.classList.contains('is-open')) {
        closeModal();
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    navInit();
    navDropdownInit();
    scrollRevealInit();
    barMeterInit();
    countUpInit();
    navScrollInit();
    ecoTiltInit();
    heroParallaxInit();
    heroCarouselInit();
    storyModalInit();
  }
})();
