/*
  app.js
  ------------------------------------------------------------------
  Main application logic for Alberto Clocks:
  - Renders the Featured Collection
  - Renders the full product grid with category filtering + search
  - Populates the single reusable product details modal
  - Renders the complete price list table
  - Validates the Repair, Appraisal, and Contact forms
  - Provides a graceful fallback for any image URL that fails to load
  ------------------------------------------------------------------
*/

(function () {
  "use strict";

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const CATEGORY_LABELS = {
    all: "All Watches",
    luxury: "Luxury",
    vintage: "Vintage",
    classic: "Classic",
    smart: "Smart",
    sports: "Sports",
    premium: "Premium",
    limited: "Limited Edition",
  };

  const AVAILABILITY_CLASS = {
    "In Stock": "in-stock",
    "Limited Stock": "limited",
    "Out of Stock": "out",
  };

  /* ---------------- Image fallback ---------------- */
  // If a product image URL ever fails to load, swap it for one clearly
  // working fallback photo rather than leaving a broken image icon.
  function attachImageFallback(imgEl) {
    imgEl.addEventListener(
      "error",
      function handler() {
        if (imgEl.dataset.fallbackApplied) return;
        imgEl.dataset.fallbackApplied = "true";
        imgEl.src = ALBERTO_FALLBACK_IMAGE;
      },
      { once: true }
    );
  }

  /* ---------------- Featured collection ---------------- */
  function renderFeatured() {
    const wrap = document.getElementById("featuredGrid");
    if (!wrap) return;
    const featured = ALBERTO_PRODUCTS.slice(0, 3);
    wrap.innerHTML = featured.map((p) => productCardHTML(p)).join("");
    attachCardListeners(wrap);
  }

  /* ---------------- Product card markup ---------------- */
  function productCardHTML(product) {
    let badge = "";
    if (product.availability === "Out of Stock") {
      badge = '<span class="watch-card-badge badge-out">Out of Stock</span>';
    } else if (product.availability === "Limited Stock") {
      badge = '<span class="watch-card-badge badge-limited">Limited</span>';
    }
    return (
      '<div class="col-sm-6 col-lg-4">' +
      '<article class="watch-card reveal-on-scroll" tabindex="0" data-product-id="' +
      product.id +
      '" aria-label="View details for ' +
      escapeHTML(product.name) +
      '">' +
      '<div class="watch-card-media">' +
      badge +
      '<img src="' +
      product.image +
      '" alt="' +
      escapeHTML(product.name) +
      " by " +
      escapeHTML(product.brand) +
      '" loading="lazy">' +
      "</div>" +
      '<div class="watch-card-body">' +
      '<div class="watch-card-brand">' +
      escapeHTML(product.brand) +
      "</div>" +
      '<h3 class="watch-card-title">' +
      escapeHTML(product.name) +
      "</h3>" +
      '<p class="watch-card-desc">' +
      escapeHTML(product.shortDescription) +
      "</p>" +
      '<div class="watch-card-footer">' +
      '<span class="watch-card-price">' +
      currencyFormatter.format(product.price) +
      "</span>" +
      '<button type="button" class="btn-alberto btn-outline-alberto btn-sm-alberto" data-view-product="' +
      product.id +
      '">View Details</button>' +
      "</div>" +
      "</div>" +
      "</article>" +
      "</div>"
    );
  }

  function attachCardListeners(container) {
    container.querySelectorAll("img").forEach(attachImageFallback);
    container.querySelectorAll("[data-product-id]").forEach((card) => {
      card.addEventListener("click", (e) => {
        // Avoid double-triggering when the inner button is clicked.
        if (e.target.closest("[data-view-product]")) return;
        openProductModal(card.getAttribute("data-product-id"));
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          openProductModal(card.getAttribute("data-product-id"));
        }
      });
    });
    container.querySelectorAll("[data-view-product]").forEach((btn) => {
      btn.addEventListener("click", () => openProductModal(btn.getAttribute("data-view-product")));
    });
    initScrollRevealFor(container);
  }

  function initScrollRevealFor(container) {
    const items = container.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    items.forEach((el) => observer.observe(el));
  }

  function escapeHTML(str) {
    const div = document.createElement("div");
    div.textContent = str == null ? "" : String(str);
    return div.innerHTML;
  }

  /* ---------------- Product grid: category + search ---------------- */
  const state = {
    category: "all",
    query: "",
  };

  function getFilteredProducts() {
    return ALBERTO_PRODUCTS.filter((p) => {
      const matchesCategory = state.category === "all" || p.category === state.category;
      const q = state.query.trim().toLowerCase();
      const matchesQuery =
        q === "" ||
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }

  function renderProductGrid() {
    const grid = document.getElementById("productGrid");
    const emptyState = document.getElementById("productEmptyState");
    const countLabel = document.getElementById("productResultsCount");
    if (!grid) return;

    const results = getFilteredProducts();

    if (countLabel) {
      countLabel.textContent =
        results.length + (results.length === 1 ? " watch found" : " watches found");
    }

    if (results.length === 0) {
      grid.innerHTML = "";
      if (emptyState) emptyState.classList.remove("d-none");
      return;
    }

    if (emptyState) emptyState.classList.add("d-none");
    grid.innerHTML = results.map((p) => productCardHTML(p)).join("");
    attachCardListeners(grid);
  }

  function initCategoryTabs() {
    const tabs = document.querySelectorAll("[data-category-filter]");
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        state.category = tab.getAttribute("data-category-filter");
        renderProductGrid();
      });
    });
  }

  function initSearch() {
    const input = document.getElementById("productSearchInput");
    if (!input) return;
    input.addEventListener("input", () => {
      state.query = input.value;
      renderProductGrid();
    });
  }

  /* ---------------- Product details modal ---------------- */
  function openProductModal(id) {
    const product = ALBERTO_PRODUCTS.find((p) => String(p.id) === String(id));
    if (!product) return;

    document.getElementById("modalProductImage").src = product.image;
    document.getElementById("modalProductImage").alt = product.name + " by " + product.brand;
    attachImageFallback(document.getElementById("modalProductImage"));
    document.getElementById("modalProductBrand").textContent = product.brand;
    document.getElementById("modalProductCategory").textContent =
      CATEGORY_LABELS[product.category] || product.category;
    document.getElementById("modalProductName").textContent = product.name;
    document.getElementById("modalProductPrice").textContent = currencyFormatter.format(
      product.price
    );
    document.getElementById("modalProductFullDesc").textContent = product.fullDescription;
    document.getElementById("modalProductTechnology").textContent = product.technology;

    const availEl = document.getElementById("modalProductAvailability");
    availEl.textContent = product.availability;
    availEl.className =
      "availability-pill " + (AVAILABILITY_CLASS[product.availability] || "in-stock");

    const featureList = document.getElementById("modalProductFeatures");
    featureList.innerHTML = product.features
      .map((f) => '<li><span class="gold-tick">&#10003;</span>' + escapeHTML(f) + "</li>")
      .join("");

    const modalEl = document.getElementById("productDetailsModal");
    const modal = bootstrap.Modal.getOrCreateInstance(modalEl);
    modal.show();
  }

  // Exposed so other scripts (e.g. the gallery) can open the same
  // product details modal without duplicating this logic.
  window.openProductModal = openProductModal;

  /* ---------------- Price list ---------------- */
  function renderPriceList() {
    const tbody = document.getElementById("priceListBody");
    if (!tbody) return;
    tbody.innerHTML = ALBERTO_PRODUCTS.map((p) => {
      return (
        "<tr>" +
        "<td>" +
        escapeHTML(p.name) +
        "</td>" +
        "<td>" +
        escapeHTML(p.brand) +
        "</td>" +
        "<td>" +
        (CATEGORY_LABELS[p.category] || p.category) +
        "</td>" +
        "<td>" +
        currencyFormatter.format(p.price) +
        "</td>" +
        "<td><span class='availability-pill " +
        (AVAILABILITY_CLASS[p.availability] || "in-stock") +
        "'>" +
        p.availability +
        "</span></td>" +
        "</tr>"
      );
    }).join("");
  }

  /* ---------------- Generic Bootstrap-style form validation ---------------- */
  function initValidatedForm(formId, successId, onValidSubmit) {
    const form = document.getElementById(formId);
    if (!form) return;
    const successBox = document.getElementById(successId);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      form.classList.add("was-validated");
      if (successBox) {
        successBox.classList.remove("d-none");
        successBox.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (typeof onValidSubmit === "function") onValidSubmit(form);

      form.reset();
      form.classList.remove("was-validated");

      setTimeout(() => {
        if (successBox) successBox.classList.add("d-none");
      }, 6000);
    });
  }

  /* ---------------- Init ---------------- */
  document.addEventListener("DOMContentLoaded", () => {
    renderFeatured();
    renderProductGrid();
    renderPriceList();
    initCategoryTabs();
    initSearch();

    initValidatedForm("repairForm", "repairSuccessAlert");
    initValidatedForm("appraisalForm", "appraisalSuccessAlert");
    initValidatedForm("contactForm", "contactSuccessAlert");

    // "Explore Collection" / "Discover Our Services" buttons and any other
    // in-page anchor already work through normal HTML anchor behavior plus
    // the smooth-scroll CSS rule, so no extra JS is required for them.

    // Technology "Learn More" expand/collapse.
    document.querySelectorAll(".tech-learn-more").forEach((btn) => {
      btn.addEventListener("click", () => {
        const card = btn.closest(".tech-card");
        card.classList.toggle("expanded");
        btn.textContent = card.classList.contains("expanded") ? "Show Less" : "Learn More";
      });
    });
  });
})();
