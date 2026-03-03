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

  // --- Story paragraphs ---
  const storyBlocks = document.querySelectorAll('.about-story__block');
  gsap.set(storyBlocks, { opacity: 0, y: 40 });
  ScrollTrigger.create({
    trigger: '.about-story',
    start: 'top 70%',
    once: true,
    onEnter: () => {
      gsap.to(storyBlocks, { opacity: 1, y: 0, duration: 0.8, stagger: 0.18, ease: 'power3.out' });
    }
  });

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
