function setTab(el, tab) {

    document
        .querySelectorAll('.tab')
        .forEach(t => t.classList.remove('active'));

    el.classList.add('active');

    document.getElementById('venda-bar').style.display =
        tab === 'venda' ? 'flex' : 'none';

    document.getElementById('codigo-bar').style.display =
        tab === 'codigo' ? 'flex' : 'none';
}