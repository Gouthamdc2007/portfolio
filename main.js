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

  // ─── INTERACTIVE COMMAND PALETTE & CYBER TERMINAL ENGINE ───
  (function initCommandPalette() {
    // 1. Inject Floating Terminal Button if not present
    if (!document.getElementById('floating-terminal-btn')) {
      const floatBtn = document.createElement('button');
      floatBtn.id = 'floating-terminal-btn';
      floatBtn.className = 'floating-terminal-btn';
      floatBtn.setAttribute('aria-label', 'Open Command Palette & Terminal (Ctrl+K)');
      floatBtn.innerHTML = `
        <span aria-hidden="true">⚡</span>
        <span class="ft-label">Terminal (Ctrl+K)</span>
      `;
      document.body.appendChild(floatBtn);
    }

    // 2. Inject Command Palette Dialog Modal if not present
    let overlay = document.getElementById('command-palette-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'command-palette-overlay';
      overlay.className = 'command-palette-overlay';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-hidden', 'true');

      overlay.innerHTML = `
        <div class="command-palette-dialog">
          <div class="cp-header">
            <span class="cp-search-icon" aria-hidden="true">⚡</span>
            <input type="text" class="cp-input" id="cp-search-input" placeholder="Type a command or search (e.g. 'projects', 'internship', 'skills')..." autocomplete="off" spellcheck="false" />
            <button class="cp-close-btn" id="cp-close-btn" aria-label="Close Command Palette">✕</button>
          </div>
          <div class="cp-tabs">
            <button class="cp-tab-btn active" id="cp-tab-actions" type="button">⚡ Quick Actions</button>
            <button class="cp-tab-btn" id="cp-tab-cli" type="button">📟 Cyber CLI Terminal</button>
          </div>
          <div class="cp-body" id="cp-actions-view">
            <div id="cp-results-list"></div>
          </div>
          <div class="cp-body" id="cp-cli-view" style="display:none;">
            <div class="cyber-shell-wrap" id="cyber-shell-container">
              <div class="cyber-shell-log" id="cyber-shell-log">Goutham Kumar SK [Cyber Terminal v5.2]
Type 'help' for a list of commands.

</div>
              <form class="cyber-shell-form" id="cyber-cli-form">
                <span class="cyber-prompt">goutham@dev:~$</span>
                <input type="text" class="cyber-cli-input" id="cyber-cli-input" autocomplete="off" spellcheck="false" placeholder="type 'help'..." />
              </form>
            </div>
          </div>
          <div class="cp-footer">
            <div class="cp-footer-keys">
              <span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span>
              <span><kbd>↵</kbd> Select</span>
              <span><kbd>ESC</kbd> Close</span>
            </div>
            <span>Press <strong>Ctrl+K</strong> anytime</span>
          </div>
        </div>
      `;
      document.body.appendChild(overlay);
    }

    const input = document.getElementById('cp-search-input');
    const resultsList = document.getElementById('cp-results-list');
    const closeBtn = document.getElementById('cp-close-btn');
    const tabActions = document.getElementById('cp-tab-actions');
    const tabCli = document.getElementById('cp-tab-cli');
    const actionsView = document.getElementById('cp-actions-view');
    const cliView = document.getElementById('cp-cli-view');
    const cliForm = document.getElementById('cyber-cli-form');
    const cliInput = document.getElementById('cyber-cli-input');
    const shellLog = document.getElementById('cyber-shell-log');

    const COMMANDS = [
      { id: 'home', icon: '🏠', title: 'Home Page', sub: 'Main hero, developer stats, and skills mailbox', badge: 'Navigation', action: () => window.location.href = 'index.html' },
      { id: 'projects', icon: '🚀', title: 'Software Projects', sub: 'Library System, Restaurant App, IoT AI Chatbot', badge: 'Projects', action: () => window.location.href = 'projects.html' },
      { id: 'skills', icon: '⚡', title: 'Skills & Tech Stack', sub: 'Java, Python, C, C++, SQL, React, CSS3', badge: 'Skills', action: () => window.location.href = 'skills.html' },
      { id: 'about', icon: '👤', title: 'About Developer', sub: 'Background, education, tools, and experience', badge: 'Profile', action: () => window.location.href = 'about.html' },
      { id: 'internship', icon: '💼', title: 'NVSKZEN INSTITUTE PVT LTD', sub: 'Role: Web Developer (Industry Internship)', badge: 'Experience', action: () => window.location.href = 'about.html' },
      { id: 'contact', icon: '📬', title: 'Contact & Transmit', sub: 'gowtham57845@gmail.com & message form', badge: 'Contact', action: () => window.location.href = 'contact.html' },
      { id: 'vault', icon: '🔓', title: 'Toggle Page Vault / Mailbox', sub: 'Trigger the interactive container on this page', badge: 'Interactive', action: () => {
        closePalette();
        const hub = document.querySelector('.skills-mailbox-vault .mailbox-interactive-hub, .interactive-theme-vault .theme-vault-hub');
        if (hub) hub.click();
      }},
      { id: 'github', icon: '🐱', title: 'GitHub Profile', sub: 'github.com/Gouthamdc2007 (Repositories)', badge: 'External', action: () => window.open('https://github.com/Gouthamdc2007', '_blank') },
      { id: 'linkedin', icon: '🔗', title: 'LinkedIn Profile', sub: 'Goutham Kumar SK on LinkedIn', badge: 'External', action: () => window.open('https://www.linkedin.com/in/goutham-kumar-s-k-790884340/', '_blank') }
    ];

    let selectedIndex = 0;
    let filteredCommands = [...COMMANDS];

    function renderActions(query = '') {
      const q = query.toLowerCase().trim();
      filteredCommands = COMMANDS.filter(cmd => 
        cmd.title.toLowerCase().includes(q) || 
        cmd.sub.toLowerCase().includes(q) || 
        cmd.badge.toLowerCase().includes(q)
      );

      selectedIndex = 0;
      if (filteredCommands.length === 0) {
        resultsList.innerHTML = `
          <div style="text-align:center;padding:24px;color:var(--text-muted);font-size:0.9rem;">
            No commands found matching "<strong>${query}</strong>". Try switching to the 📟 Cyber CLI Terminal tab!
          </div>
        `;
        return;
      }

      resultsList.innerHTML = filteredCommands.map((cmd, idx) => `
        <div class="cp-item ${idx === selectedIndex ? 'selected' : ''}" data-index="${idx}">
          <div class="cp-item-left">
            <span class="cp-item-icon">${cmd.icon}</span>
            <div>
              <div class="cp-item-title">${cmd.title}</div>
              <div class="cp-item-subtitle">${cmd.sub}</div>
            </div>
          </div>
          <span class="cp-item-badge">${cmd.badge}</span>
        </div>
      `).join('');

      resultsList.querySelectorAll('.cp-item').forEach(el => {
        el.addEventListener('click', () => {
          const idx = parseInt(el.dataset.index, 10);
          if (filteredCommands[idx]) {
            playClickSound('button');
            filteredCommands[idx].action();
          }
        });
      });
    }

    function openPalette() {
      playClickSound('button');
      overlay.classList.add('active');
      overlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
      input.value = '';
      renderActions('');
      setTimeout(() => input.focus(), 80);
    }

    function closePalette() {
      playClickSound('nav');
      overlay.classList.remove('active');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    // Toggle triggers
    document.addEventListener('click', (e) => {
      if (e.target.closest('#floating-terminal-btn, .nav-terminal-btn, #open-terminal-btn')) {
        openPalette();
      }
    });

    if (closeBtn) closeBtn.addEventListener('click', closePalette);

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closePalette();
    });

    // Keyboard shortcut: Ctrl+K / Cmd+K
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        if (overlay.classList.contains('active')) {
          closePalette();
        } else {
          openPalette();
        }
      } else if (e.key === 'Escape' && overlay.classList.contains('active')) {
        closePalette();
      }
    });

    // Tabs switching
    tabActions.addEventListener('click', () => {
      tabActions.classList.add('active');
      tabCli.classList.remove('active');
      actionsView.style.display = 'block';
      cliView.style.display = 'none';
      input.focus();
    });

    tabCli.addEventListener('click', () => {
      tabCli.classList.add('active');
      tabActions.classList.remove('active');
      actionsView.style.display = 'none';
      cliView.style.display = 'block';
      cliInput.focus();
    });

    // Search input typing & Arrow Navigation
    input.addEventListener('input', (e) => {
      renderActions(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex + 1) % filteredCommands.length;
          updateSelected();
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (filteredCommands.length > 0) {
          selectedIndex = (selectedIndex - 1 + filteredCommands.length) % filteredCommands.length;
          updateSelected();
        }
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          playClickSound('button');
          filteredCommands[selectedIndex].action();
        }
      }
    });

    function updateSelected() {
      resultsList.querySelectorAll('.cp-item').forEach((el, idx) => {
        el.classList.toggle('selected', idx === selectedIndex);
        if (idx === selectedIndex) el.scrollIntoView({ block: 'nearest' });
      });
    }

    // CLI Terminal Form Execution
    if (cliForm) {
      cliForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const cmd = cliInput.value.trim();
        if (!cmd) return;
        cliInput.value = '';
        playClickSound('button');

        shellLog.textContent += `goutham@dev:~$ ${cmd}\n`;
        const lower = cmd.toLowerCase();

        if (lower === 'help') {
          shellLog.textContent += `Available Commands:
  • help          - List system commands
  • projects      - View all 3 featured engineering projects
  • skills        - View 7 core programming languages & stack
  • internship    - View NVSKZEN INSTITUTE PVT LTD experience
  • about         - View developer bio & background
  • contact       - View contact channels & email
  • clear         - Clear the terminal screen
  • whoami        - Display active user profile
  • goto <page>   - Navigate (home, projects, skills, about, contact)
  • date          - Print current session timestamp
\n`;
        } else if (lower === 'projects') {
          shellLog.textContent += `Featured Projects:
  1. Library Management System (Python + SQL Database + Web UI)
  2. Restaurant Web Application with SQL (React + Full-Stack DBMS)
  3. IoT AI Chatbot for Bluetooth Hardware Control (Python + C/C++ Firmware)
Type 'goto projects' to view them live!\n\n`;
        } else if (lower === 'skills') {
          shellLog.textContent += `Core Skills:
  • Languages: Java, Python, C, C++, SQL, CSS3, React
  • Domains: Web App Engineering, Databases, IoT & Systems
Type 'goto skills' to explore the full matrix!\n\n`;
        } else if (lower === 'internship' || lower === 'experience') {
          shellLog.textContent += `Professional Experience:
  • Organization: NVSKZEN INSTITUTE PRIVATE LIMITED
  • Role: Web Developer (Intern)
  • Focus: Responsive layouts, component styling, UI engineering\n\n`;
        } else if (lower === 'about' || lower === 'bio') {
          shellLog.textContent += `Goutham Kumar SK:
  • Role: Software & Web Developer
  • Degree: B.E. / B.Tech (Computer Science & Engineering)
  • Location: India\n\n`;
        } else if (lower === 'contact') {
          shellLog.textContent += `Contact Channels:
  • Email 1: gowtham57845@gmail.com
  • Email 2: gowthamkumar5468@gmail.com
  • GitHub: https://github.com/Gouthamdc2007
  • LinkedIn: https://www.linkedin.com/in/goutham-kumar-s-k-790884340/\n\n`;
        } else if (lower === 'whoami') {
          shellLog.textContent += `guest@goutham-portfolio [Role: Recruiter / Engineer / Explorer]\n\n`;
        } else if (lower === 'date') {
          shellLog.textContent += `${new Date().toString()}\n\n`;
        } else if (lower === 'clear') {
          shellLog.textContent = '';
        } else if (lower.startsWith('goto ')) {
          const target = lower.replace('goto ', '').trim();
          if (['home', 'index'].includes(target)) {
            shellLog.textContent += `Navigating to Home...\n`;
            setTimeout(() => window.location.href = 'index.html', 400);
          } else if (['projects', 'project'].includes(target)) {
            shellLog.textContent += `Navigating to Projects...\n`;
            setTimeout(() => window.location.href = 'projects.html', 400);
          } else if (['skills', 'skill'].includes(target)) {
            shellLog.textContent += `Navigating to Skills...\n`;
            setTimeout(() => window.location.href = 'skills.html', 400);
          } else if (['about'].includes(target)) {
            shellLog.textContent += `Navigating to About...\n`;
            setTimeout(() => window.location.href = 'about.html', 400);
          } else if (['contact'].includes(target)) {
            shellLog.textContent += `Navigating to Contact...\n`;
            setTimeout(() => window.location.href = 'contact.html', 400);
          } else {
            shellLog.textContent += `Unknown destination: ${target}. Options: home, projects, skills, about, contact.\n\n`;
          }
        } else {
          shellLog.textContent += `Command not recognized: '${cmd}'. Type 'help' for command list.\n\n`;
        }

        const wrap = document.getElementById('cyber-shell-container');
        if (wrap) wrap.scrollTop = wrap.scrollHeight;
      });
    }
  })();

  // ─── FOOTER YEAR ──────────────────────────────
  document.querySelectorAll('.footer-year').forEach(el => {
    el.textContent = new Date().getFullYear();
  });

})();

