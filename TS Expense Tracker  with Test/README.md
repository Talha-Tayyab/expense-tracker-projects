# Expense Tracker (TypeScript)

A lightweight, browser-based expense tracker built with **TypeScript + HTML/CSS**. Add expenses, filter/search, manage categories (add/edit/delete), set monthly budgets, and view charts via **Chart.js**. No backend required.

> ### 🔴 For Reviewers
> On **browser refresh**, the app **resets runtime data** (expenses + budgets) so reviewers always start clean.  
> You can disable this behavior any time (see **Disable auto-reset on refresh**).

---

## 🚀 Quick Start

**Option A — Open directly**
1. Compile TypeScript (see **Development**) so `dist/` exists.
2. Open `index.html` in a modern browser (Chrome/Edge/Firefox).

**Option B — Serve locally (recommended)**
```bash
# Python 3
python -m http.server 8080
# visit http://localhost:8080/

# or with Node
npx serve
```

Chart.js loads from a CDN. First run needs an internet connection.

---

## ✨ Features

- Add expenses (amount, category, date, description)
- Dynamic filters: search, date range, amount range, category toggles
- Summary (total amount + total count)
- Category management: add, edit name/emoji, delete (with reassignment)
- Monthly budgets (per-category & total) with progress bars and alerts
- Charts: Category pie & Monthly totals bar (Chart.js)
- Import / Export all data as JSON

---

## 🗂 Project Structure

```
.
├─ index.html
├─ style.css
├─ dist/                       # compiled JS (output)
│  ├─ app.js
│  └─ *.js (compiled modules)
├─ types/
│  └─ interfaces.ts            # shared TS interfaces (compiled to dist)
├─ app.ts                      # app bootstrap + DOM wiring
├─ ExpenseTracker.ts           # add/list/filter expenses (localStorage)
├─ CategoryManager.ts          # category CRUD (localStorage)
├─ BudgetManager.ts            # monthly & per-category budgets (localStorage)
├─ ChartManager.ts             # Chart.js rendering + dashboard toggle
├─ tsconfig.json
└─ package.json
```

**index.html scripts (only these):**

```html
<!-- Load Chart.js first -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/3.9.1/chart.min.js" defer></script>

<!-- Your compiled TypeScript entry -->
<script type="module" src="dist/app.js"></script>
```

**Do not add other compiled files as extra `<script>` tags.** `dist/app.js` imports what it needs.

---

## 🛠 Development

```bash
npm install

# one-time build
npm run build

# watch mode
npm run dev
```

**tsconfig basics:**
- `"outDir": "dist"`
- `"rootDir"` points to your TS sources (e.g., `"."`)
- `"module": "ESNext"` (or `"ES2020"`)
- `"moduleResolution": "Bundler"` (or `"NodeNext"`)

Make sure compiled imports end with `.js`.

---

## 💾 Data & Persistence

- **Expenses** → `localStorage["expenses"]`
- **Categories** → `localStorage["categories"]`
- **Budgets** → `localStorage["budgetConfig"]` (contains `{ monthlyLimit, categoryLimits }`)

### Auto-reset on refresh

In `app.ts` there's a small block that detects page reload and clears runtime keys:

```typescript
(() => {
  const nav = performance.getEntriesByType("navigation")[0] as any;
  const isReload = nav ? nav.type === "reload"
   : (performance as any).navigation?.type === 1;

  if (isReload) {
    ["expenses", "categoryLimits", "monthlyLimit", "budgetConfig"]
      .forEach(k => localStorage.removeItem(k));
  }
})();
```

### Disable auto-reset on refresh

Comment out or remove the IIFE above, then rebuild (`npm run build`).

### Manual reset (alternative)

Open DevTools → Console:

```js
localStorage.clear();
```

---

## 🧪 Import / Export

- **Export:** "Export JSON" downloads `expense_data_YYYY-MM-DD.json` including expenses, categories, and budgets.
- **Import:** "Import JSON" → choose file → basic validation and merge.

---

## 🧭 Using the App

- **Add Expense:** Fill form → Add Expense. List & summary update.
- **Filters:** Search, set date range, move amount sliders, toggle categories. Clear All Filters resets.
- **Categories:** Add, edit (name/emoji), delete (prompts to reassign expenses).
- **Budgets:** Set monthly total + per-category limits. Progress bars change color as you approach/exceed limits.
- **Charts:** Toggle with "📊 Toggle Chart Dashboard". Charts update automatically on data changes.

---

## ♿ Accessibility & UX

- Focus states, inline validation, contrast-friendly colors.

---

## 🧰 Troubleshooting

- **Duplicate/missing scripts:** Keep only `dist/app.js` as a module in `index.html`.
- **Chart.js errors:** Ensure the CDN `<script>` tag appears before `dist/app.js`.
- **Buttons do nothing:** Build TS → ensure `dist/` exists → serve via local server (avoids file-URL/CORS issues).

---

## 🌐 Browser Compatibility

- **Recommended:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Required:** ES6+ modules support, localStorage API

---

## ✅ Submission Checklist

- `index.html` loads Chart.js + `dist/app.js` (only)
- TypeScript compiles cleanly (`npm run build`)
- No console errors
- Filters, categories, budgets, charts, import/export all work
- Auto-reset on refresh enabled (or documented if disabled)

---

## 📄 License
