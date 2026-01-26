/* FlorMellow - Valentines Popup (2026)
   File: assets/campaigns/valentines-2026/valentines-popup.js */

(function () {
  "use strict";

  // =========================
  // CONFIG (edit here only)
  // =========================
  const CONFIG = {
    // assets (your existing filenames)
    desktopImage: "assets/campaigns/valentines-2026/popup-desktop.jpg",
    mobileImage: "assets/campaigns/valentines-2026/popup-mobile.jpg",

    // behaviour
    showDelayMs: 700,
    dismissDays: 3, // don't show again for X days after closing

    // links
    collectionUrl: "catalog.html#valentines-2026", // change to your real anchor/section
    waPhone: "407XXXXXXXX", // << put your WhatsApp number here (no +, no spaces)
    waText: "Bună! Vreau să comand din colecția Valentine’s 🌹",

    // texts
    titleWord: "Valentine’s",
    subtitle: "vine după colț",
    tagline: "Colecție limitată • Comandă rapid",

    // responsive switch
    mobileBreakpoint: 760
  };

  const STORAGE_KEY = "fm_vday_2026_dismiss_until";
  let overlayEl = null;
  let modalEl = null;

  function nowTs() { return Date.now(); }

  function getDismissUntil() {
    const v = localStorage.getItem(STORAGE_KEY);
    const n = v ? Number(v) : 0;
    return Number.isFinite(n) ? n : 0;
  }

  function setDismissForDays(days) {
    const ms = days * 24 * 60 * 60 * 1000;
    localStorage.setItem(STORAGE_KEY, String(nowTs() + ms));
  }

  function isDismissed() {
    return getDismissUntil() > nowTs();
  }

  function isMobileVariant() {
    return window.innerWidth <= CONFIG.mobileBreakpoint;
  }

  function buildWhatsAppUrl() {
    const text = encodeURIComponent(CONFIG.waText || "");
    return `https://wa.me/${CONFIG.waPhone}?text=${text}`;
  }

  function ornamentSVG() {
    // simple "infinity" gold flourish (no external SVG needed)
    return `
      <svg class="fm-vday-orn" viewBox="0 0 520 60" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M55 30c55-40 110-40 165 0s110 40 165 0 110-40 165 0"
              stroke="rgba(215,181,109,.95)" stroke-width="4" stroke-linecap="round"/>
        <circle cx="260" cy="30" r="6" fill="rgba(215,181,109,.95)"/>
      </svg>
    `;
  }

  function waIconSVG() {
    return `
      <svg class="fm-vday-wa-ic" viewBox="0 0 32 32" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
        <path fill="#22c55e" d="M16 3C9.4 3 4 8.1 4 14.5c0 2.5.8 4.8 2.2 6.7L5 29l8-1.9c1.8 1 3.9 1.6 6 1.6 6.6 0 12-5.1 12-11.5S22.6 3 16 3z"/>
        <path fill="#fff" d="M12.7 10.2c-.3-.6-.6-.6-.9-.6h-.8c-.3 0-.7.1-1 .5-.3.4-1.3 1.3-1.3 3.2s1.4 3.7 1.6 3.9c.2.3 2.8 4.4 6.9 6 3.4 1.3 4.1 1 4.9.9.8-.1 2.5-1 2.9-2 .3-1 .3-1.8.2-2-.1-.2-.3-.3-.7-.5-.4-.2-2.5-1.2-2.9-1.4-.4-.1-.7-.2-1 .2-.3.4-1.1 1.4-1.4 1.7-.3.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-1.2-1.1-2-2.4-2.2-2.8-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2.1-.5 0-.7-.1-.2-.9-2.2-1.2-2.9z"/>
      </svg>
    `;
  }

  function removePopup() {
    if (!overlayEl) return;

    // remove listeners safely
    document.removeEventListener("keydown", onKeyDown, true);
    window.removeEventListener("resize", onResize, { passive: true });
    window.removeEventListener("orientationchange", onResize, { passive: true });

    // remove DOM
    overlayEl.remove();
    overlayEl = null;
    modalEl = null;

    // unlock scroll
    document.body.classList.remove("fm-vday-lock");
  }

  function closePopup() {
    // remember dismissal
    setDismissForDays(CONFIG.dismissDays);

    // small fade out
    if (modalEl) modalEl.style.opacity = "0";
    if (overlayEl) overlayEl.style.opacity = "0";
    setTimeout(removePopup, 120);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") closePopup();
  }

  function onOverlayClick(e) {
    // close only if clicking outside modal
    if (e.target === overlayEl) closePopup();
  }

  function setVariantAssets() {
    if (!modalEl) return;
    const variant = isMobileVariant() ? "mobile" : "desktop";
    modalEl.setAttribute("data-variant", variant);

    const media = modalEl.querySelector(".fm-vday-media");
    if (media) {
      media.style.backgroundImage = `url('${variant === "mobile" ? CONFIG.mobileImage : CONFIG.desktopImage}')`;
    }
  }

  function onResize() {
    // Keep it adaptive: switch between desktop/mobile popup variant
    setVariantAssets();
  }

  function mountPopup() {
    if (overlayEl) return; // prevent duplicates
    if (isDismissed()) return;

    document.body.classList.add("fm-vday-lock");

    overlayEl = document.createElement("div");
    overlayEl.className = "fm-vday-overlay";
    overlayEl.setAttribute("role", "dialog");
    overlayEl.setAttribute("aria-modal", "true");
    overlayEl.addEventListener("click", onOverlayClick);

    modalEl = document.createElement("div");
    modalEl.className = "fm-vday-modal";

    const waUrl = buildWhatsAppUrl();

    modalEl.innerHTML = `
      <div class="fm-vday-media"></div>

      <button class="fm-vday-close" type="button" aria-label="Închide">×</button>

      <div class="fm-vday-content">
        <div class="fm-vday-titleblock">
          <div class="fm-vday-titleglass">
            <div class="fm-vday-title">
              <span class="fm-vday-title-word">${CONFIG.titleWord}</span>
            </div>
            <div class="fm-vday-sub">${CONFIG.subtitle}</div>
            ${ornamentSVG()}
            <div class="fm-vday-tag">${CONFIG.tagline}</div>
          </div>
        </div>

        <div class="fm-vday-cta">
          <a class="fm-vday-btn fm-vday-btn--wa" href="${waUrl}" target="_blank" rel="noopener">
            ${waIconSVG()}
            Comandă pe WhatsApp
          </a>
          <a class="fm-vday-btn fm-vday-btn--primary" href="${CONFIG.collectionUrl}">
            Vezi colecția
          </a>
        </div>
      </div>
    `;

    overlayEl.appendChild(modalEl);
    document.body.appendChild(overlayEl);

    // Set variant + image
    setVariantAssets();

    // Events
    modalEl.querySelector(".fm-vday-close").addEventListener("click", closePopup);
    document.addEventListener("keydown", onKeyDown, true);

    window.addEventListener("resize", onResize, { passive: true });
    window.addEventListener("orientationchange", onResize, { passive: true });

    // Important: stop clicks inside modal from closing
    modalEl.addEventListener("click", (e) => e.stopPropagation());
  }

  function boot() {
    if (isDismissed()) return;

    // delay so page loads first
    window.setTimeout(() => {
      // double check not dismissed during delay
      if (!isDismissed()) mountPopup();
    }, CONFIG.showDelayMs);
  }

  // Start
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();
