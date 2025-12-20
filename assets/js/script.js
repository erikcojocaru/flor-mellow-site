
// ======================
// Price helpers (buchete)
// ======================
const BOUQUET_PRICE_MAP = {
    "XS": { price: 130, old: 169 },
    "S":  { price: 189, old: 249 },
    "M":  { price: 239, old: 319 },
    "L":  { price: 319, old: 429 },
    "XL": { price: 500, old: 649 },
    "KING": { price: 500, old: 649 }
};

function normalizePriceNumber(raw) {
    if (raw === null || raw === undefined) return null;
    const s = String(raw).trim();
    if (!s || s === "--") return null;
    // extract first number (handles "189", "189 RON", "de la 189 RON")
    const m = s.replace(",", ".").match(/(\d+(\.\d+)?)/);
    if (!m) return null;
    const n = Number(m[1]);
    return Number.isFinite(n) ? n : null;
}

function formatPriceForDisplay(raw) {
    const n = normalizePriceNumber(raw);
    if (n === null) return "--";
    // show integers, no decimals
    return String(Math.round(n));
}

function renderPriceHTML(newRaw, oldRaw) {
    const newN = normalizePriceNumber(newRaw);
    const oldN = normalizePriceNumber(oldRaw);

    // If no price, return null to keep existing content
    if (newN === null) return null;

    const newText = `de la ${Math.round(newN)} RON`;
    const oldText = (oldN !== null && oldN > newN) ? `${Math.round(oldN)} RON` : null;

    if (oldText) {
        return `<div class="price-stack"><span class="price-old">${oldText}</span><span class="price-new">${newText}</span></div>`;
    }
    return `<span class="price-new">${newText}</span>`;
}

function inferBouquetSize(card) {
    // Prefer explicit pill text (XS/S/M/L/XL)
    const pill = card.querySelector?.(".size-pill")?.textContent?.trim()?.toUpperCase();
    if (pill && BOUQUET_PRICE_MAP[pill]) return pill;

    // Fallback: infer from images path / title
    const blob = `${card.dataset.images || ""} ${card.dataset.img || ""} ${card.dataset.title || ""}`.toUpperCase();
    if (blob.includes("BOUQUET SIZE XS") || blob.includes("BOUQUET SIZE  XS") || blob.includes("BOUQUET SIZE XS/") || blob.includes("BOUQUET SIZE XS\\")) return "XS";
    if (blob.includes("BOUQUET SIZE XL") || blob.includes("BOUQUET SIZE  XL")) return "XL";
    if (blob.includes("BOUQUET SIZE L") || blob.includes("BOUQUET SIZE  L")) return "L";
    if (blob.includes("BOUQUET SIZE M") || blob.includes("BOUQUET WITH PEONIES M")) return "M";
    if (blob.includes("BOUQUET SIZE S") || blob.includes("BOUQUET SIZE S NR") || blob.includes("BOUQUET SIZE S NR")) return "S";
    if (blob.includes("KING")) return "KING";
    return null;
}
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

        const title = card.dataset.title || card.querySelector(".product-name")?.textContent || "Buchet Flor Mellow";
        const priceRaw = card.dataset.price || card.querySelector(".product-price")?.textContent || "";
        const oldPriceRaw = card.dataset.oldPrice || card.dataset.oldPrice || card.getAttribute("data-old-price") || "";
        const price = formatPriceForDisplay(priceRaw);
        const desc = card.dataset.desc || card.querySelector(".product-desc")?.textContent || "";

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
        if (modalPrice) modalPrice.innerHTML = renderPriceHTML(priceRaw, oldPriceRaw);
        if (modalDesc) modalDesc.textContent = desc;

        if (modalWhatsAppBtn) {
            modalWhatsAppBtn.onclick = () => {
                window.openWhatsApp(`Bună, mă interesează produsul „${title}” (${price}). Putem discuta detaliile?`);
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

    

    
    function applyBouquetPricing() {
        document.querySelectorAll('.product-card').forEach((card) => {
            const blob = `${card.dataset.images || ""} ${card.dataset.img || ""} ${card.dataset.title || ""}`.toUpperCase();
            const isBouquet = (card.dataset.category || "").toLowerCase() === "buchete" || blob.includes("BOUQUET");
            if (!isBouquet) return;

            const size = inferBouquetSize(card);
            if (!size) return;

            const map = BOUQUET_PRICE_MAP[size];

            const cur = card.dataset.price || "";
            const curN = normalizePriceNumber(cur);
            if (curN === null) {
                card.dataset.price = String(map.price);
            } else {
                // keep existing numeric price if set
                card.dataset.price = String(Math.round(curN));
            }

            const oldCur = card.dataset.oldPrice || card.getAttribute("data-old-price") || "";
            const oldN = normalizePriceNumber(oldCur);
            if (oldN === null) {
                card.dataset.oldPrice = String(map.old);
                card.setAttribute("data-old-price", String(map.old));
            } else {
                card.dataset.oldPrice = String(Math.round(oldN));
                card.setAttribute("data-old-price", String(Math.round(oldN)));
            }
        });
    }

            const oldCur = (card.dataset.oldPrice || card.getAttribute("data-old-price") || "").trim();
            if (!oldCur) {
                card.dataset.oldPrice = String(map.old);
                card.setAttribute("data-old-price", String(map.old));
            }
        });
    }

    function applyCardPriceRendering() {
        document.querySelectorAll(".product-card").forEach((card) => {
            const priceDiv = card.querySelector(".product-price");
            if (!priceDiv) return;

            const newRaw = card.dataset.price || "";
            const oldRaw = card.dataset.oldPrice || card.getAttribute("data-old-price") || "";

            // If the HTML already contains spans, leave it.
            if (priceDiv.querySelector(".price-new") || priceDiv.querySelector(".price-old")) return;

            const html = renderPriceHTML(newRaw, oldRaw);
            if (html) priceDiv.innerHTML = html;
        });
    }

    applyBouquetPricing();
    applyCardPriceRendering();

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
    // Randomizare produse (index + catalog)
    // ======================
    (function randomizeProductCards() {
        const grids = document.querySelectorAll(".product-grid");
        grids.forEach((grid) => {
            const cards = Array.from(grid.querySelectorAll(".product-card"));
            if (cards.length <= 1) return;

            // shuffle simplu
            const shuffled = cards
                .map((card) => ({ card, sort: Math.random() }))
                .sort((a, b) => a.sort - b.sort)
                .map((x) => x.card);

            // reatașăm în DOM în noua ordine
            shuffled.forEach((card) => grid.appendChild(card));
        });
    })();

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
            const touchEndX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : touchStartX;
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
            const endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX;
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
            endX = e.changedTouches && e.changedTouches[0] ? e.changedTouches[0].clientX : startX;
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
// ======================
// momente flor mellow - carousel-track
// ======================

document.addEventListener("DOMContentLoaded", function () {
    const track = document.querySelector(".mini-carousel-track");
    const prev = document.querySelector(".mini-prev");
    const next = document.querySelector(".mini-next");
    const wrap = document.querySelector(".mini-carousel-wrap");

    if (!track || !prev || !next || !wrap) return;

    // ia doar imaginile originale
    let items = Array.from(track.querySelectorAll("img"));
    const originalCount = items.length;
    if (originalCount === 0) return;

    // DUBLĂM imaginile pentru efect de bandă rulantă infinită
    items.forEach((img) => {
        const clone = img.cloneNode(true);
        clone.setAttribute("data-clone", "true");
        track.appendChild(clone);
    });

    // actualizăm lista după clonare
    items = Array.from(track.querySelectorAll("img"));

    let rafId = null;
    let autoSpeed = 0.75; // pixeli per frame (~15px/sec la 60fps)

    function getLoopWidth() {
        // jumătate din scrollWidth = lățimea setului original
        return track.scrollWidth / 2;
    }

    // autoplay: mișcare constantă spre dreapta, fără să atingem capătul real
    function startAuto() {
        if (rafId !== null) return;

        function step() {
            const loopWidth = getLoopWidth();

            if (loopWidth > 0) {
                track.scrollLeft += autoSpeed;

                // când depășim lățimea setului original, revenim înapoi cu exact acea lățime
                if (track.scrollLeft >= loopWidth) {
                    track.scrollLeft -= loopWidth;
                }
            }

            rafId = requestAnimationFrame(step);
        }

        rafId = requestAnimationFrame(step);
    }

    function stopAuto() {
        if (rafId !== null) {
            cancelAnimationFrame(rafId);
            rafId = null;
        }
    }

    // săgeți: mută cu un "card" original, nu cu clone
    function scrollOneCard(direction) {
        const first = items[0];
        const rect = first.getBoundingClientRect();
        const style = window.getComputedStyle(track);
        const gap = parseFloat(style.gap || "0");
        const step = rect.width + gap;

        track.scrollBy({
            left: direction * step,
            behavior: "smooth",
        });
    }

    next.addEventListener("click", () => {
        stopAuto();
        scrollOneCard(1);
        setTimeout(startAuto, 3000);
    });

    prev.addEventListener("click", () => {
        stopAuto();
        scrollOneCard(-1);
        setTimeout(startAuto, 3000);
    });

    // pauză autoplay când user-ul interacționează (hover / touch)
    wrap.addEventListener("mouseenter", stopAuto);
    wrap.addEventListener("mouseleave", startAuto);
    wrap.addEventListener("touchstart", stopAuto);
    wrap.addEventListener("touchend", startAuto);

    // PORNIM autoplay (desktop + mobil)
    startAuto();
});
