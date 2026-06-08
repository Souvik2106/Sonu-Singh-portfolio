/* =========================================================
   Sonu Singh — Portfolio JavaScript
   Pure vanilla JS — no dependencies.
   ========================================================= */

(function () {
  'use strict';

  /* ---------- Helpers ---------- */
  const $  = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------- Year in footer ---------- */
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav shadow on scroll ---------- */
  const navbar = $('#navbar');
  const backToTop = $('#backToTop');

  function onScroll() {
    const y = window.scrollY;
    if (navbar) navbar.classList.toggle('scrolled', y > 20);
    if (backToTop) backToTop.classList.toggle('show', y > 400);
    highlightActiveLink();
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu toggle ---------- */
  const hamburger = $('#hamburger');
  const navLinks  = $('#navLinks');

  if (hamburger && navLinks) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navLinks.classList.toggle('open');
    });

    // Close menu when a link is clicked (mobile)
    $$('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('open');
      });
    });
  }

  /* ---------- Smooth scrolling (with sticky nav offset) ---------- */
  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const targetId = a.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const target = document.querySelector(targetId);
      if (!target) return;
      e.preventDefault();
      const offset = 72; // navbar height
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  /* ---------- Active nav link highlighting based on scroll ---------- */
  const sections = $$('section[id]');
  const linkMap = {};
  $$('.nav-link').forEach(l => {
    const href = l.getAttribute('href');
    if (href && href.startsWith('#')) linkMap[href.slice(1)] = l;
  });

  function highlightActiveLink() {
    const scrollPos = window.scrollY + 100;
    let currentId = null;
    sections.forEach(sec => {
      if (sec.offsetTop <= scrollPos) currentId = sec.id;
    });
    Object.entries(linkMap).forEach(([id, link]) => {
      link.classList.toggle('active', id === currentId);
    });
  }

  /* ---------- Back-to-top ---------- */
  if (backToTop) {
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- Scroll reveal animations (IntersectionObserver) ---------- */
  const revealEls = $$('.reveal');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          // small staggered delay for nicer effect
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ---------- Contact form validation ---------- */
  const form = $('#contactForm');
  if (form) {
    const successMsg = $('#formSuccess');

    const setError = (field, msg) => {
      const el = form.querySelector(`[data-error-for="${field}"]`);
      if (el) el.textContent = msg || '';
    };

    const isValidEmail = (val) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(val);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      let ok = true;
      const name    = form.name.value.trim();
      const email   = form.email.value.trim();
      const message = form.message.value.trim();

      setError('name'); setError('email'); setError('message');
      if (successMsg) successMsg.classList.remove('show');

      if (name.length < 2)        { setError('name', 'Please enter your name (min 2 characters).'); ok = false; }
      if (!isValidEmail(email))   { setError('email', 'Please enter a valid email address.');       ok = false; }
      if (message.length < 10)    { setError('message', 'Message should be at least 10 characters.'); ok = false; }

      if (!ok) return;

      // Simulated send (no backend) — show success and reset.
      if (successMsg) successMsg.classList.add('show');
      form.reset();
      setTimeout(() => successMsg && successMsg.classList.remove('show'), 5000);
    });

    // Clear error on input
    ['name', 'email', 'message'].forEach(field => {
      const input = form[field];
      if (input) input.addEventListener('input', () => setError(field));
    });
  }
})();
