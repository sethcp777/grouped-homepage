/* ============================================
   SHARED JS — Navigation, Feature Modal, Footer Parallax
   ============================================ */

// ---- NAVIGATION ----
(function initNavigation() {
  const isMobile = () => window.innerWidth < 768;
  const menuBtn = document.querySelector('[data-menu-button]');
  const navEl = document.querySelector('[data-menu-status]');
  if (menuBtn && navEl) {
    menuBtn.addEventListener('click', () => {
      const open = navEl.dataset.menuStatus === 'open';
      navEl.dataset.menuStatus = open ? 'closed' : 'open';
      if (open) {
        document.querySelectorAll('[data-dropdown-toggle]').forEach(t => { t.dataset.dropdownToggle = ''; });
      }
    });
  }
  document.querySelectorAll('[data-dropdown-toggle]').forEach(toggle => {
    toggle.addEventListener('click', (e) => {
      if (!isMobile()) return;
      // Prevent <a> tags from navigating when they have a dropdown on mobile
      if (toggle.tagName === 'A') e.preventDefault();
      const isOpen = toggle.dataset.dropdownToggle === 'open';
      document.querySelectorAll('[data-dropdown-toggle]').forEach(t => { if (t !== toggle) t.dataset.dropdownToggle = ''; });
      toggle.dataset.dropdownToggle = isOpen ? '' : 'open';
    });
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && navEl) {
      navEl.dataset.menuStatus = 'closed';
      document.querySelectorAll('[data-dropdown-toggle]').forEach(t => { t.dataset.dropdownToggle = ''; });
    }
  });
  const scrollBg = document.querySelector('.nav-scroll-bg');
  const navLogo = document.querySelector('.nav-logo');
  const SCROLL_RANGE = 100;
  const LOGO_COLLAPSE_AT = 60;
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(() => {
        const scrollY = window.scrollY;
        if (scrollBg) {
          const progress = Math.min(scrollY / SCROLL_RANGE, 1);
          scrollBg.style.opacity = progress;
          scrollBg.classList.toggle('is--visible', progress > 0.05);
        }
        if (navLogo) {
          navLogo.classList.toggle('is--collapsed', scrollY > LOGO_COLLAPSE_AT);
        }
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
})();

// ---- FEATURE REQUEST MODAL ----
(function initFeatureModal() {
  const overlay = document.getElementById('feature-modal-overlay');
  const modal = document.getElementById('feature-modal');
  const closeBtn = document.getElementById('feature-modal-close');
  const form = document.getElementById('feature-form');
  const success = document.getElementById('feature-success');
  if (!overlay) return;

  let previousFocus = null;

  function openModal(e) {
    if (e) e.preventDefault();
    previousFocus = document.activeElement;
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
    setTimeout(() => { const firstInput = modal.querySelector('input'); if (firstInput) firstInput.focus(); }, 300);
  }

  function closeModal() {
    overlay.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { form.reset(); form.style.display = ''; success.style.display = 'none'; }, 400);
    if (previousFocus) previousFocus.focus();
  }

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && overlay.classList.contains('active')) closeModal(); });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const first = form.querySelector('[name="first"]').value.trim();
    const last = form.querySelector('[name="last"]').value.trim();
    const stage = form.querySelector('[name="stage"]').value.trim();
    const feature = form.querySelector('[name="feature"]').value.trim();
    const why = form.querySelector('[name="why"]').value.trim();
    const subject = encodeURIComponent(`Feature idea from ${first} ${last}${stage ? ' (' + stage + ')' : ''}`);
    const body = encodeURIComponent(`Feature:\n${feature}\n\nWhy:\n${why}\n\n— ${first} ${last}${stage ? ' (' + stage + ')' : ''}`);
    window.location.href = `mailto:ihaveanidea@grouped.com?subject=${subject}&body=${body}`;
    form.style.display = 'none';
    success.style.display = '';
    setTimeout(closeModal, 3000);
  });

  // Wire footer trigger
  const footerFeatureTrigger = document.getElementById('footer-feature-trigger');
  if (footerFeatureTrigger) footerFeatureTrigger.addEventListener('click', openModal);
})();

(function initFooterParallax() {
  if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;
  const footer = document.getElementById('site-footer');
  if (!footer) return;

  const columns = footer.querySelector('.footer-columns');
  const tagline = footer.querySelector('.footer-tagline');
  const wordmark = footer.querySelector('.footer-logo-lockup');
  const bottomBar = footer.querySelector('.footer-bottom');
  const cols = footer.querySelectorAll('.footer-col');

  gsap.set(cols, { opacity: 0, y: 60 });
  gsap.set([tagline, wordmark, bottomBar].filter(Boolean), { opacity: 0, y: 40 });

  ScrollTrigger.create({
    trigger: footer,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(cols, { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out' });
      gsap.to(tagline, { opacity: 1, y: 0, duration: 0.7, delay: 0.4, ease: 'power3.out' });
      gsap.to(wordmark, { opacity: 1, y: 0, duration: 1, delay: 0.55, ease: 'power3.out' });
      gsap.to(bottomBar, { opacity: 1, y: 0, duration: 0.7, delay: 0.7, ease: 'power3.out' });
    }
  });

  gsap.to(wordmark, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: footer, start: 'top bottom', end: 'bottom bottom', scrub: 0.5 }
  });
})();
