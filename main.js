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

  // ─── AMBIENT CURSOR GLOW FOLLOWER ─────────────
  const cursorDot  = document.getElementById('cursor-dot');
  const cursorRing = document.getElementById('cursor-ring');
  const isFinePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;

  if (isFinePointer && cursorDot && cursorRing) {
    let mouseX = -100, mouseY = -100;
    let ringX  = -100, ringY  = -100;
    let hasMoved = false;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!hasMoved) {
        hasMoved = true;
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
        ringX = mouseX;
        ringY = mouseY;
      }
      cursorDot.style.left = mouseX + 'px';
      cursorDot.style.top  = mouseY + 'px';
    }, { passive: true });

    function animateRing() {
      if (hasMoved) {
        ringX += (mouseX - ringX) * 0.18;
        ringY += (mouseY - ringY) * 0.18;
        cursorRing.style.left = ringX + 'px';
        cursorRing.style.top  = ringY + 'px';
      }
      requestAnimationFrame(animateRing);
    }
    requestAnimationFrame(animateRing);

    // Hover states on interactive items
    const interactives = 'a, button, input, textarea, select, .card, .service-card, .postcard-box, .project-card, .skill-pill, .channel-card, .faq-question, .workflow-step, .stat-item';
    document.querySelectorAll(interactives).forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hovering');
        cursorRing.classList.add('hovering');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hovering');
        cursorRing.classList.remove('hovering');
      });
    });

    // Press down effect
    document.addEventListener('mousedown', () => {
      cursorDot.classList.add('clicking');
      cursorRing.classList.add('clicking');
    });
    document.addEventListener('mouseup', () => {
      cursorDot.classList.remove('clicking');
      cursorRing.classList.remove('clicking');
    });

    document.addEventListener('mouseleave', () => {
      cursorDot.style.opacity = '0';
      cursorRing.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
      if (hasMoved) {
        cursorDot.style.opacity = '1';
        cursorRing.style.opacity = '1';
      }
    });
  }

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

  // ─── POSTCARD SKILLS MODAL SYSTEM ────────────
  function openSkillsModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    playClickSound('button');
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeSkillsModal(modal) {
    if (!modal) return;
    playClickSound('nav');
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Open on postcard click
  document.querySelectorAll('.postcard-box[data-modal-target]').forEach(box => {
    box.addEventListener('click', () => {
      const targetId = box.getAttribute('data-modal-target');
      openSkillsModal(targetId);
    });
    box.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const targetId = box.getAttribute('data-modal-target');
        openSkillsModal(targetId);
      }
    });
  });

  // Close on close button click or overlay click
  document.querySelectorAll('.skills-modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay || e.target.closest('.modal-close-btn')) {
        closeSkillsModal(overlay);
      }
    });
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.skills-modal-overlay.active');
      if (activeModal) closeSkillsModal(activeModal);
    }
  });

  // ─── INTERACTIVE THEME VAULT CONTROLLER (MAILBOX, LAUNCH BAY, DOSSIER, COMMS, CHIP DECK) ──
  document.querySelectorAll('.skills-mailbox-vault, .interactive-theme-vault').forEach(vault => {
    const toggleBtn = vault.querySelector('.mailbox-interactive-hub, .theme-vault-hub, #mailbox-toggle-btn');
    const contentGrid = vault.querySelector('.skills-mailbox-content, .theme-vault-content, #skills-mailbox-grid');
    const iconEl = vault.querySelector('#mailbox-icon, .theme-vault-icon');
    const labelEl = vault.querySelector('#mailbox-btn-label, .theme-vault-btn-label');
    const statusTag = vault.querySelector('#mailbox-status-tag, .theme-vault-status-tag');
    const badgeEl = vault.querySelector('#mailbox-badge, .theme-vault-count-pill');

    if (!toggleBtn || !contentGrid) return;

    const closedIcon = vault.dataset.closedIcon || (iconEl ? iconEl.textContent.trim() : '📫');
    const openIcon = vault.dataset.openIcon || '📬';
    const closedLabel = vault.dataset.closedLabel || (labelEl ? labelEl.textContent.trim() : 'Open Vault');
    const openLabel = vault.dataset.openLabel || 'Close Vault';
    const closedStatus = vault.dataset.closedStatus || (statusTag ? statusTag.textContent.trim() : 'Vault Sealed');
    const openStatus = vault.dataset.openStatus || 'Vault Unlocked · Contents Deployed';

    function toggleVault(e) {
      if (e) {
        if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
        if (e.type === 'keydown') e.preventDefault();
      }

      playClickSound('button');
      const isOpen = contentGrid.classList.toggle('open');
      if (contentGrid.classList.contains('services-grid') || contentGrid.classList.contains('projects-grid')) {
        contentGrid.classList.toggle('grid-open', isOpen);
      }
      toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
      contentGrid.setAttribute('aria-hidden', isOpen ? 'false' : 'true');

      if (isOpen) {
        if (iconEl) iconEl.textContent = openIcon;
        if (labelEl) labelEl.textContent = openLabel;
        if (statusTag) statusTag.innerHTML = openStatus;
        if (badgeEl) badgeEl.style.display = 'none';
        vault.classList.add('vault-opened');
      } else {
        if (iconEl) iconEl.textContent = closedIcon;
        if (labelEl) labelEl.textContent = closedLabel;
        if (statusTag) statusTag.innerHTML = closedStatus;
        if (badgeEl) badgeEl.style.display = 'inline-block';
        vault.classList.remove('vault-opened');
      }
    }

    toggleBtn.addEventListener('click', toggleVault);
    toggleBtn.addEventListener('keydown', toggleVault);
  });

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

