function abreviar(texto, max = 14) {
  return texto.length > max ? texto.slice(0, max).trimEnd() + '…' : texto;
}

const options = [
  { id: 'apt',    label: 'Apartamentos',       icon: 'ti-building' },
  { id: 'neg',    label: 'Imóveis c/ negócio', icon: 'ti-briefcase' },
  { id: 'loja',   label: 'Lojas',              icon: 'ti-shopping-bag' },
  { id: 'mor',    label: 'Moradias',           icon: 'ti-home' },
  { id: 'pred',   label: 'Prédios',            icon: 'ti-building-skyscraper' },
  { id: 'quinta', label: 'Quintas e Herdades', icon: 'ti-tree' },
  { id: 'terr',   label: 'Terrenos',           icon: 'ti-layers-intersect' },
];

let selected = new Set();

function renderOptions() {
  const list = document.getElementById('optionsList');
  list.innerHTML = options.map(o => `
    <div class="option-item ${selected.has(o.id) ? 'selected' : ''}" onclick="toggle('${o.id}')">
      <i class="ti ${o.icon} opt-icon" aria-hidden="true"></i>
      <span style="flex:1">${o.label}</span>
      <div class="checkbox"><i class="ti ti-check"></i></div>
    </div>
  `).join('');
}

function toggle(id) {
  if (selected.has(id)) {
    selected.delete(id);
  } else {
    selected.add(id);
  }
  renderOptions();
  updateBtnLabel();
}

function updateBtnLabel() {
  const btnLabel = document.getElementById('btnLabel');
  if (selected.size === 0) {
    btnLabel.textContent = 'Escolher';
  } else {
    const names = options.filter(o => selected.has(o.id)).map(o => o.label);
    btnLabel.innerHTML = names.length === 1
      ? abreviar(names[0])
      : `<span class="label-tag">${names.length}</span> selecionados`;
  }
}

function toggleDropdown(e) {
  e.stopPropagation();
  // Fecha o de tipologia se estiver aberto
  document.getElementById('dropPanelTipo').classList.remove('open');
  document.getElementById('chevronTipo').classList.remove('open');

  const panel = document.getElementById('dropPanel');
  const chevron = document.getElementById('chevron');
  const open = panel.classList.toggle('open');
  chevron.classList.toggle('open', open);
}



function applySelection() {
  document.getElementById('dropPanel').classList.remove('open');
  document.getElementById('chevron').classList.remove('open');
}

document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('tipo-imovel-wrapper');
  if (!wrapper.contains(e.target)) {
    document.getElementById('dropPanel').classList.remove('open');
    document.getElementById('chevron').classList.remove('open');
  }
});

document.getElementById('dropPanel').addEventListener('click', (e) => {
  e.stopPropagation();
});

const optionsTipo = [
  { id: 't0',      label: 'T0 — Studio',   icon: 'ti-bed' },
  { id: 't1',      label: 'T1',            icon: 'ti-bed' },
  { id: 't2',      label: 'T2',            icon: 'ti-bed' },
  { id: 't3',      label: 'T3',            icon: 'ti-bed' },
  { id: 't4',      label: 'T4',            icon: 'ti-bed' },
  { id: 't5',      label: 'T5',            icon: 'ti-bed' },
  { id: 't6mais',  label: 'T6 ou mais',    icon: 'ti-bed' },
  { id: 'mor1',    label: 'Moradia T1',    icon: 'ti-home' },
  { id: 'mor2',    label: 'Moradia T2',    icon: 'ti-home' },
  { id: 'mor3',    label: 'Moradia T3',    icon: 'ti-home' },
  { id: 'mor4',    label: 'Moradia T4',    icon: 'ti-home' },
  { id: 'mor5',    label: 'Moradia T5+',   icon: 'ti-home' },
  { id: 'cob1',    label: 'Cobertura T2',  icon: 'ti-building' },
  { id: 'cob2',    label: 'Cobertura T3',  icon: 'ti-building' },
  { id: 'cob3',    label: 'Cobertura T4',  icon: 'ti-building' },
  { id: 'dup1',    label: 'Duplex T2',     icon: 'ti-stairs' },
  { id: 'dup2',    label: 'Duplex T3',     icon: 'ti-stairs' },
  { id: 'dup3',    label: 'Duplex T4',     icon: 'ti-stairs' },
  { id: 'pen1',    label: 'Penthouse',     icon: 'ti-building-skyscraper' },
];

let selectedTipo = new Set();

function renderOptionsTipo() {
  const list = document.getElementById('optionsListTipo');
  list.innerHTML = optionsTipo.map(o => `
    <div class="option-item ${selectedTipo.has(o.id) ? 'selected' : ''}" onclick="toggleTipo('${o.id}')">
      <i class="ti ${o.icon} opt-icon" aria-hidden="true"></i>
      <span style="flex:1">${o.label}</span>
      <div class="checkbox"><i class="ti ti-check"></i></div>
    </div>
  `).join('');
}

function toggleTipo(id) {
  if (selectedTipo.has(id)) {
    selectedTipo.delete(id);
  } else {
    selectedTipo.add(id);
  }
  renderOptionsTipo();
  updateBtnLabelTipo();
}

function updateBtnLabelTipo() {
  const btnLabel = document.getElementById('btnLabelTipo');
  if (selectedTipo.size === 0) {
    btnLabel.textContent = 'Escolher';
  } else {
    const names = optionsTipo.filter(o => selectedTipo.has(o.id)).map(o => o.label);
    btnLabel.innerHTML = names.length === 1
      ? abreviar(names[0])
      : `<span class="label-tag">${names.length}</span> selecionados`;
  }
}

function toggleDropdownTipo(e) {
  e.stopPropagation();
  // Fecha o de tipo de imóvel se estiver aberto
  document.getElementById('dropPanel').classList.remove('open');
  document.getElementById('chevron').classList.remove('open');

  const panel = document.getElementById('dropPanelTipo');
  const chevron = document.getElementById('chevronTipo');
  const open = panel.classList.toggle('open');
  chevron.classList.toggle('open', open);
}

function applySelectionTipo() {
  document.getElementById('dropPanelTipo').classList.remove('open');
  document.getElementById('chevronTipo').classList.remove('open');
}

document.getElementById('dropPanelTipo').addEventListener('click', (e) => {
  e.stopPropagation();
});

document.addEventListener('click', (e) => {
  const wrapper = document.getElementById('tipologia-wrapper');
  if (wrapper && !wrapper.contains(e.target)) {
    document.getElementById('dropPanelTipo').classList.remove('open');
    document.getElementById('chevronTipo').classList.remove('open');
  }
});

renderOptionsTipo();

renderOptions();