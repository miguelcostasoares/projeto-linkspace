function initHeaderScroll() {

    const header = document.querySelector('.header');

    if (!header) return;

    window.addEventListener('scroll', () => {

        if (window.scrollY > 40) {

            header.style.background =
                'rgba(20, 20, 20, 0.65)';

            header.style.backdropFilter =
                'blur(12px)';

            header.style.boxShadow =
                '0 8px 30px rgba(0,0,0,.20)';

            header.style.borderColor =
                'rgba(255,255,255,0.08)';

        } else {

            header.style.background =
                'rgba(255, 255, 255, 0.027)';

            header.style.backdropFilter =
                'blur(6px)';

            header.style.boxShadow =
                '0 8px 30px rgba(0,0,0,.08), 0 2px 10px rgba(0,0,0,.04)';

            header.style.borderColor =
                'rgba(255,255,255,0.5)';
        }

    });

}