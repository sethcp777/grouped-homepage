/* ============================================
   FEATURES GLOSSARY — Filter, Expand/Collapse, Animations
   ============================================ */

(function initFeaturesPage() {

  /* ------------------------------------------
     Filter logic
     ------------------------------------------ */
  var filterBar = document.getElementById('features-filter');
  var entries = document.querySelectorAll('.feature-entry');
  var searchInput = document.getElementById('features-search');
  var countEl = document.getElementById('features-count');
  var emptyEl = document.getElementById('features-empty');
  var pillBtns = filterBar ? filterBar.querySelectorAll('.features-filter__pill') : [];

  var activeFilters = {
    stage: 'all',
    status: 'all',
    category: 'all'
  };

  function setFilter(type, value, btn) {
    activeFilters[type] = value;
    // Update active pill states within this group
    var group = btn.closest('.features-filter__group');
    if (group) {
      group.querySelectorAll('.features-filter__pill').forEach(function(p) {
        p.classList.toggle('is--active', p === btn);
      });
    }
    applyFilters();
  }

  function applyFilters() {
    var searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var visibleCount = 0;

    entries.forEach(function(entry) {
      var stage = entry.getAttribute('data-stage') || '';
      var status = entry.getAttribute('data-status') || '';
      var category = entry.getAttribute('data-category') || '';
      var text = (entry.textContent || '').toLowerCase();

      var stageMatch = activeFilters.stage === 'all' || stage === activeFilters.stage;
      var statusMatch = activeFilters.status === 'all' || status === activeFilters.status;
      var categoryMatch = activeFilters.category === 'all' || category.indexOf(activeFilters.category) !== -1;
      var searchMatch = !searchTerm || text.indexOf(searchTerm) !== -1;

      if (stageMatch && statusMatch && categoryMatch && searchMatch) {
        entry.classList.remove('is--hidden');
        visibleCount++;
      } else {
        entry.classList.add('is--hidden');
        entry.classList.remove('is--expanded');
      }
    });

    if (countEl) {
      countEl.innerHTML = 'Showing <strong>' + visibleCount + '</strong> of <strong>' + entries.length + '</strong> features';
    }
    if (emptyEl) {
      emptyEl.classList.toggle('is--visible', visibleCount === 0);
    }
  }

  pillBtns.forEach(function(btn) {
    btn.addEventListener('click', function() {
      var type = btn.getAttribute('data-filter-type');
      var value = btn.getAttribute('data-filter-value');
      if (type && value !== undefined) {
        setFilter(type, value, btn);
      }
    });
  });

  if (searchInput) {
    var debounceTimer;
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(applyFilters, 200);
    });
  }

  // Initial count
  applyFilters();

  /* ------------------------------------------
     Expand / Collapse feature entries
     ------------------------------------------ */
  entries.forEach(function(entry) {
    var header = entry.querySelector('.feature-entry__header');
    if (!header) return;
    header.addEventListener('click', function() {
      var wasExpanded = entry.classList.contains('is--expanded');
      entry.classList.toggle('is--expanded', !wasExpanded);
    });
  });

  /* ------------------------------------------
     Sticky filter bar shadow
     ------------------------------------------ */
  if (filterBar && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
    ScrollTrigger.create({
      trigger: filterBar,
      start: 'top 76px',
      endTrigger: '.features-faq',
      end: 'top top',
      onEnter: function() { filterBar.classList.add('is--stuck'); },
      onLeave: function() { filterBar.classList.remove('is--stuck'); },
      onEnterBack: function() { filterBar.classList.add('is--stuck'); },
      onLeaveBack: function() { filterBar.classList.remove('is--stuck'); }
    });
  }

  /* ------------------------------------------
     GSAP Scroll animations
     ------------------------------------------ */
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // Hero stagger
  var heroEls = document.querySelectorAll('.features-hero__label, .features-hero__title, .features-hero__sub');
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

  // Stats
  var statEls = document.querySelectorAll('.features-stat__number');
  if (statEls.length) {
    gsap.set(statEls, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.features-stats',
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(statEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
      }
    });
  }

  // Feature entries — batch reveal
  var visibleEntries = document.querySelectorAll('.feature-entry');
  gsap.set(visibleEntries, { opacity: 0, y: 30 });
  ScrollTrigger.batch(visibleEntries, {
    start: 'top 90%',
    once: true,
    onEnter: function(batch) {
      gsap.to(batch, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
    }
  });

  // Comparison cards
  var compareCards = document.querySelectorAll('.features-compare__card');
  if (compareCards.length) {
    gsap.set(compareCards, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.features-compare',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compareCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

  // FAQ items
  var faqItems = document.querySelectorAll('.features-faq__item');
  if (faqItems.length) {
    gsap.set(faqItems, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.features-faq',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(faqItems, { opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out' });
      }
    });
  }

  // CTA
  var ctaEls = document.querySelectorAll('.features-cta__title, .features-cta__sub, .features-cta__actions');
  if (ctaEls.length) {
    gsap.set(ctaEls, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.features-cta',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(ctaEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

})();
