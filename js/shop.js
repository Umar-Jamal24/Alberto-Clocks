/*
  shop.js
  ------------------------------------------------------------------
  Shopping features for Alberto Clocks (front-end demonstration only):
  - Add to Cart (with quantities) and Add to Wishlist from the product
    details modal
  - Header icons with live item counts, opening the Cart and Wishlist
    panels
  - Cart and Wishlist saved in localStorage (they survive a refresh)
  - "Buy Now" from the product details modal, and "Proceed to Checkout"
    from the cart, both opening the same checkout form
  - Checkout form validation, live Order Summary, and the
    "Purchase Successful" popup

  No payment is processed and no card details are collected. Only a
  short order record (reference, items, total, payment method, city and
  country) is kept in localStorage; name, email, phone and street
  address are never stored.

  Depends on: products.js (ALBERTO_PRODUCTS), Bootstrap's JS bundle, and
  window.albertoShowToast from cart-wishlist.js. It reads the open
  product modal but does not change app.js.
  ------------------------------------------------------------------
*/

(function () {
  "use strict";

  const CART_KEY = "albertoCart";
  const WISHLIST_KEY = "albertoWishlist";
  const ORDERS_KEY = "albertoOrders";
  const MAX_QTY = 10; // most units of one watch per order line

  const currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  const CATEGORY_LABELS = {
    luxury: "Luxury",
    vintage: "Vintage",
    classic: "Classic",
    smart: "Smart",
    sports: "Sports",
    premium: "Premium",
    limited: "Limited Edition",
  };

  let cart = [];
  let wishlist = [];
  // What the checkout form is currently buying.
  // mode "buyNow" = one watch chosen in the product modal
  // mode "cart"   = everything in the cart
  let checkout = { mode: "buyNow", items: [] };

  /* ---------------- Small helpers ---------------- */
  function $(id) {
    return document.getElementById(id);
  }

  function esc(value) {
    const div = document.createElement("div");
    div.textContent = value == null ? "" : String(value);
    return div.innerHTML;
  }

  function toast(message) {
    if (typeof window.albertoShowToast === "function") window.albertoShowToast(message);
  }

  function categoryLabel(key) {
    return CATEGORY_LABELS[key] || key || "";
  }

  function findProduct(id) {
    return ALBERTO_PRODUCTS.find((p) => String(p.id) === String(id)) || null;
  }

  // The details saved for a product in the cart / wishlist.
  function snapshot(p) {
    return {
      id: p.id,
      name: p.name,
      brand: p.brand,
      category: p.category,
      price: p.price,
      image: p.image,
      availability: p.availability,
    };
  }

  function isOutOfStock(item) {
    return item.availability === "Out of Stock";
  }

  /* ---------------- localStorage ---------------- */
  function readList(key) {
    try {
      const raw = localStorage.getItem(key);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (err) {
      return [];
    }
  }

  function writeList(key, list) {
    try {
      localStorage.setItem(key, JSON.stringify(list));
    } catch (err) {
      /* Storage full or blocked: the site keeps working for this visit. */
    }
  }

  // Cleans saved data: refreshes details from the current catalogue,
  // drops damaged entries and duplicates, keeps quantities in range.
  function normalise(list, withQty) {
    const seen = new Set();
    const result = [];
    list.forEach((entry) => {
      if (!entry || seen.has(String(entry.id))) return;
      const live = findProduct(entry.id);
      const base = live ? snapshot(live) : entry;
      if (typeof base.name !== "string" || typeof base.price !== "number") return;
      const item = Object.assign({}, base);
      if (withQty) {
        item.qty = Math.min(MAX_QTY, Math.max(1, parseInt(entry.qty, 10) || 1));
      }
      seen.add(String(entry.id));
      result.push(item);
    });
    return result;
  }

  function loadStorage() {
    cart = normalise(readList(CART_KEY), true);
    wishlist = normalise(readList(WISHLIST_KEY), false);
  }

  function saveCart() {
    writeList(CART_KEY, cart);
    refreshCartUI();
  }

  function saveWishlist() {
    writeList(WISHLIST_KEY, wishlist);
    refreshWishlistUI();
  }

  /* ---------------- Keep keyboard focus after a list re-renders ---------------- */
  // Re-drawing a list replaces its buttons. Without this, focus would fall
  // back to the page and keys such as Escape would stop closing the panel.
  function rerenderKeepingFocus(listEl, panelEl, draw) {
    const active = document.activeElement;
    let rowId = null;
    let action = null;
    if (active && listEl.contains(active)) {
      rowId = itemIdFrom(active);
      ["data-cart-inc", "data-cart-dec", "data-wishlist-add"].forEach((attr) => {
        if (active.hasAttribute(attr)) action = attr;
      });
    }
    draw();
    if (rowId === null) return;
    let target = null;
    if (action) {
      const row = listEl.querySelector('.shop-item[data-id="' + rowId + '"]');
      target = row && row.querySelector("[" + action + "]:not(:disabled)");
    }
    (target || panelEl).focus();
  }

  /* ---------------- Cart ---------------- */
  function cartUnits() {
    return cart.reduce((sum, item) => sum + item.qty, 0);
  }

  function cartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function addToCart(product) {
    if (!product) return;
    if (isOutOfStock(product)) {
      toast(product.name + " is currently out of stock");
      return;
    }
    const existing = cart.find((item) => String(item.id) === String(product.id));
    if (existing) {
      if (existing.qty >= MAX_QTY) {
        toast("You can order up to " + MAX_QTY + " of the same watch");
        return;
      }
      existing.qty += 1;
      toast(product.name + " quantity updated in your cart");
    } else {
      cart.push(Object.assign(snapshot(product), { qty: 1 }));
      toast(product.name + " is added to cart");
    }
    saveCart();
  }

  function changeCartQty(id, delta) {
    const item = cart.find((i) => String(i.id) === String(id));
    if (!item) return;
    item.qty = Math.min(MAX_QTY, Math.max(1, item.qty + delta));
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter((i) => String(i.id) !== String(id));
    saveCart();
  }

  function clearCart() {
    cart = [];
    saveCart();
  }

  function refreshCartUI() {
    const units = cartUnits();
    document.querySelectorAll("[data-cart-count]").forEach((el) => {
      el.textContent = units;
      el.classList.toggle("d-none", units === 0);
    });

    const list = $("cartItems");
    const empty = $("cartEmpty");
    const footer = $("cartFooter");
    if (!list || !empty || !footer) return;

    rerenderKeepingFocus(list, $("cartOffcanvas"), () => drawCart(list, empty, footer, units));
  }

  function drawCart(list, empty, footer, units) {
    if (cart.length === 0) {
      list.innerHTML = "";
      empty.classList.remove("d-none");
      footer.classList.add("d-none");
      return;
    }

    empty.classList.add("d-none");
    footer.classList.remove("d-none");
    list.innerHTML = cart
      .map(
        (item) =>
          '<div class="shop-item" data-id="' + esc(item.id) + '">' +
          '<img class="shop-thumb" src="' + esc(item.image) + '" alt="' + esc(item.name) + '">' +
          '<div class="shop-item-info">' +
          '<div class="shop-item-brand">' + esc(item.brand) + " &middot; " + esc(categoryLabel(item.category)) + "</div>" +
          '<div class="shop-item-name">' + esc(item.name) + "</div>" +
          '<div class="shop-item-price">' + currency.format(item.price) + "</div>" +
          '<div class="qty-control" role="group" aria-label="Quantity for ' + esc(item.name) + '">' +
          '<button type="button" data-cart-dec aria-label="Decrease quantity"' + (item.qty <= 1 ? " disabled" : "") + '>&minus;</button>' +
          "<span>" + item.qty + "</span>" +
          '<button type="button" data-cart-inc aria-label="Increase quantity"' + (item.qty >= MAX_QTY ? " disabled" : "") + '>+</button>' +
          "</div>" +
          "</div>" +
          '<div class="shop-item-side">' +
          '<button type="button" class="shop-remove" data-cart-remove aria-label="Remove ' + esc(item.name) + ' from cart"><i class="bi bi-trash" aria-hidden="true"></i></button>' +
          '<div class="shop-line-total">' + currency.format(item.price * item.qty) + "</div>" +
          "</div>" +
          "</div>"
      )
      .join("");

    $("cartTotal").textContent = currency.format(cartTotal());
    $("cartItemCount").textContent = "(" + units + (units === 1 ? " item)" : " items)");
  }

  /* ---------------- Wishlist ---------------- */
  function addToWishlist(product) {
    if (!product) return;
    if (wishlist.some((item) => String(item.id) === String(product.id))) {
      toast(product.name + " is already in your wishlist");
      return;
    }
    wishlist.push(snapshot(product));
    saveWishlist();
    toast(product.name + " is added to wishlist");
  }

  function removeFromWishlist(id) {
    wishlist = wishlist.filter((i) => String(i.id) !== String(id));
    saveWishlist();
  }

  function refreshWishlistUI() {
    const count = wishlist.length;
    document.querySelectorAll("[data-wishlist-count]").forEach((el) => {
      el.textContent = count;
      el.classList.toggle("d-none", count === 0);
    });

    const list = $("wishlistItems");
    const empty = $("wishlistEmpty");
    if (!list || !empty) return;

    rerenderKeepingFocus(list, $("wishlistOffcanvas"), () => drawWishlist(list, empty, count));
  }

  function drawWishlist(list, empty, count) {
    if (count === 0) {
      list.innerHTML = "";
      empty.classList.remove("d-none");
      return;
    }

    empty.classList.add("d-none");
    list.innerHTML = wishlist
      .map(
        (item) =>
          '<div class="shop-item" data-id="' + esc(item.id) + '">' +
          '<img class="shop-thumb" src="' + esc(item.image) + '" alt="' + esc(item.name) + '">' +
          '<div class="shop-item-info">' +
          '<div class="shop-item-brand">' + esc(item.brand) + " &middot; " + esc(categoryLabel(item.category)) + "</div>" +
          '<div class="shop-item-name">' + esc(item.name) + "</div>" +
          '<div class="shop-item-price">' + currency.format(item.price) + "</div>" +
          '<button type="button" class="btn-alberto btn-outline-alberto btn-sm-alberto shop-move-btn" data-wishlist-add' +
          (isOutOfStock(item) ? " disabled" : "") + ">" +
          (isOutOfStock(item) ? "Out of Stock" : '<i class="bi bi-bag-plus" aria-hidden="true"></i> Add to Cart') +
          "</button>" +
          "</div>" +
          '<div class="shop-item-side">' +
          '<button type="button" class="shop-remove" data-wishlist-remove aria-label="Remove ' + esc(item.name) + ' from wishlist"><i class="bi bi-trash" aria-hidden="true"></i></button>' +
          "</div>" +
          "</div>"
      )
      .join("");
  }

  /* ---------------- Product modal: which watch is open? ---------------- */
  // app.js fills the shared modal from ALBERTO_PRODUCTS. Names are unique,
  // so name + brand identifies the watch the visitor is looking at.
  function getSelectedProduct() {
    const nameEl = $("modalProductName");
    const brandEl = $("modalProductBrand");
    if (!nameEl) return null;
    const name = nameEl.textContent.trim();
    const brand = brandEl ? brandEl.textContent.trim() : "";
    return (
      ALBERTO_PRODUCTS.find((p) => p.name === name && p.brand === brand) ||
      ALBERTO_PRODUCTS.find((p) => p.name === name) ||
      null
    );
  }

  /* ---------------- Opening one Bootstrap panel after another closes ---------------- */
  // Showing a modal while another overlay is still closing causes stacked
  // backdrops, so wait for the "hidden" event first.
  function showAfterHidden(el, hiddenEventName, getInstance, next) {
    const instance = getInstance(el);
    if (instance && el.classList.contains("show")) {
      el.addEventListener(hiddenEventName, next, { once: true });
      instance.hide();
    } else {
      next();
    }
  }

  /* ---------------- Checkout ---------------- */
  function checkoutTotal() {
    return checkout.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  function selectedPayment() {
    const checked = document.querySelector('input[name="paymentMethod"]:checked');
    return checked ? checked.value : "";
  }

  function openCheckout(mode, items) {
    if (!items.length) return;
    checkout = {
      mode: mode,
      items: items.map((item) => Object.assign({}, item)),
    };
    const form = $("checkoutForm");
    form.classList.remove("was-validated");
    $("checkoutError").classList.add("d-none");
    renderOrderSummary();
    bootstrap.Modal.getOrCreateInstance($("checkoutModal")).show();
  }

  function buyNow() {
    const product = getSelectedProduct();
    if (!product) return;
    if (isOutOfStock(product)) {
      toast(product.name + " is currently out of stock");
      return;
    }
    const item = Object.assign(snapshot(product), { qty: 1 });
    showAfterHidden(
      $("productDetailsModal"),
      "hidden.bs.modal",
      (el) => bootstrap.Modal.getInstance(el),
      () => openCheckout("buyNow", [item])
    );
  }

  function checkoutFromCart() {
    if (!cart.length) return;
    showAfterHidden(
      $("cartOffcanvas"),
      "hidden.bs.offcanvas",
      (el) => bootstrap.Offcanvas.getInstance(el),
      () => openCheckout("cart", cart)
    );
  }

  function renderOrderSummary() {
    const canEditQty = checkout.mode === "buyNow";

    $("orderSummaryItems").innerHTML = checkout.items
      .map(
        (item) =>
          '<div class="shop-item summary-item" data-id="' + esc(item.id) + '">' +
          '<img class="shop-thumb" src="' + esc(item.image) + '" alt="' + esc(item.name) + '">' +
          '<div class="shop-item-info">' +
          '<div class="shop-item-brand">' + esc(item.brand) + "</div>" +
          '<div class="shop-item-name">' + esc(item.name) + "</div>" +
          '<div class="shop-item-price">' + currency.format(item.price) + " each</div>" +
          (canEditQty
            ? '<div class="qty-control" role="group" aria-label="Quantity">' +
              '<button type="button" data-checkout-dec aria-label="Decrease quantity"' + (item.qty <= 1 ? " disabled" : "") + '>&minus;</button>' +
              "<span>" + item.qty + "</span>" +
              '<button type="button" data-checkout-inc aria-label="Increase quantity"' + (item.qty >= MAX_QTY ? " disabled" : "") + '>+</button>' +
              "</div>"
            : '<div class="shop-item-qty">Quantity: ' + item.qty + "</div>") +
          "</div>" +
          '<div class="shop-item-side"><div class="shop-line-total">' + currency.format(item.price * item.qty) + "</div></div>" +
          "</div>"
      )
      .join("");

    updateSummaryDetails();
  }

  // Delivery, payment and total lines: refreshed as the form is filled in.
  function updateSummaryDetails() {
    const name = $("coFullName").value.trim();
    const address = $("coAddress").value.trim();
    const cityLine = [$("coCity").value.trim(), $("coPostal").value.trim()].filter(Boolean).join(" ");
    const country = $("coCountry").value;
    const lines = [name, address, cityLine, country].filter(Boolean);

    $("summaryDelivery").innerHTML = lines.length
      ? lines.map(esc).join("<br>")
      : '<span class="text-muted">Enter your delivery details</span>';
    $("summaryPayment").textContent = selectedPayment();
    $("summaryTotal").textContent = currency.format(checkoutTotal());
  }

  function changeCheckoutQty(delta) {
    const item = checkout.items[0];
    if (!item) return;
    item.qty = Math.min(MAX_QTY, Math.max(1, item.qty + delta));
    renderOrderSummary();
  }

  // Phone numbers may contain spaces, dashes, brackets and a leading +.
  function validatePhone() {
    const input = $("coPhone");
    const digits = input.value.replace(/\D/g, "");
    const allowed = /^\+?[0-9\s\-()]+$/.test(input.value.trim());
    const ok = allowed && digits.length >= 7 && digits.length <= 15;
    input.setCustomValidity(ok ? "" : "Invalid phone number");
  }

  function makeOrderReference() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = String(d.getFullYear()).slice(2) + pad(d.getMonth() + 1) + pad(d.getDate());
    const rand = String(Math.floor(1000 + Math.random() * 9000));
    return "AC-" + stamp + "-" + rand;
  }

  function recordOrder(reference) {
    const orders = readList(ORDERS_KEY);
    orders.push({
      reference: reference,
      placedAt: new Date().toISOString(),
      items: checkout.items.map((i) => ({ id: i.id, name: i.name, brand: i.brand, qty: i.qty, price: i.price })),
      total: checkoutTotal(),
      payment: selectedPayment(),
      city: $("coCity").value.trim(),
      country: $("coCountry").value,
    });
    writeList(ORDERS_KEY, orders.slice(-20));
  }

  function handleCheckoutSubmit(event) {
    event.preventDefault();
    const form = $("checkoutForm");

    // Trim stray spaces so a field holding only spaces counts as empty.
    form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]').forEach((input) => {
      input.value = input.value.trim();
    });
    validatePhone();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      $("checkoutError").classList.remove("d-none");
      const firstInvalid = form.querySelector(":invalid");
      if (firstInvalid) firstInvalid.focus();
      updateSummaryDetails();
      return;
    }

    // Everything is valid: complete the demonstration purchase.
    const reference = makeOrderReference();
    recordOrder(reference);

    if (checkout.mode === "cart") {
      clearCart(); // the whole cart was bought
    }
    // A "Buy Now" purchase leaves the cart untouched.

    form.reset();
    form.classList.remove("was-validated");
    $("checkoutError").classList.add("d-none");
    checkout = { mode: "buyNow", items: [] };
    $("successOrderRef").textContent = reference;

    const checkoutEl = $("checkoutModal");
    checkoutEl.addEventListener(
      "hidden.bs.modal",
      () => bootstrap.Modal.getOrCreateInstance($("purchaseSuccessModal")).show(),
      { once: true }
    );
    bootstrap.Modal.getInstance(checkoutEl).hide();
  }

  /* ---------------- Event wiring ---------------- */
  function itemIdFrom(target) {
    const row = target.closest(".shop-item");
    return row ? row.getAttribute("data-id") : null;
  }

  function initEvents() {
    // Product details modal buttons.
    const addCartBtn = $("modalAddToCartBtn");
    const addWishBtn = $("modalAddToWishlistBtn");
    const buyNowBtn = $("modalBuyNowBtn");
    if (addCartBtn) addCartBtn.addEventListener("click", () => addToCart(getSelectedProduct()));
    if (addWishBtn) addWishBtn.addEventListener("click", () => addToWishlist(getSelectedProduct()));
    if (buyNowBtn) buyNowBtn.addEventListener("click", buyNow);

    // Cart panel.
    $("cartItems").addEventListener("click", (e) => {
      const id = itemIdFrom(e.target);
      if (id === null) return;
      if (e.target.closest("[data-cart-inc]")) changeCartQty(id, 1);
      else if (e.target.closest("[data-cart-dec]")) changeCartQty(id, -1);
      else if (e.target.closest("[data-cart-remove]")) removeFromCart(id);
    });
    $("cartClearBtn").addEventListener("click", clearCart);
    $("cartCheckoutBtn").addEventListener("click", checkoutFromCart);

    // Wishlist panel.
    $("wishlistItems").addEventListener("click", (e) => {
      const id = itemIdFrom(e.target);
      if (id === null) return;
      if (e.target.closest("[data-wishlist-remove]")) {
        removeFromWishlist(id);
      } else if (e.target.closest("[data-wishlist-add]")) {
        addToCart(findProduct(id));
      }
    });

    // Checkout modal.
    const form = $("checkoutForm");
    form.addEventListener("submit", handleCheckoutSubmit);
    form.addEventListener("input", updateSummaryDetails);
    form.addEventListener("change", updateSummaryDetails);
    $("coPhone").addEventListener("input", validatePhone);

    $("orderSummaryItems").addEventListener("click", (e) => {
      if (e.target.closest("[data-checkout-inc]")) changeCheckoutQty(1);
      else if (e.target.closest("[data-checkout-dec]")) changeCheckoutQty(-1);
    });

    // Swap a working fallback photo in for any image that fails to load.
    document.addEventListener(
      "error",
      (e) => {
        const img = e.target;
        if (!(img instanceof HTMLImageElement) || !img.classList.contains("shop-thumb")) return;
        if (img.dataset.fallbackApplied) return;
        img.dataset.fallbackApplied = "true";
        img.src = ALBERTO_FALLBACK_IMAGE;
      },
      true
    );

    // Keep several open tabs in step with each other.
    window.addEventListener("storage", (e) => {
      if (e.key === CART_KEY || e.key === WISHLIST_KEY) {
        loadStorage();
        refreshCartUI();
        refreshWishlistUI();
      }
    });
  }

  function init() {
    loadStorage();
    refreshCartUI();
    refreshWishlistUI();
    initEvents();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
