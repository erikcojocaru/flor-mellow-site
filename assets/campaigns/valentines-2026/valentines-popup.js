/* Flor Mellow - Valentine's Popup 2026
   Shows on every fresh page load (as requested) on index + catalog.
   No localStorage / no "7 days" logic.
*/

(function () {
  "use strict";

  // ====== CONFIG (edit only this) ======
  const CONFIG = {
    desktopImage: "assets/campaigns/valentines-2026/popup-desktop.jpg",
    mobileImage: "assets/campaigns/valentines-2026/popup-mobile.jpg",

    // Where "Vezi colectia" should go
    collectionUrl: "catalog.html#valentines", // change if needed

    // WhatsApp link (replace number + text)
    whatsappNumber: "40700000000", // <-- CHANGE
    whatsappText: "Bună! Vreau să comand din colecția de Valentine’s 🌹",

    // Show delay (ms)
    showDelay: 250
  };

  // ====== Fonts loader ======
  function ensureFonts() {
    if (document.getElementById("fm-vday-fonts")) return;
    const l1 = document.createElement("link");
    l1.id = "fm-vday-fonts";
    l1.rel = "stylesheet";
    l1.href =
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Playfair+Display:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap";
    document.head.appendChild(l1);
  }

  function isMobileViewport() {
    return window.matchMedia("(max-width: 768px)").matches;
  }

  function buildWhatsAppLink() {
    const text = encodeURIComponent(CONFIG.whatsappText || "");
    const number = (CONFIG.whatsappNumber || "").replace(/\D/g, "");
    return `https://wa.me/${number}?text=${text}`;
  }

  function el(tag, attrs = {}, children = []) {
    const node = document.createElement(tag);
    Object.entries(attrs).forEach(([k, v]) => {
      if (k === "class") node.className = v;
      else if (k === "html") node.innerHTML = v;
      else if (k === "text") node.textContent = v;
      else node.setAttribute(k, v);
    });
    children.forEach((c) => node.appendChild(c));
    return node;
  }

  function removePopup() {
    const existing = document.getElementById("fm-vday-backdrop");
    if (existing) existing.remove();
    document.body.classList.remove("fm-vday-lock");
    window.removeEventListener("keydown", onKeyDown);
  }

  function onKeyDown(e) {
    if (e.key === "Escape") removePopup();
  }

  function buildPopup() {
    // avoid duplicates
    if (document.getElementById("fm-vday-backdrop")) return;

    const mobile = isMobileViewport();
    const img = mobile ? CONFIG.mobileImage : CONFIG.desktopImage;

    // Backdrop
    const backdrop = el("div", { id: "fm-vday-backdrop", class: "fm-vday-backdrop", role: "dialog", "aria-modal": "true" });

    // Close on click outside dialog
    backdrop.addEventListener("click", (e) => {
      if (e.target === backdrop) removePopup();
    });

    // Dialog
    const dialog = el("div", { class: "fm-vday-dialog" });

    // Hero
    const hero = el("div", { class: "fm-vday-hero" });
    hero.style.backgroundImage = `url("${img}")`;

    // Close button
    const closeBtn = el("button", { class: "fm-vday-close", type: "button", "aria-label": "Închide" }, [
      el("span", { html: "&times;" })
    ]);
    closeBtn.addEventListener("click", removePopup);

    // Title wrap (premium) — stays OFF the face on mobile via CSS top: 38vh
    const titleWrap = el("div", { class: "fm-vday-titlewrap" }, [
      el("div", { class: "fm-vday-title", text: "Valentine’s" }),
      el("div", { class: "fm-vday-subtitle", text: "vine după colț" }),
      el("div", { class: "fm-vday-orn" }),
      el("div", { class: "fm-vday-micro", text: "Colecție limitată • Comandă rapid" })
    ]);

    // Buttons
    const actions = el("div", { class: "fm-vday-actions" });

    const waBtn = el("a", { class: "fm-vday-btn fm-vday-btn--wa", href: buildWhatsAppLink(), target: "_blank", rel: "noopener" });
    waBtn.appendChild(
      el("span", { class: "fm-vday-wa-dot", html: `
        <svg viewBox="0 0 32 32" aria-hidden="true">
          <path d="M19.11 17.23c-.27-.13-1.6-.79-1.84-.88-.25-.09-.43-.13-.6.13-.18.27-.7.88-.86 1.06-.16.18-.32.2-.59.07-.27-.13-1.15-.42-2.2-1.34-.82-.73-1.37-1.63-1.53-1.9-.16-.27-.02-.41.12-.54.12-.12.27-.32.41-.48.13-.16.18-.27.27-.45.09-.18.04-.34-.02-.48-.07-.13-.6-1.45-.82-1.98-.22-.53-.44-.45-.6-.45h-.52c-.18 0-.48.07-.73.34-.25.27-.95.93-.95 2.27 0 1.34.98 2.64 1.12 2.82.13.18 1.93 2.95 4.67 4.13.65.28 1.15.45 1.55.58.65.21 1.24.18 1.7.11.52-.08 1.6-.65 1.83-1.28.23-.63.23-1.17.16-1.28-.06-.11-.25-.18-.52-.32z"/>
          <path d="M16 3C8.83 3 3 8.83 3 16c0 2.3.6 4.46 1.66 6.34L3.6 29l6.85-1.99A12.94 12.94 0 0 0 16 29c7.17 0 13-5.83 13-13S23.17 3 16 3zm0 23.6c-2.03 0-3.92-.6-5.51-1.63l-.39-.25-4.06 1.18 1.2-3.95-.25-.4A10.56 10.56 0 1 1 16 26.6z"/>
        </svg>
      `})
    );
    waBtn.appendChild(el("span", { text: "Comandă pe WhatsApp" }));

    const colBtn = el("a", { class: "fm-vday-btn fm-vday-btn--col", href: CONFIG.collectionUrl });
    colBtn.appendChild(el("span", { text: "Vezi colecția" }));

    actions.appendChild(waBtn);
    actions.appendChild(colBtn);

    // Compose
    hero.appendChild(closeBtn);
    hero.appendChild(titleWrap);
    hero.appendChild(actions);

    dialog.appendChild(hero);
    backdrop.appendChild(dialog);
    document.body.appendChild(backdrop);

    // Lock scroll
    document.body.classList.add("fm-vday-lock");

    // ESC to close
    window.addEventListener("keydown", onKeyDown);

    // Re-render on resize breakpoints (so image switches correctly)
    let lastMobile = mobile;
    window.addEventListener("resize", () => {
      const nowMobile = isMobileViewport();
      if (nowMobile !== lastMobile) {
        // rebuild cleanly
        removePopup();
        setTimeout(buildPopup, 50);
        lastMobile = nowMobile;
      }
    }, { passive: true });
  }

  function init() {
    // show on every page load (index + catalog) — no persistence blocking
    ensureFonts();
    setTimeout(buildPopup, CONFIG.showDelay);
  }

  // DOM ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
