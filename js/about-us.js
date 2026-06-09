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
       TEAM CAROUSEL
    ──────────────────────────────────────────────────── */
    var consultores = [
        { initials: 'RA', name: 'Antonino Bárria', role: 'Director Executivo', bg: '#dde4f0', img: '/images/ceo.jpeg', badge: 'CEO' },
        { initials: 'HF', name: 'Alexandre Malainho',      role: 'Consultor',        bg: '#fde8d8', img: '/images/consultor6.jpeg', badge: 'Consultor' },
        { initials: 'BS', name: 'André Barria',        role: 'Consultor',        bg: '#d8f0e4', img: '/images/consultor8.jpeg', badge: 'Consultor' },
        { initials: 'HA', name: 'Bruno Sobral',        role: 'Consultor',        bg: '#f0d8f0', img: '/images/consultor3.jpeg',  badge: 'Consultor' },
        { initials: 'HA', name: 'Ester Costa',        role: 'Consultor',        bg: '#f0d8f0', img: '/images/consultor5.jpeg',  badge: 'Consultor' },
        { initials: 'HA', name: 'Hugo Azevedo',        role: 'Consultor',        bg: '#f0d8f0', img: '/images/consultor4.jpeg',  badge: 'Consultor' },
        { initials: 'HA', name: 'Hugo Ferreira',        role: 'Consultor',        bg: '#f0d8f0', img: '/images/consultor2.jpeg',  badge: 'Consultor' },
        { initials: 'HA', name: 'Nuno Oliveira',        role: 'Consultor',        bg: '#f0d8f0', img: '/images/consultor7.jpeg',  badge: 'Consultor' },
        { initials: 'HA', name: 'Raphael de Almeida',        role: 'Consultor',        bg: '#f0d8f0', img: '/images/consultor1.jpeg',  badge: 'Consultor' }
        /* Adicione mais consultores aqui seguindo o mesmo padrão */
    ];
 
    var tcTotal   = consultores.length;
    var tcCurrent = 0;
    var tcTrack   = document.getElementById('tcTrack');
    var tcDots    = document.getElementById('tcDots');
    var tcPrevBtn = document.getElementById('tcPrev');
    var tcNextBtn = document.getElementById('tcNext');
 
    function tcGetClass(idx) {
        var diff = ((idx - tcCurrent) % tcTotal + tcTotal) % tcTotal;
        if (diff === 0)                            return 'center';
        if (diff === 1 || diff === tcTotal - 1)    return 'side';
        return 'far';
    }
 
    function tcRender() {
        if (!tcTrack) return;
        tcTrack.innerHTML = '';
        if (tcDots) tcDots.innerHTML = '';
 
        /* Decide quais itens mostrar: centro + 1 de cada lado */
        var display = [
            (tcCurrent - 1 + tcTotal) % tcTotal,
            tcCurrent,
            (tcCurrent + 1) % tcTotal
        ];
 
        /* Remove duplicados quando tcTotal < 3 */
        display = display.filter(function (v, i, a) { return a.indexOf(v) === i; });
 
        display.forEach(function (idx) {
            var c   = consultores[idx];
            var cls = tcGetClass(idx);
            var el  = document.createElement('div');
            el.className = 'tc-item ' + cls;
 
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
                tcCurrent = idx;
                tcRender();
            });
 
            tcTrack.appendChild(el);
        });
 
        /* Dots */
        if (tcDots) {
            for (var di = 0; di < tcTotal; di++) {
                (function (i) {
                    var dot = document.createElement('div');
                    dot.className = 'tc-dot' + (i === tcCurrent ? ' active' : '');
                    dot.addEventListener('click', function () { tcCurrent = i; tcRender(); });
                    tcDots.appendChild(dot);
                })(di);
            }
        }
    }
 
    if (tcPrevBtn) tcPrevBtn.addEventListener('click', function () {
        tcCurrent = (tcCurrent - 1 + tcTotal) % tcTotal;
        tcRender();
    });
 
    if (tcNextBtn) tcNextBtn.addEventListener('click', function () {
        tcCurrent = (tcCurrent + 1) % tcTotal;
        tcRender();
    });
 
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
 
            restartProgress();
            restartSlideTimer();
 
            /* Inicializa carrossel depois do reveal */
            tcRender();
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