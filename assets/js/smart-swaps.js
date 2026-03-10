/* ============================================
   SMART SWAPS PAGE — Scroll Animations & Counters
   ============================================ */

(function initSwapsAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------
     Hero stagger
     ------------------------------------------ */
  var heroEls = document.querySelectorAll('.swaps-hero__label, .swaps-hero__title, .swaps-hero__sub, .swaps-hero__actions, .swaps-hero__proof');
  gsap.set(heroEls, { opacity: 0, y: 40 });
  gsap.to(heroEls, {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.4
  });

  // Phone mockup entrance
  var phoneEl = document.querySelector('.swaps-hero__visual');
  if (phoneEl) {
    gsap.set(phoneEl, { opacity: 0, y: 60, scale: 0.95 });
    gsap.to(phoneEl, {
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
    if (phoneEl && parseFloat(getComputedStyle(phoneEl).opacity) < 0.1) {
      gsap.set(phoneEl, { opacity: 1, y: 0, scale: 1 });
    }
  }, 2500);

  /* ------------------------------------------
     Section headers — fade in on scroll
     ------------------------------------------ */
  var sectionHeaders = [
    '.swaps-pain__header',
    '.swaps-how__header',
    '.swaps-compare__header',
    '.swaps-uses__header',
    '.swaps-faq__header'
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
  var painCards = document.querySelectorAll('.swaps-pain__card');
  if (painCards.length) {
    gsap.set(painCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.swaps-pain__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(painCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     How-it-works steps — stagger with line draw
     ------------------------------------------ */
  var howSteps = document.querySelectorAll('.swaps-how__step');
  if (howSteps.length) {
    gsap.set(howSteps, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.swaps-how__steps',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(howSteps, { opacity: 1, y: 0, duration: 0.7, stagger: 0.18, ease: 'power3.out' });
      }
    });
  }

  // Connecting line grow
  var howLine = document.querySelector('.swaps-how__line');
  if (howLine) {
    gsap.set(howLine, { scaleY: 0, transformOrigin: 'top center' });
    ScrollTrigger.create({
      trigger: '.swaps-how__steps',
      start: 'top 70%',
      once: true,
      onEnter: function() {
        gsap.to(howLine, { scaleY: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 });
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

  var statsNums = document.querySelectorAll('.swaps-stats__num[data-counter]');
  if (statsNums.length) {
    ScrollTrigger.create({
      trigger: '.swaps-stats__grid',
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
  var compareCols = document.querySelectorAll('.swaps-compare__col');
  if (compareCols.length) {
    gsap.set(compareCols, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.swaps-compare__columns',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compareCols, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Use case cards — batch stagger
     ------------------------------------------ */
  var useCards = document.querySelectorAll('.swaps-uses__card');
  if (useCards.length) {
    gsap.set(useCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.swaps-uses__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(useCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Interstitial gold band
     ------------------------------------------ */
  var bandEl = document.querySelector('.interstitial-band');
  if (bandEl) {
    var bandChildren = bandEl.querySelector('.container').children;
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

  /* ------------------------------------------
     FAQ items
     ------------------------------------------ */
  var faqItems = document.querySelectorAll('.swaps-faq__item');
  if (faqItems.length) {
    gsap.set(faqItems, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: '.swaps-faq__list',
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
  var ctaInner = document.querySelector('.swaps-cta__inner');
  if (ctaInner) {
    var ctaChildren = ctaInner.children;
    gsap.set(ctaChildren, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.swaps-cta',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(ctaChildren, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

})();
