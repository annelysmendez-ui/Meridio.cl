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

  // 4. Filtrado combinado por pilares y buscador de servicios
  const filterButtons = document.querySelectorAll('.pillar-btn');
  const pillarSections = document.querySelectorAll('[data-pillar-section]');
  const solutionCards = document.querySelectorAll('.solution-card');
  const searchInput = document.getElementById('svcSearch');
  const emptyState = document.getElementById('svcEmpty');

  let activePillar = 'all';
  let searchQuery = '';

  const normalizeText = (str) =>
    (str || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

  const applyCatalogFilters = () => {
    let totalVisible = 0;

    solutionCards.forEach(card => {
      const cardPillar = card.dataset.pillar || '';
      const searchable = normalizeText(
        (card.dataset.search || '') + ' ' + (card.textContent || '')
      );

      const matchesPillar = activePillar === 'all' || cardPillar === activePillar;
      const matchesSearch = !searchQuery || searchable.includes(searchQuery);

      if (matchesPillar && matchesSearch) {
        card.style.display = '';
        totalVisible++;
      } else {
        card.style.display = 'none';
      }
    });

    pillarSections.forEach(sec => {
      const secPillar = sec.dataset.pillarSection;
      const visibleInSec = Array.from(sec.querySelectorAll('.solution-card')).some(
        c => c.style.display !== 'none'
      );

      if ((activePillar === 'all' || secPillar === activePillar) && visibleInSec) {
        sec.style.display = '';
      } else {
        sec.style.display = 'none';
      }
    });

    if (emptyState) {
      emptyState.hidden = totalVisible > 0;
    }
  };

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activePillar = btn.dataset.pillar || 'all';

      // Al presionar un botón de filtro, limpia el buscador automáticamente
      if (searchInput && searchInput.value !== '') {
        searchInput.value = '';
        searchQuery = '';
      }

      applyCatalogFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchQuery = normalizeText(e.target.value);
      applyCatalogFilters();
    });
  }

  // Soporte para parámetro ?pilar= en la URL (ej. desde enlaces del footer)
  if (filterButtons.length > 0) {
    const urlParams = new URLSearchParams(window.location.search);
    const initialPillar = urlParams.get('pilar');
    if (initialPillar) {
      const targetBtn = Array.from(filterButtons).find(b => b.dataset.pillar === initialPillar);
      if (targetBtn) {
        targetBtn.click();
      }
    }
  }

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
    const closeBtns = modal.querySelectorAll('.ficha-modal-close-btn, .btn-cerrar-ficha');
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => closeModal(modal));
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal(modal);
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const activeModal = document.querySelector('.ficha-modal-backdrop.open');
      if (activeModal) closeModal(activeModal);
    }
  });

  // 6. Formulario de Diagnóstico Ejecutivo con Cloudflare Turnstile
  const diagnosticForm = document.getElementById('diagnosticForm');
  if (diagnosticForm) {
    diagnosticForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = diagnosticForm.querySelector('.form-submit-btn');
      const originalText = submitBtn ? submitBtn.textContent : 'Solicitar diagnóstico gratuito';
      
      // Validar token de Cloudflare Turnstile si el widget está activo
      const cfResponse = diagnosticForm.querySelector('[name="cf-turnstile-response"]');
      if (cfResponse && !cfResponse.value) {
        alert('Por favor, complete la verificación de seguridad de Cloudflare antes de enviar.');
        return;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Enviando solicitud...';
      }

      const nombre = document.getElementById('nombre')?.value || '';
      const cargo = document.getElementById('cargo')?.value || '';
      const empresa = document.getElementById('empresa')?.value || '';
      const correo = document.getElementById('correo')?.value || '';
      const telefono = document.getElementById('telefono')?.value || '';
      const tamano = document.getElementById('tamano')?.value || '';
      const comentario = document.getElementById('comentario')?.value || '';
      const preocupaciones = Array.from(diagnosticForm.querySelectorAll('input[name="preocupacion"]:checked'))
        .map(cb => cb.nextElementSibling?.textContent?.trim() || cb.value)
        .join(', ');

      setTimeout(() => {
        const subject = encodeURIComponent(`Solicitud Diagnóstico Ejecutivo — ${empresa}`);
        const body = encodeURIComponent(
          `Nombre: ${nombre}\n` +
          `Cargo: ${cargo}\n` +
          `Empresa: ${empresa}\n` +
          `Correo: ${correo}\n` +
          `Teléfono: ${telefono || 'No especificado'}\n` +
          `Tamaño organización: ${tamano}\n` +
          `Preocupaciones principales: ${preocupaciones || 'No especificadas'}\n` +
          `Comentario: ${comentario || 'Sin comentarios adicionales'}`
        );

        if (submitBtn) {
          submitBtn.textContent = '¡Solicitud registrada con éxito!';
          submitBtn.style.background = '#059669';
        }

        window.location.href = `mailto:csoc@meridio.cl?subject=${subject}&body=${body}`;
        
        setTimeout(() => {
          diagnosticForm.reset();
          if (window.turnstile) {
            window.turnstile.reset();
          }
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
            submitBtn.style.background = '';
          }
        }, 3000);
      }, 400);
    });
  }
});