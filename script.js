/* ═══════════════════════════════════════════
   Portfolio – script.js
   ═══════════════════════════════════════════ */

(() => {
  'use strict';

  /* ── DOM refs ── */
  const html         = document.documentElement;
  const navbar       = document.getElementById('navbar');
  const menuToggle   = document.getElementById('menuToggle');
  const navLinks     = document.getElementById('navLinks');
  const themeToggle  = document.getElementById('themeToggle');
  const contactForm  = document.getElementById('contactForm');
  const sections     = document.querySelectorAll('.section, .hero');
  const navAnchors   = document.querySelectorAll('.nav-links a');

  /* ═══════════════════════════════════════
     1.  DARK MODE TOGGLE
     ═══════════════════════════════════════ */
  const THEME_KEY = 'rohit-portfolio-theme';

  // restore saved theme or respect OS preference
  const saved = localStorage.getItem(THEME_KEY);
  if (saved) {
    html.setAttribute('data-theme', saved);
  } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    html.setAttribute('data-theme', 'dark');
  } else {
    html.setAttribute('data-theme', 'light');
  }

  function updateThemeLabel() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  }
  updateThemeLabel();

  themeToggle.addEventListener('click', () => {
    const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem(THEME_KEY, next);
    updateThemeLabel();
  });

  /* ═══════════════════════════════════════
     2.  MOBILE MENU
     ═══════════════════════════════════════ */
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // close on link click
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ═══════════════════════════════════════
     3.  ACTIVE NAV HIGHLIGHT ON SCROLL
     ═══════════════════════════════════════ */
  const observerNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navAnchors.forEach(a => {
          a.classList.toggle('active', a.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => observerNav.observe(s));

  /* ═══════════════════════════════════════
     4.  SCROLL REVEAL  (Intersection Observer)
     ═══════════════════════════════════════ */
  const aosElements = document.querySelectorAll('[data-aos]');

  const observerAos = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerAos.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  aosElements.forEach(el => observerAos.observe(el));

  /* ═══════════════════════════════════════
     5.  NAVBAR SHADOW ON SCROLL
     ═══════════════════════════════════════ */
  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    navbar.classList.toggle('navbar-scrolled', y > 20);
  }, { passive: true });

  /* ═══════════════════════════════════════
     6.  CONTACT FORM (client-side only)
     ═══════════════════════════════════════ */
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;

    btn.textContent = 'Sent! ✓';
    btn.disabled = true;
    btn.style.opacity = '.7';

    setTimeout(() => {
      btn.textContent = original;
      btn.disabled = false;
      btn.style.opacity = '1';
      contactForm.reset();
    }, 2500);
  });

  /* ═══════════════════════════════════════
     7.  SMOOTH SCROLL POLYFILL (fallback)
     ═══════════════════════════════════════ */
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

})();
