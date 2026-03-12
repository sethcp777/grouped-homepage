/* ============================================
   ABOUT PAGE — Scroll Animations
   ============================================ */

(function initAboutAnimations() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  // --- Hero stagger ---
  const heroEls = document.querySelectorAll('.about-hero__label, .about-hero__title, .about-hero__sub');
  gsap.set(heroEls, { opacity: 0, y: 40 });
  gsap.to(heroEls, {
    opacity: 1, y: 0,
    duration: 0.9,
    stagger: 0.15,
    ease: 'power3.out',
    delay: 0.3
  });

  // --- Mission section ---
  const missionEls = document.querySelectorAll('.about-mission__icon, .about-mission__label, .about-mission__title, .about-mission__body');
  gsap.set(missionEls, { opacity: 0, y: 50 });
  ScrollTrigger.create({
    trigger: '.about-mission',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to(missionEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
    }
  });

  // --- Timeline V2: Draw-Path-on-Scroll ---
  initTimelinePath();
  initDrawPathOnScroll();
  initTimelineEntryReveals();

  // --- Social proof section ---
  const proofQuote = document.querySelectorAll('.about-proof__quote');
  const proofCards = document.querySelectorAll('.about-proof__card');
  const proofEls = [...proofQuote, ...proofCards];
  if (proofEls.length) {
    gsap.set(proofEls, { opacity: 0, y: 40 });
    ScrollTrigger.create({
      trigger: '.about-proof',
      start: 'top 75%',
      once: true,
      onEnter: () => {
        gsap.to(proofEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      }
    });
  }

  // --- Belief cards ---
  const beliefCards = document.querySelectorAll('.about-belief-card');
  gsap.set(beliefCards, { opacity: 0, y: 50 });
  ScrollTrigger.create({
    trigger: '.about-beliefs',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to(beliefCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
    }
  });

  // --- Stats counter animation ---
  const statNumbers = document.querySelectorAll('.about-stat__number');
  gsap.set(statNumbers, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: '.about-stats',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(statNumbers, { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' });
    }
  });

  // --- Team cards ---
  const teamCards = document.querySelectorAll('.about-team-card');
  gsap.set(teamCards, { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '.about-team',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.to(teamCards, { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out' });
    }
  });

  // --- Join section ---
  const joinEls = document.querySelectorAll('.about-join__label, .about-join__title, .about-join__body, .about-join__ctas');
  gsap.set(joinEls, { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '.about-join',
    start: 'top 75%',
    once: true,
    onEnter: () => {
      gsap.to(joinEls, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
    }
  });

  // --- Contact CTA ---
  const contactEls = document.querySelectorAll('.about-contact__title, .about-contact__channels, .about-contact .btn-primary');
  gsap.set(contactEls, { opacity: 0, y: 30 });
  ScrollTrigger.create({
    trigger: '.about-contact',
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(contactEls, { opacity: 1, y: 0, duration: 0.7, stagger: 0.12, ease: 'power3.out' });
    }
  });
})();

/* ============================================
   TIMELINE V2 — Dynamic SVG Path + DrawSVG
   ============================================ */

/**
 * Measure dot positions and generate SVG path `d` attributes
 * for both desktop (S-curves) and mobile (straight vertical line).
 */
function initTimelinePath() {
  const wrap = document.querySelector('[data-draw-scroll-wrap]');
  if (!wrap) return;

  const dots = wrap.querySelectorAll('.about-timeline-v2__dot');
  if (dots.length < 2) return;

  // S-curve amplitude — how far the path swings left/right of center
  const SWING = 180;

  function buildPaths() {
    const wrapRect = wrap.getBoundingClientRect();
    const wH = wrap.scrollHeight;
    const wW = wrap.offsetWidth;

    // Collect dot center positions relative to the wrapper
    const wrapTop = wrapRect.top + window.scrollY;
    const points = [];
    dots.forEach(dot => {
      const r = dot.getBoundingClientRect();
      points.push({
        x: r.left - wrapRect.left + r.width / 2,
        y: (r.top + window.scrollY) - wrapTop + r.height / 2
      });
    });

    // Safety: if dots haven't laid out yet, bail and retry
    if (points[0].y === points[1].y) return false;

    // --- Desktop path: S-curves weaving through dot centers ---
    const desktopSvg = wrap.querySelector('[data-draw-scroll-desktop]');
    if (desktopSvg) {
      let d = `M ${points[0].x} ${points[0].y}`;
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midY = (prev.y + curr.y) / 2;
        // Alternate swing direction: odd segments swing right, even swing left
        const swing = (i % 2 === 1) ? SWING : -SWING;
        d += ` C ${prev.x + swing} ${midY}, ${curr.x + swing} ${midY}, ${curr.x} ${curr.y}`;
      }
      desktopSvg.setAttribute('viewBox', `0 0 ${wW} ${wH}`);
      const path = desktopSvg.querySelector('[data-draw-scroll-path]');
      if (path) path.setAttribute('d', d);
    }

    // --- Mobile path: straight vertical line ---
    const mobileSvg = wrap.querySelector('[data-draw-scroll-mobile]');
    if (mobileSvg) {
      const firstDot = points[0];
      const lastDot = points[points.length - 1];
      const mD = `M ${firstDot.x} ${firstDot.y} L ${lastDot.x} ${lastDot.y}`;
      mobileSvg.setAttribute('viewBox', `0 0 ${wW} ${wH}`);
      const path = mobileSvg.querySelector('[data-draw-scroll-path]');
      if (path) path.setAttribute('d', mD);
    }
    return true;
  }

  // Build paths after layout is stable
  function tryBuild(attempts) {
    if (attempts <= 0) return;
    requestAnimationFrame(() => {
      const success = buildPaths();
      if (success) {
        ScrollTrigger.refresh();
      } else {
        // Retry with increasing delay if dots haven't laid out
        setTimeout(() => tryBuild(attempts - 1), 200);
      }
    });
  }

  // Wait for fonts + CSS to settle, then build
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(() => tryBuild(5));
  } else {
    setTimeout(() => tryBuild(5), 300);
  }

  // Rebuild on resize (debounced)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      buildPaths();
      ScrollTrigger.refresh();
    }, 250);
  });
}

/**
 * DrawSVG scroll animation using gsap.matchMedia()
 * Draws the SVG path as the user scrolls through the timeline section.
 * Activates dots based on scroll progress.
 */
function initDrawPathOnScroll() {
  if (typeof DrawSVGPlugin !== 'undefined') {
    gsap.registerPlugin(DrawSVGPlugin);
  } else {
    // DrawSVGPlugin not available — skip draw animation but still animate entries
    return;
  }

  const wrap = document.querySelector('[data-draw-scroll-wrap]');
  if (!wrap) return;

  const dots = wrap.querySelectorAll('.about-timeline-v2__dot');
  const dotCount = dots.length;

  function activateDots(progress) {
    dots.forEach((dot, i) => {
      // Each dot activates when the path has progressed past its proportional position
      const threshold = dotCount > 1 ? i / (dotCount - 1) : 0;
      if (progress >= threshold - 0.06) {
        dot.classList.add('is-reached');
      } else {
        dot.classList.remove('is-reached');
      }
    });
  }

  gsap.matchMedia().add(
    {
      isDesktop: '(min-width: 768px)',
      isMobile: '(max-width: 767px)'
    },
    (context) => {
      const { isDesktop } = context.conditions;
      const svgAttr = isDesktop ? 'data-draw-scroll-desktop' : 'data-draw-scroll-mobile';
      const svg = wrap.querySelector(`[${svgAttr}]`);
      if (!svg) return;

      const path = svg.querySelector('[data-draw-scroll-path]');
      if (!path) return;

      // Wait a tick so the path `d` attribute is set by initTimelinePath
      gsap.delayedCall(0.5, () => {
        const d = path.getAttribute('d');
        if (!d) return;

        gsap.set(path, { drawSVG: 0 });

        ScrollTrigger.create({
          trigger: wrap,
          start: 'clamp(top 90%)',
          end: 'clamp(bottom 85%)',
          scrub: true,
          invalidateOnRefresh: true,
          animation: gsap.fromTo(
            path,
            { drawSVG: 0 },
            { drawSVG: '100%', ease: 'none' }
          ),
          onUpdate: (self) => {
            activateDots(self.progress);
          }
        });
      });

      return () => {
        // Cleanup on context change
        dots.forEach(dot => dot.classList.remove('is-reached'));
      };
    }
  );
}

/**
 * Reveal timeline entries as they scroll into view.
 */
function initTimelineEntryReveals() {
  const entries = document.querySelectorAll('.about-timeline-v2__entry');
  if (!entries.length) return;

  entries.forEach(entry => {
    const content = entry.querySelector('.about-timeline-v2__content');
    const imgWrap = entry.querySelector('.about-timeline-v2__img-wrap');
    const ctaWrap = entry.querySelector('.about-timeline-v2__cta-wrap');

    const targets = [content, imgWrap, ctaWrap].filter(Boolean);
    gsap.set(targets, { opacity: 0, y: 40 });

    ScrollTrigger.create({
      trigger: entry,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(targets, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.12,
          ease: 'power3.out'
        });
      }
    });
  });
}
