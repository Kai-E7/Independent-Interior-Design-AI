const products = {
  floor: [
    { id: "oak", name: "Eiche Natur", detail: "Landhausdiele · matt", price: 46.9, unit: "m²", color: "#b98c59", pattern: "repeating-linear-gradient(92deg, rgba(255,255,255,.12) 0 2px, transparent 2px 54px), repeating-linear-gradient(0deg, rgba(75,45,20,.17) 0 1px, transparent 1px 12px)", size: "auto" },
    { id: "walnut", name: "Nussbaum", detail: "Dunkel · geölt", price: 62.5, unit: "m²", color: "#72503b", pattern: "repeating-linear-gradient(91deg, rgba(255,255,255,.07) 0 1px, transparent 1px 46px), repeating-linear-gradient(0deg, rgba(30,18,10,.2) 0 1px, transparent 1px 11px)" },
    { id: "sand-tile", name: "Fliese Sand", detail: "Feinsteinzeug · 60×60", price: 39.9, unit: "m²", color: "#c9b99f", pattern: "linear-gradient(rgba(255,255,255,.28) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.28) 1px, transparent 1px)", size: "58px 58px" },
    { id: "terrazzo", name: "Terrazzo", detail: "Warmgrau · matt", price: 54.9, unit: "m²", color: "#ada89e", pattern: "radial-gradient(circle at 12px 15px, #e8dfd2 0 2px, transparent 3px), radial-gradient(circle at 35px 29px, #7d756c 0 1.5px, transparent 2px), radial-gradient(circle at 23px 42px, #d3bea0 0 2px, transparent 3px)", size: "48px 48px" },
    { id: "travertine", name: "Travertin", detail: "Natursteinoptik", price: 71, unit: "m²", color: "#c8b79b", pattern: "repeating-linear-gradient(174deg, transparent 0 14px, rgba(255,255,255,.15) 15px, transparent 17px, rgba(95,71,43,.11) 18px, transparent 20px)" }
  ],
  wall: [
    { id: "warm-white", name: "Warmweiß", detail: "Innenfarbe · stumpfmatt", price: 8.9, unit: "L", coverage: 8, color: "#eee8dc", pattern: "none" },
    { id: "sage", name: "Salbeigrün", detail: "Innenfarbe · matt", price: 10.9, unit: "L", coverage: 8, color: "#a9b6a2", pattern: "none" },
    { id: "greige", name: "Soft Greige", detail: "Innenfarbe · matt", price: 9.9, unit: "L", coverage: 8, color: "#b8afa1", pattern: "none" },
    { id: "clay", name: "Lehmputz", detail: "Mineralisch · fein", price: 18.5, unit: "m²", color: "#ae846b", pattern: "radial-gradient(circle at 8px 9px, rgba(255,255,255,.11) 0 1px, transparent 1.5px), radial-gradient(circle at 20px 17px, rgba(65,40,28,.08) 0 1px, transparent 1.5px)", size: "25px 25px" },
    { id: "limewash", name: "Kalkweiß", detail: "Kalkfarbe · wolkig", price: 12.5, unit: "L", coverage: 7, color: "#d9d3c6", pattern: "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,.14), transparent 42%), radial-gradient(ellipse at 75% 65%, rgba(100,90,75,.08), transparent 40%)", size: "130px 110px" }
  ],
  ceiling: [
    { id: "ceiling-white", name: "Deckenweiß", detail: "Hohe Deckkraft · matt", price: 7.9, unit: "L", coverage: 8, color: "#f4f2ea", pattern: "none" },
    { id: "ceiling-warm", name: "Warmweiß", detail: "Wohnlich · matt", price: 9.5, unit: "L", coverage: 8, color: "#e8dfd1", pattern: "none" },
    { id: "acoustic", name: "Akustikputz", detail: "Feinkörnig · weiß", price: 22, unit: "m²", color: "#dddcd5", pattern: "radial-gradient(circle, rgba(80,80,75,.16) 0 1px, transparent 1.3px)", size: "7px 7px" }
  ]
};

const state = {
  surface: "floor",
  selected: { floor: "oak", wall: "warm-white", ceiling: "ceiling-white" },
  dimensions: { length: 5.2, width: 4.1, height: 2.7, openings: 4.2 },
  labor: false,
  photoUrl: null
};

const labels = { floor: "Boden", wall: "Wände", ceiling: "Decke" };
const euro = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });
const number = new Intl.NumberFormat("de-DE", { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const frame = document.querySelector("[data-photo-frame]");
const catalog = document.querySelector("[data-products]");
const catalogTitle = document.querySelector("#catalog-title");
const selectedProduct = document.querySelector("[data-selected-product]");
const lines = document.querySelector("[data-estimate-lines]");
const toast = document.querySelector("[data-toast]");

function getProduct(surface) {
  return products[surface].find((item) => item.id === state.selected[surface]);
}

function applyMaterial(surface) {
  const product = getProduct(surface);
  document.querySelectorAll(`[data-mask="${surface}"]`).forEach((mask) => {
    mask.style.setProperty("--surface-color", product.color);
    mask.style.setProperty("--surface-pattern", product.pattern || "none");
    mask.style.setProperty("--surface-size", product.size || "auto");
  });
}

function setSurface(surface) {
  state.surface = surface;
  document.querySelectorAll("[data-surface]").forEach((button) => {
    const active = button.dataset.surface === surface;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  document.querySelectorAll("[data-surface-shortcut]").forEach((button) => button.classList.toggle("active", button.dataset.surfaceShortcut === surface));
  document.querySelectorAll("[data-mask]").forEach((mask) => mask.classList.toggle("is-active", mask.dataset.mask === surface));
  catalogTitle.textContent = `Wähle ${surface === "floor" ? "einen Boden" : surface === "wall" ? "eine Wandoberfläche" : "eine Decke"}`;
  renderProducts();
}

function renderProducts() {
  catalog.innerHTML = products[state.surface].map((product) => `
    <button class="product-card ${state.selected[state.surface] === product.id ? "active" : ""}" type="button" data-product="${product.id}">
      <span class="product-swatch" style="--swatch-color:${product.color};--swatch-pattern:${product.pattern || "none"};--swatch-size:${product.size || "auto"}"></span>
      <span class="product-meta"><b>${product.name}</b><small>${euro.format(product.price)} / ${product.unit}</small></span>
    </button>`).join("");
  const product = getProduct(state.surface);
  selectedProduct.innerHTML = `<div><b>${product.name}</b><small>${product.detail} · Musterprodukt</small></div><strong>${euro.format(product.price)} / ${product.unit}</strong>`;
  catalog.querySelectorAll("[data-product]").forEach((button) => button.addEventListener("click", () => {
    state.selected[state.surface] = button.dataset.product;
    applyMaterial(state.surface);
    renderProducts();
    renderEstimate();
  }));
}

function calculateSurface(surface) {
  const { length, width, height, openings } = state.dimensions;
  const area = surface === "wall" ? Math.max(0, 2 * (length + width) * height - openings) : length * width;
  const waste = surface === "floor" ? 1.1 : 1.05;
  const billedArea = area * waste;
  const product = getProduct(surface);
  const isLiquid = product.unit === "L";
  const quantity = isLiquid ? Math.ceil((billedArea * 2) / product.coverage) : billedArea;
  const material = quantity * product.price;
  const laborRates = { floor: 32, wall: 14, ceiling: 16 };
  const labor = state.labor ? area * laborRates[surface] : 0;
  return { area, billedArea, quantity, material, labor, product, isLiquid };
}

function renderEstimate() {
  const results = ["floor", "wall", "ceiling"].map((surface) => ({ surface, ...calculateSurface(surface) }));
  lines.innerHTML = results.map((item) => `
    <div class="estimate-line">
      <div><span>${labels[item.surface]} · ${item.product.name}</span><small>${number.format(item.area)} m² Fläche · ${item.isLiquid ? `${item.quantity} L bei 2 Anstrichen` : `${number.format(item.quantity)} m² inkl. Verschnitt`}</small></div>
      <strong>${euro.format(item.material + item.labor)}</strong>
    </div>`).join("");
  const total = results.reduce((sum, item) => sum + item.material + item.labor, 0);
  document.querySelector("[data-total]").textContent = euro.format(total);
  document.querySelector("[data-total-note]").textContent = state.labor ? "Material, Verschnitt & Demo-Arbeitslohn · inkl. MwSt." : "Material inkl. Verschnitt · inkl. MwSt.";
  document.querySelector("[data-summary-length]").textContent = `${state.dimensions.length.toLocaleString("de-DE", { minimumFractionDigits: 2 })} m`;
  document.querySelector("[data-summary-width]").textContent = `${state.dimensions.width.toLocaleString("de-DE", { minimumFractionDigits: 2 })} m`;
  document.querySelector("[data-summary-height]").textContent = `${state.dimensions.height.toLocaleString("de-DE", { minimumFractionDigits: 2 })} m`;
  return { results, total };
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("visible"), 2400);
}

function saveDesign() {
  const payload = { selected: state.selected, dimensions: state.dimensions, labor: state.labor, savedAt: new Date().toISOString() };
  localStorage.setItem("raumly-surface-design", JSON.stringify(payload));
  showToast("Variante auf diesem Gerät gespeichert");
}

async function shareEstimate() {
  const { results, total } = renderEstimate();
  const detail = results.map((item) => `${labels[item.surface]}: ${item.product.name} (${euro.format(item.material + item.labor)})`).join("\n");
  const text = `raumly Surface Estimate\n${detail}\nGesamt: ${euro.format(total)}\nUnverbindliche Demo-Schätzung.`;
  if (navigator.share) {
    try { await navigator.share({ title: "raumly Surface Estimate", text }); return; } catch (error) { if (error.name === "AbortError") return; }
  }
  try { await navigator.clipboard.writeText(text); showToast("Estimate kopiert"); }
  catch { showToast("Teilen wird von diesem Browser nicht unterstützt"); }
}

document.querySelectorAll("[data-surface]").forEach((button) => button.addEventListener("click", () => setSurface(button.dataset.surface)));
document.querySelectorAll("[data-surface-shortcut]").forEach((button) => button.addEventListener("click", () => setSurface(button.dataset.surfaceShortcut)));
document.querySelectorAll("[data-save-design]").forEach((button) => button.addEventListener("click", saveDesign));
document.querySelector("[data-share-estimate]").addEventListener("click", shareEstimate);

document.querySelector("[data-toggle-measures]").addEventListener("click", (event) => {
  const form = document.querySelector("[data-measurement-form]");
  form.hidden = !form.hidden;
  event.currentTarget.textContent = form.hidden ? "Maße ändern" : "Fertig";
});

document.querySelectorAll("[data-measure]").forEach((input) => input.addEventListener("input", () => {
  const value = Number.parseFloat(input.value);
  if (Number.isFinite(value)) state.dimensions[input.dataset.measure] = value;
  renderEstimate();
}));

document.querySelector("[data-labor-toggle]").addEventListener("change", (event) => {
  state.labor = event.target.checked;
  renderEstimate();
});

const compareButton = document.querySelector("[data-compare]");
const showOriginal = () => { frame.classList.add("show-original"); compareButton.setAttribute("aria-pressed", "true"); };
const hideOriginal = () => { frame.classList.remove("show-original"); compareButton.setAttribute("aria-pressed", "false"); };
["pointerdown", "touchstart"].forEach((name) => compareButton.addEventListener(name, showOriginal, { passive: true }));
["pointerup", "pointercancel", "pointerleave", "touchend"].forEach((name) => compareButton.addEventListener(name, hideOriginal, { passive: true }));

document.querySelector("#room-photo").addEventListener("change", (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  if (!file.type.startsWith("image/")) { showToast("Bitte ein Bild auswählen"); return; }
  const progress = document.querySelector("[data-scan-progress]");
  progress.classList.add("visible");
  if (state.photoUrl) URL.revokeObjectURL(state.photoUrl);
  state.photoUrl = URL.createObjectURL(file);
  window.setTimeout(() => {
    const image = document.querySelector("[data-room-photo]");
    image.src = state.photoUrl;
    frame.style.setProperty("--user-photo", `url("${state.photoUrl}")`);
    frame.classList.add("user-photo");
    progress.classList.remove("visible");
    showToast("Foto geladen · Demo-Masken angewendet");
  }, 900);
});

document.querySelectorAll(".mobile-nav a").forEach((link) => link.addEventListener("click", () => {
  document.querySelectorAll(".mobile-nav a").forEach((item) => item.classList.toggle("active", item === link));
}));

try {
  const saved = JSON.parse(localStorage.getItem("raumly-surface-design"));
  if (saved?.selected) state.selected = { ...state.selected, ...saved.selected };
  if (saved?.dimensions) {
    state.dimensions = { ...state.dimensions, ...saved.dimensions };
    document.querySelectorAll("[data-measure]").forEach((input) => { input.value = state.dimensions[input.dataset.measure]; });
  }
  if (typeof saved?.labor === "boolean") {
    state.labor = saved.labor;
    document.querySelector("[data-labor-toggle]").checked = state.labor;
  }
} catch { /* Ignore invalid local data. */ }

["floor", "wall", "ceiling"].forEach(applyMaterial);
setSurface("floor");
renderEstimate();
