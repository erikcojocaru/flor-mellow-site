(() => {
  const CAMPAIGN_ID = "fm-valentines-2026";

  // Test range (schimbi când vrei)
  const START = "2026-01-01T00:00:00";
  const END   = "2026-03-01T00:00:00";

  const ASSET_BASE = "/assets/campaigns/valentines-2026/";
  const DESKTOP_IMG = ASSET_BASE + "popup-desktop.jpg";
  const MOBILE_IMG  = ASSET_BASE + "popup-mobile.jpg";

  const CATALOG_URL = "/catalog.html"; // sau /catalog.html#valentines

  // pune numarul real (fara +)
  const WHATSAPP_URL =
    "https://wa.me/40XXXXXXXXX?text=" +
    encodeURIComponent("Bună! Vreau să comand din colecția Valentine’s Flor Mellow.");

  // Copy text
  const TITLE = "Valentine’s";
  const SUBTITLE = "vine după colț";
  const NOTE = "Colecție limitată • Comandă rapid";

  const BTN_PRIMARY = "Vezi colecția";
  const BTN_SECONDARY = "Comandă pe WhatsApp";

  const now = new Date();
  const start = new Date(START);
  const end = new Date(END);
  if (now < start || now > end) return;

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

  // SVG title with gold outline + fill wine (premium)
  // Curved subtitle using textPath (semi-arc)
  headline.innerHTML = `
    <svg class="fm-vday-title-svg" viewBox="0 0 900 170" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <filter id="softShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="blur"/>
          <feOffset dx="0" dy="6" result="off"/>
          <feColorMatrix in="off" type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.35 0" result="shadow"/>
          <feMerge>
            <feMergeNode in="shadow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <text x="50%" y="105"
        text-anchor="middle"
        font-family="Great Vibes, cursive"
        font-size="110"
        fill="#7b1f2d"
        stroke="rgba(214,170,92,0.70)"
        stroke-width="2.2"
        paint-order="stroke fill"
        filter="url(#softShadow)"
      >${TITLE}</text>
    </svg>

    <svg class="fm-vday-curve" viewBox="0 0 900 220" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <path id="subtitleArc" d="M 120 150 Q 450 55 780 150" />
        <filter id="subShadow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceAlpha" stdDeviation="2.2" result="blur"/>
          <feOffset dx="0" dy="4" result="off"/>
          <feColorMatrix in="off" type="matrix"
            values="0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0 0
                    0 0 0 0.35 0" result="shadow"/>
          <feMerge>
            <feMergeNode in="shadow"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <text font-family="Fraunces, Georgia, serif" font-weight="700" font-size="54"
            fill="rgba(255,255,255,0.95)"
            stroke="rgba(214,170,92,0.45)"
            stroke-width="1.3"
            paint-order="stroke fill"
            filter="url(#subShadow)"
      >
        <textPath href="#subtitleArc" startOffset="50%" text-anchor="middle">
          ${SUBTITLE}
        </textPath>
      </text>
    </svg>

    <svg class="fm-vday-ornament" viewBox="0 0 240 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M12 12 C40 2, 70 2, 98 12 C120 22, 140 22, 162 12 C190 2, 200 2, 228 12"
            fill="none" stroke="rgba(214,170,92,0.85)" stroke-width="2" stroke-linecap="round"/>
      <circle cx="120" cy="12" r="2.6" fill="rgba(214,170,92,0.95)"/>
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
  btnPrimary.onclick = () => window.location.href = CATALOG_URL;

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
