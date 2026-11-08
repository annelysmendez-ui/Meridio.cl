document.addEventListener('DOMContentLoaded', () => {
  // 1. Año dinámico en footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // 2. Menú móvil
  const mobileMenuBtn = document.getElementById('mobileMenu');
  const mainNav = document.getElementById('mainNav');
  if (mobileMenuBtn && mainNav) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
    });
  }

  // 3. Dropdown menú (Quiénes somos)
  const dropdown = document.getElementById('aboutDropdown');
  const dropdownTrigger = document.getElementById('dropdownTrigger');
  if (dropdown && dropdownTrigger) {
    dropdownTrigger.addEventListener('click', (e) => {
      e.stopPropagation();
      const expanded = dropdownTrigger.getAttribute('aria-expanded') === 'true';
      dropdownTrigger.setAttribute('aria-expanded', !expanded);
      dropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active');
        dropdownTrigger.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // 4. Filtrado por pilares
  const filterButtons = document.querySelectorAll('.pillar-btn');
  const pillarSections = document.querySelectorAll('[data-pillar-section]');
  const solutionCards = document.querySelectorAll('.solution-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const pillar = btn.dataset.pillar;

      if (pillar === 'all') {
        pillarSections.forEach(sec => sec.style.display = '');
        solutionCards.forEach(card => card.style.display = '');
      } else {
        pillarSections.forEach(sec => {
          if (sec.dataset.pillarSection === pillar) {
            sec.style.display = '';
          } else {
            sec.style.display = 'none';
          }
        });

        solutionCards.forEach(card => {
          if (card.dataset.pillar === pillar) {
            card.style.display = '';
          } else {
            card.style.display = 'none';
          }
        });
      }
    });
  });

  // 5. Modales de Fichas Técnicas
  const modalTriggers = document.querySelectorAll('.btn-ficha-trigger');
  const modalBackdrops = document.querySelectorAll('.ficha-modal-backdrop');

  const openModal = (modalId) => {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  };

  const closeModal = (modal) => {
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  modalTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
      const targetId = trigger.getAttribute('data-target');
      if (targetId) openModal(targetId);
    });
  });

  modalBackdrops.forEach(modal => {
    // Cerrar con botón X o botón Cerrar
    const closeBtns = modal.querySelectorAll('.ficha-modal-close-btn, .btn-cerrar-ficha');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => closeModal(modal));
    });

    // Cerrar al hacer clic fuera de la caja
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.ficha-modal-backdrop.open');
      if (activeModal) closeModal(activeModal);
    }
  });
});