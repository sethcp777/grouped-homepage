/* ============================================
   FOR TEAMS PAGE — Scroll Animations & Counters
   ============================================ */

(function initTeamsAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------
     Hero stagger
     ------------------------------------------ */
  var heroEls = document.querySelectorAll('.teams-hero__label, .teams-hero__title, .teams-hero__sub, .teams-hero__actions, .teams-hero__proof');
  gsap.set(heroEls, { opacity: 0, y: 40 });
  gsap.to(heroEls, {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.4
  });

  // Safety fallback: ensure hero is visible even if GSAP ticker stalls
  setTimeout(function() {
    heroEls.forEach(function(el) {
      if (parseFloat(getComputedStyle(el).opacity) < 0.1) {
        gsap.set(el, { opacity: 1, y: 0 });
      }
    });
  }, 2500);

  /* ------------------------------------------
     Section headers — fade in on scroll
     ------------------------------------------ */
  var sectionHeaders = [
    '.teams-pain__header',
    '.teams-solution__header',
    '.teams-dashboard__header',
    '.teams-compare__header',
    '.teams-proof__header',
    '.teams-faq__header'
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
  var painCards = document.querySelectorAll('.teams-pain__card');
  if (painCards.length) {
    gsap.set(painCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.teams-pain__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(painCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Solution cards — batch stagger
     ------------------------------------------ */
  var solutionCards = document.querySelectorAll('.teams-solution__card');
  if (solutionCards.length) {
    gsap.set(solutionCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.teams-solution__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(solutionCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Dashboard features + mockup
     ------------------------------------------ */
  var dashFeatures = document.querySelectorAll('.teams-dashboard__feature');
  if (dashFeatures.length) {
    gsap.set(dashFeatures, { opacity: 0, x: -30 });
    ScrollTrigger.create({
      trigger: '.teams-dashboard__content',
      start: 'top 70%',
      once: true,
      onEnter: function() {
        gsap.to(dashFeatures, { opacity: 1, x: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
      }
    });
  }

  var dashMockup = document.querySelector('.teams-dashboard__mockup');
  if (dashMockup) {
    gsap.set(dashMockup, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: dashMockup,
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(dashMockup, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', delay: 0.3 });
      }
    });
  }

  /* ------------------------------------------
     Compare columns
     ------------------------------------------ */
  var compareCols = document.querySelectorAll('.teams-compare__col');
  if (compareCols.length) {
    gsap.set(compareCols, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.teams-compare__columns',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compareCols, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Testimonial cards
     ------------------------------------------ */
  var proofCards = document.querySelectorAll('.teams-proof__card');
  if (proofCards.length) {
    gsap.set(proofCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.teams-proof__grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(proofCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     FAQ items
     ------------------------------------------ */
  var faqItems = document.querySelectorAll('.teams-faq__item');
  if (faqItems.length) {
    gsap.set(faqItems, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: '.teams-faq__list',
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
  var ctaInner = document.querySelector('.teams-cta__inner');
  if (ctaInner) {
    var ctaChildren = ctaInner.children;
    gsap.set(ctaChildren, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.teams-cta',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(ctaChildren, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Counter animations
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
        var formatted = Math.round(obj.val);
        if (formatted >= 1000) {
          formatted = formatted.toLocaleString();
        }
        el.textContent = prefix + formatted + suffix;
      }
    });
  }

  // Dashboard mockup counters
  var mockupStats = document.querySelectorAll('.teams-dashboard__mockup-stat-num[data-counter]');
  if (mockupStats.length) {
    ScrollTrigger.create({
      trigger: '.teams-dashboard__mockup',
      start: 'top 80%',
      once: true,
      onEnter: function() {
        mockupStats.forEach(function(el) {
          var target = parseInt(el.getAttribute('data-counter'), 10);
          var suffix = el.getAttribute('data-suffix') || '';
          animateCounter(el, target, '', suffix);
        });
      }
    });
  }

  // Savings counter
  var savingsEl = document.querySelector('.teams-compare__savings-amount[data-counter]');
  if (savingsEl) {
    ScrollTrigger.create({
      trigger: '.teams-compare__savings',
      start: 'top 85%',
      once: true,
      onEnter: function() {
        var target = parseInt(savingsEl.getAttribute('data-counter'), 10);
        animateCounter(savingsEl, target, '$', '', 2.5);
      }
    });
  }

  /* ------------------------------------------
     Dashboard bar chart animation
     ------------------------------------------ */
  var chartBars = document.querySelectorAll('.teams-dashboard__mockup-bar');
  if (chartBars.length) {
    chartBars.forEach(function(bar) {
      var targetHeight = bar.style.getPropertyValue('--bar-height');
      bar.style.setProperty('--bar-height', '0%');
    });
    ScrollTrigger.create({
      trigger: '.teams-dashboard__mockup-chart',
      start: 'top 85%',
      once: true,
      onEnter: function() {
        chartBars.forEach(function(bar, i) {
          var heights = ['30%', '45%', '35%', '60%', '55%', '75%', '90%'];
          setTimeout(function() {
            bar.style.setProperty('--bar-height', heights[i] || '50%');
          }, i * 100);
        });
      }
    });
  }

  /* ------------------------------------------
     Interactive dashboard feature switching
     ------------------------------------------ */
  var featureItems = document.querySelectorAll('.teams-dashboard__feature[data-feature]');
  var mockupScreens = document.querySelectorAll('.teams-dashboard__mockup-screen[data-screen]');
  var mockupTitle = document.querySelector('.teams-dashboard__mockup-title[data-screen-title]');
  var screenTitles = [
    'Roster Overview',
    'Cross-Roster Analytics',
    'Fan Database',
    'Campaign Templates',
    'Team & Roles'
  ];

  if (featureItems.length && mockupScreens.length) {
    featureItems.forEach(function(feature) {
      feature.addEventListener('click', function() {
        var idx = feature.getAttribute('data-feature');

        // Skip if already active
        if (feature.classList.contains('is--active')) return;

        // Remove active from all features & screens
        featureItems.forEach(function(f) { f.classList.remove('is--active'); });
        mockupScreens.forEach(function(s) { s.classList.remove('is--active'); });

        // Activate clicked feature + matching screen
        feature.classList.add('is--active');
        var targetScreen = document.querySelector('.teams-dashboard__mockup-screen[data-screen="' + idx + '"]');
        if (targetScreen) {
          targetScreen.classList.add('is--active');
        }

        // Update mockup title
        if (mockupTitle && screenTitles[idx]) {
          mockupTitle.textContent = screenTitles[idx];
        }
      });
    });
  }

})();
