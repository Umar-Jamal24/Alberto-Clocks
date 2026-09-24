/*
  cart-wishlist.js
  ------------------------------------------------------------------
  New, self-contained behaviors added on top of the existing site:
  - Back-to-top button: hidden at the top of the page, fades in once
    the visitor has scrolled down, and smooth-scrolls to the top on click.
  - A small bottom-right toast notification, shared with js/shop.js
    (which handles the Add to Cart / Add to Wishlist / Buy Now buttons).

  This file does not modify or depend on changing any other script.
  ------------------------------------------------------------------
*/

(function () {
  "use strict";

  /* ---------------- Back to top button ---------------- */
  function initBackToTop() {
    const btn = document.getElementById("backToTopBtn");
    if (!btn) return;

    const SHOW_AFTER_PX = 320;

    function updateVisibility() {
      const scrolled = window.scrollY || document.documentElement.scrollTop;
      btn.classList.toggle("is-visible", scrolled > SHOW_AFTER_PX);
    }

    window.addEventListener("scroll", updateVisibility, { passive: true });
    updateVisibility();

    btn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------------- Toast notifications ---------------- */
  function getToastContainer() {
    let container = document.getElementById("albertoToastContainer");
    if (!container) {
      container = document.createElement("div");
      container.id = "albertoToastContainer";
      container.className = "alberto-toast-container";
      document.body.appendChild(container);
    }
    return container;
  }

  function showToast(message) {
    const container = getToastContainer();

    const toast = document.createElement("div");
    toast.className = "alberto-toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.innerHTML =
      '<i class="bi bi-check-circle" aria-hidden="true"></i><span></span>';
    toast.querySelector("span").textContent = message;

    container.appendChild(toast);

    // Trigger the enter transition on the next frame.
    requestAnimationFrame(() => {
      requestAnimationFrame(() => toast.classList.add("show"));
    });

    const DISPLAY_MS = 3200;
    setTimeout(() => {
      toast.classList.remove("show");
      toast.classList.add("hide");
      toast.addEventListener(
        "transitionend",
        () => toast.remove(),
        { once: true }
      );
      // Fallback removal in case transitionend doesn't fire.
      setTimeout(() => toast.remove(), 600);
    }, DISPLAY_MS);
  }

  /* ---------------- Add to Cart / Add to Wishlist ---------------- */
  // The real Add to Cart / Add to Wishlist / Buy Now logic now lives in
  // js/shop.js. It reuses the toast above through window.albertoShowToast.
  window.albertoShowToast = showToast;

  document.addEventListener("DOMContentLoaded", () => {
    initBackToTop();
  });
})();
