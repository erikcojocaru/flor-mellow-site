// ======================
// WhatsApp helper
// ======================
const WA_NUMBER = "40738841225";

window.openWhatsApp = function (message) {
  const text = encodeURIComponent(message);
  window.open(`https://wa.me/${WA_NUMBER}?text=${text}`, "_blank");
};

// Rulează totul după ce DOM-ul e gata (script-ul este cu defer, dar să fim safe)
document.addEventListener("DOMContentLoaded", () => {
  // ======================
  // Scroll reveal
  // ======================
  const reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    reveals.forEach((el) => observer.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add("visible"));
  }

  // ======================
  // Footer year
  // ======================
  const yearSpan = document.getElementById("year");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // ======================
  // MODAL PRODUSE (index + catalog)
  // ======================
  const modal = document.getElementById("productModal");
  const modalImg = document.getElementById("modalImg");
  const modalTitle = document.getElementById("modalTitle");
  const modalPrice = document.getElementById("modalPrice");
  const modalDesc = document.getElementById("modalDesc");
  const modalWhatsAppBtn = document.getElementById("modalWhatsAppBtn");
  const modalDots = document.getElementById("modalDots");
  const modalMedia = document.getElementById("modalMedia");

  let modalImages = [];
  let modalImageIndex = 0;

  function renderModalImage() {
    if (!modal || !modalImg) return;
    if (!modalImages.length) return;

    modalImg.src = modalImages[modalImageIndex];
    if (!modalDots) return;

    modalDots.innerHTML = "";
    if (modalImages.length > 1) {
      modalImages.forEach((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "modal-dot" + (idx === modalImageIndex ? " active" : "");
        dot.onclick = () => {
          modalImageIndex = idx;
          renderModalImage();
        };
        modalDots.appendChild(dot);
      });
    }
  }

  window.prevModalImage = function () {
    if (!modalImages.length) return;
    modalImageIndex = (modalImageIndex - 1 + modalImages.length) % modalImages.length;
    renderModalImage();
  };

  window.nextModalImage = function () {
    if (!modalImages.length) return;
    modalImageIndex = (modalImageIndex + 1) % modalImages.length;
    renderModalImage();
  };

  function openModalFromCard(card) {
    if (!modal) return;

    const title =
      card.dataset.title ||
      card.querySelector(".product-name")?.textContent ||
      "Buchet Flor Mellow";
    const price =
      card.dataset.price ||
      card.querySelector(".product-price")?.textContent ||
      "";
    const desc =
      card.dataset.desc ||
      card.querySelector(".product-desc")?.textContent ||
      "";

    const imagesAttr = card.dataset.images;
    const fallbackImg = card.dataset.img || card.querySelector("img")?.src || "";

    if (imagesAttr) {
      modalImages = imagesAttr
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
    } else if (fallbackImg) {
      modalImages = [fallbackImg];
    } else {
      modalImages = [];
    }

    modalImageIndex = 0;

    if (modalTitle) modalTitle.textContent = title;
    if (modalPrice) modalPrice.textContent = price;
    if (modalDesc) modalDesc.textContent = desc;

    if (modalWhatsAppBtn) {
      modalWhatsAppBtn.onclick = () => {
        window.openWhatsApp(
          `Bună, mă interesează produsul „${title}” (${price}). Putem discuta detaliile?`
        );
      };
    }

    renderModalImage();
    modal.style.display = "flex";
  }

  window.closeModal = function () {
    if (modal) modal.style.display = "none";
  };

  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) window.closeModal();
    });
  }

  // Atașează modalul la toate cardurile de produs (index + catalog)
  const productCards = document.querySelectorAll(".product-card");
  productCards.forEach((card) => {
    card.addEventListener("click", (e) => {
      e.stopPropagation();
      openModalFromCard(card);
    });
    const btn = card.querySelector(".product-btn");
    if (btn) {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModalFromCard(card);
      });
    }
  });

  // ======================
  // HERO slideshow
  // ======================
  (function initHeroSlideshow() {
    const heroImg = document.querySelector(".hero-card img");
    const heroDotsWrap = document.querySelector(".hero-dots");
    const heroQuoteEl = document.querySelector(".hero-floating strong");

    if (!heroImg || !heroImg.dataset.heroImages) return;

    const heroImages = heroImg.dataset.heroImages
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!heroImages.length) return;

    const heroQuotes = [
      "„Nu doar flori, ci un desert care arată ca un buchet.”",
      "„Bezele moi, culori pastel și un buchet care se mănâncă până la ultima floare.”",
      "„Desertul care arată ca un buchet și rămâne în poze și în amintiri.”",
      "„Buchetul de care ți-e milă să te atingi… până îl guști.”",
    ];

    let heroIndex = 0;
    let heroTimer = null;
    let heroDots = [];

    function syncHeroDots() {
      if (!heroDots.length) return;
      heroDots.forEach((d, idx) => {
        d.classList.toggle("active", idx === heroIndex);
      });
    }

    function showHeroImage(newIndex) {
      if (!heroImages.length) return;

      newIndex = (newIndex + heroImages.length) % heroImages.length;
      if (newIndex === heroIndex) return;

      heroIndex = newIndex;
      const nextSrc = heroImages[heroIndex];

      heroImg.style.opacity = 0.2;
      setTimeout(() => {
        heroImg.src = nextSrc;
        if (heroQuoteEl && heroQuotes[heroIndex]) {
          heroQuoteEl.textContent = heroQuotes[heroIndex];
        }
        heroImg.onload = () => {
          heroImg.style.opacity = 1;
        };
      }, 250);

      syncHeroDots();
    }

    function startHeroAuto() {
      if (heroTimer) clearInterval(heroTimer);
      heroTimer = setInterval(() => {
        showHeroImage(heroIndex + 1);
      }, 7000);
    }

    // init
    heroImg.style.opacity = 1;
    heroImg.src = heroImages[0];
    heroIndex = 0;
    if (heroQuoteEl && heroQuotes[0]) {
      heroQuoteEl.textContent = heroQuotes[0];
    }

    if (heroDotsWrap) {
      heroDotsWrap.innerHTML = "";
      heroDots = heroImages.map((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "hero-dot" + (idx === heroIndex ? " active" : "");
        dot.addEventListener("click", () => {
          showHeroImage(idx);
          startHeroAuto();
        });
        heroDotsWrap.appendChild(dot);
        return dot;
      });
    }

    startHeroAuto();

    // swipe pe mobil
    let touchStartX = null;

    heroImg.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || !e.touches.length) return;
        touchStartX = e.touches[0].clientX;
      },
      { passive: true }
    );

    heroImg.addEventListener("touchend", (e) => {
      if (touchStartX === null) return;
      const touchEndX =
        e.changedTouches && e.changedTouches[0]
          ? e.changedTouches[0].clientX
          : touchStartX;
      const deltaX = touchEndX - touchStartX;
      const THRESHOLD = 40;
      if (Math.abs(deltaX) > THRESHOLD) {
        if (deltaX < 0) {
          showHeroImage(heroIndex + 1);
        } else {
          showHeroImage(heroIndex - 1);
        }
        startHeroAuto();
      }
      touchStartX = null;
    });
  })();

  // ======================
  // ABOUT slideshow („Povestea noastră”)
  // ======================
  (function initAboutSlideshow() {
    const aboutSection = document.querySelector("#about");
    if (!aboutSection) return;

    const aboutImg = aboutSection.querySelector(".about-photo img");
    const aboutDotsWrap = aboutSection.querySelector(".about-dots");
    const aboutQuoteEl = aboutSection.querySelector(".about-floating strong");

    if (!aboutImg || !aboutImg.dataset.aboutImages) return;

    const aboutImages = aboutImg.dataset.aboutImages
      .split("|")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!aboutImages.length) return;

    const aboutQuotes = [
      "„Fiecare floare din bezea e făcută manual, petală cu petală.”",
      "„Lucrăm în loturi mici, ca fiecare buchet să primească atenția lui.”",
      "„Ne inspirăm din florării, dar gândim totul ca un desert de împărțit.”",
      "„Pastel, comestibil și gândit pentru momentul tău.”",
      "„Buchetul tău începe de la o singură floare din bezea.”",
    ];

    let aboutIndex = 0;
    let aboutDots = [];

    function syncAboutDots() {
      if (!aboutDots.length) return;
      aboutDots.forEach((d, idx) => {
        d.classList.toggle("active", idx === aboutIndex);
      });
    }

    function showAboutImage(newIndex) {
      if (!aboutImages.length) return;

      newIndex = (newIndex + aboutImages.length) % aboutImages.length;
      if (newIndex === aboutIndex) return;

      aboutIndex = newIndex;
      const nextSrc = aboutImages[aboutIndex];

      aboutImg.style.opacity = 0;
      setTimeout(() => {
        aboutImg.src = nextSrc;
        if (aboutQuoteEl && aboutQuotes[aboutIndex]) {
          aboutQuoteEl.textContent = aboutQuotes[aboutIndex];
        }
        aboutImg.onload = () => {
          aboutImg.style.opacity = 1;
        };
      }, 250);

      syncAboutDots();
    }

    if (aboutDotsWrap) {
      aboutDotsWrap.innerHTML = "";
      aboutDots = aboutImages.map((_, idx) => {
        const dot = document.createElement("span");
        dot.className = "about-dot" + (idx === aboutIndex ? " active" : "");
        dot.addEventListener("click", () => {
          showAboutImage(idx);
        });
        aboutDotsWrap.appendChild(dot);
        return dot;
      });
    }

    if (aboutQuoteEl && aboutQuotes[0]) {
      aboutQuoteEl.textContent = aboutQuotes[0];
    }

    // auto-rotate
    setInterval(() => showAboutImage(aboutIndex + 1), 7000);

    // swipe pe mobil în zona pozei
    let startX = null;
    const THRESHOLD = 40;

    aboutImg.addEventListener(
      "touchstart",
      (e) => {
        if (!e.touches || !e.touches.length) return;
        startX = e.touches[0].clientX;
      },
      { passive: true }
    );

    aboutImg.addEventListener("touchend", (e) => {
      if (startX === null) return;
      const endX =
        e.changedTouches && e.changedTouches[0]
          ? e.changedTouches[0].clientX
          : startX;
      const delta = endX - startX;
      if (Math.abs(delta) > THRESHOLD) {
        if (delta < 0) {
          showAboutImage(aboutIndex + 1);
        } else {
          showAboutImage(aboutIndex - 1);
        }
      }
      startX = null;
    });
  })();

  // ======================
  // SWIPE pentru MODAL
  // ======================
  (function initModalSwipe() {
    if (!modalMedia) return;

    let startX = 0;
    let endX = 0;
    const THRESHOLD = 40;

    function onTouchStart(e) {
      if (!e.touches || !e.touches.length) return;
      startX = e.touches[0].clientX;
    }

    function onTouchEnd(e) {
      endX =
        e.changedTouches && e.changedTouches[0]
          ? e.changedTouches[0].clientX
          : startX;
      const delta = endX - startX;
      if (Math.abs(delta) > THRESHOLD) {
        if (delta < 0) {
          window.nextModalImage();
        } else {
          window.prevModalImage();
        }
      }
      startX = 0;
      endX = 0;
    }

    modalMedia.addEventListener("touchstart", onTouchStart, { passive: true });
    modalMedia.addEventListener("touchend", onTouchEnd, { passive: true });
  })();
});
