/*
  visitor.js
  ------------------------------------------------------------------
  A local, frontend-only demonstration visitor counter.

  Because this project has no backend or shared database, this is NOT
  a real global visitor count — it only reflects visits made from this
  browser, stored in localStorage. sessionStorage is used to make sure
  a single browsing session (multiple pages/reloads) is only counted
  once, rather than incrementing on every reload.
  ------------------------------------------------------------------
*/

(function () {
  "use strict";

  const STORAGE_KEY = "albertoVisitorCount";
  const SESSION_KEY = "albertoSessionCounted";
  const START_COUNT = 1240; // a believable seed value for the demo

  function getStoredCount() {
    const stored = parseInt(localStorage.getItem(STORAGE_KEY), 10);
    return Number.isFinite(stored) ? stored : START_COUNT;
  }

  function renderCount(count) {
    const targets = document.querySelectorAll("[data-visitor-count]");
    const formatted = count.toLocaleString("en-US");
    targets.forEach((el) => {
      el.textContent = formatted;
    });
  }

  let count = getStoredCount();

  if (!sessionStorage.getItem(SESSION_KEY)) {
    count += 1;
    localStorage.setItem(STORAGE_KEY, String(count));
    sessionStorage.setItem(SESSION_KEY, "true");
  }

  renderCount(count);
})();
