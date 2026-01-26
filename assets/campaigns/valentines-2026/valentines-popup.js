/* === FlorMellow Valentines Popup 2026 (FIXED) ===
   Fixes:
   - If CSS fails/gets overridden, popup still stays fixed (inline fallback styles)
   - On close, we remove ALL leftovers (duplicate/unstyled instances)
   - Uses absolute paths for images
*/

(function () {
  const CONFIG = {
    desktopImg: "/assets/campaigns/valentines-2026/popup-desktop.jpg",
    mobileImg: "/assets/campaigns/valentines-2026/popup-mobile.jpg",

    collectionUrl: "/catalog.html#valentines",
    whatsappUrl:
      "https://wa.me/40700000000?text=Salut!%20Vreau%20sa%20comand%20din%20colectia%20de%20Valentine%E2%80%99s.",

    showEverywhere: true
  };

  const ROOT_CLASS = "fm-vday-backdrop";
  const MODAL_CLASS = "fm-vday-modal";

  function isMobileViewport() {
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

  // 🔥 Aggressive cleanup (removes any leftover popups)
  function cleanupAll() {
    document.querySelectorAll("." + ROOT_CLASS).forEach((el) => el.remove());
    lockScroll(false);
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("resize", syncBg);
    window.removeEventListener("orientationchange", syncBg);
  }

  let bgEl = null;

  function syncBg() {
    if (!bgEl) return;
    const img = isMobileViewport() ? CONFIG.mobileImg : CONFIG.desktopImg;
    bgEl.style.backgroundImage = `url("${img}")`;
  }

  function onKey(e) {
    if (e.key === "Escape") cleanupAll();
  }

  function buildPopup() {
    // prevent duplicates
    cleanupAll();

    const backdrop = document.createElement("div");
    backdrop.className = ROOT_CLASS;
    backdrop.setAttribute("role", "dialog");
    backdrop.setAttribute("aria-modal", "true");

    // ✅ Inline fallback styles (so it can NEVER appear as normal content in page)
    backdrop.style.position = "fixed";
    backdrop.style.inset = "0";
    backdrop.style.zIndex = "999999";
    backdrop.style.display = "grid";
    backdrop.style.placeItems = "center";
    backdrop.style.padding = "16px";
    backdrop.style.background = "rgba(10,10,12,.55)";
    backdrop.style.backdropFilter = "blur(8px)";
    backdrop.style.webkitBackdropFilter = "blur(8px)";

    const modal = document.createElement("div");
    modal.className = MODAL_CLASS;

    // Inline fallback sizing (so even without CSS it looks like a popup)
    modal.style.position = "relative";
    modal.style.width = "min(1100px, 96vw)";
    modal.style.aspectRatio = isMobileViewport() ? "3 / 5" : "16 / 10";
    modal.style.borderRadius = "28px";
    modal.style.overflow = "hidden";
    modal.style.boxShadow = "0 30px 90px rgba(0,0,0,.35)";

    const bg = document.createElement("div");
    bg.className = "fm-vday-bg";
    bg.style.position = "absolute";
    bg.style.inset = "0";
    bg.style.backgroundPosition = "center";
    bg.style.backgroundRepeat = "no-repeat";
    bg.style.backgroundSize = "cover";
    bgEl = bg;

    const vignette = document.createElement("div");
    vignette.className = "fm-vday-vignette";
    vignette.style.position = "absolute";
    vignette.style.inset = "0";
    vignette.style.pointerEvents = "none";
    vignette.style.background =
      "radial-gradient(1200px 700px at 70% 20%, rgba(0,0,0,0) 0%, rgba(0,0,0,.18) 65%, rgba(0,0,0,.25) 100%)";

    const close = document.createElement("button");
    close.className = "fm-vday-close";
    close.type = "button";
    close.setAttribute("aria-label", "Închide");
    close.innerHTML = "&times;";

    // Fallback close styling
    close.style.position = "absolute";
    close.style.top = "14px";
    close.style.right = "14px";
    close.style.width = "44px";
    close.style.height = "44px";
    close.style.borderRadius = "14px";
    close.style.border = "1px solid rgba(255,255,255,.25)";
    close.style.background = "rgba(0,0,0,.25)";
    close.style.color = "#fff";
    close.style.fontSize = "22px";
    close.style.cursor = "pointer";
    close.style.zIndex = "5";

    const content = document.createElement("div");
    content.className = "fm-vday-content";
    content.style.position = "absolute";
    content.style.inset = "0";
    content.style.display = "grid";
    content.style.gridTemplateRows = "1fr auto";
    content.style.padding = isMobileViewport() ? "18px" : "32px";
    content.style.zIndex = "4";

    const hero = document.createElement("div");
    hero.className = "fm-vday-hero";
    hero.style.textAlign = "center";
    hero.style.maxWidth = isMobileViewport() ? "92%" : "72%";
    hero.style.margin = "0 auto";
    hero.style.marginTop = isMobileViewport() ? "22vh" : "3.2vw";

    hero.innerHTML = `
      <div class="fm-vday-title" style="
        font-size:${isMobileViewport() ? "44px" : "76px"};
        line-height:1.02;
        font-weight:600;
        color:rgba(124,18,33,.88);
        text-shadow:0 2px 10px rgba(0,0,0,.25);
        ">
        Valentine’s
      </div>
      <div class="fm-vday-subtitle" style="
        margin-top:8px;
        font-size:${isMobileViewport() ? "28px" : "44px"};
        font-weight:600;
        color:rgba(255,255,255,.92);
        text-shadow:0 2px 10px rgba(0,0,0,.28);
      ">
        vine după colț
      </div>
      <div style="
        margin:14px auto 0;
        width:${isMobileViewport() ? "70%" : "60%"};
        height:2px;
        background:linear-gradient(to right, transparent, #d7b56d, transparent);
      "></div>
      <div class="fm-vday-micro" style="
        margin-top:10px;
        font-size:12px;
        letter-spacing:.14em;
        text-transform:uppercase;
        color:rgba(255,255,255,.82);
        text-shadow:0 2px 10px rgba(0,0,0,.25);
      ">
        Colecție limitată • Comandă rapid
      </div>
    `;

    const cta = document.createElement("div");
    cta.className = "fm-vday-cta";
    cta.style.alignSelf = "end";
    cta.style.justifySelf = "center";
    cta.style.width = isMobileViewport() ? "100%" : "min(760px,92%)";
    cta.style.display = "flex";
    cta.style.gap = "12px";
    cta.style.flexDirection = isMobileViewport() ? "column" : "row";
    cta.style.padding = "14px";
    cta.style.borderRadius = "20px";
    cta.style.background = "rgba(255,255,255,.10)";
    cta.style.border = "1px solid rgba(255,255,255,.16)";
    cta.style.boxShadow = "0 14px 40px rgba(0,0,0,.20)";

    const wa = document.createElement("a");
    wa.href = CONFIG.whatsappUrl;
    wa.target = "_blank";
    wa.rel = "noopener";
    wa.textContent = "Comandă pe WhatsApp";
    wa.style.textDecoration = "none";
    wa.style.display = "flex";
    wa.style.alignItems = "center";
    wa.style.justifyContent = "center";
    wa.style.width = "100%";
    wa.style.padding = "16px 18px";
    wa.style.borderRadius = "999px";
    wa.style.fontWeight = "700";
    wa.style.background = "rgba(255,245,235,.92)";
    wa.style.color = "rgba(20,20,20,.92)";
    wa.style.boxShadow = "inset 0 0 0 2px rgba(215,181,109,.55), 0 12px 28px rgba(0,0,0,.18)";

    const col = document.createElement("a");
    col.href = CONFIG.collectionUrl;
    col.textContent = "Vezi colecția";
    col.style.textDecoration = "none";
    col.style.display = "flex";
    col.style.alignItems = "center";
    col.style.justifyContent = "center";
    col.style.width = "100%";
    col.style.padding = "16px 18px";
    col.style.borderRadius = "999px";
    col.style.fontWeight = "700";
    col.style.background = "linear-gradient(180deg, #a3192a, #7a0f1b)";
    col.style.color = "rgba(255,255,255,.96)";
    col.style.boxShadow = "inset 0 0 0 2px rgba(215,181,109,.55), 0 12px 28px rgba(0,0,0,.22)";

    cta.appendChild(wa);
    cta.appendChild(col);

    content.appendChild(hero);
    content.appendChild(cta);

    modal.appendChild(bg);
    modal.appendChild(vignette);
    modal.appendChild(close);
    modal.appendChild(content);

    backdrop.appendChild(modal);
    document.body.appendChild(backdrop);

    // events
    close.addEventListener("click", cleanupAll);
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) cleanupAll();
    });

    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", syncBg, { passive: true });
    window.addEventListener("orientationchange", syncBg, { passive: true });

    syncBg();
    lockScroll(true);
  }

  function init() {
    setTimeout(buildPopup, 200);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
