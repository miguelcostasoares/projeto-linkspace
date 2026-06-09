(function () {
    'use strict';
 
    /* ── Configurações ── */
    const SLIDE_INTERVAL = 4000; // ms entre slides automáticos
 
    /* ── Estado ── */
    let currentSlide  = 0;
    let slideTimer    = null;
    let hasAnimated   = false;
 
    /* ── Elementos ── */
    const slideshow   = document.getElementById('aboutSlideshow');
    const slides      = document.querySelectorAll('.about-slide');
    const progressBar = document.getElementById('aboutProgressBar');
    const dotsWrap    = document.getElementById('aboutDots');
    const counterCur  = document.getElementById('aboutSlideCurrent');
    const counterTot  = document.getElementById('aboutSlideTotal');
    const btnPrev     = document.getElementById('aboutBtnPrev');
    const btnNext     = document.getElementById('aboutBtnNext');
    const totalSlides = slides.length;
 
    /* ── Inicializa dots ── */
    if (dotsWrap && totalSlides > 0) {
        counterTot.textContent = totalSlides;
 
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.className = 'about-dot' + (i === 0 ? ' active' : '');
            dot.setAttribute('aria-label', 'Slide ' + (i + 1));
            dot.addEventListener('click', () => goToSlide(i));
            dotsWrap.appendChild(dot);
        }
    }
 
    /* ── Botões ── */
    if (btnPrev) {
        btnPrev.addEventListener('click', () => goToSlide(currentSlide - 1));
    }

    if (btnNext) {
        btnNext.addEventListener('click', () => goToSlide(currentSlide + 1));
    }
 
    /* ── Navegação ── */
    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        slides[currentSlide].classList.add('active');
        updateDots();
        updateCounter();
        restartProgress();
        restartTimer();
    }
 
    window.aboutNextSlide = function () { goToSlide(currentSlide + 1); };
    window.aboutPrevSlide = function () { goToSlide(currentSlide - 1); };
 
    function updateDots() {
        document.querySelectorAll('.about-dot').forEach(function (d, i) {
            d.classList.toggle('active', i === currentSlide);
        });
    }
 
    function updateCounter() {
        if (counterCur) counterCur.textContent = currentSlide + 1;
    }
 
    /* ── Progress bar ── */
    function restartProgress() {
        if (!progressBar) return;
        progressBar.classList.remove('running');
        void progressBar.offsetWidth; // reflow para reiniciar a transição CSS
        progressBar.classList.add('running');
    }
 
    /* ── Timer automático ── */
    function restartTimer() {
        clearInterval(slideTimer);
        slideTimer = setInterval(function () {
            goToSlide(currentSlide + 1);
        }, SLIDE_INTERVAL);
    }
 
    /* ── Animação de contadores ── */
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
 
    /* ── Reveal com IntersectionObserver ── */
    function revealSection() {
        if (hasAnimated) return;
        hasAnimated = true;
 
        /* Slideshow */
        if (slideshow) slideshow.classList.add('about-revealed');
 
        /* Value items — atraso escalonado */
        document.querySelectorAll('.about-value-item').forEach(function (el, i) {
            setTimeout(function () {
                el.style.animationDelay = '0s';
                el.classList.add('about-revealed');
            }, i * 130);
        });
 
        /* Stat cards — atraso escalonado */
        document.querySelectorAll('.about-stat-card').forEach(function (el, i) {
            setTimeout(function () {
                el.classList.add('about-revealed');
            }, 220 + i * 110);
        });
 
        /* Team strip */
        var teamStrip = document.querySelector('.about-team-strip');
        if (teamStrip) {
            setTimeout(function () {
                teamStrip.classList.add('about-revealed');
            }, 420);
        }
 
        /* Contadores numéricos */
        setTimeout(function () {
            document.querySelectorAll('.about-counter').forEach(function (el) {
                var target   = parseInt(el.getAttribute('data-target'), 10) || 0;
                var duration = target > 100 ? 1400 : 1000;
                animateCounter(el, target, duration);
            });
 
            /* Inicia slideshow automático */
            restartProgress();
            restartTimer();
        }, 380);
    }
 
    /* Observa a secção */
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
        /* Fallback: anima logo */
        setTimeout(revealSection, 300);
    }
 
})();