/* ═══════════════════════════════════════════
   Portfolio – script.js (Premium Edition)
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
  const backToTop    = document.getElementById('backToTop');
  const scrollProgress = document.getElementById('scrollProgress');
  const heroCanvas   = document.getElementById('heroParticles');
  const sections     = document.querySelectorAll('.section, .hero');
  const navAnchors   = document.querySelectorAll('.nav-links a');
  const sectionTitles = document.querySelectorAll('.section-title');

  /* ═══════════════════════════════════════
     1.  DARK MODE TOGGLE
     ═══════════════════════════════════════ */
  const THEME_KEY = 'rohit-portfolio-theme';

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
    // Reinit particles with new theme colors
    if (particlesInitialized) initParticles();
  });

  /* ═══════════════════════════════════════
     2.  MOBILE MENU
     ═══════════════════════════════════════ */
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      menuToggle.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });

  /* ═══════════════════════════════════════
     3.  SMART NAVBAR (hide on scroll down, show on scroll up)
     ═══════════════════════════════════════ */
  let lastScrollY = 0;
  let ticking = false;

  function handleScroll() {
    const y = window.scrollY;

    // Navbar shadow
    navbar.classList.toggle('navbar-scrolled', y > 20);

    // Smart hide/show
    if (y > 100) {
      if (y > lastScrollY && y - lastScrollY > 10) {
        navbar.classList.add('navbar-hidden');
      } else if (lastScrollY > y && lastScrollY - y > 10) {
        navbar.classList.remove('navbar-hidden');
      }
    } else {
      navbar.classList.remove('navbar-hidden');
    }

    // Scroll progress bar
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (y / docHeight) * 100 : 0;
    scrollProgress.style.width = progress + '%';

    // Back to top button
    backToTop.classList.toggle('visible', y > 400);

    lastScrollY = y;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(handleScroll);
      ticking = true;
    }
  }, { passive: true });

  /* ═══════════════════════════════════════
     4.  ACTIVE NAV HIGHLIGHT ON SCROLL
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
     5.  SCROLL REVEAL  (Staggered with delays)
     ═══════════════════════════════════════ */
  const aosElements = document.querySelectorAll('[data-aos]');

  const observerAos = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerAos.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  aosElements.forEach(el => observerAos.observe(el));

  /* ═══════════════════════════════════════
     5b. SECTION TITLE UNDERLINE ANIMATION
     ═══════════════════════════════════════ */
  const observerTitles = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observerTitles.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  sectionTitles.forEach(t => observerTitles.observe(t));

  /* ═══════════════════════════════════════
     6.  BACK TO TOP
     ═══════════════════════════════════════ */
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ═══════════════════════════════════════
     7.  CONTACT FORM (mailto)
     ═══════════════════════════════════════ */
  contactForm.addEventListener('submit', e => {
    e.preventDefault();

    const name    = contactForm.querySelector('#name').value.trim();
    const email   = contactForm.querySelector('#email').value.trim();
    const message = contactForm.querySelector('#message').value.trim();

    // Build mailto link
    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
    const mailto  = `mailto:svrohit18@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailto;

    // Visual feedback
    const btn = contactForm.querySelector('button[type="submit"]');
    const original = btn.textContent;
    btn.textContent = 'Opening Mail App ✓';
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
     8.  SMOOTH SCROLL
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

  /* ═══════════════════════════════════════
     9.  HERO PARTICLES (Canvas animation)
     ═══════════════════════════════════════ */
  let particlesInitialized = false;

  function initParticles() {
    if (!heroCanvas) return;
    particlesInitialized = true;

    const ctx = heroCanvas.getContext('2d');
    let width, height, particles, animationId;

    function resize() {
      const hero = heroCanvas.parentElement;
      width = heroCanvas.width = hero.offsetWidth;
      height = heroCanvas.height = hero.offsetHeight;
    }

    function createParticles() {
      const count = Math.min(Math.floor((width * height) / 18000), 60);
      const isDark = html.getAttribute('data-theme') === 'dark';
      particles = [];

      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 2 + 0.5,
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          opacity: Math.random() * 0.4 + 0.1,
          color: isDark
            ? `rgba(230, 57, 70, ${Math.random() * 0.3 + 0.05})`
            : `rgba(230, 57, 70, ${Math.random() * 0.15 + 0.03})`
        });
      }
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });

      // Draw connections
      const isDark = html.getAttribute('data-theme') === 'dark';
      const lineAlpha = isDark ? 0.06 : 0.03;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(230, 57, 70, ${lineAlpha * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(draw);
    }

    // Cleanup previous
    if (animationId) cancelAnimationFrame(animationId);

    resize();
    createParticles();
    draw();

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        resize();
        createParticles();
      }, 200);
    });
  }

  // Start particles
  initParticles();

})();
