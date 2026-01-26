/* =====================================================
   Flor Mellow — Valentine's Popup (2026) — Premium Stable
   - Shows on EVERY refresh (no storage)
   - Stable layout (img + content)
   - Close works ALWAYS (event delegation)
   - Close: X, backdrop, ESC
   - Prevent double instances + remove old ones if present
   ===================================================== */

(() => {
  "use strict";

  // Kill any old overlays from previous versions (important if you had multiple scripts)
  document.querySelectorAll(".fmv-overlay").forEach(el => el.remove());

  // Prevent double-init
  if (window.__fmvVdayLoaded) return;
  window.__fmvVdayLoaded = true;

  const CFG = {
    imgDesktop: "assets/campaigns/valentines-2026/popup-desktop.jpg",
    imgMobile:  "assets/campaigns/valentines-2026/popup-mobile.jpg",

    // CHANGE THIS:
    whatsappUrl: "https://wa.me/40XXXXXXXXXX?text=Salut%20Flor%20Mellow!%20Vreau%20s%C4%83%20comand%20din%20colec%C8%9Bia%20Valentine%E2%80%99s%202026.",
    collectionUrl: "catalog.html#valentines-2026",

    openDelayMs: 350
  };

  const isMobile = () => window.matchMedia("(max-width: 760px)").matches;
  const imgForViewport = () => (isMobile() ? CFG.imgMobile : CFG.imgDesktop);

  const lockScroll = (lock) => document.body.classList.toggle("fmv-lock", !!lock);

  function ornSvg() {
    const gold = (getComputedStyle(document.documentElement).getPropertyValue("--fmv-gold") || "#d7b56d").trim();
    return `
      <svg class="fmv-orn" viewBox="0 0 600 60" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M80 30c55-22 110-22 165 0s110 22 165 0 110-22 165 0"
              fill="none" stroke="${gold}" stroke-width="4" stroke-linecap="round" opacity="0.95"/>
        <circle cx="300" cy="30" r="6" fill="${gold}" opacity="0.95"/>
      </svg>
    `;
  }

  function waSvg() {
    return `
      <svg class="fmv-wa-ico" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path fill="#22c55e" d="M16 3C9.4 3 4 8.2 4 14.6c0 2.3.7 4.4 1.9 6.2L4 29l8.4-1.8c1.1.3 2.3.5 3.6.5 6.6 0 12-5.2 12-11.6S22.6 3 16 3z"/>
        <path fill="#fff" d="M12.7 10.2c-.3-.7-.6-.7-.9-.7h-.8c-.2 0-.6.1-.9.4-.3.3-1.2 1.1-1.2 2.8 0 1.7 1.2 3.3 1.4 3.5.2.2 2.4 3.8 5.9 5.2 2.9 1.1 3.5.9 4.1.8.6-.1 2-0.8 2.3-1.6.3-.8.3-1.4.2-1.6-.1-.2-.3-.3-.7-.5l-1.8-.9c-.4-.2-.7-.2-1 .2-.3.4-1.1 1.4-1.3 1.7-.2.3-.5.3-.9.1-.4-.2-1.7-.6-3.2-2-.4-.4-1-1.1-1.2-1.5-.2-.4 0-.6.2-.8.2-.2.4-.5.6-.7.2-.2.3-.4.4-.6.1-.2 0-.5-.1-.7l-.9-2.3z"/>
      </svg>
    `;
  }

  function build() {
    const overlay = document.createElement("div");
    overlay.className = "fmv-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Valentine’s — Flor Mellow");

    overlay.innerHTML = `
      <div class="fmv-modal" role="document">
        <button class="fmv-close" type="button" data-fmv-close aria-label="Închide">×</button>

        <div class="fmv-grid">
          <div class="fmv-media">
            <img class="fmv-img" alt="Colecția Valentine’s Flor Mellow" src="${imgForViewport()}">
          </div>

          <div class="fmv-content">
            <h2 class="fmv-title">Valentine’s</h2>
            <p class="fmv-sub">vine după colț</p>
            ${ornSvg()}
            <p class="fmv-tag">Colecție limitată • Comandă rapid</p>

            <div class="fmv-cta">
              <a class="fmv-btn fmv-btn--wa" href="${CFG.whatsappUrl}" target="_blank" rel="noopener">
                ${waSvg()}
                Comandă pe WhatsApp
              </a>
              <a class="fmv-btn fmv-btn--primary" href="${CFG.collectionUrl}">
                Vezi colecția
              </a>
            </div>
          </div>
        </div>
      </div>
    `;

    return overlay;
  }

  function setImg(overlay) {
    const img = overlay.querySelector(".fmv-img");
    if (img) img.src = imgForViewport();
  }

  function open() {
    // ensure single instance
    if (document.querySelector(".fmv-overlay")) return;

    const overlay = build();
    document.body.appendChild(overlay);

    // animation
    requestAnimationFrame(() => overlay.classList.add("is-open"));

    lockScroll(true);

    // -------- close handling (event delegation) ----------
    const onClick = (e) => {
      const closeBtn = e.target.closest("[data-fmv-close]");
      const modal = e.target.closest(".fmv-modal");

      // click X => close
      if (closeBtn) {
        e.preventDefault();
        e.stopPropagation();
        close(overlay);
        return;
      }

      // click outside modal => close
      if (!modal) {
        close(overlay);
      }
    };

    const onKey = (e) => {
      if (e.key === "Escape") close(overlay);
    };

    const onResize = () => setImg(overlay);

    // capture = more robust if some other code stops propagation
    document.addEventListener("click", onClick, true);
    window.addEventListener("keydown", onKey, true);
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    overlay.__fmvHandlers = { onClick, onKey, onResize };
  }

  function close(overlay) {
    if (!overlay) return;

    overlay.classList.remove("is-open");
    lockScroll(false);

    const h = overlay.__fmvHandlers;
    if (h) {
      document.removeEventListener("click", h.onClick, true);
      window.removeEventListener("keydown", h.onKey, true);
      window.removeEventListener("resize", h.onResize);
      window.removeEventListener("orientationchange", h.onResize);
    }

    setTimeout(() => overlay.remove(), 160);
  }

  function boot() {
    setTimeout(open, CFG.openDelayMs);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
