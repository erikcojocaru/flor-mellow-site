/* FlorMellow - Valentines Popup (2026)
   File: assets/campaigns/valentines-2026/valentines-popup.js */

(() => {
  "use strict";

  // guard (avoid double-inject if script included twice)
  if (window.__fmVday2026Loaded) return;
  window.__fmVday2026Loaded = true;

  const CFG = {
    // file paths (your exact structure)
    imgDesktop: "assets/campaigns/valentines-2026/popup-desktop.jpg",
    imgMobile:  "assets/campaigns/valentines-2026/popup-mobile.jpg",

    // links
    whatsappUrl: "https://wa.me/40XXXXXXXXXX?text=Salut%20Flor%20Mellow!%20Vreau%20s%C4%83%20comand%20din%20colec%C8%9Bia%20Valentine%E2%80%99s%202026.",
    collectionUrl: "catalog.html#valentines-2026",

    // ✅ IMPORTANT: show on every refresh
    showEveryRefresh: true,

    // optional: campaign window (set null to disable)
    startDate: null, // "2026-01-20"
    endDate: null    // "2026-02-15"
  };

  const now = new Date();

  function withinCampaignWindow() {
    if (!CFG.startDate && !CFG.endDate) return true;
    const t = now.getTime();
    if (CFG.startDate) {
      const s = new Date(CFG.startDate + "T00:00:00").getTime();
      if (t < s) return false;
    }
    if (CFG.endDate) {
      const e = new Date(CFG.endDate + "T23:59:59").getTime();
      if (t > e) return false;
    }
    return true;
  }

  function isMobile() {
    return window.matchMedia("(max-width: 640px)").matches;
  }

  function getVariant() {
    return isMobile() ? "mobile" : "desktop";
  }

  function buildOrnSvg() {
    const gold = (getComputedStyle(document.documentElement).getPropertyValue("--fm-vday-gold") || "#d7b56d").trim();
    return `
      <svg class="fm-vday-orn" viewBox="0 0 600 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M80 30c55-22 110-22 165 0s110 22 165 0 110-22 165 0"
              fill="none" stroke="${gold}" stroke-width="4" stroke-linecap="round" opacity="0.95"/>
        <circle cx="300" cy="30" r="6" fill="${gold}" opacity="0.95"/>
      </svg>
    `;
  }

  function buildWhatsAppSvg() {
    return `
      <svg class="fm-vday-wa-ico" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#22c55e" d="M16 3C9.4 3 4 8.2 4 14.6c0 2.3.7 4.4 1.9 6.2L4 29l8.4-1.8c1.1.3 2.3.5 3.6.5 6.6 0 12-5.2 12-11.6S22.6 3 16 3z"/>
        <path fill="#fff" d="M12.7 10.2c-.3-.7-.6-.7-.9-.7h-.8c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.8 5.9 5.2 2.9 1.1 3.5.9 4.1.8.6-.1 2-0.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.3-.7-.5l-1.8-.9c-.4-.2-.7-.2-1 .2-.3.4-1.1 1.4-1.3 1.7-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-.4-.4-1-1.1-1.2-1.5-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7l-.9-2.3z"/>
      </svg>
    `;
  }

  function createPopup() {
    const variant = getVariant();
    const bg = variant === "mobile" ? CFG.imgMobile : CFG.imgDesktop;

    const overlay = document.createElement("div");
    overlay.className = "fm-vday-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Promoție Valentine’s");

    overlay.innerHTML = `
      <div class="fm-vday-modal" data-variant="${variant}">
        <div class="fm-vday-media" style="background-image:url('${bg}')"></div>

        <button class="fm-vday-close" type="button" aria-label="Închide">×</button>

        <div class="fm-vday-content">
          <div class="fm-vday-titleblock">
            <div class="fm-vday-title">Valentine’s</div>
            <div class="fm-vday-sub">vine după colț</div>
            ${buildOrnSvg()}
            <div class="fm-vday-tag">Colecție limitată • Comandă rapid</div>
          </div>

          <div class="fm-vday-cta" aria-label="Acțiuni">
            <a class="fm-vday-btn fm-vday-btn--wa" href="${CFG.whatsappUrl}" target="_blank" rel="noopener">
              ${buildWhatsAppSvg()}
              Comandă pe WhatsApp
            </a>
            <a class="fm-vday-btn fm-vday-btn--primary" href="${CFG.collectionUrl}">
              Vezi colecția
            </a>
          </div>
        </div>
      </div>
    `;

    // prevent clicks inside modal from closing overlay
    const modal = overlay.querySelector(".fm-vday-modal");
    modal.addEventListener("click", (e) => e.stopPropagation());

    return overlay;
  }

  function setVariant(overlay) {
    const modal = overlay.querySelector(".fm-vday-modal");
    const media = overlay.querySelector(".fm-vday-media");
    const variant = getVariant();
    modal.setAttribute("data-variant", variant);
    media.style.backgroundImage = `url('${variant === "mobile" ? CFG.imgMobile : CFG.imgDesktop}')`;
  }

  function openPopup() {
    if (document.querySelector(".fm-vday-overlay")) return;

    document.body.classList.add("fm-vday-lock");
    const overlay = createPopup();
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector(".fm-vday-close");

    const onEsc = (e) => {
      if (e.key === "Escape") closePopup(overlay);
    };
    const onResize = () => setVariant(overlay);
    const onOverlayClick = () => closePopup(overlay);

    closeBtn.addEventListener("click", () => closePopup(overlay));
    overlay.addEventListener("click", onOverlayClick);
    window.addEventListener("keydown", onEsc);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    overlay.__fmHandlers = { onEsc, onResize, onOverlayClick };

    setVariant(overlay);
  }

  function closePopup(overlay) {
    if (!overlay) return;

    const h = overlay.__fmHandlers;
    if (h) {
      window.removeEventListener("keydown", h.onEsc);
      window.removeEventListener("resize", h.onResize);
      window.removeEventListener("orientationchange", h.onResize);
      overlay.removeEventListener("click", h.onOverlayClick);
    }

    overlay.remove();
    document.body.classList.remove("fm-vday-lock");
  }

  function boot() {
    if (!withinCampaignWindow()) return;

    // ✅ show on every refresh
    window.setTimeout(openPopup, 600);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
