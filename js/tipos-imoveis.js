(function () {

    /* ===================== REVEAL ANIMATION ===================== */
    const cards = document.querySelectorAll('[data-reveal]');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const index = [...cards].indexOf(entry.target);
                setTimeout(() => {
                    entry.target.classList.add('revealed');
                }, index * 100);
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });

    cards.forEach(card => revealObserver.observe(card));


    /* ===================== LEAFLET MAPS ===================== */

    // Carrega Leaflet dinamicamente se ainda não estiver na página
    function loadLeaflet(callback) {
        if (window.L) return callback();

        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);

        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.onload = callback;
        document.head.appendChild(script);
    }

    function initMaps() {
        const mapEls = document.querySelectorAll('.tipo-card-mapa');

        mapEls.forEach(el => {
            const lat  = parseFloat(el.dataset.lat)  || 39.5;
            const lng  = parseFloat(el.dataset.lng)  || -8.0;
            const zoom = parseInt(el.dataset.zoom)   || 7;

            const map = L.map(el, {
                center: [lat, lng],
                zoom: zoom,
                zoomControl: false,
                attributionControl: false,
                dragging: false,
                scrollWheelZoom: false,
                doubleClickZoom: false,
                touchZoom: false,
                keyboard: false,
            });

            L.tileLayer('https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png', {
                maxZoom: 20,
            }).addTo(map);

            // Cria ícone laranja customizado
            const pinPrimary = L.divIcon({
                className: '',
                html: `<div style="
                    width: 12px; height: 12px;
                    background: #FF6200;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 0 3px rgba(255,98,0,0.35);
                "></div>`,
                iconSize: [12, 12],
                iconAnchor: [6, 6],
            });

            // Cria ícone azul secundário
            const pinSecondary = L.divIcon({
                className: '',
                html: `<div style="
                    width: 9px; height: 9px;
                    background: #3B82F6;
                    border: 2px solid #fff;
                    border-radius: 50%;
                    box-shadow: 0 0 0 3px rgba(59,130,246,0.30);
                "></div>`,
                iconSize: [9, 9],
                iconAnchor: [4, 4],
            });

            // Lê os pins do HTML e converte pra markers reais
            const pinEls = el.closest('.tipo-card')
                            .querySelectorAll('.tipo-card-mapa-pins .mapa-pin');

            pinEls.forEach(pinEl => {
                const isSecondary = pinEl.classList.contains('mapa-pin--secondary');
                const icon = isSecondary ? pinSecondary : pinPrimary;
                const pinLat = parseFloat(pinEl.dataset.lat);
                const pinLng = parseFloat(pinEl.dataset.lng);

                if (!isNaN(pinLat) && !isNaN(pinLng)) {
                    L.marker([pinLat, pinLng], { icon }).addTo(map);
                }
            });

            // Esconde os pins HTML originais (agora são desnecessários)
            const pinsWrap = el.closest('.tipo-card').querySelector('.tipo-card-mapa-pins');
            if (pinsWrap) pinsWrap.style.display = 'none';

            setTimeout(() => map.invalidateSize(), 50);
        });
    }

    // Só inicializa os mapas quando os cards entrarem na viewport
    // (evita carregar tiles desnecessariamente no load)
    const section = document.querySelector('.tipos-section');

    if (!section) return;

    const sectionObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            loadLeaflet(initMaps);
            sectionObserver.disconnect();
        }
    }, { threshold: 0.05 });

    sectionObserver.observe(section);

})();