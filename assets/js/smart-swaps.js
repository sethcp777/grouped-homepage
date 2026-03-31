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
     Compare columns + tabs
     ------------------------------------------ */
  var compareTabsBar = document.querySelector('.swaps-compare__tabs');
  var compareCols = document.querySelectorAll('.swaps-compare__col');
  var compareEls = compareTabsBar ? [compareTabsBar].concat(Array.from(compareCols)) : Array.from(compareCols);

  if (compareEls.length) {
    gsap.set(compareEls, { opacity: 0, y: 50 });
    ScrollTrigger.create({
      trigger: compareTabsBar || '.swaps-compare__columns',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compareEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      }
    });
  }

  /* ------------------------------------------
     Compare tab switching — competitor data
     ------------------------------------------ */
  var COMPETITOR_DATA = {
    laylo: {
      label: 'Laylo',
      subtitle: 'Pre-save & drop pages',
      rows: [
        { feature: 'Fan email + phone capture', grouped: '\u2713 Built-in, one step', status: 'yes', text: '\u2713 Available' },
        { feature: 'Pre-save integration', grouped: '\u2713 Native, one-step', status: 'yes', text: '\u2713 Available' },
        { feature: 'Owned group community', grouped: '\u2713 Built-in', status: 'no', text: '\u2717 Not included' },
        { feature: 'Release compounding (fans carry forward)', grouped: '\u2713 Automatic', status: 'yes', text: '\u2713 Available' },
        { feature: 'Push notifications', grouped: '\u2713 Built-in', status: 'no', text: '\u2717 Not included' },
        { feature: 'Free to start', grouped: '\u2713 Free tier available', status: 'no', text: '\u2717 Paid only' }
      ]
    },
    even: {
      label: 'EVEN',
      subtitle: 'Direct-to-fan sales platform',
      rows: [
        { feature: 'Fan capture without requiring payment', grouped: '\u2713 Free opt-in for fans', status: 'no', text: '\u2717 Purchase required for core access' },
        { feature: 'Works for emerging artists (no existing fanbase required)', grouped: '\u2713 Built for growth', status: 'partial', text: '~ Best with existing fanbase' },
        { feature: 'Owned group community layer', grouped: '\u2713 Built-in', status: 'partial', text: '~ Limited chat feature' },
        { feature: 'Release compounding (fans carry forward)', grouped: '\u2713 Automatic', status: 'partial', text: '~ Each release requires new purchase' },
        { feature: 'Pre-save integration', grouped: '\u2713 Native one-step', status: 'no', text: '\u2717 Not included' },
        { feature: 'Free to start', grouped: '\u2713 Free tier available', status: 'partial', text: '~ 20% rev share on all sales' }
      ]
    },
    linktree: {
      label: 'Linktree / Beacons',
      subtitle: 'Link-in-bio tools',
      rows: [
        { feature: 'Fan email capture', grouped: '\u2713 Built-in', status: 'partial', text: '~ Requires integrations or paid plan' },
        { feature: 'Phone number capture', grouped: '\u2713 Built-in', status: 'partial', text: '~ Paid plans only' },
        { feature: 'Pre-save integration', grouped: '\u2713 Native one-step', status: 'partial', text: '~ Redirect only' },
        { feature: 'Fan relationship', grouped: '\u2713 Direct & owned', status: 'partial', text: '~ No music-specific CRM' },
        { feature: 'Data ownership', grouped: '\u2713 You own everything', status: 'partial', text: '~ Platform claims ownership in ToS' },
        { feature: 'Release compounding', grouped: '\u2713 Fans carry forward', status: 'no', text: '\u2717 Starts from zero' }
      ]
    },
    discord: {
      label: 'Discord',
      subtitle: 'Community chat platform',
      rows: [
        { feature: 'Fan capture at point of discovery', grouped: '\u2713 Built-in via Swaps', status: 'no', text: '\u2717 Requires fans to seek you out' },
        { feature: 'Email + phone in one step', grouped: '\u2713 Built-in', status: 'no', text: '\u2717 No contact capture' },
        { feature: 'Algorithm-free reach', grouped: '\u2713 Yes', status: 'partial', text: '~ Notifications throttled at scale' },
        { feature: 'Organized, low-noise fan space', grouped: '\u2713 Clean by design', status: 'no', text: '\u2717 Chaotic by default' },
        { feature: 'Works without an existing fanbase', grouped: '\u2713 Designed for growth', status: 'no', text: '\u2717 Requires fans who already know you' },
        { feature: 'Release compounding', grouped: '\u2713 Automatic', status: 'no', text: '\u2717 Manual, starts over each drop' }
      ]
    },
    mailchimp: {
      label: 'Mailchimp',
      subtitle: 'Email marketing platform',
      note: 'Pre-saves coming soon',
      rows: [
        { feature: 'Phone + pre-save capture', grouped: '\u2713 Built-in', status: 'partial', text: '~ SMS is paid add-on; no pre-save' },
        { feature: 'Cost model', grouped: '\u2713 Per-send credits', status: 'no', text: '\u2717 Per-subscriber (costs grow as you do)' },
        { feature: 'Built for music releases', grouped: '\u2713 Purpose-built', status: 'no', text: '\u2717 Generic' },
        { feature: 'Fan compounding across releases', grouped: '\u2713 Automatic', status: 'no', text: '\u2717 Manual list management' },
        { feature: 'Push notifications', grouped: '\u2713 Built-in', status: 'no', text: '\u2717 Not included' },
        { feature: 'Free to start', grouped: '\u2713 Free tier available', status: 'partial', text: '~ Free up to 250 contacts only' }
      ]
    }
  };

  var compareTabs = document.querySelectorAll('.swaps-compare__tab');
  var competitorCol = document.getElementById('compare-competitor');
  var groupedCol = document.getElementById('compare-grouped');
  var competitorLabel = document.getElementById('competitor-label');
  var competitorSubtitle = document.getElementById('competitor-subtitle');

  function setCompetitor(key) {
    var data = COMPETITOR_DATA[key];
    if (!data) return;

    competitorLabel.textContent = data.label;
    competitorSubtitle.textContent = data.subtitle;

    data.rows.forEach(function(row, i) {
      // Update competitor column
      var statusEl = document.getElementById('competitor-row-' + i);
      var featureEl = document.getElementById('competitor-feature-' + i);
      if (statusEl) {
        statusEl.classList.remove('swaps-compare__row-status--yes', 'swaps-compare__row-status--no', 'swaps-compare__row-status--partial');
        statusEl.classList.add('swaps-compare__row-status--' + row.status);
        statusEl.textContent = row.text;
      }
      if (featureEl) {
        featureEl.textContent = row.feature;
      }
      // Update grouped column (row labels + text change per competitor)
      var groupedFeatureEl = document.getElementById('grouped-feature-' + i);
      var groupedStatusEl = document.getElementById('grouped-row-' + i);
      if (groupedFeatureEl) {
        groupedFeatureEl.textContent = row.feature;
      }
      if (groupedStatusEl) {
        groupedStatusEl.textContent = row.grouped;
      }
    });

    // Show/hide note
    var noteEl = document.getElementById('grouped-note');
    if (noteEl) {
      if (data.note) {
        noteEl.textContent = data.note;
        noteEl.style.display = 'block';
      } else {
        noteEl.style.display = 'none';
      }
    }
  }

  if (compareTabs.length && competitorCol) {
    // Set initial state (Laylo is default)
    setCompetitor('laylo');

    compareTabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var key = tab.getAttribute('data-competitor');
        if (tab.classList.contains('active')) return;

        // Update active tab
        compareTabs.forEach(function(t) { t.classList.remove('active'); });
        tab.classList.add('active');

        // Fade out both columns, swap content, fade in
        competitorCol.classList.add('is--switching');
        groupedCol.classList.add('is--switching');
        setTimeout(function() {
          setCompetitor(key);
          competitorCol.classList.remove('is--switching');
          groupedCol.classList.remove('is--switching');
        }, 250);
      });
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
