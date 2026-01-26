(() => {
  // ===== CONFIG =====
  const CAMPAIGN_ID = "fm-valentines-2026";

  // Set your dates later (you said you'll tell exact period)
  // If you want ALWAYS ON for now, set very wide range:
  const START = "2026-01-01T00:00:00";
  const END   = "2026-03-01T00:00:00";

  const ASSET_BASE = "/assets/campaigns/valentines-2026/";
  const DESKTOP_IMG = ASSET_BASE + "popup-desktop.jpg";
  const MOBILE_IMG  = ASSET_BASE + "popup-mobile.jpg";

  const CATALOG_URL = "/catalog.html"; // or "/catalog.html#valentines"

  // Replace 40XXXXXXXXX with your real number (no +)
  const WHATSAPP_URL =
    "https://wa.me/40XXXXXXXXX?text=" +
    encodeURIComponent("Bună! Vreau să comand din colecția Valentine’s Flor Mellow.");

  // Text overlay (premium red + ivory)
  const HEADLINE_HTML = `
    <p class="vday-main">
      <span class="red">Valentine’s</span>
      <span class="ivory"> vine după colț</span>
    </p>
    <svg class="vday-ornament" viewBox="0 0 200 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M10 10 C40 2, 60 2, 90 10 C120 18, 140 18, 190 10" fill="none" stroke="rgba(255,255,255,0.85)" stroke-width="2" stroke-linecap="round"/>
    </svg>
    <div class="vday-sub">Colecție limitată • Comandă rapid</div>
  `;

  const BTN_PRIMARY = "Vezi colecția";
  const BTN_SECONDARY = "Comandă pe WhatsApp";
  // ==================

  const now = new Date();
  const start = new Date(START);
  const end = new Date(END);
  if (now < start || now > end) return;

  // Prevent double inject
  if (document.getElementById(CAMPAIGN_ID)) return;

  // Build overlay
  const overlay = document.createElement("div");
  overlay.className = "fm-vday-overlay";
  overlay.id = CAMPAIGN_ID;

  const modal = document.createElement("div");
  modal.className = "fm-vday-modal";

  // Choose image based on screen width
  const img = document.createElement("img");
  img.className = "fm-vday-media";
  img.alt = "Flor Mellow Valentine’s";
  img.loading = "eager";
  img.src = (window.innerWidth <= 640) ? MOBILE_IMG : DESKTOP_IMG;

  // Headline overlay
  const headline = document.createElement("div");
  headline.className = "fm-vday-headline";
  headline.innerHTML = HEADLINE_HTML;

  // Buttons
  const ui = document.createElement("div");
  ui.className = "fm-vday-ui";

  const btnSecondary = document.createElement("button");
  btnSecondary.className = "fm-vday-btn secondary";
  btnSecondary.innerHTML = `<span class="fm-vday-wa-dot"></span><span>${BTN_SECONDARY}</span>`;
  btnSecondary.onclick = () => window.open(WHATSAPP_URL, "_blank", "noopener");

  const btnPrimary = document.createElement("button");
  btnPrimary.className = "fm-vday-btn primary";
  btnPrimary.textContent = BTN_PRIMARY;
  btnPrimary.onclick = () => window.location.href = CATALOG_URL;

  ui.appendChild(btnSecondary);
  ui.appendChild(btnPrimary);

  // Close button
  const close = document.createElement("button");
  close.className = "fm-vday-close";
  close.setAttribute("aria-label", "Închide");
  close.textContent = "×";
  close.onclick = () => overlay.remove();

  // Assemble
  modal.appendChild(img);
  modal.appendChild(headline);
  modal.appendChild(ui);
  modal.appendChild(close);

  overlay.appendChild(modal);

  // Close when clicking outside
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  // ESC closes
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById(CAMPAIGN_ID)) overlay.remove();
  });

  // Show every time (as requested)
  setTimeout(() => document.body.appendChild(overlay), 350);
})();
