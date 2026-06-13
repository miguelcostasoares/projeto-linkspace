/**
 * LinkSpace CRM — dashboard.js
 * Cobre: sidebar, submenus, charts, KPI counters, live feed, notificações.
 */

'use strict';

/* ==========================================================================
   UTILITÁRIOS
   ========================================================================== */

/**
 * Formata um número como moeda PT (€ 1.120.000 ou 12,4%)
 * @param {number} value
 * @param {string} type  'currency' | 'percent' | 'integer'
 */
function formatValue(value, type) {
  if (type === 'currency') {
    return '€ ' + value.toLocaleString('pt-PT');
  }
  if (type === 'percent') {
    return value.toLocaleString('pt-PT', { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + '%';
  }
  return value.toLocaleString('pt-PT');
}

/**
 * Detecta o tipo de valor a partir do texto original do elemento
 */
function detectValueType(text) {
  if (text.includes('€')) return 'currency';
  if (text.includes('%')) return 'percent';
  return 'integer';
}

/**
 * Extrai o valor numérico de uma string como "€ 1.120.000" ou "12,4%"
 */
function parseNumericValue(text) {
  // Remove o símbolo € e espaços, troca vírgula decimal por ponto
  const clean = text.replace(/€\s*/g, '').replace(/\./g, '').replace(',', '.').trim();
  return parseFloat(clean);
}

/* ==========================================================================
   1. SIDEBAR — TOGGLE MOBILE + SUBMENUS
   ========================================================================== */

(function initSidebar() {
  const sidebar     = document.getElementById('sidebar');
  const toggleBtn   = document.getElementById('sidebarToggle');
  const toggleItems = document.querySelectorAll('.sidebar__item.has-submenu');

  if (!sidebar || !toggleBtn) return;

  /* ---- Toggle off-canvas (mobile) ---- */
  toggleBtn.addEventListener('click', () => {
    const isOpen = sidebar.classList.toggle('is-open');
    toggleBtn.setAttribute('aria-expanded', String(isOpen));
  });

  /* Fechar ao clicar fora da sidebar */
  document.addEventListener('click', (e) => {
    if (
      sidebar.classList.contains('is-open') &&
      !sidebar.contains(e.target) &&
      e.target !== toggleBtn
    ) {
      sidebar.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });

  /* Fechar com Escape */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      sidebar.classList.remove('is-open');
      toggleBtn.setAttribute('aria-expanded', 'false');
      toggleBtn.focus();
    }
  });

  /* ---- Submenus com accordion ---- */
  toggleItems.forEach((item) => {
    const btn     = item.querySelector('.sidebar__toggle');
    const submenu = item.querySelector('.sidebar__submenu');
    if (!btn || !submenu) return;

    /* Acessibilidade: ID único para aria-controls */
    const uid = 'submenu-' + Math.random().toString(36).slice(2, 7);
    submenu.id = uid;
    btn.setAttribute('aria-controls', uid);
    btn.setAttribute('aria-expanded', 'false');

    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('is-open');

      /* Fecha todos os outros submenus (accordion) */
      toggleItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove('is-open');
          const otherBtn = other.querySelector('.sidebar__toggle');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
        }
      });

      item.classList.toggle('is-open', willOpen);
      btn.setAttribute('aria-expanded', String(willOpen));
    });
  });
})();

/* ==========================================================================
   2. KPI — CONTADOR PROGRESSIVO
   ========================================================================== */

(function initKpiCounters() {
  const duration = 900; // ms
  const fps      = 60;
  const steps    = Math.round(duration / (1000 / fps));

  document.querySelectorAll('.kpi-card__value').forEach((el) => {
    const original  = el.textContent.trim();
    const type      = detectValueType(original);
    const target    = parseNumericValue(original);

    if (isNaN(target)) return;

    let step = 0;

    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      // Easing: ease-out cubic
      const eased  = 1 - Math.pow(1 - progress, 3);
      const current = target * eased;

      el.textContent = formatValue(
        type === 'percent' ? Math.round(current * 10) / 10 : Math.round(current),
        type
      );

      if (step >= steps) {
        clearInterval(timer);
        el.textContent = original; // garante o valor exato original
      }
    }, 1000 / fps);
  });
})();

/* ==========================================================================
   3. CHARTS — CHART.JS
   ========================================================================== */

(function initCharts() {
  if (typeof Chart === 'undefined') {
    console.warn('LinkSpace: Chart.js não foi carregado.');
    return;
  }

  /* Paleta da marca */
  const palette = {
    orange     : '#FF6803',
    blue       : '#035BA9',
    navy       : '#323A48',
    green      : '#11D428',
    lightGray  : '#E6E8EE',
    textSecond : '#8B93A7',
    white      : '#ffffff',

    orangeAlpha : (a) => `rgba(255,104,3,${a})`,
    blueAlpha   : (a) => `rgba(3,91,169,${a})`,
    navyAlpha   : (a) => `rgba(50,58,72,${a})`,
    greenAlpha  : (a) => `rgba(17,212,40,${a})`,
  };

  /* Fonte padrão */
  Chart.defaults.font.family = "'Lato', 'Montserrat', sans-serif";
  Chart.defaults.color       = palette.textSecond;

  /* ------------------------------------------------------------------ */
  /* 3a. GRÁFICO DE LINHA — Vendas por Mês                             */
  /* ------------------------------------------------------------------ */
  const canvasVendas = document.getElementById('chartVendas');
  if (canvasVendas) {
    const labels = JSON.parse(canvasVendas.dataset.labels || '[]');
    const values = JSON.parse(canvasVendas.dataset.values || '[]');

    const ctx = canvasVendas.getContext('2d');

    /* Gradiente de área sob a linha */
    const areaGradient = ctx.createLinearGradient(0, 0, 0, 280);
    areaGradient.addColorStop(0,   palette.orangeAlpha(0.22));
    areaGradient.addColorStop(0.7, palette.orangeAlpha(0.06));
    areaGradient.addColorStop(1,   palette.orangeAlpha(0));

    new Chart(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label          : 'Vendas (€)',
          data           : values,
          borderColor    : palette.orange,
          borderWidth    : 2.5,
          backgroundColor: areaGradient,
          fill           : true,
          tension        : 0.4,           // curva suave
          pointBackgroundColor : palette.orange,
          pointBorderColor     : palette.white,
          pointBorderWidth     : 2,
          pointRadius          : 5,
          pointHoverRadius     : 7,
          pointHoverBackgroundColor: palette.orange,
          pointHoverBorderColor    : palette.white,
          pointHoverBorderWidth    : 2,
        }]
      },
      options: {
        responsive : true,
        maintainAspectRatio: false,
        interaction: {
          mode     : 'index',
          intersect: false,
        },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: palette.navy,
            titleFont : { size: 13, weight: '700' },
            bodyFont  : { size: 12 },
            padding   : 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => ' ' + formatValue(ctx.parsed.y, 'currency'),
            }
          }
        },
        scales: {
          x: {
            grid : { display: false },
            border: { display: false },
            ticks: { font: { size: 12, weight: '600' } }
          },
          y: {
            grid: {
              color    : palette.lightGray,
              drawTicks: false,
            },
            border: { display: false, dash: [4, 4] },
            ticks: {
              padding  : 8,
              font     : { size: 11 },
              callback : (v) => '€ ' + (v / 1000) + 'k',
            }
          }
        },
        animation: {
          duration : 900,
          easing   : 'easeOutQuart',
        }
      }
    });
  }

  /* ------------------------------------------------------------------ */
  /* 3b. DOUGHNUT — Leads por Origem                                    */
  /* ------------------------------------------------------------------ */
  const canvasLeads = document.getElementById('chartLeadsFonte');
  if (canvasLeads) {
    const labels = JSON.parse(canvasLeads.dataset.labels || '[]');
    const values = JSON.parse(canvasLeads.dataset.values || '[]');

    const colors = [
      palette.orange,
      palette.blue,
      palette.navy,
      palette.green,
      palette.textSecond,
    ];

    const total = values.reduce((a, b) => a + b, 0);

    new Chart(canvasLeads, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data            : values,
          backgroundColor : colors,
          borderColor     : colors,   // mesma cor → sem linha de separação visível
          borderWidth     : 0,        // elimina o espaçamento branco entre fatias
          hoverOffset     : 6,
          hoverBorderWidth: 0,
        }]
      },
      options: {
        responsive : true,
        maintainAspectRatio: false,
        cutout     : '55%',           // anel mais espesso (era 68%)
        plugins: {
          legend: { display: false }, // legenda customizada abaixo
          tooltip: {
            backgroundColor: palette.navy,
            titleFont : { size: 13, weight: '700' },
            bodyFont  : { size: 12 },
            padding   : 12,
            cornerRadius: 10,
            callbacks: {
              label: (ctx) => {
                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                return ` ${ctx.parsed} leads (${pct}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate : true,
          duration      : 900,
          easing        : 'easeOutQuart',
        }
      }
    });

    /* ---- Legenda customizada ---- */
    const legendEl = document.getElementById('legendLeadsFonte');
    if (legendEl) {
      labels.forEach((label, i) => {
        const pct = ((values[i] / total) * 100).toFixed(0);
        const li  = document.createElement('li');
        li.style.setProperty('--legend-color', colors[i]);
        li.textContent = `${label} — ${pct}%`;
        legendEl.appendChild(li);
      });
    }
  }
})();

/* ==========================================================================
   4. TOPBAR — BOTÃO DE NOTIFICAÇÕES
   ========================================================================== */

(function initNotifications() {
  const btn     = document.querySelector('.topbar__icon-btn[aria-label="Notificações"]');
  const badgeDot = btn ? btn.querySelector('.badge-dot') : null;
  if (!btn) return;

  btn.addEventListener('click', () => {
    /* Remove o indicador visual ao clicar (simula "lido") */
    if (badgeDot) {
      badgeDot.style.opacity = '0';
      badgeDot.style.transform = 'scale(0)';
      badgeDot.style.transition = 'opacity .2s ease, transform .2s ease';
    }

    /* Aqui podes ligar a um painel real de notificações no futuro */
    console.info('LinkSpace: painel de notificações (a implementar)');
  });
})();

/* ==========================================================================
   5. TOPBAR — FILTRO DE PERÍODO (preparado para expansão)
   ========================================================================== */

(function initPeriodFilter() {
  const select = document.querySelector('.topbar__period select');
  if (!select) return;

  select.addEventListener('change', () => {
    const period = select.value;
    /* Emite um evento customizado que futuras secções podem escutar */
    document.dispatchEvent(new CustomEvent('ls:periodChange', { detail: { period } }));
    console.info('LinkSpace: período alterado para —', period);
  });
})();

/* ==========================================================================
   6. LIVE FEED — SIMULA NOVOS EVENTOS NO FEED DE ATIVIDADE
   Adiciona um item real ao feed a cada ~30 s para dar sensação de "tempo real".
   ========================================================================== */

(function initLiveFeed() {
  const feed = document.querySelector('.activity-feed');
  if (!feed) return;

  const events = [
    {
      icon : 'ti ti-user-plus',
      color: 'blue',
      html : '<strong>Novo lead</strong> via Imovirtual: Rui Alves demonstrou interesse no T3 de Palmeira',
    },
    {
      icon : 'ti ti-phone-call',
      color: 'navy',
      html : '<strong>Bruno Sobral</strong> realizou follow-up com Sara Costa',
    },
    {
      icon : 'ti ti-calendar-event',
      color: 'green',
      html : '<strong>Visita confirmada:</strong> Inês Gonçalves confirmou visita à Cobertura T4 (Sé) às 17h30',
    },
    {
      icon : 'ti ti-tag',
      color: 'orange',
      html : '<strong>Hugo Ferreira</strong> atualizou o preço do Terreno em Real para € 115.000',
    },
  ];

  let eventIndex = 0;

  function addFeedItem() {
    const ev = events[eventIndex % events.length];
    eventIndex++;

    const li = document.createElement('li');
    li.className = 'activity-item';
    li.style.opacity    = '0';
    li.style.transform  = 'translateY(-8px)';
    li.style.transition = 'opacity .35s ease, transform .35s ease';

    li.innerHTML = `
      <div class="activity-item__icon activity-item__icon--${ev.color}">
        <i class="${ev.icon}"></i>
      </div>
      <div class="activity-item__body">
        <p>${ev.html}</p>
        <span class="activity-item__time">agora mesmo</span>
      </div>
    `;

    /* Insere no topo do feed */
    feed.insertBefore(li, feed.firstChild);

    /* Anima a entrada */
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        li.style.opacity   = '1';
        li.style.transform = 'translateY(0)';
      });
    });

    /* Remove o último item se o feed ficar muito longo (> 8 itens) */
    const items = feed.querySelectorAll('.activity-item');
    if (items.length > 8) {
      const last = items[items.length - 1];
      last.style.transition = 'opacity .3s ease';
      last.style.opacity    = '0';
      setTimeout(() => last.remove(), 300);
    }

    /* Repõe o badge de notificação */
    const badgeDot = document.querySelector('.badge-dot');
    if (badgeDot) {
      badgeDot.style.opacity   = '1';
      badgeDot.style.transform = 'scale(1)';
    }
  }

  /* Primeiro evento depois de 30 s, depois a cada 45 s */
  setTimeout(() => {
    addFeedItem();
    setInterval(addFeedItem, 45_000);
  }, 30_000);
})();

/* ==========================================================================
   7. DEAL CARDS — ACESSIBILIDADE POR TECLADO (ENTER / SPACE abre detalhes)
   ========================================================================== */

(function initDealCards() {
  document.querySelectorAll('.deal-card').forEach((card) => {
    card.setAttribute('tabindex', '0');
    card.setAttribute('role', 'button');

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        /* Aqui poderá abrir um modal/drawer no futuro */
        card.style.outline = `2px solid var(--cor-destaque)`;
        setTimeout(() => (card.style.outline = ''), 300);
        console.info('LinkSpace: deal card seleccionado —', card.querySelector('h4')?.textContent);
      }
    });
  });
})();

/* ==========================================================================
   8. BOTÃO "NOVO IMÓVEL" — FEEDBACK VISUAL (PLACEHOLDER)
   ========================================================================== */

(function initNewPropertyBtn() {
  const btn = document.querySelector('.btn--primary');
  if (!btn) return;

  btn.addEventListener('click', () => {
    const original = btn.innerHTML;
    btn.innerHTML  = '<i class="ti ti-check"></i><span>Brevemente</span>';
    btn.disabled   = true;
    btn.style.opacity = '0.85';

    setTimeout(() => {
      btn.innerHTML  = original;
      btn.disabled   = false;
      btn.style.opacity = '';
    }, 2000);
  });
})();