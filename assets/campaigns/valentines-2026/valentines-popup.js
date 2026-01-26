(() => {
  // === CONFIG (edit these only) ===
  const CAMPAIGN_ID = "fm-valentines-2026";
  const START = "2026-01-25T00:00:00"; // change when you want
  const END   = "2026-02-16T00:00:00"; // change when you want

  const ASSET_BASE = "/assets/campaigns/valentines-2026/";
  const DESKTOP_IMG = ASSET_BASE + "popup-desktop.jpg";
  const MOBILE_IMG  = ASSET_BASE + "popup-mobile.jpg";

  const CATALOG_URL = "/catalog.html"; // or "/catalog.html#valentines"
  const WHATSAPP_URL =
    "https://wa.me/40XXXXXXXXX?text=" + encodeURIComponent("Bună! Vreau să comand din colecția Valentine’s Flor Mellow.");

  const TITLE = "Valentine’s vine după colț";
  const SUBTITLE = "Colecție limitată • Comandă rapid";
  const BTN_PRIMARY = "Vezi colecția";
  const BTN_SECONDARY = "Comandă pe WhatsApp";
  // ===============================

  const now = new Date();
  const start = new Date(START);
  const end = new Date(END);
  if (now < start || now > end) return;

  // prevent double inject
  if (document.getElementById(CAMPAIGN_ID)) return;

  const overlay = document.createElement("div");
  overlay.className = "fm-vday-overlay";
  overlay.id = CAMPAIGN_ID;

  const modal = document.createElement("div");
  modal.className = "fm-vday-modal";

  const img = document.createElement("img");
  img.className = "fm-vday-media";
  img.alt = "Flor Mellow Valentine’s";
  img.loading = "eager";
  img.src = (window.innerWidth <= 640) ? MOBILE_IMG : DESKTOP_IMG;

  const badge = document.createElement("div");
  badge.className = "fm-vday-badge";
  badge.innerHTML = `
    <span class="fm-vday-title">${TITLE}</span>
    <span class="fm-vday-sub">${SUBTITLE}</span>
  `;

  const ui = document.createElement("div");
  ui.className = "fm-vday-ui";

  const btnPrimary = document.createElement("button");
  btnPrimary.className = "fm-vday-btn primary";
  btnPrimary.textContent = BTN_PRIMARY;
  btnPrimary.onclick = () => window.location.href = CATALOG_URL;

  const btnSecondary = document.createElement("button");
  btnSecondary.className = "fm-vday-btn secondary";
  btnSecondary.textContent = BTN_SECONDARY;
  btnSecondary.onclick = () => window.open(WHATSAPP_URL, "_blank", "noopener");

  const close = document.createElement("button");
  close.className = "fm-vday-close";
  close.setAttribute("aria-label", "Închide");
  close.textContent = "×";
  close.onclick = () => overlay.remove();

  ui.appendChild(btnSecondary);
  ui.appendChild(btnPrimary);

  modal.appendChild(img);
  modal.appendChild(badge);
  modal.appendChild(ui);
  modal.appendChild(close);

  overlay.appendChild(modal);

  // close when clicking outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById(CAMPAIGN_ID)) overlay.remove();
  });

  // show with tiny delay for nicer load
  setTimeout(() => document.body.appendChild(overlay), 350);
})();
