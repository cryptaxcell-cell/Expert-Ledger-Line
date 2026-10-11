/**
 * LEDGERPULSE PRIVATE ADVISORY - CLIENT SCRIPT
 * High-touch interactions, Tax Calculation Engine & Audit Assessment
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initHeroLedgerEngine();
  initTaxEstimator();
  initAuditChecklist();
  initFaqAccordion();
  initPhoneModal();
});

/* ==========================================================================
   1. NAVBAR & NAVIGATION
   ========================================================================== */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileNav = document.getElementById('mobileNav');
  const mobileNavClose = document.getElementById('mobileNavClose');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

  // Sticky navbar with blur on scroll
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    updateActiveNav();
  });

  // Mobile drawer controls
  if (mobileMenuBtn && mobileNav) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileNav.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeDrawer = () => {
    if (mobileNav) {
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeDrawer);
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  // Highlight active link based on scroll section
  function updateActiveNav() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentId = '';

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        currentId = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }
}

/* ==========================================================================
   2. HERO SIMULATED LEDGER ENGINE
   ========================================================================== */
function initHeroLedgerEngine() {
  const blockCounterEl = document.getElementById('heroBlockCount');
  const hashCountEl = document.getElementById('heroHashCount');
  const pulseStatusEl = document.getElementById('heroStatusText');

  if (!blockCounterEl) return;

  let currentBlock = 19482104;
  let reconciledTx = 14820;

  setInterval(() => {
    currentBlock += 1;
    reconciledTx += Math.floor(Math.random() * 4) + 1;
    
    blockCounterEl.textContent = '#' + currentBlock.toLocaleString();
    if (hashCountEl) {
      hashCountEl.textContent = reconciledTx.toLocaleString();
    }

    if (pulseStatusEl) {
      pulseStatusEl.textContent = 'Syncing Block #' + (currentBlock % 1000);
      setTimeout(() => {
        pulseStatusEl.textContent = 'Multi-Chain Reconciled';
      }, 1500);
    }
  }, 4500);
}

/* ==========================================================================
   3. CRYPTO TAX ESTIMATOR CALCULATOR
   ========================================================================== */
function initTaxEstimator() {
  const jurisdictionBtns = document.querySelectorAll('[data-jurisdiction]');
  const holdingBtns = document.querySelectorAll('[data-holding]');
  const gainSlider = document.getElementById('gainSlider');
  const gainValueDisplay = document.getElementById('gainValueDisplay');
  const incomeBracketSelect = document.getElementById('incomeBracket');
  
  const estimatedTaxDisplay = document.getElementById('estimatedTaxDisplay');
  const effectiveRateDisplay = document.getElementById('effectiveRateDisplay');
  const taxableBaseDisplay = document.getElementById('taxableBaseDisplay');
  const harvestSavingsDisplay = document.getElementById('harvestSavingsDisplay');

  if (!gainSlider) return;

  let state = {
    jurisdiction: 'us', // 'us' or 'ca'
    holding: 'long',    // 'short' or 'long'
    gain: 150000,
    bracket: 'tier2'    // 'tier1', 'tier2', 'tier3'
  };

  jurisdictionBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      jurisdictionBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.jurisdiction = btn.getAttribute('data-jurisdiction');
      calculateTax();
    });
  });

  holdingBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      holdingBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.holding = btn.getAttribute('data-holding');
      calculateTax();
    });
  });

  gainSlider.addEventListener('input', (e) => {
    state.gain = parseInt(e.target.value, 10);
    gainValueDisplay.textContent = '$' + state.gain.toLocaleString();
    calculateTax();
  });

  incomeBracketSelect.addEventListener('change', (e) => {
    state.bracket = e.target.value;
    calculateTax();
  });

  function calculateTax() {
    let rate = 0.15;
    let taxableAmount = state.gain;
    let harvestBenefit = 0;

    if (state.jurisdiction === 'us') {
      // US Tax Logic
      if (state.holding === 'short') {
        // Ordinary income rates
        if (state.bracket === 'tier1') rate = 0.22;
        else if (state.bracket === 'tier2') rate = 0.32;
        else rate = 0.37;
      } else {
        // Long-term preferential capital gain rates (0%, 15%, 20% + NIIT 3.8%)
        if (state.bracket === 'tier1') rate = 0.15;
        else if (state.bracket === 'tier2') rate = 0.188; // 15% + NIIT
        else rate = 0.238; // 20% + NIIT
      }
      harvestBenefit = Math.round(state.gain * 0.14);
    } else {
      // Canada (CRA) Tax Logic
      // 50% inclusion rate (or 66.7% over $250k under new proposals)
      const inclusionRate = (state.gain > 250000) ? 0.60 : 0.50;
      taxableAmount = state.gain * inclusionRate;

      let marginalRate = 0.33;
      if (state.bracket === 'tier1') marginalRate = 0.26;
      else if (state.bracket === 'tier2') marginalRate = 0.38;
      else marginalRate = 0.53;

      rate = (taxableAmount / state.gain) * marginalRate;
      harvestBenefit = Math.round(state.gain * 0.12);
    }

    const calculatedTax = Math.round(state.gain * rate);
    const effectivePct = (rate * 100).toFixed(1);

    estimatedTaxDisplay.textContent = '$' + calculatedTax.toLocaleString();
    effectiveRateDisplay.textContent = effectivePct + '%';
    taxableBaseDisplay.textContent = '$' + Math.round(taxableAmount).toLocaleString();
    harvestSavingsDisplay.textContent = '$' + harvestBenefit.toLocaleString();
  }

  // Initial calculation run
  calculateTax();
}

/* ==========================================================================
   4. AUDIT-READINESS CHECKLIST
   ========================================================================== */
function initAuditChecklist() {
  const quizButtons = document.querySelectorAll('.quiz-btn');
  const scoreBadge = document.getElementById('auditScoreBadge');
  const scoreFeedback = document.getElementById('auditFeedbackText');

  if (!scoreBadge) return;

  const responses = {
    q1: null,
    q2: null,
    q3: null,
    q4: null
  };

  quizButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const q = btn.getAttribute('data-question');
      const val = btn.getAttribute('data-val');

      // Unselect siblings
      const parent = btn.closest('.quiz-toggle-btns');
      parent.querySelectorAll('.quiz-btn').forEach(b => {
        b.classList.remove('selected-yes', 'selected-no');
      });

      if (val === 'yes') {
        btn.classList.add('selected-yes');
        responses[q] = true;
      } else {
        btn.classList.add('selected-no');
        responses[q] = false;
      }

      evaluateAuditRisk();
    });
  });

  function evaluateAuditRisk() {
    let answered = 0;
    let complexCount = 0;

    Object.keys(responses).forEach(k => {
      if (responses[k] !== null) {
        answered++;
        if (responses[k] === true) complexCount++;
      }
    });

    if (answered === 0) return;

    if (complexCount >= 3) {
      scoreBadge.textContent = 'High Audit Exposure';
      scoreBadge.style.background = 'rgba(239, 68, 68, 0.2)';
      scoreBadge.style.color = '#ef4444';
      scoreFeedback.textContent = 'Multiple cross-venue transactions and yield positions detected. Professional cost-basis reconciliation strongly advised before filing.';
    } else if (complexCount >= 1) {
      scoreBadge.textContent = 'Moderate Complexity';
      scoreBadge.style.background = 'rgba(234, 179, 8, 0.2)';
      scoreBadge.style.color = '#eab308';
      scoreFeedback.textContent = 'Your ledger contains multi-venue activity. Clean lot documentation and bridge reconciliation is recommended.';
    } else {
      scoreBadge.textContent = 'Clean / Low Exposure';
      scoreBadge.style.background = 'rgba(16, 185, 129, 0.2)';
      scoreBadge.style.color = '#10b981';
      scoreFeedback.textContent = 'Relatively straightforward reporting required. Ensure annual disposal summaries and cost-basis lots are filed on Form 8949.';
    }
  }
}

/* ==========================================================================
   5. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question-btn');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items
      faqItems.forEach(i => i.classList.remove('active'));

      // Toggle current
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}



/* ==========================================================================
   7. PHONE MODAL INTERACTION
   ========================================================================== */
function initPhoneModal() {
  const phoneModal = document.getElementById('phoneModal');
  const triggerBtns = document.querySelectorAll('[data-trigger-phone]');
  const closeBtn = document.getElementById('closePhoneModal');

  if (!phoneModal) return;

  triggerBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      phoneModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    phoneModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  phoneModal.addEventListener('click', (e) => {
    if (e.target === phoneModal) {
      closeModal();
    }
  });
}
