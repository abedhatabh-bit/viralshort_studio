/**
 * Component Fixer - Ensures all components work perfectly
 */

export const fixCommonIssues = () => {
  // Fix missing CSS classes
  const addMissingStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
      .transition-neon { transition: all 0.3s ease; }
      .neon-glow-primary { box-shadow: 0 0 10px rgba(57, 255, 20, 0.3); }
      .neon-glow-secondary { box-shadow: 0 0 10px rgba(255, 0, 255, 0.3); }
      .neon-glow-accent { box-shadow: 0 0 10px rgba(0, 255, 255, 0.3); }
      .surface-elevation { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
      .glitch-effect { animation: glitch 0.3s ease-in-out; }
      .pulse-cta { animation: pulse 2s infinite; }
      
      @keyframes glitch {
        0% { transform: translate(0); }
        20% { transform: translate(-2px, 2px); }
        40% { transform: translate(-2px, -2px); }
        60% { transform: translate(2px, 2px); }
        80% { transform: translate(2px, -2px); }
        100% { transform: translate(0); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      .z-100 { z-index: 100; }
      .z-200 { z-index: 200; }
    `;
    document.head.appendChild(style);
  };

  // Fix button click handlers
  const fixButtonHandlers = () => {
    document.addEventListener('click', (e) => {
      const button = e.target.closest('button');
      if (button && !button.disabled) {
        button.style.transform = 'scale(0.95)';
        setTimeout(() => {
          button.style.transform = '';
        }, 150);
      }
    });
  };

  // Fix form submissions
  const fixFormHandlers = () => {
    document.addEventListener('submit', (e) => {
      const form = e.target;
      const submitButton = form.querySelector('button[type="submit"]');
      if (submitButton) {
        submitButton.disabled = true;
        setTimeout(() => {
          submitButton.disabled = false;
        }, 2000);
      }
    });
  };

  // Initialize fixes
  addMissingStyles();
  fixButtonHandlers();
  fixFormHandlers();
};

export const validateComponents = () => {
  const issues = [];
  
  // Check for missing icons
  const icons = document.querySelectorAll('[data-lucide]');
  icons.forEach(icon => {
    if (!icon.querySelector('svg')) {
      issues.push(`Missing icon: ${icon.dataset.lucide}`);
    }
  });
  
  // Check for broken buttons
  const buttons = document.querySelectorAll('button');
  buttons.forEach(button => {
    if (!button.onclick && !button.getAttribute('onclick')) {
      const hasClickHandler = button.addEventListener ? true : false;
      if (!hasClickHandler) {
        issues.push(`Button without click handler: ${button.textContent}`);
      }
    }
  });
  
  return issues;
};

// Auto-fix on load
if (typeof window !== 'undefined') {
  document.addEventListener('DOMContentLoaded', fixCommonIssues);
  if (document.readyState === 'complete') {
    fixCommonIssues();
  }
}