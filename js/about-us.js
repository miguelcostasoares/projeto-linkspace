/* ============================================================
   LINKSPACE — about-us.js
   Substitui o ficheiro js/about-us.js na íntegra
   ============================================================ */

(function () {
    'use strict';

    /* ────────────────────────────────────────────────────
       SLIDESHOW
    ──────────────────────────────────────────────────── */
    var SLIDE_INTERVAL = 4000;

    var currentSlide = 0;
    var slideTimer   = null;
    var hasAnimated  = false;

    var slideshow   = document.getElementById('aboutSlideshow');
    var slides      = document.querySelectorAll('.about-slide');
    var progressBar = document.getElementById('aboutProgressBar');
    var dotsWrapSl  = document.getElementById('aboutDots');
    var counterCur  = document.getElementById('aboutSlideCurrent');
    var counterTot  = document.getElementById('aboutSlideTotal');
    var btnPrev     = document.getElementById('aboutBtnPrev');
    var btnNext     = document.getElementById('aboutBtnNext');
    var totalSlides = slides.length;

    if (dotsWrapSl && totalSlides > 0) {
        if (counterTot) counterTot.textContent = totalSlides;
        for (var si = 0; si < totalSlides; si++) {
            (function (i) {
                var dot = document.createElement('div');
                dot.className = 'about-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', 'Slide ' + (i + 1));
                dot.addEventListener('click', function () { goToSlide(i); });
                dotsWrapSl.appendChild(dot);
            })(si);
        }
    }

    if (btnPrev) btnPrev.addEventListener('click', function () { goToSlide(currentSlide - 1); });
    if (btnNext) btnNext.addEventListener('click', function () { goToSlide(currentSlide + 1); });

    function goToSlide(index) {
        if (!slides.length) return;
        slides[currentSlide].classList.remove('active');
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        updateSlideDots();
        updateCounter();
        restartProgress();
        restartSlideTimer();
    }

    window.aboutNextSlide = function () { goToSlide(currentSlide + 1); };
    window.aboutPrevSlide = function () { goToSlide(currentSlide - 1); };

    function updateSlideDots() {
        document.querySelectorAll('#aboutDots .about-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === currentSlide);
        });
    }

    function updateCounter() {
        if (counterCur) counterCur.textContent = currentSlide + 1;
    }

    function restartProgress() {
        if (!progressBar) return;
        progressBar.classList.remove('running');
        void progressBar.offsetWidth;
        progressBar.classList.add('running');
    }

    function restartSlideTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(function () { goToSlide(currentSlide + 1); }, SLIDE_INTERVAL);
    }

    /* ────────────────────────────────────────────────────
       TEAM CAROUSEL — configurações
    ──────────────────────────────────────────────────── */
    var TC_INTERVAL = 3500; /* ms entre mudanças automáticas */

    var consultores = [
        { initials: 'AB', name: 'Antonino Bárria',    role: 'Director Executivo', bg: '#dde4f0', img: '/images/ceo.jpeg',         badge: 'CEO'       },
        { initials: 'AM', name: 'Alexandre Malainho', role: 'Consultor',          bg: '#fde8d8', img: '/images/consultor6.jpeg',   badge: 'Consultor' },
        { initials: 'AB', name: 'André Barria',        role: 'Consultor',          bg: '#d8f0e4', img: '/images/consultor8.jpeg',   badge: 'Consultor' },
        { initials: 'BS', name: 'Bruno Sobral',        role: 'Consultor',          bg: '#e8f0d8', img: '/images/consultor3.jpeg',   badge: 'Consultor' },
        { initials: 'EC', name: 'Ester Costa',         role: 'Consultor',          bg: '#f0e8d8', img: '/images/consultor5.jpeg',   badge: 'Consultor' },
        { initials: 'HA', name: 'Hugo Azevedo',        role: 'Consultor',          bg: '#f0d8f0', img: '/images/consultor4.jpeg',   badge: 'Consultor' },
        { initials: 'HF', name: 'Hugo Ferreira',       role: 'Consultor',          bg: '#fde8d8', img: '/images/consultor2.jpeg',   badge: 'Consultor' },
        { initials: 'NO', name: 'Nuno Oliveira',       role: 'Consultor',          bg: '#d8e8f0', img: '/images/consultor7.jpeg',   badge: 'Consultor' },
        { initials: 'RA', name: 'Raphael de Almeida',  role: 'Consultor Sênior',   bg: '#f0d8d8', img: '/images/consultor1.jpeg',   badge: 'Sênior'    }
    ];

    var tcTotal    = consultores.length;
    var tcCurrent  = 0;
    var tcPrev     = -1;          /* índice que acabou de sair   */
    var tcDir      = 1;           /* +1 → para a direita  /  -1 → para a esquerda */
    var tcTimer    = null;
    var tcAnimating = false;

    var tcTrack   = document.getElementById('tcTrack');
    var tcDotsEl  = document.getElementById('tcDots');
    var tcPrevBtn = document.getElementById('tcPrev');
    var tcNextBtn = document.getElementById('tcNext');

    /* ── Barra de progresso do carrossel ── */
    var tcProgressBar = null;

    function tcBuildProgressBar() {
        
    }

    function tcRestartProgress() {
        if (!tcProgressBar) return;
        tcProgressBar.classList.remove('tc-running');
        void tcProgressBar.offsetWidth;
        tcProgressBar.classList.add('tc-running');
    }

    /* ── Injetar CSS da barra + transições stack ── */
    (function injectStyles() {
        var style = document.createElement('style');
        style.textContent = [
            /* Barra de progresso do carrossel */
            '.tc-progress{position:relative;height:3px;background:rgba(50,58,72,0.1);border-radius:999px;margin-bottom:14px;overflow:hidden;}',
            '.tc-progress-bar{position:absolute;top:0;left:0;height:100%;width:0;background:var(--cor-destaque,#FF6803);border-radius:999px;transition:none;}',
            '.tc-progress-bar.tc-running{transition:width ' + TC_INTERVAL + 'ms linear;width:100%;}',

            /* Stack slide — item que ENTRA */
            '.tc-item.tc-enter-right{animation:tcSlideInRight .45s cubic-bezier(0.22,1,0.36,1) forwards;}',
            '.tc-item.tc-enter-left {animation:tcSlideInLeft  .45s cubic-bezier(0.22,1,0.36,1) forwards;}',

            /* Stack slide — item que SAI */
            '.tc-item.tc-exit-right {animation:tcSlideOutRight .38s cubic-bezier(0.22,1,0.36,1) forwards;}',
            '.tc-item.tc-exit-left  {animation:tcSlideOutLeft  .38s cubic-bezier(0.22,1,0.36,1) forwards;}',

            '@keyframes tcSlideInRight {',
            '  from{opacity:0;transform:translateX(28px) scale(0.92);}',
            '  to  {opacity:1;transform:translateX(0)    scale(1);}',
            '}',
            '@keyframes tcSlideInLeft {',
            '  from{opacity:0;transform:translateX(-28px) scale(0.92);}',
            '  to  {opacity:1;transform:translateX(0)     scale(1);}',
            '}',
            '@keyframes tcSlideOutRight {',
            '  from{opacity:1;transform:translateX(0)     scale(1);}',
            '  to  {opacity:0;transform:translateX(-20px) scale(0.94);}',
            '}',
            '@keyframes tcSlideOutLeft {',
            '  from{opacity:1;transform:translateX(0)    scale(1);}',
            '  to  {opacity:0;transform:translateX(20px) scale(0.94);}',
            '}'
        ].join('');
        document.head.appendChild(style);
    })();

    /* ── Render ── */
    function tcGetClass(idx) {
        var diff = ((idx - tcCurrent) % tcTotal + tcTotal) % tcTotal;
        if (diff === 0)                         return 'center';
        if (diff === 1 || diff === tcTotal - 1) return 'side';
        return 'far';
    }

    function tcBuildItem(idx, extraClass) {
        var c   = consultores[idx];
        var cls = tcGetClass(idx);
        var el  = document.createElement('div');
        el.className = 'tc-item ' + cls + (extraClass ? ' ' + extraClass : '');
        el.dataset.idx = idx;

        el.innerHTML =
            '<div class="tc-photo-ring">' +
                '<div class="tc-photo">' +
                    '<div class="tc-photo-inner" style="background:' + c.bg + ';">' +
                        '<span>' + c.initials + '</span>' +
                        '<img src="' + c.img + '" alt="' + c.name + '" onerror="this.style.display=\'none\'">' +
                    '</div>' +
                '</div>' +
            '</div>' +
            '<div class="tc-info">' +
                '<div class="tc-name">' + c.name + '</div>' +
                '<div class="tc-role">' + c.role + '</div>' +
                (cls === 'center' ? '<span class="tc-badge">' + c.badge + '</span>' : '') +
            '</div>';

        el.addEventListener('click', function () {
            var clickedIdx = parseInt(el.dataset.idx, 10);
            if (clickedIdx === tcCurrent) return;
            /* determina direção pelo lado em que o item está */
            var diff = ((clickedIdx - tcCurrent) % tcTotal + tcTotal) % tcTotal;
            tcGoTo(clickedIdx, diff <= tcTotal / 2 ? 1 : -1);
        });

        return el;
    }

    function tcRender(enterClass) {
        if (!tcTrack) return;
        tcTrack.innerHTML = '';
        if (tcDotsEl) tcDotsEl.innerHTML = '';

        var display = [
            (tcCurrent - 1 + tcTotal) % tcTotal,
            tcCurrent,
            (tcCurrent + 1) % tcTotal
        ];
        /* remove duplicados (quando tcTotal < 3) */
        display = display.filter(function (v, i, a) { return a.indexOf(v) === i; });

        display.forEach(function (idx) {
            var anim = (enterClass && idx === tcCurrent) ? enterClass : '';
            tcTrack.appendChild(tcBuildItem(idx, anim));
        });

        /* dots */
        if (tcDotsEl) {
            for (var di = 0; di < tcTotal; di++) {
                (function (i) {
                    var dot = document.createElement('div');
                    dot.className = 'tc-dot' + (i === tcCurrent ? ' active' : '');
                    dot.addEventListener('click', function () {
                        if (i === tcCurrent) return;
                        var diff = ((i - tcCurrent) % tcTotal + tcTotal) % tcTotal;
                        tcGoTo(i, diff <= tcTotal / 2 ? 1 : -1);
                    });
                    tcDotsEl.appendChild(dot);
                })(di);
            }
        }
    }

    /* ── Navegação com animação stack ── */
    function tcGoTo(newIdx, dir, fromTimer) {
        if (tcAnimating || newIdx === tcCurrent) return;
        tcAnimating = true;

        /* anima saída do item central atual */
        var currentCenter = tcTrack ? tcTrack.querySelector('.tc-item.center') : null;
        if (currentCenter) {
            var exitClass = (dir > 0) ? 'tc-exit-right' : 'tc-exit-left';
            currentCenter.classList.add(exitClass);
        }

        var enterClass = (dir > 0) ? 'tc-enter-right' : 'tc-enter-left';

        setTimeout(function () {
            tcCurrent = ((newIdx % tcTotal) + tcTotal) % tcTotal;
            tcRender(enterClass);
            tcAnimating = false;
        }, 280); /* ligeiramente antes do exit terminar para overlap suave */

        /* reinicia temporizador só se veio de interação humana */
        if (!fromTimer) {
            tcRestartTimer();
            tcRestartProgress();
        }
    }

    function tcNext(fromTimer) { tcGoTo((tcCurrent + 1) % tcTotal, 1, fromTimer); }
    function tcPrevFn()        { tcGoTo((tcCurrent - 1 + tcTotal) % tcTotal, -1, false); }

    /* ── Temporizador automático ── */
    function tcRestartTimer() {
        clearInterval(tcTimer);
        tcTimer = setInterval(function () { tcNext(true); }, TC_INTERVAL);
    }

    if (tcPrevBtn) tcPrevBtn.addEventListener('click', function () { tcPrevFn(); tcRestartProgress(); });
    if (tcNextBtn) tcNextBtn.addEventListener('click', function () { tcNext(false); });

    /* ────────────────────────────────────────────────────
       CONTADORES NUMÉRICOS
    ──────────────────────────────────────────────────── */
    function animateCounter(el, target, duration) {
        var start = performance.now();
        function step(now) {
            var progress = Math.min((now - start) / duration, 1);
            var ease     = 1 - Math.pow(1 - progress, 3);
            el.textContent = Math.round(ease * target);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    }

    /* ────────────────────────────────────────────────────
       REVEAL COM IntersectionObserver
    ──────────────────────────────────────────────────── */
    function revealSection() {
        if (hasAnimated) return;
        hasAnimated = true;

        if (slideshow) slideshow.classList.add('about-revealed');

        document.querySelectorAll('.about-value-item').forEach(function (el, i) {
            setTimeout(function () {
                el.style.animationDelay = '0s';
                el.classList.add('about-revealed');
            }, i * 130);
        });

        document.querySelectorAll('.about-stat-card').forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('about-revealed');
            }, 220 + i * 110);
        });

        var carousel = document.getElementById('aboutTeamCarousel');
        if (carousel) {
            setTimeout(function () {
                carousel.classList.add('about-revealed');
            }, 420);
        }

        setTimeout(function () {
            document.querySelectorAll('.about-counter').forEach(function (el) {
                var target   = parseInt(el.getAttribute('data-target'), 10) || 0;
                var duration = target > 100 ? 1400 : 1000;
                animateCounter(el, target, duration);
            });

            /* Slideshow */
            restartProgress();
            restartSlideTimer();

            /* Carrossel de equipa */
            tcRender();
            tcRestartTimer();
            tcRestartProgress();
        }, 380);
    }

    if ('IntersectionObserver' in window && slideshow) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    revealSection();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.12 });
        observer.observe(slideshow);
    } else {
        setTimeout(revealSection, 300);
    }

})();