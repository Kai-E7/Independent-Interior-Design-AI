const products = [
  { id: 'sofa', name: 'Sofa Lennon', detail: 'Bouclé · Creme · 282 cm', shop: 'Westwing', price: 1499, category: 'möbel', icon: '🛋️', color: '#e8e0d5' },
  { id: 'chair', name: 'Lounge Chair Bogen', detail: 'Leder · Cognac', shop: 'Bolia', price: 849, category: 'möbel', icon: '🪑', color: '#d7c0a6' },
  { id: 'table', name: 'Couchtisch Teso', detail: 'Travertin · 110 cm', shop: 'Westwing', price: 549, category: 'möbel', icon: '◉', color: '#e9e2d4' },
  { id: 'rug', name: 'Wollteppich Lindi', detail: 'Natur · 200 × 300 cm', shop: 'IKEA', price: 399, category: 'deko', icon: '▧', color: '#ded5c4' },
  { id: 'lamp', name: 'Stehleuchte Arum', detail: 'Schwarz · 136 cm', shop: 'Nordic Nest', price: 315, category: 'licht', icon: '💡', color: '#d8d8d2' },
  { id: 'sideboard', name: 'Sideboard Eiche', detail: 'Natur · 160 cm', shop: 'home24', price: 189, category: 'möbel', icon: '▤', color: '#d9c4a7' },
  { id: 'vase', name: 'Vase Aer', detail: 'Rauchglas · 33 cm', shop: 'HAY', price: 42, category: 'deko', icon: '♙', color: '#cdd4cc' }
];

const money = value => new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(value);
const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const cart = new Set();
let scanStep = 1;
let toastTimer;

function toast(message) {
  const element = $('[data-toast]');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 2600);
}

function renderProducts(filter = 'all') {
  const grid = $('[data-product-grid]');
  grid.innerHTML = products.map(product => `
    <article class="product-card ${filter !== 'all' && filter !== product.category ? 'hidden' : ''}" data-product="${product.id}" data-category="${product.category}">
      <div class="product-image" style="--thumb:${product.color}">
        <span class="shop-tag">${product.shop}</span>
        <button class="favorite" aria-label="${product.name} merken">♡</button>
        <span class="product-shape" aria-hidden="true">${product.icon}</span>
        <button class="add-product ${cart.has(product.id) ? 'added' : ''}" data-add="${product.id}" aria-label="${product.name} zur Liste hinzufügen">${cart.has(product.id) ? '✓' : '+'}</button>
      </div>
      <div class="product-info"><h3>${product.name}</h3><p>${product.detail}</p><span class="product-price">${money(product.price)}</span></div>
    </article>`).join('');

  grid.querySelectorAll('[data-add]').forEach(button => button.addEventListener('click', () => toggleCart(button.dataset.add)));
  grid.querySelectorAll('.favorite').forEach(button => button.addEventListener('click', () => {
    button.classList.toggle('liked');
    button.textContent = button.classList.contains('liked') ? '♥' : '♡';
    toast(button.classList.contains('liked') ? 'Zu deinen Favoriten hinzugefügt' : 'Aus Favoriten entfernt');
  }));
}

function renderMiniProducts() {
  $('[data-mini-products]').innerHTML = products.map(product => `<div class="mini-product"><span class="mini-thumb" style="--thumb:${product.color}">${product.icon}</span><div><b>${product.name}</b><small>${product.shop} · ${money(product.price)}</small></div><button data-add="${product.id}">${cart.has(product.id) ? '✓' : '+'}</button></div>`).join('');
  $$('[data-mini-products] [data-add]').forEach(button => button.addEventListener('click', () => toggleCart(button.dataset.add)));
}

function toggleCart(id, forceAdd = false) {
  const product = products.find(item => item.id === id);
  if (cart.has(id) && !forceAdd) { cart.delete(id); toast(`${product.name} entfernt`); }
  else { cart.add(id); toast(`${product.name} zur Liste hinzugefügt`); }
  updateCart();
  const activeFilter = $('.filter-pills .active')?.dataset.filter || 'all';
  renderProducts(activeFilter);
  renderMiniProducts();
}

function updateCart() {
  const count = $('[data-cart-count]');
  count.textContent = cart.size;
  count.classList.toggle('has-items', cart.size > 0);
  const selected = products.filter(product => cart.has(product.id));
  $('[data-cart-items]').innerHTML = selected.map(product => `<div class="cart-item"><span class="cart-thumb" style="--thumb:${product.color}">${product.icon}</span><div><b>${product.name}</b><small>${product.shop} · ${money(product.price)}</small></div><button data-remove="${product.id}" aria-label="Entfernen">×</button></div>`).join('');
  $('[data-cart-total]').textContent = money(selected.reduce((sum, product) => sum + product.price, 0));
  $('[data-cart-empty]').classList.toggle('hidden', selected.length > 0);
  $$('[data-cart-items] [data-remove]').forEach(button => button.addEventListener('click', () => toggleCart(button.dataset.remove)));
}

function openDrawer() {
  $('[data-cart-drawer]').classList.add('open');
  $('[data-drawer-backdrop]').classList.add('open');
  $('[data-cart-drawer]').setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
}
function closeDrawer() {
  $('[data-cart-drawer]').classList.remove('open');
  $('[data-drawer-backdrop]').classList.remove('open');
  $('[data-cart-drawer]').setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function openModal(modal) {
  modal.classList.add('open');
  modal.setAttribute('aria-hidden', 'false');
  document.body.classList.add('modal-open');
  setTimeout(() => $('input,button,select', modal)?.focus(), 50);
}
function closeModal(modal) {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden', 'true');
  document.body.classList.remove('modal-open');
}

function updateScanStep() {
  $$('[data-step]').forEach(step => step.classList.toggle('active', Number(step.dataset.step) === scanStep));
  $$('[data-step-indicator]').forEach(item => {
    const number = Number(item.dataset.stepIndicator);
    item.classList.toggle('active', number === scanStep);
    item.classList.toggle('done', number < scanStep);
    if (number < scanStep) item.querySelector(':scope > span').textContent = '✓';
    else item.querySelector(':scope > span').textContent = number;
  });
  $('.scan-progress i').style.width = `${scanStep * 25}%`;
  $('[data-scan-back]').classList.toggle('hidden', scanStep === 1);
  $('[data-scan-next]').innerHTML = scanStep === 4 ? 'Entwurf erstellen <span>✦</span>' : 'Weiter <span>→</span>';
}

function handleFiles(files) {
  const names = [...files].slice(0, 6);
  $('[data-file-list]').innerHTML = names.map(file => `<span class="file-chip">✓ ${file.name}</span>`).join('');
  if (names.length) toast(`${names.length} Datei${names.length > 1 ? 'en' : ''} bereit`);
}

renderProducts();
renderMiniProducts();
updateCart();

const revealObserver = new IntersectionObserver(entries => entries.forEach(entry => {
  if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
}), { threshold: .12 });
$$('.reveal').forEach(element => revealObserver.observe(element));

$$('[data-scan-open]').forEach(button => button.addEventListener('click', () => openModal($('[data-scan-modal]'))));
$$('[data-partner-open]').forEach(button => button.addEventListener('click', () => openModal($('[data-partner-modal]'))));
$$('[data-modal-close]').forEach(button => button.addEventListener('click', () => closeModal(button.closest('.modal-backdrop'))));
$$('.modal-backdrop').forEach(backdrop => backdrop.addEventListener('click', event => { if (event.target === backdrop) closeModal(backdrop); }));
document.addEventListener('keydown', event => { if (event.key === 'Escape') { $$('.modal-backdrop.open').forEach(closeModal); closeDrawer(); } });

$('[data-scan-next]').addEventListener('click', () => {
  if (scanStep < 4) { scanStep += 1; updateScanStep(); }
  else {
    const next = $('[data-scan-next]');
    next.textContent = 'Raum wird analysiert …';
    next.disabled = true;
    setTimeout(() => {
      closeModal($('[data-scan-modal]'));
      $('#studio').scrollIntoView({ behavior: 'smooth' });
      toast('Dein erster Entwurf ist bereit ✦');
      next.disabled = false;
      scanStep = 1;
      next.innerHTML = 'Weiter <span>→</span>';
      updateScanStep();
    }, 1400);
  }
});
$('[data-scan-back]').addEventListener('click', () => { if (scanStep > 1) { scanStep -= 1; updateScanStep(); } });

const dropZone = $('[data-drop-zone]');
const roomFiles = $('[data-room-files]');
roomFiles.addEventListener('change', () => handleFiles(roomFiles.files));
['dragenter','dragover'].forEach(type => dropZone.addEventListener(type, event => { event.preventDefault(); dropZone.classList.add('dragover'); }));
['dragleave','drop'].forEach(type => dropZone.addEventListener(type, event => { event.preventDefault(); dropZone.classList.remove('dragover'); }));
dropZone.addEventListener('drop', event => handleFiles(event.dataTransfer.files));
$('[data-floorplan-file]').addEventListener('change', event => { const file = event.target.files[0]; if (file) { $('[data-floorplan-label]').textContent = `✓ ${file.name}`; toast('Grundriss hinzugefügt'); } });

$$('.style-picker button').forEach(button => button.addEventListener('click', () => {
  if (!button.classList.contains('selected') && $$('.style-picker .selected').length >= 3) return toast('Du kannst bis zu drei Stile wählen');
  button.classList.toggle('selected');
}));

$$('.preference-chips button').forEach(button => button.addEventListener('click', () => button.classList.toggle('selected')));

$('[data-budget-range]').addEventListener('input', event => { $('[data-budget-output]').textContent = money(Number(event.target.value)); });

const compareRange = $('.compare-range');
compareRange.addEventListener('input', event => {
  const value = Number(event.target.value);
  $('[data-before-layer]').style.width = `${value}%`;
  $('[data-before-layer] img').style.width = `${10000 / Math.max(value, 1)}%`;
  $('[data-compare-line]').style.left = `${value}%`;
});

$$('[data-view]').forEach(button => button.addEventListener('click', () => {
  $$('[data-view]').forEach(item => item.classList.toggle('active', item === button));
  $('[data-floorplan]').classList.toggle('visible', button.dataset.view === 'floor');
}));

$$('[data-panel-tab]').forEach(button => button.addEventListener('click', () => {
  $$('[data-panel-tab]').forEach(item => item.classList.toggle('active', item === button));
  $$('[data-panel]').forEach(panel => panel.classList.toggle('hidden', panel.dataset.panel !== button.dataset.panelTab));
}));

$$('.style-option').forEach(button => button.addEventListener('click', () => {
  $$('.style-option').forEach(item => item.classList.toggle('active', item === button));
  $('.panel-content[data-panel="style"] h3').textContent = button.dataset.style;
  $('[data-studio-total]').textContent = money(Number(button.dataset.budget));
  toast(`${button.dataset.style} geladen`);
}));

$('[data-variant]').addEventListener('click', event => {
  const button = event.currentTarget;
  button.textContent = 'Variante wird erstellt …';
  button.disabled = true;
  setTimeout(() => { button.textContent = 'Neue Variante erstellen'; button.disabled = false; toast('Neue Variante „Calm Contrast“ ist bereit'); }, 1300);
});

$$('[data-product-focus]').forEach(button => button.addEventListener('click', () => {
  const id = button.dataset.productFocus;
  const card = $(`[data-product="${id}"]`);
  if (card) { card.scrollIntoView({ behavior: 'smooth', block: 'center' }); setTimeout(() => card.querySelector('.product-image').animate([{ outline: '3px solid #d7e65b' }, { outline: '0 solid transparent' }], { duration: 1200 }), 500); }
}));

$$('[data-filter]').forEach(button => button.addEventListener('click', () => {
  $$('[data-filter]').forEach(item => item.classList.toggle('active', item === button));
  renderProducts(button.dataset.filter);
}));

$$('[data-add-all]').forEach(button => button.addEventListener('click', () => {
  products.forEach(product => cart.add(product.id));
  updateCart(); renderProducts($('.filter-pills .active').dataset.filter); renderMiniProducts(); openDrawer(); toast('Kompletter Look hinzugefügt');
}));

$('[data-cart-open]').addEventListener('click', openDrawer);
$('[data-cart-close]').addEventListener('click', closeDrawer);
$('[data-drawer-backdrop]').addEventListener('click', closeDrawer);
$('[data-checkout]').addEventListener('click', () => cart.size ? toast('Partner-Checkout als nächster Integrationsschritt') : toast('Deine Liste ist noch leer'));
$('[data-share]').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href + '#studio'); toast('Freigabelink kopiert'); }
  catch { toast('Freigabelink ist bereit'); }
});
$('[data-demo-scroll]').addEventListener('click', () => $('#studio').scrollIntoView({ behavior: 'smooth' }));
$('[data-review]').addEventListener('click', event => { event.currentTarget.textContent = '✓ Designer-Check vorgemerkt'; event.currentTarget.disabled = true; toast('Designer-Check hinzugefügt'); });
$('[data-partner-form]').addEventListener('submit', event => { event.preventDefault(); closeModal($('[data-partner-modal]')); event.currentTarget.reset(); toast('Danke! Wir melden uns für deine Partner-Demo.'); });
$$('[data-info]').forEach(button => button.addEventListener('click', () => toast(`${button.dataset.info} wird vor dem Livegang ergänzt`)));

const menuButton = $('.mobile-menu');
menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  toast(open ? 'Menü geschlossen' : 'Nutze die Bereiche direkt auf dieser Seite');
});
