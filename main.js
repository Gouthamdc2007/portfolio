/* ================================================
   PORTFOLIO — main.js  v4
   Custom cursor · Sound effects · Accordions · Counters
   ================================================ */

(function () {
  'use strict';

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
      ringX += (mouseX - ringX) * 0.14;
      ringY += (mouseY - ringY) * 0.14;
      cursorRing.style.left = ringX + 'px';
      cursorRing.style.top  = ringY + 'px';
    }
    requestAnimationFrame(animateRing);
  }
  animateRing();

  // Hover state
  function attachHoverListeners() {
    const interactives = 'a, button, input, textarea, select, .card, .service-card, .skill-pill, .channel-card, .faq-question, .workflow-step';
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
  }
  attachHoverListeners();

  // Click state
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

  // ─── WEB AUDIO SOUND EFFECTS ──────────────────
  let audioCtx = null;
  let soundEnabled = true;

  function getAudioCtx() {
    if (!audioCtx) {
      try {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) { soundEnabled = false; }
    }
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
        nav:       { freq: 520, freqEnd: 320, dur: 0.07, vol: 0.10, filterFreq: 2000 },
        button:    { freq: 780, freqEnd: 420, dur: 0.09, vol: 0.15, filterFreq: 3200 },
        link:      { freq: 500, freqEnd: 280, dur: 0.07, vol: 0.09, filterFreq: 2000 },
        accordion: { freq: 440, freqEnd: 660, dur: 0.08, vol: 0.12, filterFreq: 2500 },
        click:     { freq: 400, freqEnd: 220, dur: 0.05, vol: 0.08, filterFreq: 1600 }
      };

      const s = sounds[type] || sounds.click;
      filter.frequency.value = s.filterFreq;
      osc.type = 'sine';
      osc.frequency.setValueAtTime(s.freq, now);
      osc.frequency.exponentialRampToValueAtTime(s.freqEnd, now + s.dur);
      gain.gain.setValueAtTime(s.vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + s.dur);
      osc.start(now);
      osc.stop(now + s.dur + 0.01);
    } catch (e) {}
  }

  document.addEventListener('click', (e) => {
    const target = e.target;
    if (target.closest('.faq-question')) { playSound('accordion'); }
    else if (target.closest('button, .btn')) { playSound('button'); }
    else if (target.closest('.navbar a, .nav-mobile a')) { playSound('nav'); }
    else if (target.closest('a')) { playSound('link'); }
    else { playSound('click'); }
  }, { capture: true });

  // ─── FAQ ACCORDION LOGIC ──────────────────────
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      
      // Close other accordion items
      document.querySelectorAll('.faq-item').forEach(other => {
        if (other !== item) other.classList.remove('open');
      });

      // Toggle current
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
      'Software Developer',
      'Backend Engineer',
      'Web App Specialist',
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
      playSound('button');
      setTimeout(() => {
        form.reset();
        btn.innerHTML = orig;
        btn.disabled = false;
        if (successMsg) {
          successMsg.style.display = 'block';
          setTimeout(() => successMsg.style.display = 'none', 6000);
        }
      }, 1400);
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
