/* =====================================================================
   Flor Mellow – Crăciun 2026
   - prima pagină: secțiunea „Colecția de sărbători”, construită automat
     din produsele cu badge CRĂCIUN (.product-badge--xmas), bradul primul;
   - catalog: butonul „Crăciun” în filtre; catalog.html#craciun îl
     deschide direct activ.
   Se oprește singur după 4 ianuarie 2027. Curățenie după sărbători:
   șterge cele 3 rânduri „CRĂCIUN 2026” din index.html și catalog.html
   și folderul assets/campaigns/christmas-2026.
   ===================================================================== */
(function () {
    "use strict";

    var END = new Date(2027, 0, 5);        // vizibil până pe 4 ianuarie 2027 inclusiv
    var CHRISTMAS = new Date(2026, 11, 25);
    var FIRST = ["grand-christmas-marshmallow-tree-brad-craciun-bezele-cluj"]; // apar primele în secțiune
    var COLLECTION = "craciun";

    var now = new Date();
    if (now >= END) return;

    var TREE_ICON =
        '<svg class="chip-icon" width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">' +
        '<path d="M7.5 1.2 10.3 5.2H9l2.6 3.8H10l2.8 3.8H2.2L5 9H3.4L6 5.2H4.7z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/>' +
        '<path d="M7.5 12.8v1.6" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>';

    // cardurile cu badge CRĂCIUN, fiecare o singură dată, în ordinea din pagină
    function xmasCards() {
        var seen = {};
        var list = [];
        document.querySelectorAll(".product-card").forEach(function (card) {
            if (!card.querySelector(".product-badge--xmas")) return;
            var key = card.dataset.slug || card.id || card.dataset.title;
            if (seen[key]) return;
            seen[key] = true;
            list.push(card);
        });
        return list;
    }

    function onReady(fn) {
        if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fn);
        else fn();
    }

    // ---------- catalog: butonul „Crăciun” ----------
    function setupCatalog(cats) {
        // marchează produsele de Crăciun ca făcând parte din colecție (filtrul din catalog.html citește data-collections)
        xmasCards().forEach(function (card) {
            var cols = (card.dataset.collections || "").split(",").filter(Boolean);
            if (cols.indexOf(COLLECTION) === -1) cols.push(COLLECTION);
            card.dataset.collections = cols.join(",");
        });

        var chip = document.createElement("button");
        chip.type = "button";
        chip.className = "catalog-chip xmas-chip";
        chip.setAttribute("data-category-filter", COLLECTION);
        chip.innerHTML = TREE_ICON + "\nCrăciun\n";

        var all = cats.querySelector('[data-category-filter="all"]');
        cats.insertBefore(chip, all ? all.nextSibling : cats.firstChild);
        if (!cats.id) cats.id = COLLECTION; // ținta link-ului catalog.html#craciun

        // link direct: activează filtrul după ce scriptul catalogului și-a legat butoanele
        // (acela rulează la DOMContentLoaded; scriptul acesta e „defer”, deci rulează înainte)
        if (window.location.hash === "#" + COLLECTION) {
            if (document.readyState === "complete") chip.click();
            else document.addEventListener("DOMContentLoaded", function () { chip.click(); });
        }
    }

    // ---------- prima pagină: „Colecția de sărbători” ----------
    function priceLabel(card) {
        var prices = [parseFloat(card.dataset.price)];
        try {
            var variants = JSON.parse(card.dataset.variants || "{}");
            Object.keys(variants).forEach(function (k) { prices.push(parseFloat(variants[k].price)); });
        } catch (e) { /* fără variante */ }
        prices = prices.filter(function (p) { return isFinite(p); });
        if (!prices.length) return "";
        var min = Math.min.apply(null, prices);
        var max = Math.max.apply(null, prices);
        return (min !== max ? "de la " : "") + min + " RON";
    }

    function countdownHTML() {
        var days = Math.ceil((CHRISTMAS - now) / 864e5);
        if (days > 1) {
            var de = (days % 100 === 0 || days % 100 >= 20) ? "de " : ""; // „31 de zile”, „19 zile”
            return "mai sunt <strong>" + days + "</strong> " + de + "zile până la Crăciun";
        }
        if (days === 1) return "Crăciunul e <strong>mâine</strong>";
        return "<strong>Sărbători fericite!</strong>";
    }

    function miniCard(card) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "xmas-mini";
        btn.innerHTML = '<img alt="" loading="lazy" decoding="async"/>' +
            '<span class="xmas-mini-name"></span><span class="xmas-mini-price"></span>';
        var title = card.dataset.title || "";
        var img = btn.querySelector("img");
        img.setAttribute("src", card.dataset.img || "");
        img.setAttribute("alt", title);
        btn.querySelector(".xmas-mini-name").textContent = title;
        btn.querySelector(".xmas-mini-price").textContent = priceLabel(card);
        btn.addEventListener("click", function () {
            var open = card.querySelector(".product-btn") || card;
            open.click(); // deschide modalul produsului, ca un click pe card
        });
        return btn;
    }

    function setupHome(anchor) {
        var cards = xmasCards().filter(function (c) { return !c.classList.contains("is-soldout"); });
        if (!cards.length) return;
        cards.sort(function (a, b) {
            var ia = FIRST.indexOf(a.dataset.slug);
            var ib = FIRST.indexOf(b.dataset.slug);
            return (ia === -1 ? FIRST.length : ia) - (ib === -1 ? FIRST.length : ib);
        });

        var beforeXmas = Math.ceil((CHRISTMAS - now) / 864e5) > 0;
        var section = document.createElement("section");
        section.className = "xmas-collection";
        section.setAttribute("aria-label", "Colecția de sărbători");
        section.innerHTML =
            '<div class="container"><div class="xmas-collection-box">' +
            '<div class="xmas-collection-head"><div>' +
            '<div class="xmas-kicker">✦ Colecția de sărbători</div>' +
            '<h2 class="xmas-title">' + (beforeXmas ? "Crăciunul vine <span>dulce</span>." : "Sărbători <span>dulci</span>.") + "</h2>" +
            '<p class="xmas-text">Cadouri din bezea create special pentru sărbători, de la buchete și cutii până la bradul de 80 cm.</p>' +
            '</div><div class="xmas-countdown">' + countdownHTML() + "</div></div>" +
            '<div class="xmas-strip"></div>' +
            '<div class="xmas-collection-foot">Comandă din timp, locurile sunt limitate. ' +
            '<a href="catalog.html#' + COLLECTION + '">Vezi toată colecția în catalog →</a></div>' +
            "</div></div>";

        var strip = section.querySelector(".xmas-strip");
        cards.forEach(function (card) { strip.appendChild(miniCard(card)); });
        anchor.parentNode.insertBefore(section, anchor);
    }

    onReady(function () {
        var cats = document.querySelector(".catalog-categories");
        if (cats) return setupCatalog(cats);
        var infoBar = document.querySelector(".info-bar");
        if (infoBar) setupHome(infoBar);
    });
})();
