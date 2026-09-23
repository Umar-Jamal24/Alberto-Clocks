/*
  gallery.js
  ------------------------------------------------------------------
  Handles the watch gallery: each photo in the gallery is also one of
  the real products in the catalog, so clicking it opens the same
  product details modal used everywhere else on the site (complete
  with Add to Cart / Add to Wishlist). If a gallery photo has no
  matching product (no data-product-id), it falls back to the plain
  image lightbox instead.
  ------------------------------------------------------------------
*/

(function () {
  "use strict";

  const galleryImages = document.querySelectorAll("[data-gallery-image]");
  const lightboxModalEl = document.getElementById("galleryLightbox");
  if (galleryImages.length === 0) return;

  const lightboxImg = lightboxModalEl ? document.getElementById("galleryLightboxImage") : null;
  const lightboxCaption = lightboxModalEl
    ? document.getElementById("galleryLightboxCaption")
    : null;
  const lightboxModal = lightboxModalEl ? new bootstrap.Modal(lightboxModalEl) : null;

  function openImageLightbox(img) {
    if (!lightboxModal) return;
    const largeSrc = img.getAttribute("data-large") || img.src;
    lightboxImg.src = largeSrc;
    lightboxImg.alt = img.alt || "Alberto Clocks gallery photograph";
    lightboxCaption.textContent = img.getAttribute("data-caption") || img.alt || "";
    lightboxModal.show();
  }

  galleryImages.forEach((img) => {
    img.addEventListener("click", () => {
      const productId = img.getAttribute("data-product-id");
      if (productId && typeof window.openProductModal === "function") {
        window.openProductModal(productId);
      } else {
        openImageLightbox(img);
      }
    });

    // Keyboard accessibility: allow Enter/Space to trigger the same action.
    img.setAttribute("tabindex", "0");
    img.setAttribute("role", "button");
    img.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        img.click();
      }
    });
  });

  // Reset the lightbox image source when it closes so it doesn't briefly
  // flash the previous photo the next time it opens.
  if (lightboxModalEl) {
    lightboxModalEl.addEventListener("hidden.bs.modal", () => {
      lightboxImg.src = "";
    });
  }
})();
