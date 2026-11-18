/**
 * DUSTBURN - Main Application Coordinator
 * Control de modales, notificaciones, menús y formularios
 */
(function() {
  // Toast Notification System
  function showToast(message, duration = 3500) {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<i class="fas fa-fire text-fire"></i> <span>${message}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateX(100%)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, duration);
  }

  // Modals management
  function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add('active');
  }

  function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove('active');
  }

  document.addEventListener('DOMContentLoaded', () => {
    // Modal Close buttons
    const closeButtons = document.querySelectorAll('.modal-close-btn, .btn-modal-cancel');
    closeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal-overlay');
        if (modal) modal.classList.remove('active');
      });
    });

    // Close on click outside
    const overlays = document.querySelectorAll('.modal-overlay');
    overlays.forEach(overlay => {
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) overlay.classList.remove('active');
      });
    });

    // Register Burner Form
    const registerForm = document.getElementById('register-burner-form');
    if (registerForm) {
      registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          nick: document.getElementById('reg-nick').value,
          steamId: document.getElementById('reg-steam').value,
          discord: document.getElementById('reg-discord').value,
          role: document.getElementById('reg-role').value,
          favChar: document.getElementById('reg-char').value,
          hours: document.getElementById('reg-hours').value,
          kickRank: document.getElementById('reg-kick-rank').value,
          motto: document.getElementById('reg-motto').value
        };

        if (window.BurnersCommunity && window.BurnersCommunity.registerBurner(data)) {
          closeModal('modal-register');
          registerForm.reset();
        }
      });
    }

    // Create Lobby Form
    const lobbyForm = document.getElementById('create-lobby-form');
    if (lobbyForm) {
      lobbyForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const data = {
          title: document.getElementById('lobby-title-input').value,
          mode: document.getElementById('lobby-mode-input').value,
          campaign: document.getElementById('lobby-campaign-input').value,
          difficulty: document.getElementById('lobby-diff-input').value,
          serverIp: document.getElementById('lobby-ip-input').value
        };

        if (window.L4D2Lobbies) {
          window.L4D2Lobbies.createLobby(data);
          closeModal('modal-create-lobby');
          lobbyForm.reset();
        }
      });
    }

    // Open Register modal buttons
    const openRegisterBtns = document.querySelectorAll('.btn-open-register');
    openRegisterBtns.forEach(b => {
      b.addEventListener('click', () => openModal('modal-register'));
    });

    // Open Create Lobby buttons
    const openCreateLobbyBtns = document.querySelectorAll('.btn-open-create-lobby');
    openCreateLobbyBtns.forEach(b => {
      b.addEventListener('click', () => openModal('modal-create-lobby'));
    });

    // Mobile nav toggle
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');
    if (mobileBtn && navLinks) {
      mobileBtn.addEventListener('click', () => {
        const isShown = navLinks.style.display === 'flex';
        navLinks.style.display = isShown ? 'none' : 'flex';
        if (!isShown) {
          navLinks.style.flexDirection = 'column';
          navLinks.style.position = 'absolute';
          navLinks.style.top = '76px';
          navLinks.style.left = '0';
          navLinks.style.right = '0';
          navLinks.style.background = 'rgba(10, 10, 14, 0.98)';
          navLinks.style.padding = '20px';
          navLinks.style.borderBottom = '1px solid var(--border-color)';
        }
      });
    }

    // Export CSV button
    const exportBtn = document.getElementById('btn-export-csv');
    if (exportBtn && window.BurnersCommunity) {
      exportBtn.addEventListener('click', () => window.BurnersCommunity.exportCSV());
    }
  });

  window.DustburnApp = {
    showToast,
    openModal,
    closeModal
  };
})();
