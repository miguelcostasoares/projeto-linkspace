function initLocationSearch() {
    const input = document.getElementById('locationInput');
    const placeholder = document.getElementById('locationPlaceholder');
    if (!input) return;

    // Texto rotativo
    const placeholders = [
        'Digite a freguesia...',
        'Digite o concelho...',
        'Digite o distrito...',
        'Digite a cidade...',
        'Ex: Braga, Porto, Lisboa...',
    ];

    let index = 0, charIndex = 0, apagando = false, pausar = false;

    function escrever() {
        if (pausar || document.activeElement === input) return;
        const texto = placeholders[index];
        if (!apagando) {
            placeholder.textContent = texto.slice(0, charIndex++);
            if (charIndex > texto.length) {
                apagando = true; pausar = true;
                setTimeout(() => { pausar = false; }, 1800);
            }
        } else {
            placeholder.textContent = texto.slice(0, charIndex--);
            if (charIndex < 0) {
                apagando = false;
                index = (index + 1) % placeholders.length;
                charIndex = 0;
            }
        }
    }

    setInterval(escrever, 80);

    let localizacaoJaPedida = false;

input.addEventListener('focus', () => {
    placeholder.style.opacity = '0';

    if (!localizacaoJaPedida) {
        localizacaoJaPedida = true;

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                try {
                    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json&accept-language=pt`);
                    const data = await res.json();

                    const local =
                        data.address.city ||
                        data.address.town ||
                        data.address.village ||
                        data.address.county ||
                        '';

                    if (local && input.value.length === 0) {
                        input.value = local;
                        placeholder.style.opacity = '0';
                    }
                } catch {}
            },
            () => {} // se recusar, não faz nada
        );
    }
});

    input.addEventListener('blur', () => {
        if (input.value.length === 0) placeholder.style.opacity = '1';
    });

    input.addEventListener('input', () => {
        placeholder.style.opacity = input.value.length > 0 ? '0' : '1';
        const q = input.value.trim();
        if (q.length < 2) { fecharSugestoes(); return; }
        mostrarSugestoes(q);
    });

    // Lista de localidades portuguesas
    const localidades = [
        'Braga', 'Braga — Maximinos', 'Braga — Nogueiró', 'Braga — São Victor',
        'Porto', 'Porto — Bonfim', 'Porto — Campanhã', 'Porto — Cedofeita',
        'Lisboa', 'Lisboa — Avenidas Novas', 'Lisboa — Belém', 'Lisboa — Baixa',
        'Coimbra', 'Coimbra — Sé Nova', 'Coimbra — Santo António dos Olivais',
        'Faro', 'Faro — Montenegro', 'Faro — São Pedro',
        'Aveiro', 'Aveiro — Glória', 'Aveiro — Vera Cruz',
        'Setúbal', 'Setúbal — São Julião',
        'Leiria', 'Leiria — Marrazes',
        'Viseu', 'Viseu — Santa Maria de Viseu',
        'Guimarães', 'Guimarães — Oliveira do Castelo',
        'Vila Nova de Gaia', 'Vila Nova de Gaia — Mafamude',
        'Matosinhos', 'Matosinhos — Matosinhos e Leça da Palmeira',
        'Barcelos', 'Viana do Castelo', 'Bragança', 'Vila Real',
        'Évora', 'Évora — Malagueira', 'Évora — Bacelo',
        'Portimão', 'Albufeira', 'Cascais', 'Sintra', 'Almada',
        'Amadora', 'Odivelas', 'Loures', 'Vila Franca de Xira',
        'Montalegre', 'Montalegre — Salto', 'Chaves', 'Peso da Régua',
    ];

    function mostrarSugestoes(q) {
        fecharSugestoes();
        const ql = q.toLowerCase();
        const resultados = localidades.filter(l => l.toLowerCase().includes(ql)).slice(0, 6);
        if (resultados.length === 0) return;

        const panel = document.createElement('div');
        panel.id = 'locationSuggestions';
        panel.className = 'location-suggestions';

        resultados.forEach(r => {
            const item = document.createElement('div');
            item.className = 'suggestion-item';

            const partes = r.toLowerCase().indexOf(ql);
            const highlighted =
                r.slice(0, partes) +
                `<span class="suggestion-highlight">${r.slice(partes, partes + q.length)}</span>` +
                r.slice(partes + q.length);

            item.innerHTML = `<i class="ti ti-map-pin" aria-hidden="true"></i><span>${highlighted}</span>`;
            item.addEventListener('mousedown', () => {
                input.value = r;
                placeholder.style.opacity = '0';
                fecharSugestoes();
            });
            panel.appendChild(item);
        });

        const wrapper = input.closest('.location-wrapper');
        wrapper.appendChild(panel);
        requestAnimationFrame(() => panel.classList.add('open'));
    }

    function fecharSugestoes() {
        const existing = document.getElementById('locationSuggestions');
        if (existing) existing.remove();
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.location-wrapper')) fecharSugestoes();
    });
}