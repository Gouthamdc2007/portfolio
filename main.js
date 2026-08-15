/* ================================================
   PORTFOLIO — main.js  v3
   Custom cursor · Click sounds · Animations
   ================================================ */

(function () {
  'use strict';

  // ─── CUSTOM CURSOR ───────────────────────────
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;
  let isHovering = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot)  { cursorDot.style.left  = mouseX + 'px'; cursorDot.style.top  = mouseY + 'px'; }
  }, { passive: true });

  function animateRing() {
    if (cursorRing) {
      ringX += (mouseX - ringX) * 0.13;
      ringY += (mouseY - ringY) * 0.13;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state on interactive elements
  const interactives = 'a, button, input, textarea, .card, .skill-pill, .channel-card';
  document.querySelectorAll(interactives).forEach(el => {
    el.addEventListener('mouseenter', () => {
      isHovering = true;
      if (cursorDot)  cursorDot.classList.add('hovering');
      if (cursorRing) cursorRing.classList.add('hovering');
    });
    el.addEventListener('mouseleave', () => {
      isHovering = false;
      if (cursorDot)  cursorDot.classList.remove('hovering');
      if (cursorRing) cursorRing.classList.remove('hovering');
    });
  });

  // Click press effect
  document.addEventListener('mousedown', () => {
    if (cursorDot)  cursorDot.classList.add('clicking');
    if (cursorRing) cursorRing.classList.add('clicking');
  });
  document.addEventListener('mouseup', () => {
    if (cursorDot)  cursorDot.classList.remove('clicking');
    if (cursorRing) cursorRing.classList.remove('clicking');
  });

  // Hide cursor when leaving window
  document.addEventListener('mouseleave', () => {
    if (cursorDot)  cursorDot.style.opacity = '0';
    if (cursorRing) cursorRing.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    if (cursorDot)  cursorDot.style.opacity = '1';
    if (cursorRing) cursorRing.style.opacity = '1';
  });

  // ─── CLICK RIPPLE EFFECT ─────────────────────
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

  // ─── WEB AUDIO — SOUND EFFECTS ───────────────
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { soundEnabled = false; }
    }
    // Resume if suspended (required by browser policy)
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playSound(type) {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;

      const osc    = ctx.createOscillator();
      const gain   = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      filter.type = 'lowpass';
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      const now = ctx.currentTime;

      const sounds = {
        nav: {
          type: 'sine',
          freq: 520, freqEnd: 320,
          dur: 0.07,
          vol: 0.12, filterFreq: 2000
        },
        button: {
          type: 'sine',
          freq: 740, freqEnd: 380,
          dur: 0.09,
          vol: 0.16, filterFreq: 3000
        },
        link: {
          type: 'sine',
          freq: 480, freqEnd: 260,
          dur: 0.07,
          vol: 0.10, filterFreq: 2000
        },
        click: {
          type: 'sine',
          freq: 380, freqEnd: 200,
          dur: 0.06,
          vol: 0.08, filterFreq: 1500
        },
        hover_tick: {
          type: 'sine',
          freq: 900, freqEnd: 700,
          dur: 0.03,
          vol: 0.05, filterFreq: 4000
        }
      };

      const s = sounds[type] || sounds.click;
      filter.frequency.value = s.filterFreq;
      osc.type = s.type;
      osc.frequency.setValueAtTime(s.freq, now);
      osc.frequency.exponentialRampToValueAtTime(s.freqEnd, now + s.dur);
      gain.gain.setValueAtTime(s.vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + s.dur);
      osc.start(now);
      osc.stop(now + s.dur + 0.01);
    } catch (e) {}
  }

  // Wire up sounds to clicks
  document.addEventListener('click', (e) => {
    const target = e.target;
    const btn    = target.closest('button, .btn');
    const navA   = target.closest('.navbar a, .nav-mobile a');
    const link   = target.closest('a');

    if (btn)  { playSound('button'); }
    else if (navA) { playSound('nav'); }
    else if (link) { playSound('link'); }
    else           { playSound('click'); }
  }, { capture: true });

  // ─── NAVBAR ───────────────────────────────────
  const navbar     = document.querySelector('.navbar');
  const hamburger  = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile');

  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 8);
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

  // ─── SCROLL FADE ANIMATIONS ───────────────────
  const fadeObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // ─── TYPING ANIMATION ─────────────────────────
  const typedEl = document.querySelector('.typed-text');
  if (typedEl) {
    const words = [
      'Software Developer',
      'Web App Developer',
      'Backend Developer',
      'IoT Enthusiast',
    ];
    let wi = 0, ci = 0, deleting = false;
    function tick() {
      const word = words[wi];
      typedEl.textContent = deleting ? word.slice(0, ci - 1) : word.slice(0, ci + 1);
      deleting ? ci-- : ci++;
      if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1800); return; }
      if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
      setTimeout(tick, deleting ? 50 : 80);
    }
    setTimeout(tick, 900);
  }

  // ─── HERO ENTRANCE ────────────────────────────
  const heroChildren = document.querySelectorAll('.hero-content > *');
  if (heroChildren.length) {
    heroChildren.forEach((el, i) => {
      el.style.cssText = `opacity:0;transform:translateY(22px);
        transition:opacity .65s cubic-bezier(.4,0,.2,1) ${i * 0.09}s,
                   transform .65s cubic-bezier(.4,0,.2,1) ${i * 0.09}s`;
    });
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroChildren.forEach(el => { el.style.opacity = '1'; el.style.transform = 'translateY(0)'; });
    }));
  }

  // Hero photo entrance
  const heroPhoto = document.querySelector('.hero-photo-wrap');
  if (heroPhoto) {
    heroPhoto.style.cssText = `opacity:0;transform:scale(0.94) translateY(20px);
      transition:opacity .9s cubic-bezier(.4,0,.2,1) .3s, transform .9s cubic-bezier(.4,0,.2,1) .3s`;
    requestAnimationFrame(() => requestAnimationFrame(() => {
      heroPhoto.style.opacity = '1';
      heroPhoto.style.transform = 'scale(1) translateY(0)';
    }));
  }

  // ─── CONTACT FORM ─────────────────────────────
  const form       = document.getElementById('contact-form');
  const successMsg = document.getElementById('form-success');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const btn  = form.querySelector('.form-btn');
      const orig = btn.innerHTML;
      btn.innerHTML = 'Sending…';
      btn.disabled = true;
      playSound('button');
      setTimeout(() => {
        form.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => successMsg.style.display = 'none', 5000);
        }
      }, 1500);
    });
  }

  // ─── ANIMATED COUNTERS ────────────────────────
  function animateCounter(el, target, suffix) {
    const dur = 1400, start = performance.now();
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
  }, { threshold: 0.5 });
  document.querySelectorAll('[data-target]').forEach(el => counterObs.observe(el));

  // ─── BACK TO TOP ──────────────────────────────
  const backBtn = document.getElementById('back-to-top');
  if (backBtn) {
    window.addEventListener('scroll', () => {
      backBtn.classList.toggle('visible', window.scrollY > 400);
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
