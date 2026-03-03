/* ============================================
   CASE STUDY TEMPLATE — Scroll Reveal Animations
   ============================================ */

(function initCaseStudyReveals() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  gsap.registerPlugin(ScrollTrigger);

  var revealTargets = [
    '.cs-snapshot__item',
    '.cs-article__section',
    '.cs-pullquote',
    '.cs-results__metric',
    '.cs-related__card'
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
          opacity: 1, y: 0, x: 0,
          duration: opts.duration || 0.6,
          stagger: opts.stagger || 0,
          ease: 'power3.out'
        });
      }
    });
  }

  reveal('.cs-snapshot', '.cs-snapshot__item', { stagger: 0.08, duration: 0.5 });

  document.querySelectorAll('.cs-article__section').forEach(function(section) {
    reveal(section, section, { duration: 0.7 });
  });

  var pullquote = document.querySelector('.cs-pullquote');
  if (pullquote) {
    gsap.set(pullquote, { opacity: 0, x: -20, y: 0 });
    reveal(pullquote, pullquote, { duration: 0.7 });
  }

  reveal('.cs-results', '.cs-results__metric', { stagger: 0.12, start: 'top 80%' });
  reveal('.cs-related', '.cs-related__card', { stagger: 0.1, start: 'top 80%' });
})();
