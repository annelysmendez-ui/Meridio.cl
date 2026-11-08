(() => {
  const menuButton = document.getElementById('mobileMenu');
  const nav = document.getElementById('mainNav');
  const yearEl = document.getElementById('year');
  const dropdown = document.getElementById('aboutDropdown');
  const dropdownBtn = document.getElementById('dropdownTrigger');

  // Cerrar menú desplegable
  const closeDropdown = () => {
    if (!dropdown || !dropdownBtn) return;
    dropdown.classList.remove('open');
    dropdownBtn.setAttribute('aria-expanded', 'false');
  };

  // Alternar apertura fija por clic
  if (dropdownBtn && dropdown) {
    dropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = dropdown.classList.toggle('open');
      dropdownBtn.setAttribute('aria-expanded', String(isOpen));
    });
  }

  // Cerrar navegación responsive
  const closeMenu = () => {
    if (!nav || !menuButton) return;
    nav.classList.remove('open');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Abrir menú');
    closeDropdown();
  };

  if (menuButton && nav) {
    menuButton.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
      menuButton.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
    });

    // Cerrar el menú responsive o dropdown al hacer clic en cualquier link interno/externo
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        closeDropdown();
        closeMenu();
      });
    });

    // Cerrar al pulsar Escape
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        closeDropdown();
        closeMenu();
      }
    });

    // Cerrar dropdown al hacer clic en cualquier otro lado de la pantalla
    document.addEventListener('click', (event) => {
      if (dropdown && !dropdown.contains(event.target)) {
        closeDropdown();
      }
      if (!nav.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }
    });
  }

  // Manejo de modales para fichas técnicas completas en Soluciones
  const fichaTriggers = document.querySelectorAll('.btn-ficha-trigger');
  const fichaBackdrops = document.querySelectorAll('.ficha-modal-backdrop');

  const openFicha = (targetId) => {
    const modal = document.getElementById(targetId);
    if (!modal) return;
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  const closeFichas = () => {
    fichaBackdrops.forEach(modal => {
      modal.classList.remove('open');
    });
    document.body.style.overflow = '';
  };

  if (fichaTriggers.length > 0) {
    fichaTriggers.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target');
        openFicha(targetId);
      });
    });

    fichaBackdrops.forEach(modal => {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          closeFichas();
        }
      });
      const closeBtn = modal.querySelector('.ficha-modal-close-btn');
      const closeLink = modal.querySelector('.btn-cerrar-ficha');
      if (closeBtn) closeBtn.addEventListener('click', closeFichas);
      if (closeLink) closeLink.addEventListener('click', closeFichas);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeFichas();
      }
    });
  }

  // Filtrado reactivo por pestaña de pilar y buscador en tiempo real (Soluciones)
  const catalogTabs = document.querySelectorAll('.catalog-tab');
  const searchInput = document.getElementById('catalogSearchInput');
  const solutionCards = document.querySelectorAll('.solution-card[data-pilar]');
  const countEl = document.getElementById('resultsCount');
  const emptyState = document.getElementById('catalogEmptyState');

  if (catalogTabs.length > 0 && solutionCards.length > 0) {
    let currentPillar = 'all';
    let searchQuery = '';

    const filterCards = () => {
      let visibleCount = 0;
      const q = searchQuery.toLowerCase().trim();

      solutionCards.forEach(card => {
        const cardPilar = card.getAttribute('data-pilar');
        const cardText = card.textContent.toLowerCase();

        const matchesPillar = (currentPillar === 'all' || cardPilar === currentPillar);
        const matchesSearch = (!q || cardText.includes(q));

        if (matchesPillar && matchesSearch) {
          card.style.display = 'flex';
          visibleCount++;
        } else {
          card.style.display = 'none';
        }
      });

      if (countEl) {
        countEl.textContent = `${visibleCount} soluciones disponibles`;
      }

      if (emptyState) {
        emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
      }
    };

    catalogTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        catalogTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        currentPillar = tab.getAttribute('data-pillar');
        filterCards();
      });
    });

    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        filterCards();
      });
    }
  }

  // Año dinámico en footer
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
})();