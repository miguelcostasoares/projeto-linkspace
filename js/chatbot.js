(function () {
  "use strict";

  /* ----------------------------------------------------------------------
     1. DADOS — contactos e dúvidas organizadas por secções.
        Edite à vontade: adicione/remova secções ou perguntas.
        A resposta aceita HTML simples (links, <b>, <br>).
  ---------------------------------------------------------------------- */
  const CONTACTOS = {
    whatsapp: "351936087431",          // número internacional, só dígitos
    telefoneDisplay: "(+351) 936 087 431",
    telefoneTel: "+351936087431",
    email: "comercial@linkspace.pt",
    morada: "Rua do Carmo, Nº 1 · 4700-309 Braga, Portugal",
    horario: "Seg. a Sex., 9h–18h",
  };

  const SECOES = [
    {
      id: "imoveis",
      titulo: "Comprar / Procurar imóvel",
      icone: "ti-home-search",
      perguntas: [
        {
          q: "Como pesquiso um imóvel no site?",
          a: "Na barra de pesquisa da página inicial pode escolher o <b>tipo de imóvel</b>, a <b>tipologia</b> e a <b>localização</b>. Para afinar, clique em <b>Filtros</b> e defina preço, área, quartos, casas de banho, garagens e estado do imóvel. Depois é só clicar em <b>Buscar Propriedade</b>.",
        },
        {
          q: "Posso procurar por código do imóvel?",
          a: "Sim! Na barra de pesquisa, mude para o separador <b>Código</b>, escreva a referência (ex.: <b>APA_439</b>) e clique em <b>Buscar Propriedade</b>.",
        },
        {
          q: "Não encontro o imóvel que quero. E agora?",
          a: "Pode usar a opção <b>Procuro imóvel</b> e dizer-nos exatamente o que procura — a nossa equipa fica a par e contacta-o assim que houver algo adequado. Ou fale connosco diretamente pelo WhatsApp.",
        },
        {
          q: "Os preços já incluem impostos?",
          a: "Os valores apresentados são o <b>preço do imóvel</b>. À compra acrescem impostos como o <b>IMT</b> e o <b>Imposto do Selo</b>. Use o nosso <b>Simulador de IMT</b> para estimar esses custos.",
        },
      ],
    },
    {
      id: "vender",
      titulo: "Vender / Oferecer imóvel",
      icone: "ti-key",
      perguntas: [
        {
          q: "Quero vender o meu imóvel. Como faço?",
          a: "Use a opção <b>Oferta de imóvel</b> no menu <b>Imóveis</b>. Preenche os dados e a nossa equipa avalia e entra em contacto. Prefere falar já? Contacte-nos pelo WhatsApp ou telefone.",
        },
        {
          q: "Fazem avaliação do imóvel?",
          a: "Sim. Fazemos uma <b>análise de mercado</b> para definir um valor justo e competitivo. Pode pedir através da secção <b>Análise de mercado</b> ou diretamente connosco.",
        },
        {
          q: "Quanto tempo demora a vender?",
          a: "Depende do imóvel, da localização e do mercado. Com uma avaliação correta e divulgação adequada, encurtamos esse tempo ao máximo. Fale connosco para uma estimativa personalizada.",
        },
      ],
    },
    {
      id: "imt",
      titulo: "Simulador de IMT e impostos",
      icone: "ti-calculator",
      perguntas: [
        {
          q: "O que é o IMT?",
          a: "O <b>IMT</b> (Imposto Municipal sobre as Transmissões Onerosas de Imóveis) é um imposto pago na compra de um imóvel em Portugal. O valor depende do preço, do tipo de imóvel e da finalidade (habitação própria, secundária, etc.).",
        },
        {
          q: "Como uso o Simulador de IMT?",
          a: "No menu <b>Imóveis</b>, escolha <b>Simulador de IMT</b>. Introduza o valor e os dados do imóvel e o simulador estima o IMT e o Imposto do Selo a pagar.",
        },
        {
          q: "O valor do simulador é definitivo?",
          a: "É uma <b>estimativa</b> para o ajudar a planear. O valor final é confirmado no momento da escritura. Em caso de dúvida, a nossa equipa esclarece-o.",
        },
      ],
    },
    {
      id: "empresa",
      titulo: "Sobre a LinkSpace",
      icone: "ti-building-community",
      perguntas: [
        {
          q: "Quem é a LinkSpace?",
          a: "Somos uma imobiliária sediada em <b>Braga</b> que facilita a procura pelo imóvel ideal. Conte com mais de <b>500 imóveis</b>, <b>12 anos de experiência</b> e <b>1200+ negócios concluídos</b>. Saiba mais em <b>Quem Somos</b>.",
        },
        {
          q: "Onde ficam e qual o horário?",
          a: `Estamos em <b>${CONTACTOS.morada}</b>.<br>Horário: <b>${CONTACTOS.horario}</b>.`,
        },
        {
          q: "Têm vagas / recrutamento?",
          a: "Sim, estamos sempre à procura de talento. Veja as oportunidades na secção <b>Recrutamento</b> ou envie-nos uma mensagem.",
        },
      ],
    },
    {
      id: "contacto",
      titulo: "Falar com a equipa",
      icone: "ti-headset",
      perguntas: [
        {
          q: "Como falo com um consultor?",
          a: `A forma mais rápida é o <b>WhatsApp</b>. Também pode ligar para <b>${CONTACTOS.telefoneDisplay}</b> ou escrever para <b>${CONTACTOS.email}</b>.`,
        },
        {
          q: "Quais são os vossos contactos?",
          a: `📍 ${CONTACTOS.morada}<br>📞 ${CONTACTOS.telefoneDisplay}<br>✉️ ${CONTACTOS.email}<br>🕐 ${CONTACTOS.horario}`,
        },
      ],
    },
  ];

  const SAUDACAO =
    "Olá! 👋 Sou o assistente virtual da <b>LinkSpace</b>. Escolha um tema abaixo e ajudo-o a esclarecer as suas dúvidas.";

  /* ----------------------------------------------------------------------
     2. CSS — injetado uma única vez. Usa as cores e fontes do site.
  ---------------------------------------------------------------------- */
  const CSS = `
  .ls-chat, .ls-chat * { box-sizing: border-box; }
  .ls-chat {
    --c-laranja:#FF6803; --c-azul:#035BA9; --c-azul-claro:#7F9DB9;
    --c-verde:#11D428; --c-cinza:#323A48; --c-cinza-claro:#ACAFB5;
    --c-bg:#ffffff; --c-bot:#f1f3f7;
    font-family:"Montserrat","Open Sans",sans-serif;
  }

  /* Botão flutuante */
  .ls-chat-fab {
    position:fixed; right:24px; bottom:24px; z-index:99999;
    width:62px; height:62px; border-radius:50%;
    background:linear-gradient(135deg,var(--c-laranja),#ff8a3d);
    color:#fff; cursor:pointer; border:none;
    display:flex; align-items:center; justify-content:center;
    font-size:28px; line-height:1;
    box-shadow:0 10px 28px rgba(255,104,3,.45), 0 4px 10px rgba(0,0,0,.15);
    transition:transform .25s ease, box-shadow .25s ease;
  }
  .ls-chat-fab:hover { transform:translateY(-3px) scale(1.05); box-shadow:0 14px 34px rgba(255,104,3,.55); }
  .ls-chat-fab .ti-x { display:none; }
  .ls-chat.open .ls-chat-fab .ti-message-chatbot { display:none; }
  .ls-chat.open .ls-chat-fab .ti-x { display:block; }
  .ls-chat-fab .ls-pulse {
    position:absolute; inset:0; border-radius:50%;
    background:var(--c-laranja); opacity:.55; z-index:-1;
    animation:ls-pulse 2.2s ease-out infinite;
  }
  .ls-chat.open .ls-pulse { display:none; }
  @keyframes ls-pulse { 0%{transform:scale(1);opacity:.5} 100%{transform:scale(1.9);opacity:0} }

  /* Balão de convite */
  .ls-chat-invite {
    position:fixed; right:24px; bottom:98px; z-index:99998;
    max-width:230px; background:#fff; color:var(--c-cinza);
    padding:13px 38px 13px 15px; border-radius:16px 16px 4px 16px;
    font-size:13px; line-height:1.45; font-weight:500;
    box-shadow:0 14px 34px rgba(0,0,0,.16), 0 4px 12px rgba(0,0,0,.08);
    border:1px solid #eef0f3;
    opacity:0; transform:translateY(14px) scale(.94); pointer-events:none;
    transition:opacity .35s ease, transform .35s cubic-bezier(.22,1,.36,1);
  }
  .ls-chat-invite.show { opacity:1; transform:translateY(0) scale(1); pointer-events:auto; }
  .ls-chat-invite b { color:var(--c-laranja); font-weight:700; }
  .ls-chat-invite { cursor:pointer; }
  .ls-chat-invite::after {
    content:""; position:absolute; right:26px; bottom:-7px;
    width:14px; height:14px; background:#fff; border-right:1px solid #eef0f3; border-bottom:1px solid #eef0f3;
    transform:rotate(45deg);
  }
  .ls-chat-invite .ls-invite-x {
    position:absolute; top:6px; right:8px; background:none; border:none;
    color:var(--c-cinza-claro); font-size:16px; line-height:1; cursor:pointer; padding:2px;
  }
  .ls-chat-invite .ls-invite-x:hover { color:var(--c-cinza); }
  .ls-chat.open .ls-chat-invite { display:none; }
  @media (max-width:480px){ .ls-chat-invite { right:16px; bottom:88px; } }

  /* Janela */
  .ls-chat-window {
    position:fixed; right:24px; bottom:100px; z-index:99999;
    width:380px; max-width:calc(100vw - 32px);
    height:560px; max-height:calc(100vh - 130px);
    background:var(--c-bg); border-radius:22px; overflow:hidden;
    display:flex; flex-direction:column;
    box-shadow:0 24px 60px rgba(0,0,0,.22), 0 8px 20px rgba(0,0,0,.12);
    transform:translateY(18px) scale(.96); opacity:0; pointer-events:none;
    transition:transform .28s cubic-bezier(.22,1,.36,1), opacity .28s ease;
  }
  .ls-chat.open .ls-chat-window { transform:translateY(0) scale(1); opacity:1; pointer-events:auto; }

  /* Cabeçalho */
  .ls-chat-head {
    background:linear-gradient(135deg,var(--c-azul),#0477d4);
    color:#fff; padding:16px 18px; display:flex; align-items:center; gap:12px;
  }
  .ls-chat-head .ls-avatar {
    width:42px; height:42px; border-radius:50%;
    background:rgba(255,255,255,.18); display:flex; align-items:center; justify-content:center;
    font-size:22px; flex-shrink:0;
  }
  .ls-chat-head h4 { margin:0; font-size:15px; font-weight:700; font-family:"Lato",sans-serif; }
  .ls-chat-head p  { margin:2px 0 0; font-size:11.5px; opacity:.85; display:flex; align-items:center; gap:5px; }
  .ls-chat-head p::before { content:""; width:7px; height:7px; border-radius:50%; background:var(--c-verde); box-shadow:0 0 0 3px rgba(17,212,40,.25); }
  .ls-chat-head .ls-close { margin-left:auto; background:none; border:none; color:#fff; font-size:22px; cursor:pointer; opacity:.85; line-height:1; }
  .ls-chat-head .ls-close:hover { opacity:1; }

  /* Ações rápidas (WhatsApp / Ligar / Email) */
  .ls-quick { display:flex; gap:8px; padding:12px 14px; background:#fafbfc; border-bottom:1px solid #eef0f3; }
  .ls-quick a {
    flex:1; text-decoration:none; text-align:center; padding:9px 4px; border-radius:12px;
    font-size:11.5px; font-weight:600; color:#fff; display:flex; flex-direction:column; align-items:center; gap:4px;
    transition:transform .15s ease, filter .15s ease;
  }
  .ls-quick a:hover { transform:translateY(-2px); filter:brightness(1.05); }
  .ls-quick a i { font-size:18px; }
  .ls-q-wa  { background:var(--c-verde); }
  .ls-q-tel { background:var(--c-azul-claro); }
  .ls-q-mail{ background:var(--c-cinza); }

  /* Corpo do chat */
  .ls-chat-body { flex:1; overflow-y:auto; padding:16px 14px; background:var(--c-bg); scroll-behavior:smooth; }
  .ls-chat-body::-webkit-scrollbar { width:6px; }
  .ls-chat-body::-webkit-scrollbar-thumb { background:#d4d8df; border-radius:6px; }

  .ls-msg { display:flex; margin-bottom:12px; animation:ls-in .3s ease both; }
  @keyframes ls-in { from{opacity:0; transform:translateY(8px)} to{opacity:1; transform:translateY(0)} }
  .ls-msg.bot .ls-bubble {
    background:var(--c-bot); color:var(--c-cinza); border-radius:4px 16px 16px 16px;
    padding:11px 14px; font-size:13.5px; line-height:1.5; max-width:88%;
  }
  .ls-msg.user { justify-content:flex-end; }
  .ls-msg.user .ls-bubble {
    background:linear-gradient(135deg,var(--c-laranja),#ff8a3d); color:#fff;
    border-radius:16px 4px 16px 16px; padding:11px 14px; font-size:13.5px; line-height:1.45; max-width:88%;
  }
  .ls-bubble b { font-weight:700; }
  .ls-bubble a { color:var(--c-azul); font-weight:600; }
  .ls-msg.user .ls-bubble a { color:#fff; text-decoration:underline; }

  /* Opções (secções e perguntas) */
  .ls-options { display:flex; flex-direction:column; gap:8px; margin:4px 0 14px; animation:ls-in .3s ease both; }
  .ls-opt {
    text-align:left; background:#fff; border:1.5px solid #e6e9ee; color:var(--c-cinza);
    padding:11px 13px; border-radius:13px; font-size:13px; font-weight:600; cursor:pointer;
    display:flex; align-items:center; gap:10px; font-family:inherit;
    transition:border-color .18s ease, background .18s ease, transform .12s ease;
  }
  .ls-opt:hover { border-color:var(--c-laranja); background:#fff7f1; transform:translateX(3px); }
  .ls-opt i { color:var(--c-laranja); font-size:18px; flex-shrink:0; }
  .ls-opt.secundario i { color:var(--c-azul); }
  .ls-opt.voltar { border-style:dashed; color:var(--c-cinza-claro); font-weight:600; }
  .ls-opt.voltar i { color:var(--c-cinza-claro); }

  /* Indicador "a escrever" */
  .ls-typing { display:flex; gap:4px; padding:12px 14px; background:var(--c-bot); border-radius:4px 16px 16px 16px; width:fit-content; }
  .ls-typing span { width:7px; height:7px; border-radius:50%; background:var(--c-cinza-claro); animation:ls-bounce 1.2s infinite; }
  .ls-typing span:nth-child(2){ animation-delay:.2s } .ls-typing span:nth-child(3){ animation-delay:.4s }
  @keyframes ls-bounce { 0%,60%,100%{transform:translateY(0);opacity:.5} 30%{transform:translateY(-5px);opacity:1} }

  .ls-foot { text-align:center; font-size:10px; color:var(--c-cinza-claro); padding:7px; background:#fafbfc; border-top:1px solid #eef0f3; }

  @media (max-width:480px){
    .ls-chat-window { right:8px; left:8px; bottom:90px; width:auto; height:calc(100vh - 110px); }
    .ls-chat-fab { right:16px; bottom:16px; }
  }
  `;

  /* ----------------------------------------------------------------------
     3. CONSTRUÇÃO DO WIDGET
  ---------------------------------------------------------------------- */
  function init() {
    // garante o ícone-pack Tabler (caso o site não o tenha carregado)
    if (!document.querySelector('link[href*="tabler-icons"]')) {
      const l = document.createElement("link");
      l.rel = "stylesheet";
      l.href = "https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css";
      document.head.appendChild(l);
    }

    const style = document.createElement("style");
    style.textContent = CSS;
    document.head.appendChild(style);

    const root = document.createElement("div");
    root.className = "ls-chat";
    root.innerHTML = `
      <div class="ls-chat-invite" role="button" aria-label="Abrir assistente virtual">
        <button class="ls-invite-x" aria-label="Dispensar">&times;</button>
        <span class="ls-invite-text">Precisa de ajuda? 👋 Estou aqui para esclarecer as suas dúvidas.</span>
      </div>

      <button class="ls-chat-fab" aria-label="Abrir assistente virtual">
        <span class="ls-pulse"></span>
        <i class="ti ti-message-chatbot"></i>
        <i class="ti ti-x"></i>
      </button>

      <div class="ls-chat-window" role="dialog" aria-label="Assistente virtual LinkSpace">
        <div class="ls-chat-head">
          <div class="ls-avatar"><i class="ti ti-robot"></i></div>
          <div>
            <h4>Assistente LinkSpace</h4>
            <p>Online · responde já</p>
          </div>
          <button class="ls-close" aria-label="Fechar">&times;</button>
        </div>

        <div class="ls-quick">
          <a class="ls-q-wa" href="https://wa.me/${CONTACTOS.whatsapp}?text=${encodeURIComponent(
            "Olá! Vim do site da LinkSpace e gostaria de mais informações."
          )}" target="_blank" rel="noopener">
            <i class="ti ti-brand-whatsapp"></i> WhatsApp
          </a>
          <a class="ls-q-tel" href="tel:${CONTACTOS.telefoneTel}">
            <i class="ti ti-phone"></i> Ligar
          </a>
          <a class="ls-q-mail" href="mailto:${CONTACTOS.email}">
            <i class="ti ti-mail"></i> Email
          </a>
        </div>

        <div class="ls-chat-body" id="lsBody"></div>
        <div class="ls-foot">Respostas automáticas · LinkSpace</div>
      </div>
    `;
    document.body.appendChild(root);

    const fab = root.querySelector(".ls-chat-fab");
    const closeBtn = root.querySelector(".ls-close");
    const body = root.querySelector("#lsBody");
    let started = false;

    function toggle(forceOpen) {
      const willOpen = forceOpen !== undefined ? forceOpen : !root.classList.contains("open");
      root.classList.toggle("open", willOpen);
      if (willOpen && typeof esconderConvite === "function") esconderConvite();
      if (willOpen && !started) {
        started = true;
        botMsg(SAUDACAO, () => showSecoes());
      }
    }
    fab.addEventListener("click", () => toggle());
    closeBtn.addEventListener("click", () => toggle(false));

    /* --- balão de convite periódico --- */
    const invite = root.querySelector(".ls-chat-invite");
    const inviteX = root.querySelector(".ls-invite-x");
    let inviteHideTimer = null;
    let inviteCycleTimer = null;
    let inviteDismissed = false;   // se o utilizador fechar o balão, não reaparece nesta visita

    const PRIMEIRA_VEZ = 25000;    // 25s até ao primeiro convite
    const INTERVALO    = 90000;    // ~90s entre convites
    const VISIVEL      = 9000;     // fica 9s no ecrã

    function mostrarConvite() {
      if (inviteDismissed || root.classList.contains("open")) return;
      invite.classList.add("show");
      clearTimeout(inviteHideTimer);
      inviteHideTimer = setTimeout(() => invite.classList.remove("show"), VISIVEL);
    }
    function esconderConvite() { invite.classList.remove("show"); clearTimeout(inviteHideTimer); }

    inviteCycleTimer = setTimeout(function loop() {
      mostrarConvite();
      inviteCycleTimer = setTimeout(loop, INTERVALO);
    }, PRIMEIRA_VEZ);

    invite.addEventListener("click", () => { esconderConvite(); toggle(true); });
    inviteX.addEventListener("click", (e) => {
      e.stopPropagation();
      inviteDismissed = true;
      esconderConvite();
      clearTimeout(inviteCycleTimer);
    });

    /* --- helpers de UI --- */
    function scrollDown() { body.scrollTop = body.scrollHeight; }

    function botMsg(html, done) {
      const typing = document.createElement("div");
      typing.className = "ls-msg bot";
      typing.innerHTML = `<div class="ls-typing"><span></span><span></span><span></span></div>`;
      body.appendChild(typing);
      scrollDown();
      setTimeout(() => {
        typing.remove();
        const m = document.createElement("div");
        m.className = "ls-msg bot";
        m.innerHTML = `<div class="ls-bubble">${html}</div>`;
        body.appendChild(m);
        scrollDown();
        if (done) done();
      }, 480);
    }

    function userMsg(text) {
      const m = document.createElement("div");
      m.className = "ls-msg user";
      m.innerHTML = `<div class="ls-bubble">${text}</div>`;
      body.appendChild(m);
      scrollDown();
    }

    function clearOptions() {
      body.querySelectorAll(".ls-options").forEach((o) => o.remove());
    }

    function renderOptions(items) {
      clearOptions();
      const wrap = document.createElement("div");
      wrap.className = "ls-options";
      items.forEach((it) => {
        const btn = document.createElement("button");
        btn.className = "ls-opt" + (it.cls ? " " + it.cls : "");
        btn.innerHTML = `<i class="ti ${it.icone}"></i><span>${it.label}</span>`;
        btn.addEventListener("click", it.onClick);
        wrap.appendChild(btn);
      });
      body.appendChild(wrap);
      scrollDown();
    }

    /* --- fluxos --- */
    function showSecoes() {
      renderOptions(
        SECOES.map((s) => ({
          label: s.titulo,
          icone: s.icone,
          onClick: () => abrirSecao(s),
        }))
      );
    }

    function abrirSecao(secao) {
      clearOptions();
      userMsg(secao.titulo);
      botMsg(`Sobre <b>${secao.titulo.toLowerCase()}</b>, qual é a sua dúvida?`, () => {
        const items = secao.perguntas.map((p) => ({
          label: p.q,
          icone: "ti-help-circle",
          cls: "secundario",
          onClick: () => responder(secao, p),
        }));
        items.push({
          label: "Voltar aos temas",
          icone: "ti-arrow-left",
          cls: "voltar",
          onClick: () => { clearOptions(); showSecoes(); },
        });
        renderOptions(items);
      });
    }

    function responder(secao, pergunta) {
      clearOptions();
      userMsg(pergunta.q);
      botMsg(pergunta.a, () => {
        renderOptions([
          {
            label: "Outra dúvida deste tema",
            icone: "ti-list",
            cls: "secundario",
            onClick: () => { clearOptions(); abrirSecaoPerguntas(secao); },
          },
          {
            label: "Ver outros temas",
            icone: "ti-layout-grid",
            onClick: () => { clearOptions(); showSecoes(); },
          },
          {
            label: "Falar por WhatsApp",
            icone: "ti-brand-whatsapp",
            onClick: () => {
              window.open(
                `https://wa.me/${CONTACTOS.whatsapp}?text=${encodeURIComponent(
                  "Olá! Continuo com dúvidas sobre: " + pergunta.q
                )}`,
                "_blank"
              );
            },
          },
        ]);
      });
    }

    // reabre a lista de perguntas sem repetir a mensagem do bot
    function abrirSecaoPerguntas(secao) {
      const items = secao.perguntas.map((p) => ({
        label: p.q, icone: "ti-help-circle", cls: "secundario",
        onClick: () => responder(secao, p),
      }));
      items.push({
        label: "Voltar aos temas", icone: "ti-arrow-left", cls: "voltar",
        onClick: () => { clearOptions(); showSecoes(); },
      });
      renderOptions(items);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();