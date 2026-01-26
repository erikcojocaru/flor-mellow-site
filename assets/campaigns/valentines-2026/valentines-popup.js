/* === FlorMellow Valentines Popup 2026 ===
   - Responsive image swap desktop/mobile
   - Adaptive sizing on resize/orientation change
   - Shows on every fresh open (no "7 days" cookie)
*/

(function () {
  const CONFIG = {
    // paths relative to site root
    desktopImg: "assets/campaigns/valentines-2026/popup-desktop.jpg",
    mobileImg: "assets/campaigns/valentines-2026/popup-mobile.jpg",

    // Links
    collectionUrl: "catalog.html#valentines", // change if you want exact anchor
    whatsappUrl: "https://wa.me/40700000000?text=Salut!%20Vreau%20sa%20comand%20din%20colectia%20de%20Valentine’s.",

    // Enable on these pages:
    enabledPaths: ["index.html", "catalog.html", "/"],

    // If true: also show on any page (you can leave false)
    showEverywhere: true
  };

  // --- helpers
  function normalizePath(p) {
    try {
      const url = new URL(p, window.location.origin);
      return url.pathname.replace(/\/+$/, ""); // trim trailing slash
    } catch {
      return (p || "").replace(/\/+$/, "");
    }
  }

  function currentPageMatches() {
    if (CONFIG.showEverywhere) return true;
    const path = normalizePath(window.location.pathname);
    return CONFIG.enabledPaths.some((p) => normalizePath("/" + p.replace(/^\//, "")) === path || normalizePath(p) === path);
  }

  function isMobileViewport() {
    // Use width threshold + coarse pointer as extra signal
    const w = Math.min(window.innerWidth || 0, document.documentElement.clientWidth || 0);
    const coarse = window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    return w <= 860 || coarse;
  }

  function lockScroll(lock) {
    if (lock) {
      document.documentElement.style.overflow = "hidden";
      document.body.style.overflow = "hidden";
      document.body.style.touchAction = "none";
    } else {
      document.documentElement.style.overflow = "";
      document.body.style.overflow = "";
      document.body.style.touchAction = "";
    }
  }

  // --- build popup
  function buildPopup() {
    // Backdrop
    const backdrop = document.createElement("div");
    backdrop.className = "fm-vday-backdrop";
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");
    backdrop.setAttribute("aria-label", "Valentine’s Flor Mellow");

    // Modal
    const modal = document.createElement("div");
    modal.className = "fm-vday-modal";

    // Bg layer
    const bg = document.createElement("div");
    bg.className = "fm-vday-bg";

    const vignette = document.createElement("div");
    vignette.className = "fm-vday-vignette";

    // Close
    const close = document.createElement("button");
    close.className = "fm-vday-close";
    close.type = "button";
    close.setAttribute("aria-label", "Închide");
    close.innerHTML = "&times;";

    // Content
    const content = document.createElement("div");
    content.className = "fm-vday-content";

    const hero = document.createElement("div");
    hero.className = "fm-vday-hero";

    hero.innerHTML = `
      <h2 class="fm-vday-title">Valentine’s</h2>
      <div class="fm-vday-subtitle">vine după colț</div>
      <div class="fm-vday-flourish" aria-hidden="true"></div>
      <div class="fm-vday-micro">Colecție limitată • Comandă rapid</div>
    `;

    const cta = document.createElement("div");
    cta.className = "fm-vday-cta";

    const wa = document.createElement("a");
    wa.className = "fm-vday-btn fm-vday-btn-wa";
    wa.href = CONFIG.whatsappUrl;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.innerHTML = `<span class="fm-vday-wa-dot" aria-hidden="true"></span> Comandă pe WhatsApp`;

    const col = document.createElement("a");
    col.className = "fm-vday-btn fm-vday-btn-collection";
    col.href = CONFIG.collectionUrl;
    col.innerHTML = `Vezi colecția`;

    cta.appendChild(wa);
    cta.appendChild(col);

    content.appendChild(hero);
    content.appendChild(cta);

    modal.appendChild(bg);
    modal.appendChild(vignette);
    modal.appendChild(close);
    modal.appendChild(content);
    backdrop.appendChild(modal);

    // close handlers
    function destroy() {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", syncBg);
      window.removeEventListener("orientationchange", syncBg);
      backdrop.remove();
    }

    function onKey(e) {
      if (e.key === "Escape") destroy();
    }

    close.addEventListener("click", destroy);
    backdrop.addEventListener("click", (e) => {
      // click outside modal closes
      if (e.target === backdrop) destroy();
    });
    window.addEventListener("keydown", onKey);

    // responsive image swap
    function syncBg() {
      const img = isMobileViewport() ? CONFIG.mobileImg : CONFIG.desktopImg;
      bg.style.backgroundImage = `url("${img}")`;
    }

    window.addEventListener("resize", syncBg, { passive: true });
    window.addEventListener("orientationchange", syncBg, { passive: true });
    syncBg();

    // mount
    document.body.appendChild(backdrop);
    lockScroll(true);

    // prevent iOS overscroll behind modal
    backdrop.addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
  }

  // --- run
  function init() {
    if (!currentPageMatches()) return;

    // show at every fresh open:
    // We avoid localStorage "do not show" on purpose.
    // If you want to disable for the same tab refresh, uncomment:
    // if (sessionStorage.getItem("fm_vday_shown") === "1") return;
    // sessionStorage.setItem("fm_vday_shown", "1");

    // slight delay so page paints first
    setTimeout(buildPopup, 220);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
