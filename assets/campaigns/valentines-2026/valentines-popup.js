/* FlorMellow - Valentines Popup (2026) */
/* File: assets/campaigns/valentines-2026/valentines-popup.js */

(function () {
  "use strict";

  // === CONFIG ===
  const CAMPAIGN_BASE = "assets/campaigns/valentines-2026";
  const IMG_DESKTOP = `${CAMPAIGN_BASE}/popup-desktop.jpg`;
  const IMG_MOBILE  = `${CAMPAIGN_BASE}/popup-mobile.jpg`;

  // Change these if you want:
  const WHATSAPP_URL = "https://wa.me/40700000000?text=Salut!%20Vreau%20sa%20comand%20din%20colectia%20Valentine%E2%80%99s%20Flor%20Mellow.";
  const COLLECTION_URL = "catalog.html#valentines"; // or "catalog.html" if you prefer

  // show on every new open (NO localStorage gating)
  const SHOULD_AUTOSHOW = true;

  // === INTERNALS ===
  const OVERLAY_ID = "fm-vday-overlay";

  function isMobile() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function qs(sel, root = document) { return root.querySelector(sel); }

  function lockScroll() { document.body.classList.add("fm-vday-lock"); }
  function unlockScroll() { document.body.classList.remove("fm-vday-lock"); }

  function buildOrnamentSVG() {
    // lightweight gold ornament
    return `
      <svg class="fm-vday-orn" viewBox="0 0 400 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M30 30c55 0 55-16 110-16s55 16 110 16 55-16 110-16"
              fill="none" stroke="rgba(215,181,109,.95)" stroke-width="4" stroke-linecap="round"/>
        <path d="M170 30c15 0 15 10 30 10s15-10 30-10"
              fill="none" stroke="rgba(215,181,109,.95)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="200" cy="30" r="6" fill="rgba(215,181,109,.95)"/>
      </svg>
    `;
  }

  function popupMarkup() {
    return `
      <div id="${OVERLAY_ID}" class="fm-vday-overlay" role="dialog" aria-modal="true" aria-label="Promo Valentine">
        <div class="fm-vday-modal" data-variant="${isMobile() ? "mobile" : "desktop"}">
          <button type="button" class="fm-vday-close" aria-label="Închide">×</button>

          <div class="fm-vday-media"></div>

          <div class="fm-vday-content">
            <div class="fm-vday-titleblock">
              <div class="fm-vday-title">Valentine’s</div>
              <div class="fm-vday-sub">vine după colț</div>
              ${buildOrnamentSVG()}
              <div class="fm-vday-tag">Colecție limitată • Comandă rapid</div>
            </div>

            <div class="fm-vday-cta">
              <a class="fm-vday-btn fm-vday-btn--wa" href="${WHATSAPP_URL}" target="_blank" rel="noopener">
                <span class="fm-vday-dot"></span>
                Comandă pe WhatsApp
              </a>
              <a class="fm-vday-btn fm-vday-btn--primary" href="${COLLECTION_URL}">
                Vezi colecția
              </a>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  function setBackground(modalEl) {
    const media = qs(".fm-vday-media", modalEl);
    const variant = modalEl.getAttribute("data-variant");
    const img = (variant === "mobile") ? IMG_MOBILE : IMG_DESKTOP;
    media.style.backgroundImage = `url("${img}")`;
  }

  function applyVariant(modalEl, nextVariant) {
    const current = modalEl.getAttribute("data-variant");
    if (current === nextVariant) return;

    modalEl.setAttribute("data-variant", nextVariant);
    setBackground(modalEl);
  }

  function removePopup() {
    const overlay = document.getElementById(OVERLAY_ID);
    if (!overlay) return;

    overlay.remove();
    unlockScroll();

    document.removeEventListener("keydown", onKeydown, true);
    window.removeEventListener("resize", onResize, { passive: true });
  }

  function onKeydown(e) {
    if (e.key === "Escape") removePopup();
  }

  let resizeT = null;
  function onResize() {
    // Debounce + adapt variant + keep it responsive
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const overlay = document.getElementById(OVERLAY_ID);
      if (!overlay) return;

      const modal = qs(".fm-vday-modal", overlay);
      const nextVariant = isMobile() ? "mobile" : "desktop";
      applyVariant(modal, nextVariant);
    }, 120);
  }

  function showPopup() {
    // Prevent duplicates
    if (document.getElementById(OVERLAY_ID)) return;

    lockScroll();
    document.body.insertAdjacentHTML("beforeend", popupMarkup());

    const overlay = document.getElementById(OVERLAY_ID);
    const modal = qs(".fm-vday-modal", overlay);
    const closeBtn = qs(".fm-vday-close", overlay);

    setBackground(modal);

    // Close: X
    closeBtn.addEventListener("click", (e) => {
      e.preventDefault();
      removePopup();
    });

    // Close: click outside card
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) removePopup();
    });

    // Close: ESC
    document.addEventListener("keydown", onKeydown, true);

    // Responsive: change variant on resize
    window.addEventListener("resize", onResize, { passive: true });
  }

  function init() {
    if (!SHOULD_AUTOSHOW) return;

    // Run on index.html and catalog.html (and also if paths differ)
    const path = (location.pathname || "").toLowerCase();
    const allowed =
      path.endsWith("/") ||
      path.endsWith("/index.html") ||
      path.endsWith("/catalog.html") ||
      path.endsWith("/index") ||
      path.endsWith("/catalog");

    // If your GitHub Pages path is like /flor-mellow-site/index.html, still works via endsWith
    if (allowed) showPopup();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

})();
