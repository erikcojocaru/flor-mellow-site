(() => {
  const CAMPAIGN_ID = "fm-valentines-2026";

  // schimbi datele când vrei
  const START = "2026-01-01T00:00:00";
  const END   = "2026-03-01T00:00:00";

  const ASSET_BASE = "/assets/campaigns/valentines-2026/";
  const DESKTOP_IMG = ASSET_BASE + "popup-desktop.jpg";
  const MOBILE_IMG  = ASSET_BASE + "popup-mobile.jpg";

  const CATALOG_URL = "/catalog.html"; // sau "/catalog.html#valentines"

  const WHATSAPP_URL =
    "https://wa.me/40XXXXXXXXX?text=" +
    encodeURIComponent("Bună! Vreau să comand din colecția Valentine’s Flor Mellow.");

  const TITLE = "Valentine’s";
  const SUBTITLE = "vine după colț";
  const NOTE = "Colecție limitată • Comandă rapid";

  const BTN_PRIMARY = "Vezi colecția";
  const BTN_SECONDARY = "Comandă pe WhatsApp";

  const now = new Date();
  if (now < new Date(START) || now > new Date(END)) return;

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

  const headline = document.createElement("div");
  headline.className = "fm-vday-headline";
  headline.innerHTML = `
    <p class="fm-vday-title">${TITLE}</p>
    <p class="fm-vday-subtitle">${SUBTITLE}</p>

    <svg class="fm-vday-flourish" viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 12 C44 2, 74 2, 104 12 C120 20, 120 20, 136 12 C166 2, 196 2, 228 12"
            fill="none" stroke="rgba(214,170,92,0.80)" stroke-width="2" stroke-linecap="round"/>
      <path d="M120 12 c -10 -6 -10 6 0 0 c 10 -6 10 6 0 0"
            fill="none" stroke="rgba(214,170,92,0.70)" stroke-width="1.6" stroke-linecap="round"/>
    </svg>

    <div class="fm-vday-note">${NOTE}</div>
  `;

  const ui = document.createElement("div");
  ui.className = "fm-vday-ui";

  const btnSecondary = document.createElement("button");
  btnSecondary.className = "fm-vday-btn secondary";
  btnSecondary.innerHTML = `<span class="fm-vday-wa-dot"></span><span>${BTN_SECONDARY}</span>`;
  btnSecondary.onclick = () => window.open(WHATSAPP_URL, "_blank", "noopener");

  const btnPrimary = document.createElement("button");
  btnPrimary.className = "fm-vday-btn primary";
  btnPrimary.textContent = BTN_PRIMARY;
  btnPrimary.onclick = () => (window.location.href = CATALOG_URL);

  ui.appendChild(btnSecondary);
  ui.appendChild(btnPrimary);

  const close = document.createElement("button");
  close.className = "fm-vday-close";
  close.setAttribute("aria-label", "Închide");
  close.textContent = "×";
  close.onclick = () => overlay.remove();

  modal.appendChild(img);
  modal.appendChild(headline);
  modal.appendChild(ui);
  modal.appendChild(close);
  overlay.appendChild(modal);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) overlay.remove();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && document.getElementById(CAMPAIGN_ID)) overlay.remove();
  });

  setTimeout(() => document.body.appendChild(overlay), 200);
})();
