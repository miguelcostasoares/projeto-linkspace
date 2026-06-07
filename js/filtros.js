function toggleFiltros(e) {
    e.stopPropagation();
    const panel = document.getElementById('filtrosPanel');
    const btn = document.getElementById('btnFiltro');
    const searchBar = document.querySelector('.search-bar');
    const open = panel.classList.toggle('open');
    btn.classList.toggle('ativo', open);

    if (open) {
        const btnRect = btn.getBoundingClientRect();
        const espacoAcima = btnRect.top - 16;

        panel.style.bottom = (window.innerHeight - btnRect.top + 50) + 'px';
        panel.style.left = (btnRect.right - 500 - 15) + 'px';
        panel.style.width = '500px';
        panel.style.maxHeight = Math.min(espacoAcima, 420) + 'px';
    }
}

function togglePill(el, grupo) {
    el.classList.toggle('ativo');
    atualizarContador();
}

function atualizarContador() {
    const total =
        document.querySelectorAll('.filtro-pill.ativo').length +
        (document.getElementById('precoMin').value ? 1 : 0) +
        (document.getElementById('precoMax').value ? 1 : 0) +
        (document.getElementById('areaMin').value ? 1 : 0) +
        (document.getElementById('areaMax').value ? 1 : 0);

    const count = document.getElementById('filtrosCount');
    const btn = document.getElementById('btnFiltro');

    if (total > 0) {
        count.textContent = total;
        count.style.display = 'inline';
        btn.classList.add('ativo');
    } else {
        count.style.display = 'none';
        btn.classList.remove('ativo');
    }
}

function limparFiltros() {
    document.querySelectorAll('.filtro-pill.ativo').forEach(p => p.classList.remove('ativo'));
    document.getElementById('precoMin').value = '';
    document.getElementById('precoMax').value = '';
    document.getElementById('areaMin').value = '';
    document.getElementById('areaMax').value = '';
    atualizarContador();
}

function aplicarFiltros() {
    const panel = document.getElementById('filtrosPanel');
    panel.classList.remove('open');
    document.getElementById('btnFiltro').classList.remove('ativo');
}

document.addEventListener('click', (e) => {
    const panel = document.getElementById('filtrosPanel');
    const btn = document.getElementById('btnFiltro');
    if (panel && !panel.contains(e.target) && !btn.contains(e.target)) {
        panel.classList.remove('open');
        btn.classList.remove('ativo');
    }
});

['precoMin', 'precoMax', 'areaMin', 'areaMax'].forEach(id => {
    document.getElementById(id)?.addEventListener('input', atualizarContador);
});