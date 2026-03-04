/* ============================================
   ARTIST TOOLS PAGE — Scroll Animations & Stage Nav
   ============================================ */

(function initToolsAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  /* ------------------------------------------
     Hero stagger
     ------------------------------------------ */
  var heroEls = document.querySelectorAll('.tools-hero__label, .tools-hero__title, .tools-hero__sub');
  gsap.set(heroEls, { opacity: 0, y: 40 });
  requestAnimationFrame(function() {
    gsap.to(heroEls, {
      opacity: 1, y: 0,
      duration: 0.9,
      stagger: 0.15,
      ease: 'power3.out',
      delay: 0.3
    });
  });

  /* ------------------------------------------
     Journey intro
     ------------------------------------------ */
  const journeyEls = document.querySelectorAll('.tools-journey__lead, .tools-journey__core, .tools-journey__closer');
  gsap.set(journeyEls, { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '.tools-journey',
    start: 'top 75%',
    once: true,
    onEnter: function() {
      gsap.to(journeyEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power3.out' });
    }
  });

  /* ------------------------------------------
     Stage sections — header + cards
     ------------------------------------------ */
  document.querySelectorAll('.tools-stage').forEach(function(stage) {
    var headerEls = stage.querySelectorAll('.tools-stage__num, .tools-stage__label, .tools-stage__title, .tools-stage__sub');
    gsap.set(headerEls, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(headerEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      }
    });

    var cards = stage.querySelectorAll('.tools-card');
    gsap.set(cards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: stage,
      start: 'top 60%',
      once: true,
      onEnter: function() {
        gsap.to(cards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', delay: 0.3 });
      }
    });
  });

  /* ------------------------------------------
     Stats counter
     ------------------------------------------ */
  var statNumbers = document.querySelectorAll('.tools-stat__number');
  gsap.set(statNumbers, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: '.tools-stats',
    start: 'top 80%',
    once: true,
    onEnter: function() {
      gsap.to(statNumbers, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }
  });

  /* ------------------------------------------
     CTA section
     ------------------------------------------ */
  var ctaBlocks = document.querySelectorAll('.tools-cta__primary, .tools-cta__secondary');
  gsap.set(ctaBlocks, { opacity: 0, y: 50 });
  ScrollTrigger.create({
    trigger: '.tools-cta',
    start: 'top 75%',
    once: true,
    onEnter: function() {
      gsap.to(ctaBlocks, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
    }
  });

  /* ------------------------------------------
     Sticky Stage Nav — active state on scroll
     ------------------------------------------ */
  var stageNav = document.getElementById('stage-nav');
  var stageItems = stageNav ? stageNav.querySelectorAll('.stage-nav__item') : [];
  var stageIds = ['capture', 'keep', 'grow', 'compound', 'reactivate'];

  // Track which stage is in view
  stageIds.forEach(function(id) {
    var section = document.getElementById(id);
    if (!section) return;

    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onEnter: function() { setActiveStage(id); },
      onEnterBack: function() { setActiveStage(id); }
    });
  });

  function setActiveStage(activeId) {
    stageItems.forEach(function(item) {
      if (item.getAttribute('data-stage') === activeId) {
        item.classList.add('is--active');
      } else {
        item.classList.remove('is--active');
      }
    });
  }

  // Smooth scroll on stage nav click
  if (stageNav) {
    stageNav.addEventListener('click', function(e) {
      var link = e.target.closest('.stage-nav__item');
      if (!link) return;
      e.preventDefault();
      var targetId = link.getAttribute('href').replace('#', '');
      var target = document.getElementById(targetId);
      if (target) {
        var mainNav = document.querySelector('nav.nav');
        var mainNavH = mainNav ? mainNav.offsetHeight : 76;
        var navHeight = stageNav.offsetHeight + mainNavH + 20;
        var targetPos = target.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({ top: targetPos, behavior: 'smooth' });
      }
    });
  }

  // Add stuck class for shadow
  if (stageNav) {
    ScrollTrigger.create({
      trigger: stageNav,
      start: 'top 76px',
      endTrigger: '.tools-stats',
      end: 'top 76px',
      onEnter: function() { stageNav.classList.add('is--stuck'); },
      onLeave: function() { stageNav.classList.remove('is--stuck'); },
      onEnterBack: function() { stageNav.classList.add('is--stuck'); },
      onLeaveBack: function() { stageNav.classList.remove('is--stuck'); }
    });
  }

  /* ------------------------------------------
     Story bridges — fade-in on scroll
     ------------------------------------------ */
  document.querySelectorAll('.stage-bridge').forEach(function(bridge) {
    var text = bridge.querySelector('.stage-bridge__text');
    if (!text) return;
    gsap.set(text, { opacity: 0, y: 24 });
    ScrollTrigger.create({
      trigger: bridge,
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(text, { opacity: 0.85, y: 0, duration: 0.8, ease: 'power3.out' });
      }
    });
  });

  /* ------------------------------------------
     Mockup scroll activation
     ------------------------------------------ */
  document.querySelectorAll('.tools-mockup').forEach(function(mockup) {
    ScrollTrigger.create({
      trigger: mockup,
      start: 'top 85%',
      end: 'bottom 15%',
      onEnter: function() { mockup.classList.add('is--animating'); },
      onLeave: function() { mockup.classList.remove('is--animating'); },
      onEnterBack: function() { mockup.classList.add('is--animating'); },
      onLeaveBack: function() { mockup.classList.remove('is--animating'); }
    });
  });

  /* ------------------------------------------
     Email counter animation
     ------------------------------------------ */
  var emailCounter = document.querySelector('.mockup-email__stat-num');
  if (emailCounter) {
    var counterTarget = parseInt(emailCounter.getAttribute('data-target') || '89', 10);
    var counterDone = false;
    ScrollTrigger.create({
      trigger: emailCounter,
      start: 'top 85%',
      once: true,
      onEnter: function() {
        if (counterDone) return;
        counterDone = true;
        var obj = { val: 0 };
        gsap.to(obj, {
          val: counterTarget,
          duration: 2,
          ease: 'power2.out',
          onUpdate: function() {
            emailCounter.textContent = Math.round(obj.val) + '%';
          }
        });
      }
    });
  }

  /* ------------------------------------------
     Before / After comparison slider
     ------------------------------------------ */
  var compareSlider = document.getElementById('compare-slider');
  var compareHandle = document.getElementById('compare-handle');
  if (compareSlider && compareHandle) {
    var afterPanel = compareSlider.querySelector('.tools-compare__after');
    var isDragging = false;

    function setComparePosition(x) {
      var rect = compareSlider.getBoundingClientRect();
      var pct = Math.max(0, Math.min(100, ((x - rect.left) / rect.width) * 100));
      afterPanel.style.clipPath = 'inset(0 0 0 ' + pct + '%)';
      compareHandle.style.left = pct + '%';
    }

    // Start at 50%
    afterPanel.style.clipPath = 'inset(0 0 0 50%)';
    compareHandle.style.left = '50%';

    compareHandle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      isDragging = true;
    });
    compareHandle.addEventListener('touchstart', function(e) {
      isDragging = true;
    }, { passive: true });

    document.addEventListener('mousemove', function(e) {
      if (!isDragging) return;
      setComparePosition(e.clientX);
    });
    document.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      setComparePosition(e.touches[0].clientX);
    }, { passive: true });

    document.addEventListener('mouseup', function() { isDragging = false; });
    document.addEventListener('touchend', function() { isDragging = false; });

    // Click anywhere on slider to jump
    compareSlider.addEventListener('click', function(e) {
      if (e.target.closest('.tools-compare__handle')) return;
      setComparePosition(e.clientX);
    });

    // Scroll-triggered entrance
    gsap.set(compareSlider, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.tools-compare',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compareSlider, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Versus section — stagger in
     ------------------------------------------ */
  var versusBlocks = document.querySelectorAll('.tools-versus__block');
  if (versusBlocks.length) {
    gsap.set(versusBlocks, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: '.tools-versus',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(versusBlocks, { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Progress fill on stage nav lines
     ------------------------------------------ */
  var navLines = stageNav ? stageNav.querySelectorAll('.stage-nav__line-fill') : [];
  stageIds.forEach(function(id, index) {
    if (index >= navLines.length) return;
    var section = document.getElementById(id);
    if (!section) return;
    ScrollTrigger.create({
      trigger: section,
      start: 'top center',
      end: 'bottom center',
      onUpdate: function(self) {
        navLines[index].style.width = (self.progress * 100) + '%';
      },
      onEnter: function() {
        for (var i = 0; i < index; i++) { navLines[i].style.width = '100%'; }
      },
      onEnterBack: function() {
        for (var i = index + 1; i < navLines.length; i++) { navLines[i].style.width = '0%'; }
      },
      onLeaveBack: function() {
        navLines[index].style.width = '0%';
      }
    });
  });
})();
