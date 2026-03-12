/* ============================================
   CASE STUDIES — Filters, Dropdowns, Sticky, Scroll Reveals
   ============================================ */

// ---- FILTER + SEARCH + SORT ----
(function initFilters() {
  var state = {
    search: '',
    genre: 'all',
    features: [],
    kpis: [],
    sort: 'recent'
  };

  var allCards = Array.from(document.querySelectorAll('.cs-grid__card, .cs-featured__card'));
  var gridContainer = document.getElementById('cs-grid');
  var featuredSection = document.querySelector('.cs-featured');
  var featuredCard = document.querySelector('.cs-featured__card');
  var searchInput = document.getElementById('cs-search');
  var sortSelect = document.getElementById('cs-sort');
  var filtersUsed = false;

  // Force-reveal cards when filters are first used (prevents GSAP opacity:0 conflict)
  function forceRevealCards() {
    if (filtersUsed || typeof gsap === 'undefined') return;
    filtersUsed = true;
    allCards.forEach(function(c) {
      gsap.set(c, { opacity: 1, y: 0 });
    });
  }

  function applyFilters() {
    forceRevealCards();

    allCards.forEach(function(card) {
      var matchSearch = !state.search ||
        (card.dataset.artist || '').toLowerCase().includes(state.search.toLowerCase());

      var matchGenre = state.genre === 'all' ||
        card.dataset.genre === state.genre;

      var cardFeatures = (card.dataset.features || '').split(',');
      var matchFeatures = state.features.length === 0 ||
        state.features.some(function(f) { return cardFeatures.indexOf(f) !== -1; });

      var cardKpis = (card.dataset.kpis || '').split(',');
      var matchKpis = state.kpis.length === 0 ||
        state.kpis.some(function(k) { return cardKpis.indexOf(k) !== -1; });

      var visible = matchSearch && matchGenre && matchFeatures && matchKpis;
      card.classList.toggle('hidden', !visible);
    });

    // Hide/show featured section
    if (featuredCard && featuredSection) {
      featuredSection.classList.toggle('hidden', featuredCard.classList.contains('hidden'));
    }

    applySort();
    updateEmptyState();
    renderActivePills();
    updateDropdownBadges();
  }

  // ---- ACTIVE FILTER PILLS ----
  var activeFiltersContainer = document.getElementById('cs-active-filters');
  var activeRow = document.getElementById('cs-active-row');
  var clearAllBtn = document.getElementById('cs-clear-all');

  var filterLabels = {
    'christian-pop': 'Christian Pop', 'rnb-pop': 'R&B / Pop',
    'hyperpop-pop': 'Hyperpop / Pop', 'indie-pop': 'Indie Pop',
    'pop-singer-songwriter': 'Pop / Singer-Songwriter',
    pop: 'Pop', 'experimental-hip-hop': 'Experimental Hip-Hop',
    'fan-voting': 'Fan Voting', subscriptions: 'Subscriptions',
    livestreams: 'Livestreams', merch: 'Merch',
    'social-automations': 'Social Automations', 'premiere-access': 'Premiere Access',
    followers: 'Followers', revenue: 'Revenue',
    'ticket-sales': 'Ticket Sales', subscribers: 'Subscribers',
    'merch-sales': 'Merch Sales'
  };

  function renderActivePills() {
    if (!activeRow || !activeFiltersContainer) return;
    activeRow.querySelectorAll('.cs-active-pill').forEach(function(p) { p.remove(); });

    var pills = [];
    if (state.genre !== 'all') {
      pills.push({ group: 'genre', value: state.genre, label: filterLabels[state.genre] || state.genre });
    }
    state.features.forEach(function(f) {
      pills.push({ group: 'features', value: f, label: filterLabels[f] || f });
    });
    state.kpis.forEach(function(k) {
      pills.push({ group: 'kpis', value: k, label: filterLabels[k] || k });
    });

    if (pills.length === 0) {
      activeFiltersContainer.classList.remove('is--visible');
      return;
    }
    activeFiltersContainer.classList.add('is--visible');

    pills.forEach(function(pill) {
      var el = document.createElement('button');
      el.className = 'cs-active-pill';
      el.innerHTML = pill.label + ' <span class="cs-active-pill__x">&times;</span>';
      el.addEventListener('click', function() { removePill(pill.group, pill.value); });
      activeRow.insertBefore(el, clearAllBtn);
    });
  }

  function removePill(group, value) {
    if (group === 'genre') {
      state.genre = 'all';
      document.querySelectorAll('.cs-chip[data-group="genre"]').forEach(function(c) {
        var isAll = c.dataset.filter === 'all';
        c.classList.toggle('active', isAll);
        c.setAttribute('aria-pressed', isAll ? 'true' : 'false');
      });
    } else if (group === 'features') {
      var idx = state.features.indexOf(value);
      if (idx !== -1) state.features.splice(idx, 1);
      var chip = document.querySelector('.cs-chip[data-group="features"][data-filter="' + value + '"]');
      if (chip) { chip.classList.remove('active'); chip.setAttribute('aria-pressed', 'false'); }
    } else if (group === 'kpis') {
      var idx2 = state.kpis.indexOf(value);
      if (idx2 !== -1) state.kpis.splice(idx2, 1);
      var chip2 = document.querySelector('.cs-chip[data-group="kpis"][data-filter="' + value + '"]');
      if (chip2) { chip2.classList.remove('active'); chip2.setAttribute('aria-pressed', 'false'); }
    }
    applyFilters();
  }

  // ---- DROPDOWN BADGE COUNTS ----
  function updateDropdownBadges() {
    var genreCount = document.querySelector('[data-count="genre"]');
    if (genreCount) {
      if (state.genre !== 'all') {
        genreCount.textContent = '1';
        genreCount.classList.add('has-count');
      } else {
        genreCount.textContent = '';
        genreCount.classList.remove('has-count');
      }
    }
    var featCount = document.querySelector('[data-count="features"]');
    if (featCount) {
      if (state.features.length > 0) {
        featCount.textContent = state.features.length;
        featCount.classList.add('has-count');
      } else {
        featCount.textContent = '';
        featCount.classList.remove('has-count');
      }
    }
    var kpiCount = document.querySelector('[data-count="kpis"]');
    if (kpiCount) {
      if (state.kpis.length > 0) {
        kpiCount.textContent = state.kpis.length;
        kpiCount.classList.add('has-count');
      } else {
        kpiCount.textContent = '';
        kpiCount.classList.remove('has-count');
      }
    }
  }

  function applySort() {
    if (!gridContainer) return;
    var gridCards = Array.from(gridContainer.querySelectorAll('.cs-grid__card'));
    gridCards.sort(function(a, b) {
      if (state.sort === 'recent') {
        return (b.dataset.date || '').localeCompare(a.dataset.date || '');
      }
      return (a.dataset.artist || '').localeCompare(b.dataset.artist || '');
    });
    gridCards.forEach(function(card) { gridContainer.appendChild(card); });
  }

  function updateEmptyState() {
    var visibleCount = allCards.filter(function(c) { return !c.classList.contains('hidden'); }).length;
    var emptyEl = document.getElementById('cs-empty');
    if (visibleCount === 0) {
      if (!emptyEl) {
        emptyEl = document.createElement('div');
        emptyEl.id = 'cs-empty';
        emptyEl.className = 'cs-empty-state';
        emptyEl.innerHTML = '<p>No case studies match your filters.</p><button class="cs-chip" id="cs-clear-filters">Clear all filters</button>';
        gridContainer.parentNode.insertBefore(emptyEl, gridContainer.nextSibling);
        document.getElementById('cs-clear-filters').addEventListener('click', clearAll);
      }
      emptyEl.style.display = '';
    } else if (emptyEl) {
      emptyEl.style.display = 'none';
    }
  }

  function clearAll() {
    state.search = '';
    state.genre = 'all';
    state.features = [];
    state.kpis = [];
    searchInput.value = '';

    // Reset all chip states
    document.querySelectorAll('.cs-chip').forEach(function(chip) {
      if (chip.dataset.group === 'genre' && chip.dataset.filter === 'all') {
        chip.classList.add('active');
        chip.setAttribute('aria-pressed', 'true');
      } else if (chip.id !== 'cs-clear-filters') {
        chip.classList.remove('active');
        chip.setAttribute('aria-pressed', 'false');
      }
    });
    applyFilters();
  }

  // --- Event: Search ---
  var searchTimeout;
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {
      state.search = searchInput.value.trim();
      applyFilters();
    }, 150);
  });

  // --- Event: Sort ---
  sortSelect.addEventListener('change', function() {
    state.sort = sortSelect.value;
    applyFilters();
  });

  // --- Event: Chip clicks ---
  document.querySelectorAll('.cs-chip[data-group]').forEach(function(chip) {
    chip.addEventListener('click', function() {
      var group = chip.dataset.group;
      var value = chip.dataset.filter;

      if (group === 'genre') {
        // Single-select genre
        if (value === 'all') {
          state.genre = 'all';
        } else {
          state.genre = value;
        }
        // Update genre chip visuals
        document.querySelectorAll('.cs-chip[data-group="genre"]').forEach(function(c) {
          var isActive = (value === 'all' && c.dataset.filter === 'all') ||
                         (value !== 'all' && c.dataset.filter === value);
          c.classList.toggle('active', isActive);
          c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
        });
      } else if (group === 'features') {
        // Multi-select toggle
        var idx = state.features.indexOf(value);
        if (idx === -1) {
          state.features.push(value);
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
        } else {
          state.features.splice(idx, 1);
          chip.classList.remove('active');
          chip.setAttribute('aria-pressed', 'false');
        }
      } else if (group === 'kpis') {
        // Multi-select toggle
        var idx2 = state.kpis.indexOf(value);
        if (idx2 === -1) {
          state.kpis.push(value);
          chip.classList.add('active');
          chip.setAttribute('aria-pressed', 'true');
        } else {
          state.kpis.splice(idx2, 1);
          chip.classList.remove('active');
          chip.setAttribute('aria-pressed', 'false');
        }
      }

      applyFilters();
    });
  });

  // --- Event: Clear all (active-filters row) ---
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAll);
  }

  // Initial sort on load
  applySort();
})();

// ---- DROPDOWN OPEN/CLOSE ----
(function initDropdowns() {
  var allDropdowns = document.querySelectorAll('.cs-toolbar__dropdown');

  function closeAll(except) {
    allDropdowns.forEach(function(dd) {
      if (dd !== except) {
        dd.classList.remove('is--open');
        dd.querySelector('.cs-toolbar__dropdown-btn').setAttribute('aria-expanded', 'false');
      }
    });
  }

  allDropdowns.forEach(function(dd) {
    var btn = dd.querySelector('.cs-toolbar__dropdown-btn');
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      var isOpen = dd.classList.contains('is--open');
      closeAll();
      if (!isOpen) {
        dd.classList.add('is--open');
        btn.setAttribute('aria-expanded', 'true');
      }
    });

    // Prevent clicks inside panels from closing the dropdown
    dd.querySelector('.cs-toolbar__dropdown-panel').addEventListener('click', function(e) {
      e.stopPropagation();
    });
  });

  // Click outside closes all
  document.addEventListener('click', function() {
    closeAll();
  });

  // Escape key closes all
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeAll();
  });
})();

// ---- STICKY SHADOW DETECTION ----
(function initStickyDetect() {
  var sentinel = document.getElementById('cs-toolbar-sentinel');
  var toolbar = document.getElementById('cs-toolbar');
  if (!sentinel || !toolbar) return;

  var observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      toolbar.classList.toggle('is--stuck', !entry.isIntersecting);
    });
  }, { threshold: 0 });

  observer.observe(sentinel);
})();

// ---- GSAP SCROLL REVEALS ----
(function initScrollReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var revealTargets = [
    '.cs-trust-bar__stat',
    '.cs-featured__card',
    '.cs-grid__card',
    '.cs-bottom-cta h2',
    '.cs-bottom-cta p'
  ];

  revealTargets.forEach(function(sel) {
    gsap.set(sel, { opacity: 0, y: 30 });
  });

  function reveal(trigger, targets, opts) {
    opts = opts || {};
    ScrollTrigger.create({
      trigger: trigger,
      start: opts.start || 'top 85%',
      once: true,
      onEnter: function() {
        gsap.to(targets, {
          opacity: 1, y: 0,
          duration: opts.duration || 0.6,
          stagger: opts.stagger || 0,
          ease: 'power3.out'
        });
      }
    });
  }

  reveal('.cs-trust-bar', '.cs-trust-bar__stat', { stagger: 0.1 });
  reveal('.cs-featured', '.cs-featured__card', { duration: 0.8, start: 'top 80%' });
  reveal('.cs-grid', '.cs-grid__card', { stagger: 0.12, start: 'top 80%' });
  reveal('.cs-bottom-cta', '.cs-bottom-cta h2, .cs-bottom-cta p', { stagger: 0.1, duration: 0.7 });
})();
