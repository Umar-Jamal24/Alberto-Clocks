/*
  ui.js
  ------------------------------------------------------------------
  Shared interface behaviors:
  - Light/dark theme toggle, remembered with localStorage
  - Scroll-triggered fade-in reveal using IntersectionObserver
  - Active navigation link highlighting while scrolling
  - Login popup demonstration
  ------------------------------------------------------------------
*/

(function () {
  "use strict";

  /* ---------------- Theme toggle ---------------- */
  const THEME_KEY = "albertoTheme";
  const htmlEl = document.documentElement;
  const themeToggleButtons = document.querySelectorAll("[data-theme-toggle]");

  function applyTheme(theme) {
    htmlEl.setAttribute("data-theme", theme);
    themeToggleButtons.forEach((btn) => {
      btn.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
    });
  }

  function initTheme() {
    // Restore saved theme, or fall back to the visitor's OS preference.
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === "light" || saved === "dark") {
      applyTheme(saved);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }
  }

  function toggleTheme() {
    const current = htmlEl.getAttribute("data-theme") === "dark" ? "dark" : "light";
    const next = current === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  }

  themeToggleButtons.forEach((btn) => btn.addEventListener("click", toggleTheme));
  initTheme();

  /* ---------------- Scroll reveal ---------------- */
  function initScrollReveal() {
    const targets = document.querySelectorAll(".reveal-on-scroll");
    if (!("IntersectionObserver" in window) || targets.length === 0) {
      targets.forEach((el) => el.classList.add("is-visible"));
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
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    targets.forEach((el) => observer.observe(el));
  }
  initScrollReveal();

  /* ---------------- Active nav link on scroll (Scrollspy-like) ---------------- */
  function initActiveNav() {
    const navLinks = Array.from(document.querySelectorAll(".main-nav .nav-link[href^='#']"));
    const sections = navLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    if (sections.length === 0) return;

    function setActive(id) {
      navLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === "#" + id);
      });
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );

    sections.forEach((section) => observer.observe(section));

    // Close the mobile offcanvas menu after a link is tapped.
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        const offcanvasEl = document.getElementById("mainNavOffcanvas");
        if (offcanvasEl && window.bootstrap) {
          const instance = window.bootstrap.Offcanvas.getInstance(offcanvasEl);
          if (instance) instance.hide();
        }
      });
    });
  }
  initActiveNav();

  /* ---------------- Login popup (frontend demonstration only) ---------------- */
  function initLoginForm() {
    const form = document.getElementById("loginForm");
    if (!form) return;
    const successBox = document.getElementById("loginSuccessAlert");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      event.stopPropagation();

      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        return;
      }

      // No backend or authentication exists in this project. This is a
      // frontend-only demonstration of a login form's validation flow.
      form.classList.add("was-validated");
      successBox.classList.remove("d-none");
      form.reset();
      form.classList.remove("was-validated");

      setTimeout(() => successBox.classList.add("d-none"), 4000);
    });
  }
  initLoginForm();
})();
