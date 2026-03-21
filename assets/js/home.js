/* ============================================
   HOME.JS — Hero Phone Demo Animation
   ============================================ */
(function initHeroPhoneDemo() {
  if (typeof gsap === 'undefined') return;

  const screens = document.querySelectorAll('.demo-screen');
  const calloutFan = document.getElementById('callout-fan');
  const calloutUnlock = document.getElementById('callout-unlock');
  const calloutGrow = document.getElementById('callout-grow');

  if (!screens.length) return;

  // ---- Helpers ----

  function screenTransition(tl, fromId, toId, position) {
    var from = document.getElementById(fromId);
    var to = document.getElementById(toId);
    if (!from || !to) return;

    tl.to(from, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in',
      onComplete: function() { from.style.visibility = 'hidden'; }
    }, position)
    .set(to, { visibility: 'visible', y: 20 }, position)
    .to(to, {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: 'power2.out'
    }, position + 0.15);
  }

  function calloutPop(tl, el, position, holdDuration) {
    if (!el) return;
    tl.to(el, {
      opacity: 1,
      y: 0,
      scale: 1,
      duration: 0.35,
      ease: 'back.out(1.7)'
    }, position)
    .to(el, {
      opacity: 0,
      y: -8,
      scale: 0.95,
      duration: 0.25,
      ease: 'power2.in'
    }, position + holdDuration);
  }

  function typeText(valueId, fieldId, text, startTime) {
    var valueEl = document.getElementById(valueId);
    var fieldEl = document.getElementById(fieldId);
    if (!valueEl) return;

    var label = fieldEl ? fieldEl.querySelector('.demo-field-label') : null;
    var cursor = fieldEl ? fieldEl.querySelector('.demo-field-cursor') : null;

    if (label) gsap.to(label, { opacity: 0, duration: 0.15 });
    if (cursor) gsap.set(cursor, { opacity: 1 });

    valueEl.textContent = '';
    var i = 0;
    var interval = setInterval(function() {
      if (i < text.length) {
        valueEl.textContent += text[i];
        i++;
      } else {
        clearInterval(interval);
        if (cursor) {
          setTimeout(function() {
            gsap.to(cursor, { opacity: 0, duration: 0.2 });
          }, 400);
        }
      }
    }, 60);
  }

  // ---- Master Timeline ----

  var master = gsap.timeline({ repeat: -1, delay: 0.5 });

  // Screen 1: Swap Landing (visible from start, hold 3.5s)
  // Already visible via CSS

  // Transition 1 → 2 at t=3.5
  screenTransition(master, 'demo-swap', 'demo-form', 3.5);

  // Screen 2: Fan Form — typing animations
  master.call(function() {
    typeText('demo-name-value', 'demo-field-name', 'Alex Rivera', 0);
  }, null, 4.2);

  master.call(function() {
    typeText('demo-email-value', 'demo-field-email', 'alex@email.com', 0);
  }, null, 5.5);

  // Flash the "Get Access" button before transitioning
  master.to('.demo-form-btn', {
    boxShadow: '0 0 20px rgba(196,138,58,0.4)',
    duration: 0.3,
    yoyo: true,
    repeat: 1
  }, 6.8);

  // Transition 2 → 3 at t=7.5
  screenTransition(master, 'demo-form', 'demo-granted', 7.5);

  // "+1 Fan captured" callout
  calloutPop(master, calloutFan, 7.8, 2.0);

  // Screen 3: Access Granted — checkmark bounce
  master.from('#demo-granted .demo-granted-icon', {
    scale: 0,
    duration: 0.5,
    ease: 'back.out(2)'
  }, 8.0);

  // "Content unlocked" callout
  calloutPop(master, calloutUnlock, 9.0, 1.5);

  // Transition 3 → 4 at t=11.5
  screenTransition(master, 'demo-granted', 'demo-feed', 11.5);

  // Screen 4: Group Feed — staggered post reveal
  master.from('#demo-feed .demo-feed-post', {
    opacity: 0,
    y: 15,
    stagger: 0.3,
    duration: 0.5,
    ease: 'power2.out'
  }, 12.0);

  // Transition 4 → 5 at t=15.5
  screenTransition(master, 'demo-feed', 'demo-tiers', 15.5);

  // Screen 5: Tiers — progress bar fill
  master.to('.demo-tiers-progress-bar', {
    width: '65%',
    duration: 1.2,
    ease: 'power2.out'
  }, 16.2);

  // "Audience growing" callout
  calloutPop(master, calloutGrow, 16.5, 1.8);

  // Transition 5 → 6 at t=19.5
  screenTransition(master, 'demo-tiers', 'demo-notif', 19.5);

  // Screen 6: Push Notification — slide down
  master.from('#demo-notif .demo-notif-bar', {
    y: -40,
    opacity: 0,
    duration: 0.5,
    ease: 'power2.out'
  }, 20.0);

  // Transition 6 → loop reset at t=23.0
  master.to('#demo-notif', {
    opacity: 0,
    duration: 0.4,
    ease: 'power2.in'
  }, 23.0);

  // Reset all state for loop
  master.call(function() {
    screens.forEach(function(s) {
      gsap.set(s, { opacity: 0, y: 0, visibility: 'hidden' });
    });

    // Reset typed text
    var nameVal = document.getElementById('demo-name-value');
    var emailVal = document.getElementById('demo-email-value');
    if (nameVal) nameVal.textContent = '';
    if (emailVal) emailVal.textContent = '';

    // Reset field labels and cursors
    document.querySelectorAll('.demo-field-label').forEach(function(l) {
      gsap.set(l, { opacity: 1 });
    });
    document.querySelectorAll('.demo-field-cursor').forEach(function(c) {
      gsap.set(c, { opacity: 0 });
    });

    // Reset progress bar
    gsap.set('.demo-tiers-progress-bar', { width: '0%' });

    // Reset callouts
    [calloutFan, calloutUnlock, calloutGrow].forEach(function(c) {
      if (c) gsap.set(c, { opacity: 0, y: 8, scale: 0.95 });
    });

    // Show screen 1
    var screen1 = document.getElementById('demo-swap');
    if (screen1) gsap.set(screen1, { visibility: 'visible', opacity: 1, y: 0 });
  }, null, 23.5);

  // Total cycle: ~24s
})();

/* ============================================
   ARTIST MARQUEE — Infinite horizontal scroll
   ============================================ */
(function initArtistMarquee() {
  if (typeof gsap === 'undefined') return;

  var track = document.getElementById('artist-marquee-track');
  var marquee = document.getElementById('artist-marquee');
  if (!track || !marquee) return;

  // Duplicate the bubbles for seamless loop
  var items = track.innerHTML;
  track.innerHTML = items + items;

  // Measure one set width (overlapping: bubble width + negative margin)
  var allBubbles = track.querySelectorAll('.artist-bubble');
  var halfCount = allBubbles.length / 2;
  var singleSetWidth = 0;
  var bubbleStyle = getComputedStyle(allBubbles[0]);
  var marginLeft = parseFloat(bubbleStyle.marginLeft) || 0;
  for (var i = 0; i < halfCount; i++) {
    singleSetWidth += allBubbles[i].offsetWidth + (i > 0 ? marginLeft : 0);
  }

  // GSAP tween: scroll the track left by one full set, then repeat seamlessly
  var speed = 35; // pixels per second (slightly slower for bigger bubbles)
  var duration = singleSetWidth / speed;

  var scrollTween = gsap.to(track, {
    x: -singleSetWidth,
    duration: duration,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: function(x) {
        return (parseFloat(x) % singleSetWidth) + 'px';
      }
    }
  });

  // ---- Mobile vs Desktop behavior ----
  var isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (isTouchDevice) {
    // ======== MOBILE: Swipe-to-browse + Tap-to-preview ========
    scrollTween.pause();

    var touchStartX = 0;
    var touchCurrentX = 0;
    var trackStartX = 0;
    var isDragging = false;
    var hasMoved = false;
    var touchStartTime = 0;
    var activeBubble = null;

    function getTrackX() {
      var style = getComputedStyle(track);
      var matrix = new DOMMatrix(style.transform);
      return matrix.m41;
    }

    function wrapX(val) {
      val = val % singleSetWidth;
      if (val > 0) val -= singleSetWidth;
      return val;
    }

    function closeBubblePreview() {
      if (activeBubble) {
        activeBubble.classList.remove('is--tapped');
        activeBubble = null;
      }
    }

    marquee.addEventListener('touchstart', function(e) {
      touchStartX = e.touches[0].clientX;
      touchCurrentX = touchStartX;
      trackStartX = getTrackX();
      isDragging = true;
      hasMoved = false;
      touchStartTime = Date.now();
      gsap.killTweensOf(track);
    }, { passive: true });

    marquee.addEventListener('touchmove', function(e) {
      if (!isDragging) return;
      touchCurrentX = e.touches[0].clientX;
      var delta = touchCurrentX - touchStartX;
      if (Math.abs(delta) > 12) {
        hasMoved = true;
        closeBubblePreview();
      }
      gsap.set(track, { x: wrapX(trackStartX + delta) });
      updateOrbitScale();
    }, { passive: true });

    marquee.addEventListener('touchend', function(e) {
      if (!isDragging) return;
      isDragging = false;

      if (!hasMoved) {
        // It's a TAP
        var touch = e.changedTouches[0];
        var target = document.elementFromPoint(touch.clientX, touch.clientY);
        var bubble = target ? target.closest('.artist-bubble') : null;

        if (activeBubble && activeBubble === bubble) {
          // Second tap on same bubble — navigate to group
          closeBubblePreview();
          if (bubble && bubble.href) window.open(bubble.href, '_blank');
          return;
        }

        closeBubblePreview();

        if (bubble) {
          activeBubble = bubble;
          bubble.classList.add('is--tapped');
          updateOrbitScale();
        }
        return;
      }

      // SWIPE: momentum throw
      var elapsed = Date.now() - touchStartTime;
      var velocity = (touchCurrentX - touchStartX) / Math.max(elapsed, 1);
      var throwDist = Math.max(-600, Math.min(600, velocity * 400));
      var fromX = getTrackX();

      gsap.to(track, {
        x: wrapX(fromX + throwDist),
        duration: Math.min(Math.abs(throwDist) / 500, 1.2),
        ease: 'power3.out'
      });
    }, { passive: true });

    // Prevent default link navigation on tap (handled above)
    marquee.addEventListener('click', function(e) {
      var bubble = e.target.closest('.artist-bubble');
      if (bubble) e.preventDefault();
    });

    // Close preview when tapping outside marquee
    document.addEventListener('touchstart', function(e) {
      if (activeBubble && !marquee.contains(e.target)) {
        closeBubblePreview();
      }
    }, { passive: true });

  } else {
    // ======== DESKTOP: Hover pause ========
    marquee.addEventListener('mouseenter', function() {
      gsap.to(scrollTween, { timeScale: 0, duration: 0.6, ease: 'power2.out' });
    });

    marquee.addEventListener('mouseleave', function() {
      gsap.to(scrollTween, { timeScale: 1, duration: 0.8, ease: 'power2.inOut' });
    });
  }

})();

/* ============================================
   BENEFITS — Sticky Card Stack + Interactive Mockups
   ============================================ */
(function initBenefits() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  gsap.registerPlugin(ScrollTrigger);

  var cards = document.querySelectorAll('.benefit-card');
  if (!cards.length) return;

  var progressContainer = document.getElementById('benefits-progress');
  var progressDots = document.querySelectorAll('.benefits-progress-dot');
  var headlineAccent = document.querySelector('.benefits-headline-accent');
  var activeCardIndex = -1;
  var typingStarted = false;

  // --- Headline accent reveal ---
  if (headlineAccent) {
    ScrollTrigger.create({
      trigger: '.benefits-header',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        headlineAccent.classList.add('is-visible');
      }
    });
  }

  // --- Progress dots: show/hide based on section visibility ---
  if (progressContainer) {
    ScrollTrigger.create({
      trigger: '.benefits-stack',
      start: 'top 60%',
      end: 'bottom 40%',
      onEnter: function() { progressContainer.classList.add('is-visible'); },
      onLeave: function() { progressContainer.classList.remove('is-visible'); },
      onEnterBack: function() { progressContainer.classList.add('is-visible'); },
      onLeaveBack: function() { progressContainer.classList.remove('is-visible'); }
    });

    // Click dots to scroll to cards
    progressDots.forEach(function(dot) {
      dot.addEventListener('click', function() {
        var targetCard = document.querySelector('.benefit-card[data-card="' + dot.getAttribute('data-target') + '"]');
        if (targetCard) targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
      });
    });
  }

  // --- Set active card + update progress dots ---
  function setActiveCard(index) {
    if (index === activeCardIndex) return;
    activeCardIndex = index;

    cards.forEach(function(c, i) {
      if (i === index) {
        c.classList.add('is-active');
      } else {
        c.classList.remove('is-active');
      }
    });

    progressDots.forEach(function(dot, i) {
      if (i === index) {
        dot.classList.add('is-active');
      } else {
        dot.classList.remove('is-active');
      }
    });

    // Trigger card-specific animations
    if (index === 0 && !typingStarted) startTypingAnimation();
  }

  // --- Active card tracking via scroll ---
  cards.forEach(function(card, i) {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 55%',
      end: 'bottom 45%',
      onEnter: function() { setActiveCard(i); },
      onEnterBack: function() { setActiveCard(i); }
    });
  });

  // --- Card stacking: dim + scale previous cards as next ones enter ---
  cards.forEach(function(card, i) {
    if (i === cards.length - 1) return;

    ScrollTrigger.create({
      trigger: cards[i + 1],
      start: 'top 85%',
      end: 'top 40%',
      scrub: true,
      onUpdate: function(self) {
        var progress = self.progress;
        gsap.set(card.querySelector('.benefit-card-inner'), {
          scale: 1 - (progress * 0.05),
          opacity: 1 - (progress * 0.4),
          filter: 'brightness(' + (1 - progress * 0.2) + ')'
        });
      }
    });
  });

  // --- Content stagger reveal per card ---
  cards.forEach(function(card) {
    var label = card.querySelector('.benefit-label');
    var title = card.querySelector('.benefit-title');
    var points = card.querySelectorAll('.benefit-point');
    var cta = card.querySelector('.btn-primary');
    var visual = card.querySelector('.benefit-visual');

    var elements = [];
    if (label) elements.push(label);
    if (title) elements.push(title);
    points.forEach(function(p) { elements.push(p); });
    if (cta) elements.push(cta);

    gsap.set(elements, { opacity: 0, y: 25 });
    if (visual) gsap.set(visual, { opacity: 0, scale: 0.97 });

    ScrollTrigger.create({
      trigger: card,
      start: 'top 70%',
      once: true,
      onEnter: function() {
        gsap.to(elements, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          stagger: 0.1,
          ease: 'power2.out'
        });
        if (visual) {
          gsap.to(visual, {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            delay: 0.2,
            ease: 'power2.out'
          });
        }
      }
    });
  });

  // --- 92% stat counter ---
  var statEl = document.querySelector('#benefit-stat-92 .benefit-stat-value');
  if (statEl) {
    var target = parseInt(statEl.getAttribute('data-target'), 10) || 92;
    ScrollTrigger.create({
      trigger: '#benefit-stat-92',
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(statEl, {
          innerText: target,
          duration: 1.5,
          ease: 'power2.out',
          snap: { innerText: 1 },
          onUpdate: function() {
            statEl.textContent = Math.round(parseFloat(statEl.textContent));
          }
        });
      }
    });
  }

  // --- Card 1: Typing animation for swap fields ---
  function startTypingAnimation() {
    typingStarted = true;
    var fields = document.querySelectorAll('.mockup-swap-field');
    if (!fields.length) return;

    var texts = ['Sarah Johnson', 'sarah@email.com'];

    fields.forEach(function(field, i) {
      var delay = i * 1800 + 600;
      setTimeout(function() {
        var placeholder = field.querySelector('span');
        if (!placeholder) return;

        field.classList.add('is-typing');
        var originalText = placeholder.textContent;
        placeholder.innerHTML = '<span class="typed-text"></span><span class="type-cursor"></span>';
        var typedSpan = placeholder.querySelector('.typed-text');
        var text = texts[i] || 'text';
        var charIndex = 0;

        var typeInterval = setInterval(function() {
          if (charIndex < text.length) {
            typedSpan.textContent += text[charIndex];
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setTimeout(function() {
              var cursor = placeholder.querySelector('.type-cursor');
              if (cursor) cursor.style.display = 'none';
              field.classList.remove('is-typing');
            }, 800);
          }
        }, 55);
      }, delay);
    });
  }

  // --- Card 3: Chart line draw + data points ---
  var chartLine = document.querySelector('.mockup-chart-line');
  if (chartLine) {
    var lineLength = chartLine.getTotalLength ? chartLine.getTotalLength() : 500;
    gsap.set(chartLine, { strokeDasharray: lineLength, strokeDashoffset: lineLength });

    var chartDots = document.querySelectorAll('.mockup-chart-dot');
    var chartPulses = document.querySelectorAll('.mockup-chart-dot-pulse');
    var releaseLabels = document.querySelectorAll('.mockup-chart-releases span');

    ScrollTrigger.create({
      trigger: '.benefit-mockup-chart',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        // Draw the line
        gsap.to(chartLine, {
          strokeDashoffset: 0,
          duration: 2,
          ease: 'power2.out'
        });

        // Reveal data points with stagger
        chartDots.forEach(function(dot, i) {
          setTimeout(function() {
            dot.classList.add('is-visible');
          }, 500 + (i * 450));
        });

        // Start pulse rings
        chartPulses.forEach(function(pulse, i) {
          setTimeout(function() {
            pulse.classList.add('is-visible');
          }, 700 + (i * 450));
        });

        // Highlight release labels sequentially
        releaseLabels.forEach(function(label, i) {
          setTimeout(function() {
            label.classList.add('is-highlight');
            // Remove highlight from previous (keep last one)
            if (i > 0 && i < releaseLabels.length - 1) {
              setTimeout(function() {
                label.classList.remove('is-highlight');
              }, 600);
            }
          }, 600 + (i * 450));
        });
      }
    });
  }

})();

/* ============================================
   THREE PILLARS — Header Reveal + Crisp Loading + Expansion
   ============================================ */
(function initPillars() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  if (typeof CustomEase !== 'undefined') {
    gsap.registerPlugin(CustomEase);
  }

  // --- Header reveal (unchanged) ---
  var headerLabel = document.querySelector('.pillars__label');
  var headerHeadline = document.querySelector('.pillars__headline');
  var headerSub = document.querySelector('.pillars__sub');
  var headerEls = [];
  if (headerLabel) headerEls.push(headerLabel);
  if (headerHeadline) headerEls.push(headerHeadline);
  if (headerSub) headerEls.push(headerSub);

  if (headerEls.length) {
    gsap.set(headerEls, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.pillars__header',
      start: 'top 78%',
      once: true,
      onEnter: function() {
        gsap.to(headerEls, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power2.out'
        });
      }
    });
  }

  // --- Crisp loading animation for steps ---
  var masks = document.querySelectorAll('.pillars__step-mask');
  var nums = document.querySelectorAll('.pillars__step-num');
  var titles = document.querySelectorAll('.pillars__step-title');
  var line = document.querySelector('.pillars__line');
  var steps = document.querySelectorAll('.pillars__step');
  var stepsContainer = document.querySelector('.pillars__steps');
  if (!masks.length) return;

  // Start hidden — steps begin off-screen to the right
  gsap.set(steps, { xPercent: 120, opacity: 0 });
  gsap.set(stepsContainer, { opacity: 1 });

  ScrollTrigger.create({
    trigger: '.pillars__steps',
    start: 'top 82%',
    once: true,
    onEnter: function() {
      var tl = gsap.timeline({
        defaults: { ease: 'expo.out' }
      });

      // Phase 1: Steps slide in from the right with stagger
      tl.to(steps, {
        xPercent: 0,
        opacity: 1,
        duration: 1.4,
        stagger: {
          each: 0.15,
          from: 'start'
        }
      });

      // Phase 2: Subtle overshoot settle (bounce back from the left)
      tl.to(steps, {
        xPercent: -2,
        duration: 0.3,
        ease: 'power2.out'
      }, '-=0.3');

      tl.to(steps, {
        xPercent: 0,
        duration: 0.4,
        ease: 'power2.inOut'
      }, '-=0.05');

      // Phase 3: Line draws across with crisp timing
      if (line) {
        tl.to(line, {
          scaleX: 1,
          duration: 1.6,
          ease: 'expo.inOut'
        }, '-=1.4');
      }
    }
  });

  // --- Pillar detail cards: scroll-linked progression + hover parallax ---
  var pillarCards = gsap.utils.toArray('.pillar-card');
  var connectors = gsap.utils.toArray('.pillar-cards__connector');
  var isTouchDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches;

  if (pillarCards.length) {
    // Initial states
    gsap.set(connectors, { scaleY: 0 });
    gsap.set('.pillar-card__watermark', { opacity: 0 });

    // === Phase 1: Initial reveal (sequenced, once) ===
    var cardTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: '#pillar-cards',
        start: 'top 75%',
        once: true
      }
    });

    pillarCards.forEach(function(card, i) {
      var watermark = card.querySelector('.pillar-card__watermark');

      // Dot pops in
      cardTimeline.add(function() { card.classList.add('is--timeline-active'); });

      // Card fades up
      cardTimeline.to(card, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out'
      }, '-=0.2');

      // Watermark fades in
      if (watermark) {
        cardTimeline.to(watermark, {
          opacity: 1, duration: 0.5, ease: 'power2.out'
        }, '-=0.5');
      }

      // Connector draws
      if (connectors[i]) {
        cardTimeline.to(connectors[i], {
          scaleY: 1, duration: 0.4, ease: 'power2.inOut'
        }, '-=0.15');
      }
    });

    // === Phase 2: Scroll-linked dimming (previous cards recede) ===
    pillarCards.forEach(function(card, i) {
      if (i > 0) {
        ScrollTrigger.create({
          trigger: card,
          start: 'top 80%',
          end: 'top 35%',
          scrub: 0.5,
          onUpdate: function(self) {
            var prev = pillarCards[i - 1];
            var p = self.progress;
            gsap.set(prev, {
              opacity: 1 - (p * 0.45),
              scale: 1 - (p * 0.03),
              filter: 'brightness(' + (1 - p * 0.15) + ')'
            });
          }
        });
      }
    });

    // === Phase 3: Scroll-linked connector draw ===
    connectors.forEach(function(conn) {
      ScrollTrigger.create({
        trigger: conn,
        start: 'top 85%',
        end: 'bottom 65%',
        scrub: 0.3,
        onUpdate: function(self) {
          gsap.set(conn, { scaleY: self.progress });
        }
      });
    });

    // === Phase 4: Active card detection (gold highlight) ===
    ScrollTrigger.create({
      trigger: '#pillar-cards',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: function() {
        var viewCenter = window.innerHeight * 0.5;
        var closest = null;
        var closestDist = Infinity;
        pillarCards.forEach(function(card) {
          var rect = card.getBoundingClientRect();
          var cardCenter = rect.top + rect.height / 2;
          var dist = Math.abs(cardCenter - viewCenter);
          if (dist < closestDist) { closestDist = dist; closest = card; }
        });
        pillarCards.forEach(function(card) {
          card.classList.toggle('is--active', card === closest);
        });
      }
    });

    // === Phase 5: Auto-cycling benefit point highlights ===
    initPillarPointCycling(pillarCards);
  }

  function initPillarPointCycling(pillarCards) {
    var CYCLE_MS = 4000;

    pillarCards.forEach(function(card) {
      var points = card.querySelectorAll('.benefit-point');
      var mockup = card.querySelector('.benefit-mockup');
      if (!points.length) return;

      var current = 0;
      var timer = null;

      function activate(idx) {
        current = idx;
        points.forEach(function(p, i) {
          p.classList.toggle('is--point-active', i === idx);
        });
        card.setAttribute('data-active-point', idx);
        if (mockup) mockup.setAttribute('data-visual-state', idx);
        animateVisual(card, mockup, idx);
      }

      function start() {
        if (timer) return;
        card.classList.add('is--cycling');
        activate(0);
        timer = setInterval(function() {
          activate((current + 1) % points.length);
        }, CYCLE_MS);
      }

      function stop() {
        if (timer) { clearInterval(timer); timer = null; }
        card.classList.remove('is--cycling');
        card.removeAttribute('data-active-point');
        points.forEach(function(p) { p.classList.remove('is--point-active'); });
        if (mockup) mockup.removeAttribute('data-visual-state');
      }

      // Viewport-aware start/stop
      ScrollTrigger.create({
        trigger: card,
        start: 'top 70%',
        end: 'bottom 30%',
        onEnter: start,
        onLeave: stop,
        onEnterBack: start,
        onLeaveBack: stop
      });

      // Click point to jump + reset timer
      points.forEach(function(point, i) {
        point.addEventListener('click', function() {
          if (timer) { clearInterval(timer); timer = null; }
          activate(i);
          timer = setInterval(function() {
            activate((current + 1) % points.length);
          }, CYCLE_MS);
        });
      });
    });
  }

  function animateVisual(card, mockup, idx) {
    if (!mockup) return;

    // Card 1: Swap mockup
    if (mockup.classList.contains('benefit-mockup-swap')) {
      var fields = mockup.querySelectorAll('.mockup-swap-field');
      var btn = mockup.querySelector('.mockup-swap-btn');
      if (idx === 1 && fields.length) {
        gsap.fromTo(fields, { scale: 0.96 }, { scale: 1, duration: 0.4, stagger: 0.12, ease: 'power2.out' });
      } else if (idx === 2 && btn) {
        gsap.fromTo(btn, { boxShadow: '0 0 0px rgba(196,138,58,0)' },
          { boxShadow: '0 0 24px rgba(196,138,58,0.45)', duration: 0.6, yoyo: true, repeat: 1, ease: 'power2.inOut' });
      }
    }

    // Card 2: Inbox mockup
    if (mockup.classList.contains('benefit-mockup-inbox')) {
      var bell = mockup.querySelector('.mockup-inbox-bell svg');
      var sendBtn = mockup.querySelector('.mockup-inbox-send');
      var msgs = mockup.querySelectorAll('.mockup-inbox-msg');
      if (idx === 1 && bell) {
        gsap.fromTo(bell, { rotation: 0 }, { rotation: 12, duration: 0.12, yoyo: true, repeat: 5, ease: 'power1.inOut' });
        // Pulse notification dots
        msgs.forEach(function(m) {
          var dot = m.querySelector('.mockup-inbox-dot');
          if (dot) gsap.fromTo(dot, { scale: 1 }, { scale: 1.5, duration: 0.3, yoyo: true, repeat: 1, ease: 'power2.out' });
        });
      } else if (idx === 2 && sendBtn) {
        gsap.fromTo(sendBtn, { boxShadow: '0 0 0px rgba(196,138,58,0)' },
          { boxShadow: '0 0 24px rgba(196,138,58,0.45)', duration: 0.6, yoyo: true, repeat: 1, ease: 'power2.inOut' });
      }
    }

    // Card 3: Chart mockup
    if (mockup.classList.contains('benefit-mockup-chart')) {
      var dots = mockup.querySelectorAll('.mockup-chart-dot');
      var labels = mockup.querySelectorAll('.mockup-chart-releases span');
      var badge = card.querySelector('.benefit-badge');
      // Reset labels
      labels.forEach(function(l) { l.classList.remove('is-highlight'); });

      if (idx === 0) {
        gsap.to([dots[0], dots[1]], { opacity: 1, duration: 0.4 });
        if (dots[2]) gsap.to(dots[2], { opacity: 0.2, duration: 0.4 });
        if (dots[3]) gsap.to(dots[3], { opacity: 0.2, duration: 0.4 });
        if (labels[0]) labels[0].classList.add('is-highlight');
        if (labels[1]) labels[1].classList.add('is-highlight');
      } else if (idx === 1) {
        gsap.to(dots, { opacity: 1, duration: 0.4, stagger: 0.1 });
        labels.forEach(function(l) { l.classList.add('is-highlight'); });
      } else {
        gsap.to(dots, { opacity: 1, duration: 0.3 });
        labels.forEach(function(l) { l.classList.add('is-highlight'); });
        if (badge) {
          gsap.fromTo(badge, { scale: 1 }, { scale: 1.05, duration: 0.4, yoyo: true, repeat: 1, ease: 'power2.out' });
        }
      }
    }
  }
})();

/* ============================================
   FEATURE BREAKDOWN — Stagger Reveal
   ============================================ */
(function initFeatureBreakdown() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var fbCards = document.querySelectorAll('.fb-card');
  if (!fbCards.length) return;

  gsap.set(fbCards, { opacity: 0, y: 30 });

  ScrollTrigger.create({
    trigger: '.feature-breakdown',
    start: 'top 70%',
    once: true,
    onEnter: function() {
      gsap.to(fbCards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: 'power2.out'
      });
    }
  });
})();

/* ============================================
   USE CASES — Stagger Reveal
   ============================================ */
(function initUseCases() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var ucHeadline = document.querySelector('.use-cases__headline');
  var ucCards = document.querySelectorAll('.uc-card');
  var ucCta = document.querySelector('.use-cases__cta-wrap');
  if (!ucCards.length) return;

  if (ucHeadline) gsap.set(ucHeadline, { opacity: 0, y: 20 });
  gsap.set(ucCards, { opacity: 0, y: 30 });
  if (ucCta) gsap.set(ucCta, { opacity: 0, y: 15 });

  ScrollTrigger.create({
    trigger: '.use-cases',
    start: 'top 75%',
    once: true,
    onEnter: function() {
      if (ucHeadline) gsap.to(ucHeadline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
      gsap.to(ucCards, { opacity: 1, y: 0, duration: 0.6, stagger: 0.15, delay: 0.15, ease: 'power2.out' });
      if (ucCta) gsap.to(ucCta, { opacity: 1, y: 0, duration: 0.5, delay: 0.6, ease: 'power2.out' });
    }
  });
})();

/* ============================================
   WHY THEY STAY — Stagger Reveal
   ============================================ */
(function initWhyStay() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var section = document.querySelector('.why-stay');
  if (!section) return;

  var headline = section.querySelector('.why-stay__headline');
  var label = section.querySelector('.label');
  var cards = section.querySelectorAll('.why-stay__card');

  // Set initial state
  var headerEls = [];
  if (label) headerEls.push(label);
  if (headline) headerEls.push(headline);
  gsap.set(headerEls, { opacity: 0, y: 20 });
  gsap.set(cards, { opacity: 0, y: 30 });

  // Reveal header
  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    once: true,
    onEnter: function() {
      gsap.to(headerEls, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.12,
        ease: 'power2.out'
      });

      // Stagger cards in after header
      gsap.to(cards, {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        delay: 0.3,
        ease: 'power2.out'
      });
    }
  });
})();

/* ============================================
   EYEBROW BANNER — Dismiss + localStorage
   ============================================ */
(function initEyebrowBanner() {
  var banner = document.getElementById('eyebrow-banner');
  var closeBtn = document.getElementById('eyebrow-close');
  if (!banner || !closeBtn) return;

  function hideEyebrow() {
    banner.classList.add('is-hidden');
    document.documentElement.style.setProperty('--eyebrow-h', '0px');
  }

  // Check if already dismissed
  if (localStorage.getItem('eyebrow-dismissed') === '1') {
    hideEyebrow();
    return;
  }

  closeBtn.addEventListener('click', function() {
    hideEyebrow();
    localStorage.setItem('eyebrow-dismissed', '1');
  });
})();

/* ============================================
   WHAT WE ARE — Sub Reveal + Highlight Text on Scroll
   ============================================ */
(function initWhatWeAre() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var headline = document.querySelector('.what-we-are__headline');

  // Headline: soft fade-up reveal
  if (headline) {
    gsap.set(headline, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: '.what-we-are',
      start: 'top 80%',
      once: true,
      onEnter: function() {
        gsap.to(headline, {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power2.out'
        });
      }
    });
  }

  // Body: highlight text on scroll (SplitText)
  if (typeof SplitText !== 'undefined') {
    gsap.registerPlugin(SplitText);
    var targets = document.querySelectorAll('[data-highlight-text]');
    targets.forEach(function(el) {
      var scrollStart = el.getAttribute('data-highlight-scroll-start') || 'top 90%';
      var scrollEnd = el.getAttribute('data-highlight-scroll-end') || 'center 40%';
      var fadedValue = parseFloat(el.getAttribute('data-highlight-fade')) || 0.15;
      var staggerValue = parseFloat(el.getAttribute('data-highlight-stagger')) || 0.08;

      new SplitText(el, {
        type: 'words, chars',
        autoSplit: true,
        onSplit: function(self) {
          gsap.context(function() {
            gsap.timeline({
              scrollTrigger: {
                scrub: true,
                trigger: el,
                start: scrollStart,
                end: scrollEnd
              }
            }).from(self.chars, {
              autoAlpha: fadedValue,
              stagger: staggerValue,
              ease: 'linear'
            });
          });
          return;
        }
      });
    });
  }
})();

/* ============================================
   HOW IT WORKS — Step Stagger Reveal
   ============================================ */
(function initHowItWorks() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var header = document.querySelector('.how-it-works__header');
  var steps = document.querySelectorAll('.hiw-step');
  var cta = document.querySelector('.how-it-works__secondary-cta');
  if (!steps.length) return;

  var headerEls = [];
  if (header) {
    var label = header.querySelector('.label');
    var headline = header.querySelector('.how-it-works__headline');
    if (label) headerEls.push(label);
    if (headline) headerEls.push(headline);
  }
  gsap.set(headerEls, { opacity: 0, y: 20 });
  gsap.set(steps, { opacity: 0, y: 30 });
  if (cta) gsap.set(cta, { opacity: 0, y: 15 });

  ScrollTrigger.create({
    trigger: '.how-it-works',
    start: 'top 75%',
    once: true,
    onEnter: function() {
      gsap.to(headerEls, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out'
      });
      gsap.to(steps, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.2, delay: 0.25, ease: 'power2.out'
      });
      if (cta) {
        gsap.to(cta, {
          opacity: 1, y: 0, duration: 0.5, delay: 0.9, ease: 'power2.out'
        });
      }
    }
  });
})();

/* ============================================
   WHY SPLIT + COMPARISON — Stagger Reveals
   ============================================ */
(function initWhySplitComparison() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Why Split panels
  var splitHeadline = document.querySelector('.why-split__headline');
  var panels = document.querySelectorAll('.why-split__panel');
  if (splitHeadline) gsap.set(splitHeadline, { opacity: 0, y: 20 });
  if (panels.length) gsap.set(panels, { opacity: 0, y: 30 });

  if (splitHeadline) {
    ScrollTrigger.create({
      trigger: '.why-split',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(splitHeadline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        gsap.to(panels, { opacity: 1, y: 0, duration: 0.6, stagger: 0.2, delay: 0.2, ease: 'power2.out' });
      }
    });
  }

  // Comparison rows
  var compIntro = document.querySelector('.comparison__intro');
  var compRows = document.querySelectorAll('.comparison__row');
  if (compIntro) gsap.set(compIntro, { opacity: 0, y: 20 });
  if (compRows.length) gsap.set(compRows, { opacity: 0, y: 20 });

  if (compIntro) {
    ScrollTrigger.create({
      trigger: '.comparison',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(compIntro, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        gsap.to(compRows, { opacity: 1, y: 0, duration: 0.5, stagger: 0.1, delay: 0.2, ease: 'power2.out' });
      }
    });
  }
})();

/* ============================================
   CASE STUDIES + FEATURES + FINAL CTA — Reveals
   ============================================ */
(function initBottomSections() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  // Differentiators section — stagger reveal
  var diffCards = document.querySelectorAll('.diff-card');
  var diffHeader = document.querySelector('.differentiators__header');
  if (diffHeader && diffCards.length) {
    var diffHeaderEls = diffHeader.querySelectorAll('.label, .differentiators__headline');
    gsap.set(diffHeaderEls, { opacity: 0, y: 20 });
    gsap.set(diffCards, { opacity: 0, y: 25 });
    ScrollTrigger.create({
      trigger: '.differentiators',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(diffHeaderEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
        gsap.to(diffCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.12, delay: 0.2, ease: 'power2.out' });
      }
    });
  }

  // Legacy case studies cards (old grid — may still be referenced)
  var csHeader = document.querySelector('.case-studies-grid__header');
  var csCards = document.querySelectorAll('.cs-card');
  if (csHeader) {
    var csLabel = csHeader.querySelector('.label');
    var csHeadline = csHeader.querySelector('.case-studies-grid__headline');
    var csHeaderEls = [];
    if (csLabel) csHeaderEls.push(csLabel);
    if (csHeadline) csHeaderEls.push(csHeadline);
    gsap.set(csHeaderEls, { opacity: 0, y: 20 });
    gsap.set(csCards, { opacity: 0, y: 25 });

    ScrollTrigger.create({
      trigger: '.case-studies-grid',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(csHeaderEls, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
        gsap.to(csCards, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.2, ease: 'power2.out' });
      }
    });
  }

  // Features showcase
  var featHeadline = document.querySelector('.features-showcase__headline');
  var featTiles = document.querySelectorAll('.feat-tile');
  if (featHeadline) {
    gsap.set(featHeadline, { opacity: 0, y: 20 });
    gsap.set(featTiles, { opacity: 0, y: 20 });
    ScrollTrigger.create({
      trigger: '.features-showcase',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(featHeadline, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' });
        gsap.to(featTiles, { opacity: 1, y: 0, duration: 0.5, stagger: 0.08, delay: 0.15, ease: 'power2.out' });
      }
    });
  }

  // Final CTA — duo blocks
  var ctaBlocks = document.querySelectorAll('.cta-block');
  if (ctaBlocks.length) {
    gsap.set(ctaBlocks, { opacity: 0, y: 30 });
    ScrollTrigger.create({
      trigger: '.cta-section',
      start: 'top 75%',
      once: true,
      onEnter: function() {
        gsap.to(ctaBlocks, { opacity: 1, y: 0, duration: 0.7, stagger: 0.15, ease: 'power2.out' });
      }
    });
  }
})();

/* ============================================
   TESTIMONIAL QUOTE STRIP — Seamless Loop
   ============================================ */
(function initTestimonialStrip() {
  var stripTrack = document.querySelector('.testimonial-strip__track');
  if (stripTrack) stripTrack.innerHTML += stripTrack.innerHTML;
})();

/* ============================================
   CASE STUDIES — Horizontal Scroll Marquee
   ============================================ */
(function initCaseMarquee() {
  var track = document.getElementById('cs-marquee-track');
  if (!track || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

  var rotations = [-1.5, 1, -0.5, 1.5, -1, 0.5, -1.2, 0.8, -0.8, 1.2];

  function renderCard(cs, i) {
    var rot = rotations[i % rotations.length];
    var isExternal = cs.ctaUrl && cs.ctaUrl.indexOf('http') === 0;
    var targetAttr = isExternal ? ' target="_blank"' : '';
    return '<div class="cs-marquee__card" style="--card-rotate: ' + rot + 'deg">' +
      '<div class="cs-marquee__img" style="background-image: url(\'' + cs.imageUrl + '\'); background-color: ' + (cs.imageBg || '#333') + ';">' +
        '<div class="cs-marquee__stat-overlay">' +
          '<div class="cs-marquee__stat">' + cs.stat + '</div>' +
          '<div class="cs-marquee__stat-label">' + cs.statLabel + '</div>' +
        '</div>' +
      '</div>' +
      '<div class="cs-marquee__body">' +
        (cs.quote ? '<p class="cs-marquee__quote">' + cs.quote + '</p>' : '') +
        '<div class="cs-marquee__artist">' +
          '<div class="cs-marquee__avatar" style="background: linear-gradient(135deg, ' + (cs.avatarColor || 'rgba(196,138,58') + ',0.25), ' + (cs.avatarColor || 'rgba(196,138,58') + ',0.1)); color: ' + (cs.avatarColor || 'rgba(196,138,58') + ',1); border: 1px solid ' + (cs.avatarColor || 'rgba(196,138,58') + ',0.2);">' + cs.initials + '</div>' +
          '<div>' +
            '<div class="cs-marquee__name">' + cs.name + '</div>' +
            '<div class="cs-marquee__meta">' + (cs.meta || '') + '</div>' +
          '</div>' +
        '</div>' +
        '<a class="cs-marquee__cta" href="' + cs.ctaUrl + '"' + targetAttr + '>Read case study &rarr;</a>' +
      '</div>' +
    '</div>';
  }

  fetch('case-studies.json')
    .then(function(res) { return res.json(); })
    .then(function(data) {
      data.sort(function(a, b) {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return new Date(b.date) - new Date(a.date);
      });

      var cards = data.slice(0, 10);
      var reveal = track.querySelector('.cs-marquee__reveal');
      var html = '';
      for (var i = 0; i < cards.length; i++) { html += renderCard(cards[i], i); }

      if (reveal) reveal.insertAdjacentHTML('beforebegin', html);
      else track.insertAdjacentHTML('beforeend', html);

      initMarqueeGSAP();
    })
    .catch(function(err) { console.error('Failed to load case studies:', err); });

  function initMarqueeGSAP() {
    var section = document.querySelector('.cs-marquee');
    var pin = document.querySelector('.cs-marquee__pin');
    var allCards = gsap.utils.toArray('.cs-marquee__card');
    var reveal = document.querySelector('.cs-marquee__reveal');

    if (!section || !track || !allCards.length) return;

    function getScrollDist() {
      return track.scrollWidth - pin.offsetWidth;
    }

    var tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: pin,
        scrub: 1,
        start: 'top top',
        end: function() { return '+=' + (getScrollDist() * 1.2); },
        anticipatePin: 1,
        invalidateOnRefresh: true
      }
    });

    tl.to(track, {
      x: function() { return -getScrollDist(); },
      ease: 'none',
      duration: 1
    });

    allCards.forEach(function(card, i) {
      gsap.fromTo(card, {
        y: i % 2 === 0 ? 20 : -15,
        opacity: 0.4
      }, {
        y: 0,
        opacity: 1,
        ease: 'power1.out',
        scrollTrigger: {
          trigger: card,
          containerAnimation: tl,
          start: 'left 95%',
          end: 'left 65%',
          scrub: true
        }
      });
    });

    if (reveal) {
      gsap.fromTo(reveal, {
        opacity: 0, y: 30, scale: 0.95
      }, {
        opacity: 1, y: 0, scale: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: reveal,
          containerAnimation: tl,
          start: 'left 85%',
          end: 'left 55%',
          scrub: true
        }
      });
    }
  }
})();
