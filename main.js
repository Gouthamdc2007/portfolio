/* ================================================
   PORTFOLIO — main.js  v5
   Ultra-responsive Click Sounds · Custom Cursor · FAQ · Counters
   ================================================ */

(function () {
  'use strict';

  // ─── AUDIO ENGINE (LOUD & CRISP ON ALL CLICKS) ──
  let audioCtx = null;

  function initAudio() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  function playClickSound(soundType) {
    initAudio();
    if (!audioCtx) return;

    try {
      const now = audioCtx.currentTime;
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.connect(gain);
      gain.connect(audioCtx.destination);

      if (soundType === 'button') {
        // Crisp futuristic double-tone pop for buttons & CTAs
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.08);
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.09);
      } else if (soundType === 'nav') {
        // High crisp chirp for navbar links
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.07);
        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
        osc.start(now);
        osc.stop(now + 0.08);
      } else if (soundType === 'accordion') {
        // Smooth swell for FAQ dropdowns
        osc.type = 'sine';
        osc.frequency.setValueAtTime(350, now);
        osc.frequency.exponentialRampToValueAtTime(700, now + 0.1);
        gain.gain.setValueAtTime(0.30, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        osc.start(now);
        osc.stop(now + 0.11);
      } else {
        // Universal crisp UI click sound for ANY element clicked
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.07);
      }
    } catch (e) {}
  }

  // Trigger sound on every single pointerdown & click anywhere on screen
  window.addEventListener('pointerdown', (e) => {
    initAudio();
    const target = e.target;
    if (target.closest('.faq-question')) {
      playClickSound('accordion');
    } else if (target.closest('button, .btn, .nav-cta, input[type="submit"]')) {
      playClickSound('button');
    } else if (target.closest('.navbar a, .nav-mobile a')) {
      playClickSound('nav');
    } else if (target.closest('a, .card, .channel-card, .skill-pill, .service-card')) {
      playClickSound('button');
    } else {
      playClickSound('click');
    }
  }, { capture: true, passive: true });

  // ─── CUSTOM CURSOR ───────────────────────────
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    }
  }, { passive: true });

  function animateRing() {
    if (cursorRing) {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover states on interactive items
  const interactives = 'a, button, input, textarea, select, .card, .service-card, .skill-pill, .channel-card, .faq-question, .workflow-step, .stat-item';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      if (cursorDot)  cursorDot.classList.add('hovering');
      if (cursorRing) cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      if (cursorDot)  cursorDot.classList.remove('hovering');
      if (cursorRing) cursorRing.classList.remove('hovering');
    });
  });

  // Press down effect
  document.addEventListener('mousedown', () => {
    if (cursorDot)  cursorDot.classList.add('clicking');
    if (cursorRing) cursorRing.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    if (cursorDot)  cursorDot.classList.remove('clicking');
    if (cursorRing) cursorRing.classList.remove('clicking');
  });

  document.addEventListener('mouseleave', () => {
    if (cursorDot)  cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursorDot)  cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });

  // ─── CLICK RIPPLE ─────────────────────────────
  document.addEventListener('click', (e) => {
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    const size = 60;
    ripple.style.cssText = `
      width:${size}px; height:${size}px;
      left:${e.clientX - size/2}px; top:${e.clientY - size/2}px;
    `;
    document.body.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());
  });

  // ─── FAQ ACCORDION LOGIC ──────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });
      item.classList.toggle('open', !wasOpen);
    });
  });

  // ─── NAVBAR SCROLL & MOBILE ───────────────────
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 10);
    }, { passive: true });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── ACTIVE NAV LINK ──────────────────────────
  const currentFile = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(link => {
    const href = link.getAttribute('href') || '';
    if (href === currentFile || (currentFile === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ─── SCROLL OBSERVER (FADE-UP) ────────────────
  const fadeObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
  );
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // ─── TYPING ANIMATION ─────────────────────────
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const words = [
      'Web Developer',
      'Backend Engineer',
      'Software Developer',
      'IoT & AI Builder',
    ];
    let wi = 0, ci = 0, deleting = false;
    function tick() {
      const word = words[wi];
      typedEl.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
      deleting ? ci-- : ci++;
      if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      setTimeout(tick, deleting ? 45 : 75);
    }
    setTimeout(tick, 800);
  }

  // ─── ANIMATED STAT COUNTERS ───────────────────
  function animateCounter(el, target, suffix) {
    const dur = 1500, start = performance.now();
    function step(now) {
      const p    = Math.min((now - start) / dur, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.floor(ease * target) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  const counterObs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateCounter(el, parseInt(el.dataset.target, 10), el.dataset.suffix || '');
        counterObs.unobserve(el);
      }
    });
  }, { threshold: 0.3 });
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  // ─── CONTACT FORM ─────────────────────────────
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('.form-btn');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Sending message…';
      btn.disabled = true;
      setTimeout(() => {
        form.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => successMsg.style.display = 'none', 6000);
        }
      }, 1200);
    });
  }

  // ─── BACK TO TOP ──────────────────────────────
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 350);
    }, { passive: true });
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ─── FOOTER YEAR ──────────────────────────────
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();
