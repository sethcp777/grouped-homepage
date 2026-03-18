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

  // Measure one set width
  var allBubbles = track.querySelectorAll('.artist-bubble');
  var halfCount = allBubbles.length / 2;
  var singleSetWidth = 0;
  for (var i = 0; i < halfCount; i++) {
    singleSetWidth += allBubbles[i].offsetWidth + 32; // 32 = gap
  }

  // GSAP tween: scroll the track left by one full set, then repeat seamlessly
  var speed = 40; // pixels per second
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

  // Hover: slow down smoothly and stop
  var isHovered = false;

  marquee.addEventListener('mouseenter', function() {
    isHovered = true;
    gsap.to(scrollTween, { timeScale: 0, duration: 0.6, ease: 'power2.out' });
  });

  marquee.addEventListener('mouseleave', function() {
    isHovered = false;
    gsap.to(scrollTween, { timeScale: 1, duration: 0.8, ease: 'power2.inOut' });
  });

  // Touch: pause on touch, resume on release
  marquee.addEventListener('touchstart', function() {
    gsap.to(scrollTween, { timeScale: 0, duration: 0.4, ease: 'power2.out' });
  }, { passive: true });

  marquee.addEventListener('touchend', function() {
    gsap.to(scrollTween, { timeScale: 1, duration: 0.6, ease: 'power2.inOut' });
  }, { passive: true });

})();
