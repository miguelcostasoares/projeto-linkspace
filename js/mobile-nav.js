/* =====================================================================
   LinkSpace — Navegação Mobile v2 (drawer corrigido)
   =====================================================================
   Fixes v2:
   - html.nav-open em vez de body.nav-open (controlo de overflow funciona
     correctamente no Chrome Android ao nível do <html>)
   - Overlay sem [hidden] (atributo HTML que força display:none e causa
     reflow que bloqueava o primeiro toque no drawer)
   - z-index correcto: overlay=1040, drawer=1050, toggle=1100
   - -webkit-tap-highlight-color: transparent nos elementos interactivos
   ===================================================================== */
(function () {
  'use strict';

  const DESKTOP_BP = 1024;

  function init() {
    const header = document.querySelector('.header');
    const nav    = document.getElementById('nav-header');
    if (!header || !nav) return;

    /* ── Mede e expõe a altura real do header ── */
    const syncHeaderHeight = () => {
      document.documentElement.style.setProperty(
        '--header-h', header.offsetHeight + 'px'
      );
    };
    syncHeaderHeight();

    /* ── Botão hamburger ──────────────────────────────────────────── */
    const toggle = document.createElement('button');
    toggle.className  = 'nav-toggle';
    toggle.type       = 'button';
    toggle.setAttribute('aria-label',    'Abrir menu');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-controls', 'nav-header');
    toggle.innerHTML  = '<span class="bar" aria-hidden="true"></span>';
    header.insertBefore(toggle, nav);

    /* ── Overlay ──────────────────────────────────────────────────── */
    const overlay = document.createElement('div');
    overlay.className = 'nav-overlay';
    /* NÃO usar [hidden] — causes display:none/block transitions que
       bloqueiam o primeiro toque. Controlamos só com CSS (opacity +
       pointer-events via html.nav-open). */
    document.body.appendChild(overlay);

    /* ── Helpers de estado ───────────────────────────────────────── */
    const root   = document.documentElement; // <html>
    const isOpen = () => root.classList.contains('nav-open');

    const openMenu = () => {
      root.classList.add('nav-open');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label',    'Fechar menu');
      /* Foca o primeiro item do drawer para utilizadores de teclado */
      const firstFocusable = nav.querySelector('a, button');
      if (firstFocusable) firstFocusable.focus({ preventScroll: true });
    };

    const closeMenu = () => {
      root.classList.remove('nav-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label',    'Abrir menu');
      /* Colapsa todos os acordeões abertos */
      nav.querySelectorAll('.dropdown.open').forEach(d => {
        d.classList.remove('open');
        const trigger = d.querySelector('.links');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    };

    /* ── Eventos do botão e overlay ─────────────────────────────── */
    toggle.addEventListener('click', () => isOpen() ? closeMenu() : openMenu());
    overlay.addEventListener('click', closeMenu);

    /* Escape fecha o drawer e devolve o foco ao botão */
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    /* ── Dropdowns = acordeão (apenas abaixo do breakpoint desktop) ── */
    nav.querySelectorAll('.dropdown > .links').forEach(link => {
      link.addEventListener('click', e => {
        if (window.innerWidth >= DESKTOP_BP) return;
        e.preventDefault();

        const parent  = link.closest('.dropdown');
        const wasOpen = parent.classList.contains('open');

        /* Fecha outros acordeões */
        nav.querySelectorAll('.dropdown.open').forEach(d => {
          if (d !== parent) {
            d.classList.remove('open');
            const t = d.querySelector('.links');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });

        parent.classList.toggle('open', !wasOpen);
        link.setAttribute('aria-expanded', String(!wasOpen));
      });
    });

    /* Fecha o drawer quando se clica num link de destino final */
    nav.querySelectorAll('a[href]').forEach(a => {
      const isParentToggle =
        a.classList.contains('links') &&
        a.parentElement?.classList.contains('dropdown');
      if (isParentToggle) return;

      a.addEventListener('click', () => {
        if (window.innerWidth < DESKTOP_BP) closeMenu();
      });
    });

    /* ── Resize: fecha drawer e actualiza altura do header ──────── */
    let rTimer;
    window.addEventListener('resize', () => {
      clearTimeout(rTimer);
      rTimer = setTimeout(() => {
        syncHeaderHeight();
        if (window.innerWidth >= DESKTOP_BP && isOpen()) closeMenu();
      }, 100);
    });
  }

  /* Executa após o DOM estar pronto */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();