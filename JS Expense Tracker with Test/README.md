# Expense Tracker (JavaScript) — Thesis Submission

A lightweight, browser-based expense tracker built with vanilla **HTML/CSS/JS**. 
It lets you add expenses, filter/search, manage categories (add/edit/delete), set monthly budgets, and view charts (via Chart.js). No backend needed.

> ## 🔴 Important (First-Time Use / Reviewers)
> Before testing the app, open your browser's **Console** and run:
>
> ```js
> localStorage.clear();
> ```
>
> This clears any previously saved data so the app starts clean.



## 🚀 Quick Start

1. **Download & extract** the project ZIP.
2. Open **`index.html`** in a modern browser (Chrome/Edge/Firefox).
3. Open **DevTools → Console** and run:
   ```js
   localStorage.clear();
   ```
4. Start adding expenses and try the filters, categories, budgets, charts, and import/export.

**Note:** The app loads Chart.js from a CDN. You'll need an internet connection the first time.

If your browser blocks local file scripts, serve the folder locally:

```bash
# Python 3
python -m http.server 8080
# then visit http://localhost:8080/
```



## ✨ Features

- Add expenses with amount, category, date, description
- Dynamic list with search, date range, amount range, and category filters
- Summary (total amount + total count)
- Category management: add, edit name/emoji, delete (with reassignment of existing expenses)
- Monthly budgets (per-category & total) with progress bars and alerts
- Charts: category pie & monthly totals bar (Chart.js)
- Import / Export all data as JSON



## 🗂 Project Structure

```
.
├─ index.html
├─ src/
│  ├─ style.css
│  └─ app.js
└─ utils/              (optional helpers used for dev/tests)
   ├─ category.js
   ├─ expenses.js
   ├─ filter.js
   ├─ summary.js
   └─ validators.js
```

The browser app only requires files in the project root and `src/`.
The `utils/` folder uses CommonJS (Node-style) modules and isn't imported by `app.js`. It's fine to include for reference/tests, but not required to run.



## 🧭 How to Use

- **Add Expense:** Fill the form and click Add Expense. The list updates and the summary recalculates automatically.
- **Filters:** Use the search, set a date range, drag amount sliders, and toggle categories. Click Clear All Filters to reset.
- **Categories:** Default categories are provided. Add custom ones, edit name/emoji, or delete. If a category with expenses is deleted, you'll be asked to reassign those expenses.
- **Budgets:** Pick a month, set a total and optional per-category budgets. Progress bars change color as you approach or exceed limits.
- **Charts:** The pie chart shows spending by category; the bar chart shows monthly totals.
- **Import / Export:** Use the Import & Export card to back up or restore data as JSON (basic validation included).



## 💾 Data & Persistence

- Categories are persisted in localStorage (so they remain across reloads).
- Expenses and budgets are kept in memory for the current session (use Export JSON to save a snapshot; Import JSON to restore).
- To start fresh for marking/review, run:

```js
localStorage.clear();
```

in the browser console before use (as noted above).



## 🧪 Import / Export

- **Export:** Click Export JSON → downloads `expenses_YYYY-MM-DD.json` containing expenses, categories, and budgets.
- **Import:** Click Import JSON → choose a previously exported file. The app performs basic format checks and merges data.



## ♿ Accessibility & UX

- Focus states on inputs and buttons
- Inline validation messages for amount/date/category/description
- Contrast-friendly colors for important UI elements


## 🛠 Tech Stack

- HTML / CSS / JavaScript (ES6+)
- Chart.js via CDN
- localStorage (categories) + in-memory arrays (expenses/budgets)
- No frameworks or build tools required



## ⚠️ Known Limitations

- Expenses and budgets don't persist automatically across reloads (export/import is provided).
- The `utils/` folder is not bundled for browser use; it's included for reference/tests only.
- Requires internet connection for Chart.js CDN on first load



## 🌐 Browser Compatibility

- **Recommended:** Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **Required:** ES6+ support, localStorage API



## ✅ Submission Checklist

- `index.html` correctly links `src/style.css` and `src/app.js`
- App loads without console errors
- Filters, category management, budgets, and charts work as described
- README includes the `localStorage.clear()` instruction for reviewers
- (Optional) Tested once via a local server if your system blocks local files




