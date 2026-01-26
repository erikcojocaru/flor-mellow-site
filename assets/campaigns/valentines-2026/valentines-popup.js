/* =========================================
   Flor Mellow — Valentine's Popup (2026)
   Production-ready
   - shows on EVERY refresh (no localStorage)
   - ESC / backdrop / X close
   - scroll lock
   - focus trap
   - responsive background image swap
   ========================================= */

(() => {
  "use strict";

  if (window.__fmVday2026Loaded) return;
  window.__fmVday2026Loaded = true;

  const CFG = {
    imgDesktop: "assets/campaigns/valentines-2026/popup-desktop.jpg",
    imgMobile:  "assets/campaigns/valentines-2026/popup-mobile.jpg",

    // CHANGE THIS:
    whatsappUrl: "https://wa.me/40XXXXXXXXXX?text=Salut%20Flor%20Mellow!%20Vreau%20s%C4%83%20comand%20din%20colec%C8%9Bia%20Valentine%E2%80%99s%202026.",
    collectionUrl: "catalog.html#valentines-2026",

    openDelayMs: 450
  };

  const qs = (sel, root = document) => root.querySelector(sel);
  const isMobile = () => window.matchMedia("(max-width: 640px)").matches;
  const getVariant = () => (isMobile() ? "mobile" : "desktop");
  const getBg = () => (getVariant() === "mobile" ? CFG.imgMobile : CFG.imgDesktop);

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

  function lockScroll(lock) {
    document.body.classList.toggle("fm-vday-lock", !!lock);
  }

  function getFocusable(root) {
    return Array.from(
      root.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => el.offsetParent !== null);
  }

  function trapTab(e, root) {
    if (e.key !== "Tab") return;
    const f = getFocusable(root);
    if (!f.length) return;
    const first = f[0];
    const last = f[f.length - 1];

    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault(); last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault(); first.focus();
    }
  }

  function createOverlay() {
    const overlay = document.createElement("div");
    overlay.className = "fm-vday-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Valentine’s — Flor Mellow");

    overlay.innerHTML = `
      <div class="fm-vday-modal" data-variant="${getVariant()}">
        <button class="fm-vday-close" type="button" aria-label="Închide popup">×</button>

        <div class="fm-vday-inner">
          <div class="fm-vday-media" style="background-image:url('${getBg()}')"></div>

          <div class="fm-vday-content">
            <div class="fm-vday-titleblock">
              <div class="fm-vday-title">Valentine’s</div>
              <div class="fm-vday-sub">vine după colț</div>
              ${buildOrnSvg()}
              <div class="fm-vday-tag">Colecție limitată • Comandă rapid</div>
            </div>

            <div class="fm-vday-cta">
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
      </div>
    `;

    // click inside modal doesn't close
    qs(".fm-vday-modal", overlay).addEventListener("click", (e) => e.stopPropagation());
    return overlay;
  }

  function setVariant(overlay) {
    const modal = qs(".fm-vday-modal", overlay);
    const media = qs(".fm-vday-media", overlay);
    modal.setAttribute("data-variant", getVariant());
    media.style.backgroundImage = `url('${getBg()}')`;
  }

  function openPopup() {
    if (qs(".fm-vday-overlay")) return;

    const overlay = createOverlay();
    document.body.appendChild(overlay);

    requestAnimationFrame(() => overlay.classList.add("is-open"));

    lockScroll(true);

    const closeBtn = qs(".fm-vday-close", overlay);
    const modal = qs(".fm-vday-modal", overlay);

    const prevFocus = document.activeElement;
    (closeBtn || modal).focus?.();

    const onKey = (e) => {
      if (e.key === "Escape") closePopup(overlay, prevFocus);
      trapTab(e, modal);
    };

    const onResize = () => setVariant(overlay);
    const onOverlayClick = () => closePopup(overlay, prevFocus);

    closeBtn.addEventListener("click", () => closePopup(overlay, prevFocus));
    overlay.addEventListener("click", onOverlayClick);

    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    overlay.__fmHandlers = { onKey, onResize, onOverlayClick };

    setVariant(overlay);
  }

  function closePopup(overlay, prevFocus) {
    if (!overlay) return;

    overlay.classList.remove("is-open");

    const h = overlay.__fmHandlers;
    if (h) {
      window.removeEventListener("keydown", h.onKey, true);
      window.removeEventListener("resize", h.onResize);
      window.removeEventListener("orientationchange", h.onResize);
      overlay.removeEventListener("click", h.onOverlayClick);
    }

    lockScroll(false);

    window.setTimeout(() => {
      overlay.remove();
      prevFocus?.focus?.();
    }, 180);
  }

  function boot() {
    window.setTimeout(openPopup, CFG.openDelayMs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
