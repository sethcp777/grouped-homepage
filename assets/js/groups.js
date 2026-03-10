/* ============================================
   GROUPS PAGE — Scroll Animations & Counters
   ============================================ */

(function initGroupsAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------
     Hero stagger
     ------------------------------------------ */
  var heroEls = document.querySelectorAll('.groups-hero__label, .groups-hero__title, .groups-hero__sub, .groups-hero__actions, .groups-hero__proof');
  gsap.set(heroEls, { opacity: 0, y: 40 });
  gsap.to(heroEls, {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.4
  });

  // Community hub mockup entrance
  var communityEl = document.querySelector('.groups-hero__visual');
  if (communityEl) {
    gsap.set(communityEl, { opacity: 0, y: 60, scale: 0.92 });
    gsap.to(communityEl, {
      opacity: 1, y: 0, scale: 1,
      duration: 1.1,
      ease: 'power3.out',
      delay: 1.0
    });
  }

  // Safety fallback: ensure hero is visible even if GSAP ticker stalls
  setTimeout(function() {
    heroEls.forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
    if (communityEl && parseFloat(getComputedStyle(communityEl).opacity) < 0.1) {
      gsap.set(communityEl, { opacity: 1, y: 0, scale: 1 });
    }
  }, 2500);

  /* ------------------------------------------
     Section headers — fade in on scroll
     ------------------------------------------ */
  var sectionHeaders = [
    '.groups-pain__header',
    '.groups-what__header',
    '.groups-compare__header',
    '.groups-faq__header'
  ];

  sectionHeaders.forEach(function(selector) {
    var header = document.querySelector(selector);
    if (!header) return;
    var children = header.children;
    gsap.set(children, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: header,
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(children, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      }
    });
  });

  /* ------------------------------------------
     Pain cards — batch stagger
     ------------------------------------------ */
  var painCards = document.querySelectorAll('.groups-pain__card');
  if (painCards.length) {
    gsap.set(painCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.groups-pain__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(painCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     What-is-Groups feature cards — batch stagger
     ------------------------------------------ */
  var whatCards = document.querySelectorAll('.groups-what__card');
  if (whatCards.length) {
    gsap.set(whatCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.groups-what__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(whatCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Stats counter animation
     ------------------------------------------ */
  function animateCounter(el, target, prefix, suffix, duration) {
    prefix = prefix || '';
    suffix = suffix || '';
    duration = duration || 2;

    // Special case: target is 0 (e.g. "0 hrs maintenance")
    if (target === 0) {
      el.textContent = prefix + '0' + suffix;
      return;
    }

    var obj = { val: 0 };
    gsap.to(obj, {
      val: target,
      duration: duration,
      ease: 'power2.out',
      onUpdate: function() {
        var rounded = Math.round(obj.val);
        var formatted;
        if (rounded >= 1000000) {
          formatted = (rounded / 1000000).toFixed(1) + 'M';
        } else if (rounded >= 1000) {
          formatted = rounded.toLocaleString();
        } else {
          formatted = rounded;
        }
        el.textContent = prefix + formatted + suffix;
      }
    });
  }

  var statsNums = document.querySelectorAll('.groups-stats__num[data-counter]');
  if (statsNums.length) {
    ScrollTrigger.create({
      trigger: '.groups-stats__grid',
      start: 'top 80%',
      once: true,
      onEnter: function() {
        statsNums.forEach(function(el) {
          var target = parseInt(el.getAttribute('data-counter'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, '', suffix, 2.5);
        });
      }
    });
  }

  /* ------------------------------------------
     Compare columns
     ------------------------------------------ */
  var compareCols = document.querySelectorAll('.groups-compare__col');
  if (compareCols.length) {
    gsap.set(compareCols, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.groups-compare__columns',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compareCols, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Interstitial gold band
     ------------------------------------------ */
  var bandEl = document.querySelector('.interstitial-band');
  if (bandEl) {
    var bandContainer = bandEl.querySelector('.container');
    if (bandContainer) {
      var bandChildren = bandContainer.children;
      gsap.set(bandChildren, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: '.interstitial-band',
        start: 'top 75%',
        once: true,
        onEnter: function() {
          gsap.to(bandChildren, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
        }
      });
    }
  }

  /* ------------------------------------------
     FAQ items
     ------------------------------------------ */
  var faqItems = document.querySelectorAll('.groups-faq__item');
  if (faqItems.length) {
    gsap.set(faqItems, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: '.groups-faq__list',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(faqItems, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     CTA section
     ------------------------------------------ */
  var ctaInner = document.querySelector('.groups-cta__inner');
  if (ctaInner) {
    var ctaChildren = ctaInner.children;
    gsap.set(ctaChildren, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.groups-cta',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(ctaChildren, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

})();
