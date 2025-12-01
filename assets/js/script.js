      const WA_NUMBER = "40738841225";

      function openWhatsApp(message) {
        const text = encodeURIComponent(message);
        window.open(`https://wa.me/${WA_NUMBER}?text=` + text, "_blank");
      }

      // Scroll reveal
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

      // Year in footer
      document.getElementById("year").textContent = new Date().getFullYear();

      // Shuffle buchete în catalog la fiecare reload
      function shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
      }

      function shuffleCatalog() {
        const grids = document.querySelectorAll(".product-grid");
        grids.forEach((grid) => {
          const cards = Array.from(grid.querySelectorAll(".product-card"));
          if (cards.length <= 1) return;
          const shuffled = shuffleArray(cards.slice());
          shuffled.forEach((card) => grid.appendChild(card));
        });
      }

      // rulăm shuffle înainte să legăm evenimentele pe carduri
      shuffleCatalog();

      // MODAL + slider
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
        if (!modalImages.length) return;
        modalImg.src = modalImages[modalImageIndex];
        modalDots.innerHTML = "";
        if (modalImages.length > 1) {
          modalImages.forEach((_, idx) => {
            const dot = document.createElement("span");
            dot.className = "modal-dot" + (idx === modalImageIndex ? " active" : "");
            dot.onclick = () => goToModalImage(idx);
            modalDots.appendChild(dot);
          });
        }
      }

      function goToModalImage(i) {
        modalImageIndex = i;
        renderModalImage();
      }

      function prevModalImage() {
        if (modalImages.length < 2) return;
        modalImageIndex = (modalImageIndex - 1 + modalImages.length) % modalImages.length;
        renderModalImage();
      }

      function nextModalImage() {
        if (modalImages.length < 2) return;
        modalImageIndex = (modalImageIndex + 1) % modalImages.length;
        renderModalImage();
      }

      function openModalFromCard(card) {
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
          modalImages = imagesAttr.split("|").map((s) => s.trim()).filter(Boolean);
        } else {
          modalImages = [fallbackImg];
        }
        modalImageIndex = 0;
        modalTitle.textContent = title;
        modalPrice.textContent = price;
        modalDesc.textContent = desc;
        modalWhatsAppBtn.onclick = () => {
          openWhatsApp(`Bună, mă interesează produsul „${title}” (${price}). Putem discuta detaliile?`);
        };
        renderModalImage();
        modal.style.display = "flex";
      }

      function closeModal() {
        modal.style.display = "none";
      }

      modal.addEventListener("click", (e) => {
        if (e.target === modal) closeModal();
      });

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

      // HERO + ABOUT slideshow + slider dots produse
      (function () {
        // HERO
        const heroImg = document.querySelector(".hero-card img");
        const heroDotsWrap = document.querySelector(".hero-dots");
        const heroQuoteEl = document.querySelector(".hero-floating strong");

        if (heroImg && heroImg.dataset.heroImages) {
          const heroImages = heroImg.dataset.heroImages
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean);

          const heroQuotes = [
            "„Nu doar flori, ci un desert care arată ca un buchet.”",
            "„Bezele moi, culori pastel și un buchet care se mănâncă până la ultima floare.”",
            "„Desertul care arată ca un buchet și rămâne în poze și în amintiri.”",
          ];

          if (heroImages.length > 0) {
            let heroIndex = 0;
            const FADE_DELAY = 350;
            const INTERVAL_MS = 7000;
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
              }, FADE_DELAY);
              syncHeroDots();
            }

            function startHeroAuto() {
              if (heroTimer) clearInterval(heroTimer);
              heroTimer = setInterval(() => {
                showHeroImage(heroIndex + 1);
              }, INTERVAL_MS);
            }

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

            // Swipe mobil HERO
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
          }
        }

        // ABOUT slideshow
        const aboutImg = document.querySelector("#about .about-photo img");
        const aboutDotsWrap = document.querySelector("#about .about-dots");
        const aboutQuoteEl = document.querySelector("#about .about-floating strong");

        if (aboutImg && aboutImg.dataset.aboutImages) {
          const aboutImages = aboutImg.dataset.aboutImages
            .split("|")
            .map((s) => s.trim())
            .filter(Boolean);

          const aboutQuotes = [
            "„Fiecare floare din bezea e făcută manual, petală cu petală.”",
            "„Lucrăm în loturi mici, ca fiecare buchet să primească atenția lui.”",
            "„Ne inspirăm din florării, dar gândim totul ca un desert de împărțit.”",
            "„Combinația noastră preferată: pastel, texturi și gust.”",
            "„Fiecare buchet pornește de la o singură floare din bezea.”",
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
                aboutQuoteEl.textContent = aboutQuotes[aboutIndex] || aboutQuotes[0];
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

          setInterval(() => showAboutImage(aboutIndex + 1), 7000);
        }

        // SLIDER PRODUSE – dots pe mobil
        const sliders = document.querySelectorAll("[data-slider]");
        sliders.forEach((slider) => {
          const track = slider.querySelector(".product-grid");
          const cards = track ? track.querySelectorAll(".product-card") : [];
          const dotsWrap = slider.querySelector("[data-dots]");

          if (!track || !cards.length || !dotsWrap) return;

          dotsWrap.innerHTML = "";
          const dots = Array.from(cards).map((card, idx) => {
            const dot = document.createElement("span");
            dot.className = "product-dot" + (idx === 0 ? " active" : "");
            dot.addEventListener("click", () => {
              const left = card.offsetLeft - track.offsetLeft;
              track.scrollTo({ left, behavior: "smooth" });
              setActive(idx);
            });
            dotsWrap.appendChild(dot);
            return dot;
          });

          function setActive(index) {
            dots.forEach((d, i) => d.classList.toggle("active", i === index));
          }

          track.addEventListener("scroll", () => {
            const scrollLeft = track.scrollLeft;
            let closestIdx = 0;
            let minDiff = Infinity;
            cards.forEach((card, idx) => {
              const diff = Math.abs(card.offsetLeft - track.offsetLeft - scrollLeft);
              if (diff < minDiff) {
                minDiff = diff;
                closestIdx = idx;
              }
            });
            setActive(closestIdx);
          });
        });
      })();

      // SWIPE GESTURES pentru MODAL (mobile)
      (function () {
        let startX = 0;
        let endX = 0;
        const THRESHOLD = 40;

        function onTouchStart(e) {
          if (!e.touches || !e.touches.length) return;
          startX = e.touches[0].clientX;
        }

        function onTouchEnd(e) {
          if (typeof startX !== "number") return;
          endX = (e.changedTouches && e.changedTouches[0]) ? e.changedTouches[0].clientX : startX;
          const delta = endX - startX;
          if (Math.abs(delta) > THRESHOLD) {
            if (delta < 0) {
              nextModalImage();
            } else {
              prevModalImage();
            }
          }
          startX = 0;
          endX = 0;
        }

        if (modalMedia) {
          modalMedia.addEventListener("touchstart", onTouchStart, { passive: true });
          modalMedia.addEventListener("touchend", onTouchEnd, { passive: true });
        }
      })();