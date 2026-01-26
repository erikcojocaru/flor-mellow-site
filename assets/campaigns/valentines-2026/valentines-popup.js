(() => {
  const overlay = document.getElementById("fmv-overlay");
  if (!overlay) return;

  // === CONFIG: schimbi tu datele când vrei ===
  const START = "2026-01-20"; // YYYY-MM-DD
  const END   = "2026-02-15"; // YYYY-MM-DD

  const today = new Date().toISOString().slice(0, 10);
  if (today < START || today > END) return;

  const open = () => {
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.documentElement.style.overflow = "hidden";
  };

  const close = () => {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.documentElement.style.overflow = "";
  };

  // click pe fundal => close
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });

  // X => close
  overlay.querySelector(".fmv-close")?.addEventListener("click", close);

  // ESC => close
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });

  // Apare la fiecare deschidere/refresh
  setTimeout(open, 350);
})();
