/* ============================================
   RESOURCES / GROWTH LAB — Search, Filter, Animations
   ============================================ */

(function initResourcesPage() {

  /* ------------------------------------------
     DOM references
     ------------------------------------------ */
  var searchInput   = document.getElementById('resources-search');
  var allResources  = document.querySelectorAll('[data-resource]');
  var sections      = document.querySelectorAll('.res-section');
  var featureGroups = document.querySelectorAll('.res-feature-group');
  var categoryCards = document.querySelectorAll('.res-category-card');
  var resultCountEl = document.getElementById('resources-result-count');

  /* ------------------------------------------
     Search — debounced at 200ms
     ------------------------------------------ */
  var debounceTimer;

  function performSearch() {
    var term = searchInput ? searchInput.value.toLowerCase().trim() : '';
    var visibleCount = 0;

    // Show / hide individual resource items
    allResources.forEach(function(item) {
      var text = (item.textContent || '').toLowerCase();
      var match = !term || text.indexOf(term) !== -1;

      if (match) {
        item.classList.remove('is--hidden');
        visibleCount++;
      } else {
        item.classList.add('is--hidden');
      }
    });

    // Hide sections where ALL child [data-resource] items are hidden
    sections.forEach(function(section) {
      var children = section.querySelectorAll('[data-resource]');
      var allHidden = true;

      for (var i = 0; i < children.length; i++) {
        if (!children[i].classList.contains('is--hidden')) {
          allHidden = false;
          break;
        }
      }

      section.classList.toggle('is--hidden', children.length > 0 && allHidden);
    });

    // Hide feature groups where ALL child [data-resource] items are hidden
    featureGroups.forEach(function(group) {
      var children = group.querySelectorAll('[data-resource]');
      var allHidden = true;

      for (var i = 0; i < children.length; i++) {
        if (!children[i].classList.contains('is--hidden')) {
          allHidden = false;
          break;
        }
      }

      group.classList.toggle('is--hidden', children.length > 0 && allHidden);
    });

    // Update result count text
    updateResultCount(term, visibleCount);
  }

  function updateResultCount(term, count) {
    if (!resultCountEl) return;

    if (!term) {
      resultCountEl.textContent = '';
      resultCountEl.classList.remove('is--visible');
      return;
    }

    resultCountEl.classList.add('is--visible');

    if (count === 0) {
      resultCountEl.textContent = 'No results found';
    } else if (count === 1) {
      resultCountEl.textContent = '1 result found';
    } else {
      resultCountEl.textContent = count + ' results found';
    }
  }

  if (searchInput) {
    searchInput.addEventListener('input', function() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(performSearch, 200);
    });
  }

  /* ------------------------------------------
     Case Studies — populate from JSON data source
     (mirrors WordPress REST API / custom post type pattern)
     ------------------------------------------ */
  var csGrid = document.getElementById('cs-grid');

  function renderCaseStudies(data) {
    if (!csGrid || !data || !data.length) return;

    // Sort by date descending (newest first)
    data.sort(function(a, b) {
      return new Date(b.date) - new Date(a.date);
    });

    var html = '';
    data.forEach(function(cs) {
      html += '<a href="' + cs.ctaUrl + '" class="res-cs-card" data-resource>'
        + '<div class="res-cs-card__img" style="background-color:' + cs.imageBg + ';">'
        + '<img src="' + cs.imageUrl + '" alt="' + cs.name + '" loading="lazy">'
        + '</div>'
        + '<h3 class="res-cs-card__name">' + cs.name + '</h3>'
        + '<div class="res-cs-card__meta">' + cs.meta + '</div>'
        + '<div class="res-cs-card__stat">'
        + '<span class="res-cs-card__stat-value">' + cs.stat + '</span>'
        + '<span class="res-cs-card__stat-label">' + cs.statLabel + '</span>'
        + '</div>'
        + '</a>';
    });

    csGrid.innerHTML = html;

    // Re-query searchable items so dynamically added cards are included
    allResources = document.querySelectorAll('[data-resource]');
    sections = document.querySelectorAll('.res-section');

    // Animate cards in if GSAP is available
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
      var csCards = csGrid.querySelectorAll('.res-cs-card');
      gsap.set(csCards, { opacity: 0, y: 40 });
      ScrollTrigger.create({
        trigger: csGrid,
        start: 'top 80%',
        once: true,
        onEnter: function() {
          gsap.to(csCards, {
            opacity: 1, y: 0,
            duration: 0.6,
            stagger: 0.1,
            ease: 'power3.out'
          });
        }
      });
    }
  }

  if (csGrid) {
    fetch('case-studies.json?v=2')
      .then(function(res) { return res.json(); })
      .then(renderCaseStudies)
      .catch(function(err) { console.warn('Could not load case studies:', err); });
  }

  /* ------------------------------------------
     Smooth scroll for category cards
     ------------------------------------------ */
  categoryCards.forEach(function(card) {
    var href = card.getAttribute('href');
    if (!href || href.charAt(0) !== '#') return;

    card.addEventListener('click', function(e) {
      var target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      // Offset for sticky nav (76px is the standard site nav height)
      var offset = 76 + 16;
      var top = target.getBoundingClientRect().top + window.pageYOffset - offset;

      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  /* ------------------------------------------
     GSAP Scroll animations
     ------------------------------------------ */
  if (typeof gsap === 'undefined') return;
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero stagger
  var heroEls = document.querySelectorAll(
    '.res-hero .label, .res-hero__title, .res-hero__sub, .res-hero__search'
  );
  if (heroEls.length) {
    gsap.set(heroEls, { opacity: 0, y: 40 });
    requestAnimationFrame(function() {
      gsap.to(heroEls, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.3
      });
    });
  }

  // Category cards — stagger on ScrollTrigger
  if (categoryCards.length && typeof ScrollTrigger !== 'undefined') {
    gsap.set(categoryCards, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: categoryCards[0].parentElement || categoryCards[0],
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(categoryCards, {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out'
        });
      }
    });
  }

  // Section headings — each reveals on ScrollTrigger
  if (typeof ScrollTrigger !== 'undefined') {
    var sectionTitles = document.querySelectorAll('.res-section__title');
    sectionTitles.forEach(function(title) {
      gsap.set(title, { opacity: 0, y: 30 });
      ScrollTrigger.create({
        trigger: title,
        start: 'top 80%',
        once: true,
        onEnter: function() {
          gsap.to(title, {
            opacity: 1,
            y: 0,
            duration: 0.7,
            ease: 'power3.out'
          });
        }
      });
    });
  }

})();
