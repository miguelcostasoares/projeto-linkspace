/* =====================================================================
   LinkSpace — Navegação Mobile (hamburger drawer)
   ---------------------------------------------------------------------
   Progressive enhancement: injeta o botão hamburger + overlay e gere
   abertura/fecho do drawer, acordeão dos dropdowns, foco e teclado.
   Acima de 1024px o CSS esconde tudo isto e a nav inline volta ao
   normal — este script não interfere no comportamento desktop.
   ===================================================================== */
(function () {
  'use strict';

  const DESKTOP_BP = 1024; // sincronizado com responsive.css

  function init() {
    const header = document.querySelector('.header');
    const nav = document.getElementById('nav-header');
    if (!header || !nav) return;

    // Garante uma altura de header consistente para a var CSS --header-h
    const setHeaderVar = () => {
      document.documentElement.style.setProperty(
        '--header-h', header.offsetHeight + 'px'
      );
    };
    setHeaderVar();

    // --- Botão hamburger -------------------------------------------------
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Abrir menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'nav-header');
    toggle.innerHTML = '<span class="bar" aria-hidden="true"></span>';
    // Inserido logo antes do <nav> para ficar à direita da logo
    header.insertBefore(toggle, nav);

    // --- Overlay ---------------------------------------------------------
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    overlay.setAttribute('hidden', '');
    document.body.appendChild(overlay);

    // --- Estado ----------------------------------------------------------
    const openMenu = () => {
      document.body.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Fechar menu');
      overlay.removeAttribute('hidden');
      // foca o primeiro link para navegação por teclado
      const firstLink = nav.querySelector('a, button');
      if (firstLink) firstLink.focus({ preventScroll: true });
    };

    const closeMenu = () => {
      document.body.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menu');
      overlay.setAttribute('hidden', '');
      // fecha qualquer acordeão aberto
      nav.querySelectorAll('.dropdown.open')
        .forEach(d => d.classList.remove('open'));
    };

    const isOpen = () => document.body.classList.contains('nav-open');

    toggle.addEventListener('click', () => (isOpen() ? closeMenu() : openMenu()));
    overlay.addEventListener('click', closeMenu);

    // Fecha com a tecla Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // --- Dropdowns viram acordeão no mobile ------------------------------
    // Só interceptamos o clique no link "pai" do dropdown abaixo do desktop.
    nav.querySelectorAll('.dropdown > .links').forEach((link) => {
      link.addEventListener('click', (e) => {
        if (window.innerWidth >= DESKTOP_BP) return; // desktop = hover, não tocar
        e.preventDefault();
        const parent = link.closest('.dropdown');
        const wasOpen = parent.classList.contains('open');
        // fecha os outros acordeões (comportamento tipo accordion)
        nav.querySelectorAll('.dropdown.open').forEach((d) => {
          if (d !== parent) d.classList.remove('open');
        });
        parent.classList.toggle('open', !wasOpen);
        link.setAttribute('aria-expanded', String(!wasOpen));
      });
    });

    // Fecha o drawer ao clicar num link real de navegação.
    // Excluímos os links "pai" de dropdown (esses só abrem o acordeão).
    nav.querySelectorAll('a[href]').forEach((a) => {
      const isDropdownParent =
        a.classList.contains('links') &&
        a.parentElement &&
        a.parentElement.classList.contains('dropdown');
      if (isDropdownParent) return;
      a.addEventListener('click', () => {
        if (window.innerWidth < DESKTOP_BP) closeMenu();
      });
    });

    // --- Reset ao cruzar para desktop ------------------------------------
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        setHeaderVar();
        if (window.innerWidth >= DESKTOP_BP && isOpen()) closeMenu();
      }, 120);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();