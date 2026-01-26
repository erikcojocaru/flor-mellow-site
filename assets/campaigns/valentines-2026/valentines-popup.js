(() => {
  const ID = "fmvp-valentines-2026";

  // Ajustezi tu perioada ulterior
  const START = "2026-01-01T00:00:00";
  const END   = "2026-03-01T00:00:00";

  const BASE = "/assets/campaigns/valentines-2026/";
  const DESKTOP_IMG = BASE + "popup-desktop.jpg"; // IMAGINE FARA TEXT
  const MOBILE_IMG  = BASE + "popup-mobile.jpg";  // IMAGINE FARA TEXT

  const CATALOG_URL = "/catalog.html";
  const WHATSAPP_URL =
    "https://wa.me/40XXXXXXXXX?text=" +
    encodeURIComponent("Bună! Vreau să comand din colecția Valentine’s Flor Mellow.");

  const now = new Date();
  if (now < new Date(START) || now > new Date(END)) return;
  if (document.getElementById(ID)) return;

  const overlay = document.createElement("div");
  overlay.className = "fmvp-overlay";
  overlay.id = ID;

  const modal = document.createElement("div");
  modal.className = "fmvp-modal";

  const img = document.createElement("img");
  img.className = "fmvp-img";
  img.alt = "Flor Mellow Valentine’s";
  img.loading = "eager";
  img.src = (window.innerWidth <= 640) ? MOBILE_IMG : DESKTOP_IMG;

  const head = document.createElement("div");
  head.className = "fmvp-head";
  head.innerHTML = `
    <h2 class="fmvp-title">Valentine’s</h2>
    <div class="fmvp-sub">vine după colț</div>

    <svg class="fmvp-flourish" viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M20 12 C55 3, 85 3, 110 12 C120 18, 120 18, 130 12 C155 3, 185 3, 220 12"
            fill="none" stroke="rgba(215,173,102,.88)" stroke-width="2" stroke-linecap="round"/>
      <path d="M120 12 c -10 -6 -10 6 0 0 c 10 -6 10 6 0 0"
            fill="none" stroke="rgba(215,173,102,.75)" stroke-width="1.6" stroke-linecap="round"/>
    </svg>

    <div class="fmvp-note">Colecție limitată • Comandă rapid</div>
  `;

  const ui = document.createElement("div");
  ui.className = "fmvp-ui";

  const btnWA = document.createElement("button");
  btnWA.className = "fmvp-btn fmvp-btn-wa";
  btnWA.innerHTML = `<span class="fmvp-wa-dot"></span><span>Comandă pe WhatsApp</span>`;
  btnWA.onclick = () => window.open(WHATSAPP_URL, "_blank", "noopener");

  const btnCTA = document.createElement("button");
  btnCTA.className = "fmvp-btn fmvp-btn-cta";
  btnCTA.textContent = "Vezi colecția";
  btnCTA.onclick = () => (window.location.href = CATALOG_URL);

  ui.appendChild(btnWA);
  ui.appendChild(btnCTA);

  const close = document.createElement("button");
  close.className = "fmvp-close";
  close.setAttribute("aria-label", "Închide");
  close.textContent = "×";
  close.onclick = () => overlay.remove();

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById(ID)) overlay.remove();
  });

  modal.appendChild(img);
  modal.appendChild(head);
  modal.appendChild(ui);
  modal.appendChild(close);
  overlay.appendChild(modal);

  setTimeout(() => document.body.appendChild(overlay), 150);
})();
