# Alberto Clocks — Luxury Watch Company Website
### Academic eProject — HTML5, Bootstrap 5.3.8, CSS3, Vanilla JavaScript

Alberto Clocks is a **fictional** luxury watch company created for a class
web-development project. The single-page site sells watches, and offers
watch repair and appraisal services, built entirely with front-end
technology and no backend, database, or build tools.

---

## 1. Problem Definition

Academic web-development courses often ask students to design a
realistic, full-featured business website using only front-end
technologies. This project answers that brief for a luxury watch
retailer that also repairs and appraises watches, without a server,
database, or paid services.

## 2. Project Objectives

- Build a single-page, fully responsive website using HTML5, Bootstrap
  5.3.8, custom CSS, and vanilla JavaScript only.
- Present a believable luxury retail brand: browsing, filtering,
  searching, and viewing watch details.
- Demonstrate two additional service lines (repair, appraisal) through
  validated inquiry forms.
- Implement light/dark theming, a visitor counter, and a live
  date/time/location ticker as required project features.
- Keep the whole project runnable by opening one HTML file — no
  installation, build step, or server required.

## 3. Introduction

The site is a single `index.html` file that pulls in Bootstrap from a
CDN plus this project's own CSS and JavaScript files. All product,
gallery, and store data lives in the front end; there is no database.
Every form is a validated, working front-end demonstration that
clearly states it doesn't send data anywhere real.

## 4. Functional Requirements

- Sticky, responsive header with working section navigation and a
  mobile off-canvas menu.
- Hero section with two working call-to-action buttons.
- Product catalogue: 20 sample watches across 7 categories, each with
  a working details view.
- Category filter tabs and a live text search over name/brand/category.
- A complete price list kept in sync with the product data.
- Watch technology reference section (7 topics) with expandable
  explanations.
- Repair and appraisal request forms with client-side validation.
- Photo gallery with a click-to-enlarge lightbox.
- Store locator with three sample locations.
- Testimonials, FAQ accordion, and a validated contact form.
- Sitemap links in the footer.
- Local, per-browser visitor counter.
- Continuously scrolling ticker showing live date, live time, and a
  best-effort location.
- Light/dark theme toggle, remembered between visits.
- Login popup (front-end demonstration only, no real authentication).

## 5. Design Specifications

See `css/style.css` for the full token system. Layout uses Bootstrap's
12-column grid; typography combines a serif display face with a
sans-serif body face; color usage keeps champagne gold as an accent
only, never as a large background fill.

## 6. Color Palette

| Purpose          | Hex       |
|-------------------|-----------|
| Primary charcoal  | `#202321` |
| Deep charcoal     | `#151715` |
| Warm ivory        | `#F7F4ED` |
| Pure white        | `#FFFFFF` |
| Champagne gold    | `#C6A56B` |
| Muted gold        | `#A88955` |
| Warm beige        | `#E9E1D3` |
| Slate grey        | `#777B76` |
| Border grey       | `#D9D5CC` |

## 7. Typography

- Headings: **Cormorant Garamond** (serif), loaded from Google Fonts,
  with system serif fallbacks.
- Body text: **Inter** (sans-serif), with system sans-serif fallbacks.

## 8. Hardware Requirements

Any computer or mobile device capable of running a modern web browser
(minimum ~2GB RAM recommended for smooth animation).

## 9. Software Requirements

- A modern browser: Chrome, Edge, Firefox, or Safari (current
  versions).
- No server, database, or package manager is required.
- An internet connection is required only to load the Bootstrap CDN,
  Google Fonts, Bootstrap Icons, and the Unsplash product photography —
  all of which are loaded directly from their online URLs.

## 10. Website Structure

See the annotated section comments inside `index.html`. Sections, in
order: announcement bar, header/navigation, hero, about, featured
collection, products (categories + search + grid), price list,
technology, services (repair + appraisal), gallery, store locator, why
choose Alberto, testimonials, support/FAQ, contact, footer/sitemap,
bottom ticker.

## 11. Sitemap

Home · About Us · Products · Technology · Repair Services · Appraisal
Services · Gallery · Store Locator · Support · Contact Us — all linked
from the footer and the main navigation.

## 12–16. Flowcharts (textual description)

**Product filtering:** User selects a category tab or types a search
query → `app.js` combines both conditions → matching products render
into the grid → if zero matches, an empty-state message is shown
instead.

**Product details popup:** User clicks a card or "View Details" →
`openProductModal(id)` looks up the product by id → the single shared
modal's fields are populated → Bootstrap's modal API shows it.

**Contact form validation:** User submits the form → the browser's
HTML5 constraints plus `form.checkValidity()` run → if invalid,
Bootstrap's `was-validated` styling shows inline errors → if valid, a
success alert is shown and the form resets (no data is actually sent
anywhere).

**Visitor counter:** Page loads → check `sessionStorage` for a flag →
if not already counted this session, increment the count stored in
`localStorage` and set the flag → display the current count.

**Geolocation ticker:** Page loads → show a labeled sample location
immediately → request `navigator.geolocation.getCurrentPosition` →
on success, display coordinates (with an explanation that coordinates,
not a city name, are returned) → on denial/error/unsupported browsers,
keep the sample location and invite the user to type their own city,
which is remembered in `localStorage`.

## 17. Data Flow Diagram (textual description)

```
products.js (in-memory data)
        │
        ▼
   app.js (filter/search state)
        │
        ▼
 DOM rendering (cards, price list, modal)
        │
        ▼
   User interaction (click, search, category tab)
        │
        └──────────────► back into app.js state
```

No data leaves the browser; there is no server round-trip.

## 18. Testing Checklist

- [ ] Mobile nav (off-canvas) opens and closes.
- [ ] All navigation and sitemap links scroll to the correct section.
- [ ] Active nav link updates while scrolling.
- [ ] Category tabs filter the product grid correctly.
- [ ] Search filters by name, brand, and category; empty state shows
      correctly when nothing matches.
- [ ] Every product card opens the correct details in the shared modal.
- [ ] Prices match across card, modal, and price list.
- [ ] Theme toggle switches every section and is remembered on reload.
- [ ] Visitor counter increments once per new session, not per reload.
- [ ] Ticker date/time update every second; ticker scrolls smoothly.
- [ ] Geolocation permission prompt, grant, and deny paths all behave
      sensibly; manual city entry updates the ticker.
- [ ] Gallery images open an enlarged view in the lightbox modal.
- [ ] Repair, appraisal, contact, and login forms show validation
      errors for missing/invalid fields and a success message once
      valid.
- [ ] FAQ accordion opens/closes correctly.
- [ ] No horizontal scrolling at 320px, 768px, 1024px, or 1440px
      widths.
- [ ] No console errors during normal use.

Run through this checklist yourself in your browser's dev tools
(desktop and mobile emulation) before submitting the project — this
document describes what to test, not a guarantee that a specific
browser session has already passed every check.

## 19. Installation Instructions

No installation is required.

1. Download or copy the whole `alberto-clocks` folder, keeping the
   `css/`, `js/`, and `data/` subfolders alongside `index.html`.
2. Open `index.html` directly in any modern browser (double-click it,
   or use "Open File").
3. An internet connection is needed the first time the page loads, so
   the browser can fetch Bootstrap, Google Fonts, Bootstrap Icons, and
   the Unsplash photographs from their CDNs.

**Optional — running via a local server:** Geolocation and some
browser features work more consistently over `http://localhost` than
over a raw `file://` path. If you have Python installed, you can run:

```
python -m http.server 8000
```

from inside the `alberto-clocks` folder, then open
`http://localhost:8000` in your browser. This step is optional; the
site is designed to work by opening `index.html` directly too.

## 20. Assumptions and Limitations

This is an academic front-end-only project. The following are clearly
labeled demonstrations rather than real functionality:

- **No backend or database.** Nothing typed into any form is sent to a
  server or stored beyond the current browser (repair, appraisal,
  contact, and login forms all show a success message but send no
  data anywhere).
- **Login** does not authenticate a real account; any validly-formatted
  email and 6+ character password succeeds.
- **Visitor counter** only reflects visits from the current browser
  (via `localStorage`), not a real global count across all visitors.
- **Geolocation** returns coordinates only, not a city name; a manual
  city field is provided since real reverse-geocoding needs an
  external paid/keyed service this project does not call.
- **Store locator map** is a labeled placeholder, not a live embedded
  map, since embedding one reliably needs an API key.
- **Prices** are fictional sample data, not real market prices.
- **Brand names** (Rolex, Michael Kors, Citizen Eco-Drive, Bulova) are
  used only as illustrative sample data, as permitted by the project
  brief; Alberto Clocks is not a real company and is not an authorized
  dealer for any of them.
- **Product photography** is loaded live from Unsplash. If any
  individual image URL ever stops resolving, the page's built-in
  fallback swaps in a working placeholder photo automatically so no
  broken-image icon is shown — double-check all image URLs still
  resolve in your own environment before submitting, since URLs can
  change over time.

## 21. Preparing the Submission ZIP and Demonstration Video

**ZIP file:**
1. Confirm the folder contains: `index.html`, `css/`, `js/`, `data/`,
   and this `README.md`.
2. Do not include an `assets/images` folder — all images load from the
   internet by design.
3. Compress the `alberto-clocks` folder into a `.zip` archive.
4. Open the extracted ZIP once on another machine to confirm
   `index.html` still opens correctly with all styles, scripts, and
   images loading.

**Demonstration video:**
1. Record your screen while opening `index.html`.
2. Walk through: navigation, theme toggle, category filtering and
   search, opening a product's details modal, the price list, the
   technology cards, submitting the repair and appraisal forms, the
   gallery lightbox, the FAQ accordion, the contact form, the login
   popup, and the bottom ticker.
3. Resize the browser window (or use device emulation) to show mobile,
   tablet, and desktop layouts.
4. Keep the video concise — a five-to-eight-minute walkthrough is
   typically enough to cover every required feature.

---

## Project Folder Structure

```
alberto-clocks/
├── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── app.js
│   ├── products.js
│   ├── gallery.js
│   ├── geolocation.js
│   ├── visitor.js
│   └── ui.js
├── data/
│   └── products.json      (reference copy of the product data as pure JSON)
└── README.md
```

`products.js` (not `products.json`) is what the website actually
reads at runtime, because browsers block `fetch()` of local JSON files
opened directly from disk without a server. `products.json` is kept as
a plain-data reference matching the folder structure in the original
project specification.

## Image Sources

All photography is loaded directly from Unsplash via `images.unsplash.com`
URLs with resizing parameters — no images are stored in this project.
If you redistribute this project, verify the image URLs still resolve
and that your use complies with Unsplash's license terms.
