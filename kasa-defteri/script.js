const SITE_PASSWORD = 'aleyna2026';
const UNLOCK_KEY = 'kasa-defteri-unlocked';

(function initLock() {
  const lockScreen = document.getElementById('lock-screen');
  const appRoot = document.getElementById('app-root');
  const lockForm = document.getElementById('lock-form');
  const lockError = document.getElementById('lock-error');

  if (sessionStorage.getItem(UNLOCK_KEY) === '1') {
    lockScreen.hidden = true;
    appRoot.hidden = false;
    return;
  }

  lockForm.addEventListener('submit', e => {
    e.preventDefault();
    const value = document.getElementById('lock-password').value;
    if (value === SITE_PASSWORD) {
      sessionStorage.setItem(UNLOCK_KEY, '1');
      lockScreen.hidden = true;
      appRoot.hidden = false;
    } else {
      lockError.hidden = false;
    }
  });
})();

const STORAGE_KEY = 'kasa-defteri-records';
const CURRENCY_SYMBOLS = { TRY: '₺', EUR: '€', USD: '$' };
const PAYMENT_LABELS = { cash: 'Nakit', card: 'Kredi Kartı' };

let records = loadRecords();
let currentRange = 'today';
let editingId = null;

function loadRecords() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecords() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function addDays(dateStr, days) {
  const d = new Date(dateStr + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

function startOfWeek(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  const day = (d.getDay() + 6) % 7; // Monday = 0
  return addDays(dateStr, -day);
}

function startOfMonth(dateStr) {
  return dateStr.slice(0, 7) + '-01';
}

function endOfMonth(dateStr) {
  const d = new Date(dateStr.slice(0, 7) + '-01T00:00:00');
  d.setMonth(d.getMonth() + 1);
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

function getDateRange() {
  const today = todayStr();
  switch (currentRange) {
    case 'today':
      return { start: today, end: today, label: 'Bugünkü Kayıtlar' };
    case 'yesterday': {
      const y = addDays(today, -1);
      return { start: y, end: y, label: 'Dünkü Kayıtlar' };
    }
    case 'week':
      return { start: startOfWeek(today), end: today, label: 'Bu Haftaki Kayıtlar' };
    case 'month':
      return { start: startOfMonth(today), end: endOfMonth(today), label: 'Bu Ayki Kayıtlar' };
    case 'custom': {
      const val = document.getElementById('custom-date').value || today;
      return { start: val, end: val, label: `${formatDate(val)} Kayıtları` };
    }
    case 'range': {
      const start = document.getElementById('range-start').value || today;
      const end = document.getElementById('range-end').value || today;
      return { start, end, label: `${formatDate(start)} – ${formatDate(end)} Kayıtları` };
    }
    default:
      return { start: today, end: today, label: 'Kayıtlar' };
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatAmount(amount) {
  return amount.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function filteredRecords() {
  const { start, end } = getDateRange();
  return records
    .filter(r => r.date >= start && r.date <= end)
    .sort((a, b) => b.date.localeCompare(a.date));
}

function groupByCurrency(list) {
  const totals = {};
  list.forEach(r => {
    totals[r.currency] = (totals[r.currency] || 0) + r.amount;
  });
  return totals;
}

function renderAmountsByCurrency(container, totals) {
  const keys = Object.keys(totals);
  if (keys.length === 0) {
    container.innerHTML = '<span class="empty">— kayıt yok —</span>';
    return;
  }
  container.innerHTML = keys
    .sort()
    .map(cur => `<div class="amount-row">${CURRENCY_SYMBOLS[cur]} ${formatAmount(totals[cur])}</div>`)
    .join('');
}

function renderSummary(list) {
  const income = list.filter(r => r.type === 'income');
  const expense = list.filter(r => r.type === 'expense');
  const treat = list.filter(r => r.type === 'treat');
  const incomeTotals = groupByCurrency(income);
  const expenseTotals = groupByCurrency(expense);
  const treatTotals = groupByCurrency(treat);

  const balanceTotals = {};
  Object.keys(incomeTotals).forEach(cur => {
    balanceTotals[cur] = (balanceTotals[cur] || 0) + incomeTotals[cur];
  });
  Object.keys(expenseTotals).forEach(cur => {
    balanceTotals[cur] = (balanceTotals[cur] || 0) - expenseTotals[cur];
  });

  renderAmountsByCurrency(document.getElementById('summary-income'), incomeTotals);
  renderAmountsByCurrency(document.getElementById('summary-expense'), expenseTotals);
  renderAmountsByCurrency(document.getElementById('summary-balance'), balanceTotals);
  renderAmountsByCurrency(document.getElementById('summary-treat'), treatTotals);
}

function renderTable(list) {
  const tbody = document.getElementById('table-body');
  const emptyState = document.getElementById('empty-state');
  const { label } = getDateRange();

  document.getElementById('table-title').textContent = label;
  document.getElementById('table-count').textContent = `${list.length} kayıt`;

  if (list.length === 0) {
    tbody.innerHTML = '';
    emptyState.hidden = false;
    return;
  }
  emptyState.hidden = true;

  tbody.innerHTML = list.map(r => `
    <tr>
      <td>${formatDate(r.date)}</td>
      <td>${escapeHtml(r.description)}</td>
      <td>${escapeHtml(r.category) || '—'}</td>
      <td><span class="badge ${r.type}">${typeLabel(r.type)}</span></td>
      <td class="amount-cell ${r.type}">${CURRENCY_SYMBOLS[r.currency]} ${formatAmount(r.amount)}</td>
      <td>${PAYMENT_LABELS[r.paymentMethod] || '—'}</td>
      <td>
        <div class="row-actions">
          <button class="icon-btn" data-edit="${r.id}">Düzenle</button>
          <button class="icon-btn danger" data-delete="${r.id}">Sil</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function typeLabel(type) {
  if (type === 'income') return 'Gelir';
  if (type === 'expense') return 'Gider';
  return 'İkram';
}

function escapeHtml(str) {
  if (!str) return '';
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

function render() {
  const list = filteredRecords();
  renderSummary(list);
  renderTable(list);
}

// ---- Filter chips ----
document.getElementById('filter-chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  currentRange = chip.dataset.range;

  document.getElementById('custom-date-field').hidden = currentRange !== 'custom';
  document.getElementById('range-start-field').hidden = currentRange !== 'range';
  document.getElementById('range-end-field').hidden = currentRange !== 'range';

  if (currentRange === 'custom' && !document.getElementById('custom-date').value) {
    document.getElementById('custom-date').value = todayStr();
  }
  if (currentRange === 'range') {
    if (!document.getElementById('range-start').value) document.getElementById('range-start').value = todayStr();
    if (!document.getElementById('range-end').value) document.getElementById('range-end').value = todayStr();
  }
  render();
});

document.getElementById('custom-date').addEventListener('change', render);
document.getElementById('range-start').addEventListener('change', render);
document.getElementById('range-end').addEventListener('change', render);

// ---- Table row actions ----
document.getElementById('table-body').addEventListener('click', e => {
  const editId = e.target.dataset.edit;
  const deleteId = e.target.dataset.delete;
  if (editId) openModal(editId);
  if (deleteId) {
    if (confirm('Bu kaydı silmek istediğinize emin misiniz?')) {
      records = records.filter(r => r.id !== deleteId);
      saveRecords();
      render();
    }
  }
});

// ---- Modal ----
const overlay = document.getElementById('modal-overlay');
const form = document.getElementById('record-form');
let selectedType = 'income';

function openModal(id = null) {
  editingId = id;
  const record = id ? records.find(r => r.id === id) : null;

  document.getElementById('modal-title').textContent = record ? 'Kaydı Düzenle' : 'Yeni Kayıt';
  document.getElementById('record-id').value = id || '';
  document.getElementById('field-description').value = record ? record.description : '';
  document.getElementById('field-amount').value = record ? record.amount : '';
  document.getElementById('field-currency').value = record ? record.currency : 'TRY';
  document.getElementById('field-date').value = record ? record.date : todayStr();
  document.getElementById('field-category').value = record ? record.category : '';
  document.getElementById('field-payment').value = record ? (record.paymentMethod || 'cash') : 'cash';

  selectedType = record ? record.type : 'income';
  updateTypeButtons();

  overlay.hidden = false;
}

function closeModal() {
  overlay.hidden = true;
  form.reset();
  editingId = null;
}

function updateTypeButtons() {
  document.querySelectorAll('.type-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === selectedType);
  });
}

document.querySelectorAll('.type-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    selectedType = btn.dataset.type;
    updateTypeButtons();
  });
});

document.getElementById('add-btn').addEventListener('click', () => openModal());
document.getElementById('modal-close').addEventListener('click', closeModal);
document.getElementById('cancel-btn').addEventListener('click', closeModal);
overlay.addEventListener('click', e => {
  if (e.target === overlay) closeModal();
});

form.addEventListener('submit', e => {
  e.preventDefault();

  const data = {
    type: selectedType,
    description: document.getElementById('field-description').value.trim(),
    amount: parseFloat(document.getElementById('field-amount').value),
    currency: document.getElementById('field-currency').value,
    date: document.getElementById('field-date').value,
    category: document.getElementById('field-category').value.trim(),
    paymentMethod: document.getElementById('field-payment').value,
  };

  if (!data.description || !data.amount || !data.date) return;

  if (editingId) {
    const idx = records.findIndex(r => r.id === editingId);
    records[idx] = { ...records[idx], ...data };
  } else {
    records.push({ id: crypto.randomUUID(), ...data });
  }

  saveRecords();
  closeModal();
  render();
});

// ---- Init ----
render();
