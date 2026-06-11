(function () {
    'use strict';

    var SLIDE_INTERVAL = 4000; /* ms entre fotos do slideshow */

    /* ────────────────────────────────────────────────────
       DADOS DAS CIDADES
       - fotos: substitua pelos seus caminhos reais
         (ex.: /images/cidades/lisboa-1.jpg). Se a foto falhar,
         o gradiente temático aparece automaticamente.
       - svg: desenho em traço de um marco da cidade
    ──────────────────────────────────────────────────── */
    var cidades = [
        {
            id: 'vila-verde', nome: 'Vila Verde', regiao: 'Minho', imoveis: 16,
            partir: '149 000 €', tag: 'Campo & tradição', cor: '#6A8B4A', cor2: '#3F5A2B',
            fotos: ['/images/cidades/vila-verde-1.jpg', '/images/cidades/vila-verde-2.jpg', '/images/cidades/vila-verde-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                '<path class="d" pathLength="1" d="M16 132 Q70 100 120 124 T224 120"/>' +            /* colina */
                '<path class="d" pathLength="1" d="M150 132 V92 L178 70 L206 92 V132"/>' +           /* capela corpo */
                '<path class="d" pathLength="1" d="M150 92 H206"/>' +                                /* linha telhado */
                '<line class="d" pathLength="1" x1="178" y1="62" x2="178" y2="74"/>' +               /* cruz vertical */
                '<line class="d" pathLength="1" x1="172" y1="67" x2="184" y2="67"/>' +               /* cruz horizontal */
                '<rect class="d" pathLength="1" x="170" y="106" width="16" height="26" rx="2"/>' +   /* porta */
                '<line class="d" pathLength="1" x1="58" y1="132" x2="58" y2="104"/>' +                /* tronco árvore */
                '<circle class="d" pathLength="1" cx="58" cy="92" r="20"/>' +                        /* copa */
                '<path class="hl" pathLength="1" d="M96 64 q-12 -16 -24 0 q-12 16 24 30 q36 -14 24 -30 q-12 -16 -24 0"/>' + /* coração lenço */
                '<line class="dash" pathLength="1" x1="96" y1="50" x2="96" y2="90"/>' +
                '<line class="ground" pathLength="1" x1="14" y1="132" x2="226" y2="132"/>' +
                '</svg>'
        },
        {
            id: 'braga', nome: 'Braga', regiao: 'Minho', imoveis: 41,
            partir: '210 000 €', tag: 'Barroca & viva', cor: '#C19A3D', cor2: '#8A6A1E',
            fotos: ['/images/cidades/braga-1.jpg', '/images/cidades/braga-2.jpg', '/images/cidades/braga-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* fachada da igreja no topo (Bom Jesus) */
                '<rect class="d" pathLength="1" x="96" y="22" width="48" height="34" rx="2"/>' +
                '<line class="d" pathLength="1" x1="96" y1="22" x2="120" y2="10"/>' +
                '<line class="d" pathLength="1" x1="120" y1="10" x2="144" y2="22"/>' +
                '<line class="d" pathLength="1" x1="92" y1="22" x2="92" y2="56"/>' +
                '<line class="d" pathLength="1" x1="148" y1="22" x2="148" y2="56"/>' +
                '<circle class="d" pathLength="1" cx="120" cy="36" r="6"/>' +
                /* escadaria em zigue-zague barroca */
                '<path class="hl" pathLength="1" d="M120 56 L150 78 L90 100 L150 122 L90 144 L150 160"/>' +
                '<line class="d" pathLength="1" x1="150" y1="78" x2="150" y2="86"/>' +
                '<line class="d" pathLength="1" x1="90" y1="100" x2="90" y2="108"/>' +
                '<line class="d" pathLength="1" x1="150" y1="122" x2="150" y2="130"/>' +
                '<line class="d" pathLength="1" x1="90" y1="144" x2="90" y2="152"/>' +
                /* fontes/estátuas laterais */
                '<circle class="d" pathLength="1" cx="64" cy="92" r="4"/>' +
                '<circle class="d" pathLength="1" cx="176" cy="116" r="4"/>' +
                '<line class="ground" pathLength="1" x1="60" y1="160" x2="180" y2="160"/>' +
                '</svg>'
        },
        {
            id: 'guimaraes', nome: 'Guimarães', regiao: 'Minho', imoveis: 24,
            partir: '185 000 €', tag: 'Berço da nação', cor: '#5A6B4A', cor2: '#37432C',
            fotos: ['/images/cidades/guimaraes-1.jpg', '/images/cidades/guimaraes-2.jpg', '/images/cidades/guimaraes-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* torre de menagem */
                '<path class="d" pathLength="1" d="M98 64 V40 h10 v-10 h10 v10 h10 v-10 h10 v10 h10 v24"/>' +
                '<rect class="d" pathLength="1" x="98" y="64" width="50" height="72"/>' +
                '<line class="d" pathLength="1" x1="120" y1="30" x2="120" y2="14"/>' +        /* mastro */
                '<path class="hl" pathLength="1" d="M120 14 L142 20 L120 26"/>' +             /* bandeira */
                '<path class="d" pathLength="1" d="M118 136 V108 a5 5 0 0 1 10 0 V136"/>' +   /* portão arco */
                '<line class="d" pathLength="1" x1="112" y1="82" x2="112" y2="92"/>' +        /* fresta */
                '<line class="d" pathLength="1" x1="134" y1="82" x2="134" y2="92"/>' +
                /* muralhas laterais com ameias */
                '<path class="d" pathLength="1" d="M44 96 v8 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 v-8 h6"/>' +
                '<line class="d" pathLength="1" x1="44" y1="104" x2="44" y2="136"/>' +
                '<path class="d" pathLength="1" d="M148 96 h6 v8 h8 v-8 h8 v8 h8 v-8 h8 v8 h8 v-8 h8"/>' +
                '<line class="d" pathLength="1" x1="202" y1="104" x2="202" y2="136"/>' +
                '<line class="ground" pathLength="1" x1="40" y1="136" x2="206" y2="136"/>' +
                '</svg>'
        },
        {
            id: 'viana', nome: 'Viana do Castelo', regiao: 'Alto Minho', imoveis: 19,
            partir: '175 000 €', tag: 'Mar & Santa Luzia', cor: '#3A7CA5', cor2: '#214B66',
            fotos: ['/images/cidades/viana-1.jpg', '/images/cidades/viana-2.jpg', '/images/cidades/viana-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* Basílica de Santa Luzia — cúpula central */
                '<path class="hl" pathLength="1" d="M96 80 a24 24 0 0 1 48 0"/>' +
                '<rect class="d" pathLength="1" x="92" y="80" width="56" height="48"/>' +
                '<circle class="d" pathLength="1" cx="120" cy="58" r="6"/>' +                /* lanternim */
                '<circle class="d" pathLength="1" cx="120" cy="100" r="11"/>' +              /* rosácea */
                '<line class="d" pathLength="1" x1="109" y1="100" x2="131" y2="100"/>' +
                '<line class="d" pathLength="1" x1="120" y1="89" x2="120" y2="111"/>' +
                /* torres laterais */
                '<path class="d" pathLength="1" d="M72 90 a12 12 0 0 1 20 0"/>' +
                '<rect class="d" pathLength="1" x="72" y="90" width="20" height="38"/>' +
                '<path class="d" pathLength="1" d="M148 90 a12 12 0 0 1 20 0"/>' +
                '<rect class="d" pathLength="1" x="148" y="90" width="20" height="38"/>' +
                '<path class="d" pathLength="1" d="M118 128 V112 a2 2 0 0 1 4 0 V128"/>' +   /* portal */
                /* mar */
                '<path class="d" pathLength="1" d="M40 146 q12 -7 24 0 t24 0 t24 0 t24 0 t24 0 t24 0"/>' +
                '<line class="ground" pathLength="1" x1="64" y1="128" x2="176" y2="128"/>' +
                '</svg>'
        },
        {
            id: 'porto', nome: 'Porto', regiao: 'Grande Porto', imoveis: 58,
            partir: '290 000 €', tag: 'Ribeira & ferro', cor: '#2C5F7C', cor2: '#163A4E',
            fotos: ['/images/cidades/porto-1.jpg', '/images/cidades/porto-2.jpg', '/images/cidades/porto-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* Ponte D. Luís I */
                '<path class="hl" pathLength="1" d="M30 116 Q120 12 210 116"/>' +            /* arco grande */
                '<line class="d" pathLength="1" x1="20" y1="58" x2="220" y2="58"/>' +        /* tabuleiro superior */
                '<line class="d" pathLength="1" x1="24" y1="116" x2="216" y2="116"/>' +      /* tabuleiro inferior */
                '<line class="d" pathLength="1" x1="42" y1="34" x2="42" y2="116"/>' +        /* torre esq */
                '<line class="d" pathLength="1" x1="198" y1="34" x2="198" y2="116"/>' +      /* torre dir */
                '<line class="d" pathLength="1" x1="72" y1="58" x2="72" y2="84"/>' +         /* pendurais */
                '<line class="d" pathLength="1" x1="96" y1="58" x2="96" y2="68"/>' +
                '<line class="d" pathLength="1" x1="144" y1="58" x2="144" y2="68"/>' +
                '<line class="d" pathLength="1" x1="168" y1="58" x2="168" y2="84"/>' +
                '<line class="d" pathLength="1" x1="120" y1="34" x2="120" y2="58"/>' +
                /* rio Douro */
                '<path class="d" pathLength="1" d="M28 138 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0"/>' +
                '</svg>'
        },
        {
            id: 'gaia', nome: 'Vila Nova de Gaia', regiao: 'Grande Porto', imoveis: 37,
            partir: '245 000 €', tag: 'Vinho do Porto', cor: '#7B2D3A', cor2: '#4E171F',
            fotos: ['/images/cidades/gaia-1.jpg', '/images/cidades/gaia-2.jpg', '/images/cidades/gaia-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* Barco rabelo */
                '<path class="hl" pathLength="1" d="M34 116 Q120 150 206 116 L190 130 Q120 156 50 130 Z"/>' +
                '<line class="d" pathLength="1" x1="120" y1="116" x2="120" y2="34"/>' +      /* mastro */
                '<path class="d" pathLength="1" d="M120 40 L172 52 L120 78 Z"/>' +           /* vela */
                '<line class="d" pathLength="1" x1="120" y1="58" x2="146" y2="58"/>' +
                /* barricas de vinho no convés */
                '<ellipse class="d" pathLength="1" cx="78" cy="112" rx="13" ry="9"/>' +
                '<ellipse class="d" pathLength="1" cx="160" cy="112" rx="13" ry="9"/>' +
                '<line class="d" pathLength="1" x1="78" y1="103" x2="78" y2="121"/>' +
                '<line class="d" pathLength="1" x1="160" y1="103" x2="160" y2="121"/>' +
                /* água */
                '<path class="d" pathLength="1" d="M30 142 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0"/>' +
                '</svg>'
        },
        {
            id: 'coimbra', nome: 'Coimbra', regiao: 'Centro', imoveis: 28,
            partir: '195 000 €', tag: 'Saber & Mondego', cor: '#9B3B3B', cor2: '#5F2020',
            fotos: ['/images/cidades/coimbra-1.jpg', '/images/cidades/coimbra-2.jpg', '/images/cidades/coimbra-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* Torre da Universidade */
                '<rect class="d" pathLength="1" x="100" y="50" width="40" height="86"/>' +
                '<path class="hl" pathLength="1" d="M100 50 a20 20 0 0 1 40 0"/>' +          /* coroamento */
                '<circle class="d" pathLength="1" cx="120" cy="74" r="10"/>' +               /* relógio */
                '<line class="d" pathLength="1" x1="120" y1="74" x2="120" y2="67"/>' +
                '<line class="d" pathLength="1" x1="120" y1="74" x2="126" y2="74"/>' +
                '<path class="d" pathLength="1" d="M110 136 V112 a10 10 0 0 1 20 0 V136"/>' + /* arco entrada */
                '<line class="d" pathLength="1" x1="120" y1="44" x2="120" y2="32"/>' +        /* pináculo */
                '<rect class="d" pathLength="1" x="108" y="92" width="9" height="14" rx="4"/>' +
                '<rect class="d" pathLength="1" x="123" y="92" width="9" height="14" rx="4"/>' +
                /* rio Mondego */
                '<path class="d" pathLength="1" d="M34 150 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0"/>' +
                '<line class="ground" pathLength="1" x1="70" y1="136" x2="170" y2="136"/>' +
                '</svg>'
        },
        {
            id: 'lisboa', nome: 'Lisboa', regiao: 'Grande Lisboa', imoveis: 64,
            partir: '340 000 €', tag: 'Luz & elétrico 28', cor: '#E0913C', cor2: '#B26416',
            fotos: ['/images/cidades/lisboa-1.jpg', '/images/cidades/lisboa-2.jpg', '/images/cidades/lisboa-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* Elétrico 28 */
                '<line class="d" pathLength="1" x1="20" y1="30" x2="220" y2="30"/>' +        /* catenária */
                '<line class="d" pathLength="1" x1="150" y1="30" x2="150" y2="54"/>' +
                '<line class="d" pathLength="1" x1="150" y1="54" x2="124" y2="66"/>' +
                '<rect class="hl" pathLength="1" x="40" y="64" width="160" height="70" rx="14"/>' +
                '<line class="d" pathLength="1" x1="54" y1="64" x2="186" y2="64"/>' +
                '<rect class="d" pathLength="1" x="54" y="76" width="26" height="24" rx="4"/>' +
                '<rect class="d" pathLength="1" x="86" y="76" width="26" height="24" rx="4"/>' +
                '<rect class="d" pathLength="1" x="156" y="76" width="24" height="48" rx="4"/>' + /* porta */
                '<circle class="d" pathLength="1" cx="78" cy="140" r="12"/>' +
                '<circle class="d" pathLength="1" cx="156" cy="140" r="12"/>' +
                '<text x="132" y="98" class="num">28</text>' +
                '</svg>'
        },
        {
            id: 'algarve', nome: 'Algarve', regiao: 'Sul', imoveis: 47,
            partir: '320 000 €', tag: 'Falésias & sol', cor: '#1E9B9B', cor2: '#0E5E5E',
            fotos: ['/images/cidades/algarve-1.jpg', '/images/cidades/algarve-2.jpg', '/images/cidades/algarve-3.jpg'],
            svg:
                '<svg viewBox="0 0 240 170" fill="none">' +
                /* sol */
                '<circle class="hl" pathLength="1" cx="186" cy="44" r="16"/>' +
                '<line class="d" pathLength="1" x1="186" y1="14" x2="186" y2="22"/>' +
                '<line class="d" pathLength="1" x1="212" y1="44" x2="204" y2="44"/>' +
                '<line class="d" pathLength="1" x1="207" y1="23" x2="201" y2="29"/>' +
                '<line class="d" pathLength="1" x1="165" y1="23" x2="171" y2="29"/>' +
                /* falésia com arco do mar */
                '<path class="d" pathLength="1" d="M22 130 V92 q4 -28 30 -28 q26 0 30 28 V96 a22 22 0 0 0 -32 0 V130"/>' +
                '<path class="d" pathLength="1" d="M118 130 V86 q4 -22 24 -22 q20 0 24 22 V130"/>' +
                /* mar */
                '<path class="d" pathLength="1" d="M16 142 q14 -7 28 0 t28 0 t28 0 t28 0 t28 0 t28 0 t28 0"/>' +
                '<path class="d" pathLength="1" d="M30 152 q12 -6 24 0 t24 0 t24 0 t24 0 t24 0"/>' +
                '</svg>'
        }
    ];

    /* ────────────────────────────────────────────────────
       REFERÊNCIAS DOM
    ──────────────────────────────────────────────────── */
    var section   = document.querySelector('.destinos-section');
    if (!section) return;

    var stageEl   = document.getElementById('destinosStage');
    var slidesEl  = document.getElementById('destinosSlides');
    var illustEl  = document.getElementById('destinosIllust');
    var nomeEl    = document.getElementById('destinoNome');
    var regiaoEl  = document.getElementById('destinoRegiao');
    var tagEl     = document.getElementById('destinoTag');
    var imoveisEl = document.getElementById('destinoImoveis');
    var partirEl  = document.getElementById('destinoPartir');
    var ctaEl     = document.getElementById('destinoCta');
    var dotsEl    = document.getElementById('destinosSlideDots');
    var progEl    = document.getElementById('destinosProgressBar');
    var selectorEl= document.getElementById('destinosSelector');
    var prevBtn   = document.getElementById('destinosPrev');
    var nextBtn   = document.getElementById('destinosNext');

    var atual = 0;          /* índice da cidade ativa  */
    var slide = 0;          /* índice da foto ativa    */
    var timer = null;
    var revealed = false;

    /* ── Constrói os slides de foto (3 por cidade) ── */
    var SLIDES = 3;
    for (var s = 0; s < SLIDES; s++) {
        var div = document.createElement('div');
        div.className = 'destino-slide' + (s === 0 ? ' active' : '');
        var img = document.createElement('img');
        img.alt = '';
        img.onerror = function () { this.style.display = 'none'; };
        div.appendChild(img);
        slidesEl.appendChild(div);

        var dot = document.createElement('button');
        dot.className = 'destino-slide-dot' + (s === 0 ? ' active' : '');
        dot.setAttribute('aria-label', 'Foto ' + (s + 1));
        (function (i) { dot.addEventListener('click', function () { irParaSlide(i); }); })(s);
        dotsEl.appendChild(dot);
    }
    var slideNodes = slidesEl.querySelectorAll('.destino-slide');
    var dotNodes   = dotsEl.querySelectorAll('.destino-slide-dot');

    /* ── Constrói a faixa seletora de cidades ── */
    cidades.forEach(function (c, i) {
        var chip = document.createElement('button');
        chip.className = 'destino-chip' + (i === 0 ? ' ativo' : '');
        chip.dataset.idx = i;
        chip.style.setProperty('--c-cor', c.cor);
        chip.innerHTML =
            '<span class="destino-chip-thumb" style="background:linear-gradient(135deg,' + c.cor + ',' + c.cor2 + ')">' +
                '<i class="ti ti-map-pin"></i>' +
            '</span>' +
            '<span class="destino-chip-info">' +
                '<span class="destino-chip-nome">' + c.nome + '</span>' +
                '<span class="destino-chip-meta">' + c.imoveis + ' imóveis</span>' +
            '</span>';
        chip.addEventListener('click', function () { selecionar(i); });
        selectorEl.appendChild(chip);
    });
    var chipNodes = selectorEl.querySelectorAll('.destino-chip');

    /* ────────────────────────────────────────────────────
       SELECIONAR CIDADE
    ──────────────────────────────────────────────────── */
    function selecionar(i, semScroll) {
        var c = cidades[i];
        atual = i;
        slide = 0;

        chipNodes.forEach(function (n, k) { n.classList.toggle('ativo', k === i); });

        /* tema de cor do palco */
        stageEl.style.setProperty('--cor-cidade', c.cor);
        stageEl.style.setProperty('--cor-cidade-2', c.cor2);

        /* atualiza fotos dos slides + gradiente de fallback */
        slideNodes.forEach(function (node, k) {
            var ang = 120 + k * 30;
            node.style.background = 'linear-gradient(' + ang + 'deg, ' + c.cor + ', ' + c.cor2 + ')';
            var im = node.querySelector('img');
            im.style.display = '';
            im.src = c.fotos[k] || c.fotos[0];
            node.classList.toggle('active', k === 0);
        });
        dotNodes.forEach(function (d, k) { d.classList.toggle('active', k === 0); });

        /* desenho da cidade — reinjeta para re-animar o traço */
        illustEl.classList.remove('drawn');
        illustEl.innerHTML = c.svg;
        void illustEl.offsetWidth;
        illustEl.classList.add('drawn');

        /* texto */
        nomeEl.textContent   = c.nome;
        regiaoEl.textContent = c.regiao;
        tagEl.textContent    = c.tag;
        imoveisEl.textContent = c.imoveis;
        partirEl.textContent  = c.partir;
        ctaEl.querySelector('span').textContent = 'Ver imóveis em ' + c.nome;

        /* transição suave do palco */
        stageEl.classList.remove('trocar');
        void stageEl.offsetWidth;
        stageEl.classList.add('trocar');

        reiniciarTimer();
        reiniciarProgresso();
    }

    /* ────────────────────────────────────────────────────
       SLIDESHOW DE FOTOS
    ──────────────────────────────────────────────────── */
    function irParaSlide(i) {
        slideNodes[slide].classList.remove('active');
        dotNodes[slide].classList.remove('active');
        slide = ((i % SLIDES) + SLIDES) % SLIDES;
        slideNodes[slide].classList.add('active');
        dotNodes[slide].classList.add('active');
        reiniciarTimer();
        reiniciarProgresso();
    }

    function reiniciarTimer() {
        clearInterval(timer);
        timer = setInterval(function () { irParaSlide(slide + 1); }, SLIDE_INTERVAL);
    }

    function reiniciarProgresso() {
        if (!progEl) return;
        progEl.classList.remove('running');
        void progEl.offsetWidth;
        progEl.classList.add('running');
    }

    if (prevBtn) prevBtn.addEventListener('click', function () { irParaSlide(slide - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { irParaSlide(slide + 1); });

    /* ────────────────────────────────────────────────────
       REVEAL NO SCROLL
    ──────────────────────────────────────────────────── */
    function revelar() {
        if (revealed) return;
        revealed = true;
        section.classList.add('destinos-revealed');
        selecionar(0, true);
    }

    if ('IntersectionObserver' in window) {
        var obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) { revelar(); obs.disconnect(); }
            });
        }, { threshold: 0.18 });
        obs.observe(section);
    } else {
        revelar();
    }
})();