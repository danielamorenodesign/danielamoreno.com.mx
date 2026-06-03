/* ============================================
   PORTFOLIO — script.js
   UX/UI Designer · Interactions & Animations
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* --------- 1. NAV: scroll shadow + active link --------- */
  const navbar = document.getElementById('navbar');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 30);
    updateActiveLink();
  });

  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id], div[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    let current = '';

    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.id;
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  /* --------- 2. MOBILE MENU --------- */
  const hamburger   = document.getElementById('hamburger');
  const mobileMenu  = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
  });

  // Close mobile menu when any link is clicked
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
    });
  });

  /* --------- 3. SCROLL REVEAL --------- */
  const revealTargets = [
    '.work-card',
    '.process-card',
    '.tool-card',
    '.a-stat',
    '.section-header',
    '.about-img-wrap',
    '.about-text',
    '.contact-left',
    '.contact-form',
  ];

  const allReveal = document.querySelectorAll(revealTargets.join(','));

  allReveal.forEach((el, i) => {
    el.classList.add('reveal');
    // Stagger cards in a grid
    const delay = (i % 4) * 80;
    el.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target); // animate once
        }
      });
    },
    { threshold: 0.1 }
  );

  allReveal.forEach(el => observer.observe(el));

  /* --------- 4. SMOOTH SCROLL for anchor links --------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = 70; // nav height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* --------- 5. CONTACT FORM --------- */
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();

      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      // Basic validation
      if (!name || !email || !message) {
        shakeForm(form);
        return;
      }

      if (!isValidEmail(email)) {
        form.email.focus();
        form.email.style.borderColor = '#e53e3e';
        setTimeout(() => (form.email.style.borderColor = ''), 2000);
        return;
      }

      // Simulate send (replace with your backend / EmailJS / Formspree)
      const btn = form.querySelector('.form-btn');
      btn.textContent = 'Sending…';
      btn.disabled = true;

      setTimeout(() => {
        form.reset();
        btn.textContent = 'Send message →';
        btn.disabled = false;
        success.classList.add('visible');
        setTimeout(() => success.classList.remove('visible'), 5000);
      }, 1200);
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function shakeForm(el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = 'shake 0.4s ease';
  }

  /* --------- 6. WORK CARDS — open modal placeholder --------- */
  document.querySelectorAll('.work-card').forEach(card => {
    card.addEventListener('click', () => {
      const projectName = card.querySelector('.work-name').textContent;
      // Replace this with your actual case study navigation or modal
      console.log(`Opening case study: ${projectName}`);
      // Example: window.location.href = `case-study-${card.dataset.index}.html`;
    });

    // Keyboard accessible
    card.setAttribute('tabindex', '0');
    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') card.click();
    });
  });

  /* --------- 7. ANIMATE hero stat numbers (count up) --------- */
  function countUp(el, target, duration = 1200) {
    const start    = performance.now();
    const isPlus   = el.textContent.includes('+');
    const update   = now => {
      const elapsed  = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const ease     = 1 - Math.pow(1 - progress, 3); // ease out cubic
      el.textContent = Math.round(ease * target) + (isPlus ? '+' : '');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
  }

  const heroStats = document.querySelectorAll('.hero-stat-num');
  const targets   = [5, 30, 100];

  // Run count-up once hero is in view
  const heroObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        heroStats.forEach((el, i) => countUp(el, targets[i]));
        heroObserver.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const heroSection = document.querySelector('.hero');
  if (heroSection) heroObserver.observe(heroSection);

});

/* --------- CSS shake keyframe (injected via JS) --------- */
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%, 100% { transform: translateX(0); }
    20%       { transform: translateX(-6px); }
    40%       { transform: translateX(6px); }
    60%       { transform: translateX(-4px); }
    80%       { transform: translateX(4px); }
  }
  .nav-links a.active { color: var(--blue-accent); font-weight: 600; }
`;
document.head.appendChild(style);
