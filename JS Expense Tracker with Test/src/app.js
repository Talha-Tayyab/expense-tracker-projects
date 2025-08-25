class ExpenseTracker {
  constructor() {
    this.expenses = this.loadExpenses();
    this.filteredExpenses = [...this.expenses];
    this.filters = {
      search: "",
      categories: [],
      dateFrom: "",
      dateTo: "",
      minAmount: 0,
      maxAmount: 1000,
    };
    this.initializeApp();
  }

  initializeApp() {
    this.setupEventListeners();
    this.setupFilterListeners();
    this.setDefaultDate();
    this.initializeFilters();
    this.displayExpenses();
    this.updateSummary();
  }

  setupEventListeners() {
    const form = document.getElementById("expenseForm");
    form.addEventListener("submit", (e) => this.handleSubmit(e));

    const inputs = ["amount", "category", "date", "description"];
    inputs.forEach((inputId) => {
      const input = document.getElementById(inputId);
      input.addEventListener("blur", () => this.validateField(inputId));
      input.addEventListener("input", () => this.clearError(inputId));
    });
  }

  setupFilterListeners() {
    const searchInput = document.getElementById("searchInput");
    searchInput.addEventListener("input", (e) => {
      this.filters.search = e.target.value.toLowerCase();
      this.applyFilters();
    });

    const dateFrom = document.getElementById("dateFrom");
    const dateTo = document.getElementById("dateTo");
    dateFrom.addEventListener("change", (e) => {
      this.filters.dateFrom = e.target.value;
      this.applyFilters();
    });
    dateTo.addEventListener("change", (e) => {
      this.filters.dateTo = e.target.value;
      this.applyFilters();
    });

    const minAmount = document.getElementById("minAmount");
    const maxAmount = document.getElementById("maxAmount");
    const minAmountValue = document.getElementById("minAmountValue");
    const maxAmountValue = document.getElementById("maxAmountValue");

    minAmount.addEventListener("input", (e) => {
      this.filters.minAmount = parseInt(e.target.value);
      minAmountValue.textContent = `$${this.filters.minAmount}`;
      this.applyFilters();
    });

    maxAmount.addEventListener("input", (e) => {
      this.filters.maxAmount = parseInt(e.target.value);
      maxAmountValue.textContent = `$${this.filters.maxAmount}`;
      this.applyFilters();
    });

    const clearFilters = document.getElementById("clearFilters");
    clearFilters.addEventListener("click", () => this.clearAllFilters());

    const filterToggle = document.getElementById("filterToggle");
    const filterSection = document.getElementById("filterSection");
    filterToggle.addEventListener("click", () => {
      filterSection.classList.toggle("show");
      filterToggle.textContent = filterSection.classList.contains("show")
        ? "🔍 Hide Filters"
        : "🔍 Show Filters";
    });
  }

  initializeFilters() {
    this.createCategoryFilters();
    const today = new Date();
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    document.getElementById("dateTo").value = today.toISOString().split("T")[0];
    document.getElementById("dateFrom").value =
      thirtyDaysAgo.toISOString().split("T")[0];
    this.updateAmountRange();
  }

  createCategoryFilters() {
    // Build from this.categories (set by CategoryManager)
    const container = document.getElementById("categoryFilters");
    if (!container || !this.categories) return;

    container.innerHTML = this.categories
      .map(
        (cat) => `
      <label class="category-checkbox" data-category="${cat.id}">
        <input type="checkbox" value="${cat.id}" checked />
        <span>${cat.emoji} ${cat.name}</span>
      </label>`
      )
      .join("");

    container.addEventListener("change", (e) => {
      if (e.target.type === "checkbox") {
        this.updateCategoryFilters();
        this.applyFilters();
      }
    });

    // include all categories by default
    this.filters.categories = this.categories.map((cat) => cat.id);
  }

  updateCategoryFilters() {
    const checkboxes = document.querySelectorAll(
      '#categoryFilters input[type="checkbox"]'
    );
    this.filters.categories = [];

    checkboxes.forEach((checkbox) => {
      const label = checkbox.parentElement;
      if (checkbox.checked) {
        this.filters.categories.push(checkbox.value);
        label.classList.add("active");
      } else {
        label.classList.remove("active");
      }
    });
  }

  updateCategoryDropdown() {
    const select = document.getElementById("category");
    if (!select) return;

    select.innerHTML = this.categories
      .map((cat) => `<option value="${cat.id}">${cat.emoji} ${cat.name}</option>`)
      .join("");
  }

  updateAmountRange() {
    if (this.expenses.length === 0) return;
    const amounts = this.expenses.map((expense) => expense.amount);
    const minExpense = Math.floor(Math.min(...amounts));
    const maxExpense = Math.ceil(Math.max(...amounts));

    const minSlider = document.getElementById("minAmount");
    const maxSlider = document.getElementById("maxAmount");

    minSlider.min = minExpense;
    minSlider.max = maxExpense;
    minSlider.value = minExpense;

    maxSlider.min = minExpense;
    maxSlider.max = maxExpense;
    maxSlider.value = maxExpense;

    this.filters.minAmount = minExpense;
    this.filters.maxAmount = maxExpense;

    document.getElementById("minAmountValue").textContent = `$${minExpense}`;
    document.getElementById("maxAmountValue").textContent = `$${maxExpense}`;
  }

  applyFilters() {
    this.filteredExpenses = this.expenses.filter((expense) => {
      if (this.filters.search) {
        const searchTerm = this.filters.search;
        const searchableText = [
          expense.amount.toString(),
          expense.category,
          expense.description,
          this.getCategoryName(expense.category),
        ]
          .join(" ")
          .toLowerCase();

        if (!searchableText.includes(searchTerm)) return false;
      }

      if (
        this.filters.categories.length > 0 &&
        !this.filters.categories.includes(expense.category)
      ) {
        return false;
      }

      if (this.filters.dateFrom && expense.date < this.filters.dateFrom)
        return false;
      if (this.filters.dateTo && expense.date > this.filters.dateTo) return false;

      if (
        expense.amount < this.filters.minAmount ||
        expense.amount > this.filters.maxAmount
      )
        return false;

      return true;
    });

    this.displayExpenses();
    this.updateFilterCount();
  }

  updateFilterCount() {
    const filterCount = document.getElementById("filterCount");
    const total = this.expenses.length;
    const filtered = this.filteredExpenses.length;

    filterCount.textContent =
      filtered === total
        ? `Showing all ${total} expenses`
        : `Showing ${filtered} of ${total} expenses`;
  }

  clearAllFilters() {
    document.getElementById("searchInput").value = "";
    document.getElementById("dateFrom").value = "";
    document.getElementById("dateTo").value = "";

    const checkboxes = document.querySelectorAll(
      '#categoryFilters input[type="checkbox"]'
    );
    checkboxes.forEach((checkbox) => {
      checkbox.checked = true;
      checkbox.parentElement.classList.add("active");
    });

    this.updateAmountRange();

    this.filters = {
      search: "",
      categories: ["food", "transport", "shopping", "entertainment", "bills", "health", "other"],
      dateFrom: "",
      dateTo: "",
      minAmount: this.filters.minAmount,
      maxAmount: this.filters.maxAmount,
    };

    this.applyFilters();
  }

  setDefaultDate() {
    const dateInput = document.getElementById("date");
    const today = new Date().toISOString().split("T")[0];
    dateInput.value = today;
  }

  validateField(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "Error");
    let isValid = true;

    field.classList.remove("input-error");
    errorElement.style.display = "none";

    switch (fieldId) {
      case "amount": {
        const amount = parseFloat(field.value);
        if (!field.value || amount <= 0 || amount > 1000000) {
          this.showError(
            field,
            errorElement,
            "Please enter a valid amount (0.01 - 1,000,000)"
          );
          isValid = false;
        }
        break;
      }
      case "category":
        if (!field.value) {
          this.showError(field, errorElement, "Please select a category");
          isValid = false;
        }
        break;
      case "date": {
        const selectedDate = new Date(field.value);
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);

        if (!field.value || selectedDate > today || selectedDate < oneYearAgo) {
          this.showError(
            field,
            errorElement,
            "Please select a valid date (within the last year)"
          );
          isValid = false;
        }
        break;
      }
      case "description":
        if (field.value.length > 200) {
          this.showError(
            field,
            errorElement,
            "Description must be less than 200 characters"
          );
          isValid = false;
        }
        break;
    }

    return isValid;
  }

  showError(field, errorElement, message) {
    field.classList.add("input-error");
    errorElement.textContent = message;
    errorElement.style.display = "block";
  }

  clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorElement = document.getElementById(fieldId + "Error");
    field.classList.remove("input-error");
    errorElement.style.display = "none";
  }

  handleSubmit(e) {
    e.preventDefault();
    const fields = ["amount", "category", "date", "description"];
    let allValid = true;

    fields.forEach((fieldId) => {
      if (!this.validateField(fieldId)) allValid = false;
    });

    if (!allValid) return;

    const expense = {
      id: Date.now().toString(),
      amount: parseFloat(document.getElementById("amount").value),
      category: document.getElementById("category").value,
      date: document.getElementById("date").value,
      description: document.getElementById("description").value.trim(),
      timestamp: new Date().toISOString(), // currently unused but harmless
    };

    this.addExpense(expense);
    this.resetForm();
  }

  addExpense(expense) {
    this.expenses.unshift(expense);
    this.saveExpenses();
    this.updateAmountRange();
    this.applyFilters();
    this.updateSummary();
    this.showSuccessMessage();
  }

  deleteExpense(id) {
    if (confirm("Are you sure you want to delete this expense?")) {
      this.expenses = this.expenses.filter((expense) => expense.id !== id);
      this.saveExpenses();
      this.updateAmountRange();
      this.applyFilters();
      this.updateSummary();
    }
  }

  displayExpenses() {
    const container = document.getElementById("expensesList");

    if (this.filteredExpenses.length === 0) {
      container.innerHTML =
        this.expenses.length === 0
          ? '<p style="text-align: center; color: #7f8c8d; padding: 20px;">No expenses added yet. Add your first expense above!</p>'
          : `<div class="no-results">
               <div class="no-results-icon">🔍</div>
               <h3>No expenses match your filters</h3>
               <p>Try adjusting your search criteria or clear all filters</p>
             </div>`;
      return;
    }

    const expensesHTML = this.filteredExpenses
      .map((expense) => {
        const categoryEmoji = this.getCategoryEmoji(expense.category);
        const formattedDate = new Date(expense.date).toLocaleDateString();

        return `
          <div class="expense-item">
            <div class="expense-details">
              <div class="expense-amount">${expense.amount.toFixed(2)}</div>
              <div class="expense-category">${categoryEmoji} ${this.getCategoryName(expense.category)}</div>
              <div class="expense-date">${formattedDate}</div>
              ${expense.description ? `<div style="color: #666; margin-top: 5px;">${expense.description}</div>` : ""}
            </div>
            <div class="expense-actions">
              <button class="btn btn-danger btn-small" onclick="app.deleteExpense('${expense.id}')">Delete</button>
            </div>
          </div>`;
      })
      .join("");

    container.innerHTML = expensesHTML;
  }

  getCategoryName(categoryId) {
    const cat = this.categories?.find((c) => c.id === categoryId);
    return cat ? cat.name : "Other";
  }

  getCategoryEmoji(categoryId) {
    const cat = this.categories?.find((c) => c.id === categoryId);
    return cat ? cat.emoji : "📦";
  }

  updateSummary() {
    const total = this.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const count = this.expenses.length;

    document.getElementById("totalAmount").textContent = `$${total.toFixed(2)}`;
    document.getElementById("totalCount").textContent = count;
  }

  resetForm() {
    document.getElementById("expenseForm").reset();
    this.setDefaultDate();
    ["amount", "category", "date", "description"].forEach((id) =>
      this.clearError(id)
    );
  }

  showSuccessMessage() {
    const btn = document.getElementById("submitBtn");
    const originalText = btn.textContent;
    btn.textContent = "✓ Added!";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  }

  saveExpenses() {
    console.log("Data saved to memory. Expenses count:", this.expenses.length);
  }

  loadExpenses() {
    return [];
  }
}

/* -------- Budget Management -------- */
class BudgetTracker extends ExpenseTracker {
  constructor() {
    super();
    this.budgets = this.loadBudgets();
    this.setupBudgetUI();
    this.updateBudgetUI();
  }

  setupBudgetUI() {
    const budgetCard = document.createElement("div");
    budgetCard.className = "card";
    budgetCard.innerHTML = `
      <h2>Set Budgets</h2>
      <form id="budgetForm">
        <div class="form-group">
          <label for="budgetMonth">Month</label>
          <input type="month" id="budgetMonth" required />
        </div>
        <div class="form-group">
          <label for="totalBudget">Total Budget ($)</label>
          <input type="number" id="totalBudget" min="0" step="0.01" required />
        </div>
        <div class="form-group">
          <label>Category Budgets</label>
          <div class="category-filters" id="budgetCategories">
            ${this.getAllCategories()
              .map(
                (cat) => `
              <label class="category-checkbox">
                <span>${this.getCategoryEmoji(cat)} ${this.getCategoryName(cat)}</span>
                <input type="number" id="budget-${cat}" min="0" placeholder="$0" />
              </label>`
              )
              .join("")}
          </div>
        </div>
        <button type="submit" class="btn">Save Budget</button>
      </form>
      <div class="budget-feedback" id="budgetFeedback"></div>
      <div id="budgetBars"></div>
    `;

    document
      .querySelector(".container")
      .insertBefore(budgetCard, document.querySelector(".card.expense-list"));

    document
      .getElementById("budgetForm")
      .addEventListener("submit", (e) => this.handleBudgetSubmit(e));
  }

  handleBudgetSubmit(e) {
    e.preventDefault();
    const month = document.getElementById("budgetMonth").value;
    const total = parseFloat(document.getElementById("totalBudget").value);
    const categoryBudgets = {};

    this.getAllCategories().forEach((cat) => {
      const val = parseFloat(document.getElementById(`budget-${cat}`).value) || 0;
      categoryBudgets[cat] = val;
    });

    const budgetEntry = {
      month,
      total,
      categoryBudgets,
      timestamp: new Date().toISOString(),
    };

    const existingIndex = this.budgets.findIndex((b) => b.month === month);
    if (existingIndex >= 0) this.budgets[existingIndex] = budgetEntry;
    else this.budgets.push(budgetEntry);

    this.saveBudgets();
    this.updateBudgetUI();
    document.getElementById("budgetFeedback").textContent =
      "Budget saved successfully ✅";
  }

  updateBudgetUI() {
    const barsContainer = document.getElementById("budgetBars");
    if (!barsContainer) return;

    const month =
      document.getElementById("budgetMonth").value ||
      new Date().toISOString().slice(0, 7);
    const currentBudget = this.budgets.find((b) => b.month === month);
    barsContainer.innerHTML = "";

    const [year] = month.split("-");
    const monthName = new Date(`${month}-01`).toLocaleString("default", {
      month: "long",
    });

    barsContainer.innerHTML += `
      <div style="margin-bottom: 10px; font-weight: bold; font-size: 16px;">
        📅 Budget for: ${monthName} ${year}
      </div>`;

    if (!currentBudget) {
      barsContainer.innerHTML =
        '<p style="color:#7f8c8d">No budget set for this month</p>';
      return;
    }

    // Per-category budgets
    this.getAllCategories().forEach((cat) => {
      const spent = this.expenses
        .filter((e) => e.category === cat && e.date.startsWith(month))
        .reduce((sum, e) => sum + e.amount, 0);
      const budget = currentBudget.categoryBudgets[cat] || 0;

      let percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
      let alertColor = "#2ecc71";
      if (percentage >= 100) alertColor = "#e74c3c";
      else if (percentage >= 80) alertColor = "#f39c12";
      else if (percentage >= 50) alertColor = "#f1c40f";

      barsContainer.innerHTML += `
        <div style="margin-bottom:10px;">
          <div style="margin-bottom:4px; font-weight:600;">
            ${this.getCategoryEmoji(cat)} ${this.getCategoryName(cat)}:
            $${spent.toFixed(2)} / $${budget.toFixed(2)}
          </div>
          <div style="background:#ecf0f1; border-radius:6px; overflow:hidden; height:14px;">
            <div style="width:${percentage}%; background:${alertColor}; height:14px;"></div>
          </div>
        </div>`;

      if (spent >= budget && budget > 0) {
        barsContainer.innerHTML += `
          <div style="color:#e74c3c; font-weight:bold; margin-bottom:10px;">
            ⚠️ You have exceeded your ${this.getCategoryName(cat)} budget!
          </div>`;
      } else if (percentage >= 80) {
        barsContainer.innerHTML += `
          <div style="color:#f39c12; font-weight:bold; margin-bottom:10px;">
            ⏳ You have reached ${Math.round(percentage)}% of your ${this.getCategoryName(cat)} budget.
          </div>`;
      } else if (percentage >= 50) {
        barsContainer.innerHTML += `
          <div style="color:#f1c40f; font-weight:bold; margin-bottom:10px;">
            📊 Halfway through your ${this.getCategoryName(cat)} budget!
          </div>`;
      }
    });

    // Total budget
    const totalSpent = this.expenses
      .filter((e) => e.date.startsWith(month))
      .reduce((sum, e) => sum + e.amount, 0);
    const totalBudget = currentBudget.total || 0;
    let totalPercent =
      totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
    let totalColor = "#2ecc71";
    if (totalPercent >= 100) totalColor = "#e74c3c";
    else if (totalPercent >= 80) totalColor = "#f39c12";
    else if (totalPercent >= 50) totalColor = "#f1c40f";

    barsContainer.innerHTML += `
      <div style="margin-top:16px;">
        <div style="margin-bottom:4px; font-weight:700;">
          Total: $${totalSpent.toFixed(2)} / $${totalBudget.toFixed(2)}
        </div>
        <div style="background:#ecf0f1; border-radius:6px; overflow:hidden; height:18px;">
          <div style="width:${totalPercent}%; background:${totalColor}; height:18px;"></div>
        </div>
      </div>`;

    if (totalSpent >= totalBudget && totalBudget > 0) {
      barsContainer.innerHTML += `
        <div style="color:#e74c3c; font-weight:bold; margin-top:6px;">
          ⚠️ You have exceeded your total budget for this month!
        </div>`;
    } else if (totalPercent >= 80) {
      barsContainer.innerHTML += `
        <div style="color:#f39c12; font-weight:bold; margin-top:6px;">
          ⏳ You have reached ${Math.round(totalPercent)}% of your total budget.
        </div>`;
    } else if (totalPercent >= 50) {
      barsContainer.innerHTML += `
        <div style="color:#f1c40f; font-weight:bold; margin-top:6px;">
          📊 You have spent over half of your monthly budget.
        </div>`;
    }
  }

  getAllCategories() {
    return ["food", "transport", "shopping", "entertainment", "bills", "health", "other"];
  }

  saveBudgets() {
    console.log("Budgets saved to memory. Count:", this.budgets.length);
  }

  loadBudgets() {
    return [];
  }

  addExpense(expense) {
    super.addExpense(expense);
    this.updateBudgetUI();
  }
  deleteExpense(id) {
    super.deleteExpense(id);
    this.updateBudgetUI();
  }
}

/* -------- Charts -------- */
class ChartedTracker extends BudgetTracker {
  constructor() {
    super();
    this.chartInstances = {};
    this.setupChartUI();
    this.updateCharts();
  }

  setupChartUI() {
    const chartCard = document.createElement("div");
    chartCard.className = "card";
    chartCard.innerHTML = `
      <h2>Spending Charts</h2>
      <canvas id="categoryPieChart" height="200"></canvas>
      <canvas id="monthlyBarChart" height="200" style="margin-top: 30px;"></canvas>
    `;
    document.querySelector(".container").appendChild(chartCard);
  }

  updateCharts() {
    this.renderCategoryPieChart();
    this.renderMonthlyBarChart();
  }

  renderCategoryPieChart() {
    const ctx = document.getElementById("categoryPieChart").getContext("2d");
    const data = {};
    this.expenses.forEach((exp) => {
      data[exp.category] = (data[exp.category] || 0) + exp.amount;
    });

    const labels = Object.keys(data).map(
      (cat) => `${this.getCategoryEmoji(cat)} ${this.getCategoryName(cat)}`
    );
    const values = Object.values(data);

    if (this.chartInstances.pie) this.chartInstances.pie.destroy();

    this.chartInstances.pie = new Chart(ctx, {
      type: "pie",
      data: {
        labels,
        datasets: [
          {
            data: values,
            backgroundColor: [
              "#3498db",
              "#2ecc71",
              "#f1c40f",
              "#e67e22",
              "#e74c3c",
              "#9b59b6",
              "#95a5a6",
            ],
          },
        ],
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: "Expenses by Category" },
        },
      },
    });
  }

  renderMonthlyBarChart() {
    const ctx = document.getElementById("monthlyBarChart").getContext("2d");
    const data = {};
    this.expenses.forEach((exp) => {
      const month = exp.date.slice(0, 7); // YYYY-MM
      data[month] = (data[month] || 0) + exp.amount;
    });

    const labels = Object.keys(data).sort();
    const values = labels.map((m) => data[m]);

    if (this.chartInstances.bar) this.chartInstances.bar.destroy();

    this.chartInstances.bar = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{ label: "Monthly Expenses ($)", data: values, backgroundColor: "#3498db" }],
      },
      options: {
        scales: { y: { beginAtZero: true } },
        plugins: { title: { display: true, text: "Spending Trend by Month" } },
      },
    });
  }

  addExpense(expense) {
    super.addExpense(expense);
    this.updateCharts();
  }
  deleteExpense(id) {
    super.deleteExpense(id);
    this.updateCharts();
  }
}

/* -------- Category Manager -------- */
class CategoryManager extends ChartedTracker {
  constructor() {
    super();
    this.categories = this.loadCategories();
    this.renderCategoryGrid();
    this.setupCategoryForm();
    this.updateCategoryDropdown();
    this.refreshBudgetCategories();
    this.createCategoryFilters();
    this.setupGlobalDeleteButton();
  }

  loadCategories() {
    const saved = JSON.parse(localStorage.getItem("categories"));
    if (Array.isArray(saved)) {
      return saved.map((cat) => ({
        ...cat,
        totalSpent: cat.totalSpent ?? 0,
        expenseCount: cat.expenseCount ?? 0,
      }));
    }

    const defaults = [
      { id: "food", name: "Food & Dining", emoji: "🍽️", color: "#3498db", isDefault: true, isCustom: false },
      { id: "transport", name: "Transportation", emoji: "🚗", color: "#2ecc71", isDefault: true, isCustom: false },
      { id: "shopping", name: "Shopping", emoji: "🛍️", color: "#f1c40f", isDefault: true, isCustom: false },
      { id: "entertainment", name: "Entertainment", emoji: "🎬", color: "#e67e22", isDefault: true, isCustom: false },
      { id: "bills", name: "Bills & Utilities", emoji: "📄", color: "#e74c3c", isDefault: true, isCustom: false },
      { id: "health", name: "Healthcare", emoji: "🏥", color: "#9b59b6", isDefault: true, isCustom: false },
      { id: "other", name: "Other", emoji: "📦", color: "#95a5a6", isDefault: true, isCustom: false },
    ];
    return defaults.map((cat) => ({ ...cat, totalSpent: 0, expenseCount: 0 }));
  }

  saveCategories() {
    localStorage.setItem("categories", JSON.stringify(this.categories));
  }

  renderCategoryGrid() {
    const grid = document.getElementById("categoryGrid");
    if (!grid) return;
    grid.innerHTML = "";

    this.categories.forEach((cat) => {
      const box = document.createElement("div");
      box.className = "category-box";
      box.innerHTML = `
        <div class="category-icon" contenteditable="false">${cat.emoji}</div>
        <div class="category-name" contenteditable="false">${cat.name}</div>
        <div class="category-id">ID: <span class="cat-id">${cat.id}</span></div>
        <div class="category-info">
          <span>${cat.expenseCount} expenses</span>
          <span>$${cat.totalSpent.toFixed(2)}</span>
        </div>
        <div class="category-actions">
          <button class="btn btn-small edit-btn" data-id="${cat.id}">Edit</button>
          <button class="btn btn-small save-btn" data-id="${cat.id}" style="display:none">Save</button>
          <button class="btn btn-small cancel-btn" data-id="${cat.id}" style="display:none">Cancel</button>
          <button class="btn btn-small btn-danger delete-btn" data-id="${cat.id}" ${cat.isDefault ? "disabled" : ""}>Delete</button>
        </div>
      `;

      const iconDiv = box.querySelector(".category-icon");
      const nameDiv = box.querySelector(".category-name");
      const editBtn = box.querySelector(".edit-btn");
      const saveBtn = box.querySelector(".save-btn");
      const cancelBtn = box.querySelector(".cancel-btn");
      const deleteBtn = box.querySelector(".delete-btn");

      editBtn.addEventListener("click", () => {
        iconDiv.contentEditable = true;
        nameDiv.contentEditable = true;
        iconDiv.focus();
        editBtn.style.display = "none";
        saveBtn.style.display = "inline-block";
        cancelBtn.style.display = "inline-block";
      });

      saveBtn.addEventListener("click", () => {
        const newName = nameDiv.textContent.trim();
        const newEmoji = iconDiv.textContent.trim();

        if (!newName || newName.length < 3 || newName.length > 30) {
          alert("Invalid name. 3–30 characters required.");
          return;
        }

        const target = this.categories.find((c) => c.id === cat.id);
        if (!target) return;
        target.name = newName;
        target.emoji = newEmoji || "📦";

        this.saveCategories();
        this.renderCategoryGrid();
        this.updateCategoryDropdown();
      });

      cancelBtn.addEventListener("click", () => {
        this.renderCategoryGrid();
      });

      deleteBtn.addEventListener("click", () => {
        if (cat.expenseCount > 0) {
          const reassignTo = prompt(
            `Category '${cat.name}' has ${cat.expenseCount} expenses. Enter ID of a category to reassign to:`
          );
          const reassignedCat = this.categories.find((c) => c.id === reassignTo);

          if (!reassignedCat || reassignedCat.id === cat.id) {
            alert("Invalid reassignment category.");
            return;
          }

          this.expenses.forEach((e) => {
            if (e.category === cat.id) e.category = reassignedCat.id;
          });

          alert(`Reassigned ${cat.expenseCount} expenses to ${reassignedCat.name}.`);
        }

        this.categories = this.categories.filter((c) => c.id !== cat.id);
        this.saveCategories();
        this.renderCategoryGrid();
        this.updateCategoryDropdown();
        this.refreshBudgetCategories();
        this.applyFilters();
        this.updateCharts();
      });

      grid.appendChild(box);
    });

    document.getElementById("totalCategories").textContent = this.categories.length;
    this.updateCategoryStats();
  }

  updateCategoryStats() {
    document.getElementById("mostUsed").textContent = "—";
    document.getElementById("highestSpend").textContent = "—";
  }

  updateCategoryDropdown() {
    const select = document.getElementById("category");
    if (!select) return;
    select.innerHTML =
      `<option value="">Select a category</option>` +
      this.categories
        .map((cat) => `<option value="${cat.id}">${cat.emoji} ${cat.name}</option>`)
        .join("");
    select.value = "";
  }

  setupCategoryForm() {
    const modal = document.getElementById("categoryModal");
    const openBtn = document.getElementById("addCategory");
    const closeBtn = document.getElementById("modalClose");
    const cancelBtn = document.getElementById("cancelCategory");
    const form = document.getElementById("categoryForm");

    openBtn.addEventListener("click", () => {
      modal.classList.add("active");   // use CSS .active to show
      form.reset();
    });

    [closeBtn, cancelBtn].forEach((btn) => {
      btn.addEventListener("click", () => {
        modal.classList.remove("active"); // hide
      });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const nameInput = document.getElementById("categoryName");
      const emojiInput = document.getElementById("categoryEmoji");

      const name = nameInput.value.trim();
      const emoji = emojiInput.value.trim() || "📦";

      if (name.length < 3 || name.length > 30) {
        alert("Category name must be between 3 and 30 characters.");
        return;
      }

      if (this.categories.some((c) => c.name.toLowerCase() === name.toLowerCase())) {
        alert("Category name already exists.");
        return;
      }

      const newCategory = {
        id: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        emoji,
        color: "#3498db",
        isDefault: false,
        isCustom: true,
        createdAt: Date.now(),
        expenseCount: 0,
        totalSpent: 0,
      };

      this.categories.push(newCategory);
      this.saveCategories();
      this.renderCategoryGrid();
      this.updateCategoryDropdown();
      this.refreshBudgetCategories();
      this.createCategoryFilters();
      modal.classList.remove("active");
    });
  }

  setupGlobalDeleteButton() {
    const deleteBtn = document.getElementById("deleteCategory");
    if (!deleteBtn) return;

    deleteBtn.addEventListener("click", () => {
      const input = prompt("Enter the category name or ID to delete:");
      if (!input) return;

      const cat = this.categories.find(
        (c) =>
          c.id.toLowerCase() === input.toLowerCase() ||
          c.name.toLowerCase() === input.toLowerCase()
      );

      if (!cat) {
        alert("❌ Category not found.");
        return;
      }
      if (cat.isDefault) {
        alert("⚠️ You cannot delete default categories.");
        return;
      }

      const expenseCount = this.expenses.filter((e) => e.category === cat.id).length;

      if (expenseCount > 0) {
        const reassignTo = prompt(
          `Category '${cat.name}' has ${expenseCount} expenses. Enter name or ID of a category to reassign to:`
        );

        const newCat = this.categories.find(
          (c) =>
            c.id.toLowerCase() === reassignTo?.toLowerCase() ||
            c.name.toLowerCase() === reassignTo?.toLowerCase()
        );

        if (!newCat || newCat.id === cat.id) {
          alert("❌ Invalid reassignment.");
          return;
        }

        this.expenses.forEach((e) => {
          if (e.category === cat.id) e.category = newCat.id;
        });
      }

      this.categories = this.categories.filter((c) => c.id !== cat.id);
      this.saveCategories();
      this.renderCategoryGrid();
      this.updateCategoryDropdown();
      this.applyFilters();
      this.updateCharts();
      alert(`✅ Category '${cat.name}' deleted.`);
    });
  }

  refreshBudgetCategories() {
    const container = document.getElementById("budgetCategories");
    if (!container) return;

    container.innerHTML = this.categories
      .map(
        (cat) => `
      <label class="category-checkbox">
        <span>${cat.emoji} ${cat.name}</span>
        <input type="number" id="budget-${cat.id}" min="0" placeholder="$0" />
      </label>`
      )
      .join("");
  }
}

/* -------- Import / Export -------- */
class ImportExportManager extends CategoryManager {
  constructor() {
    super();
    this.setupImportExportUI();
  }

  setupImportExportUI() {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <h2>📂 Import & Export</h2>
      <div class="form-group">
        <input type="file" id="jsonFileInput" accept=".json" style="display:none;" />
        <button class="btn" id="importJSONBtn">📥 Import JSON</button>
        <button class="btn btn-secondary" id="exportJSONBtn">📤 Export JSON</button>
      </div>
    `;
    document.querySelector(".container").appendChild(card);

    document.getElementById("importJSONBtn").addEventListener("click", () => {
      document.getElementById("jsonFileInput").click();
    });

    document.getElementById("jsonFileInput").addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (!file || !file.name.endsWith(".json")) {
        alert("Please select a valid JSON file.");
        return;
      }
      this.readJSONFile(file);
    });

    document
      .getElementById("exportJSONBtn")
      .addEventListener("click", () => this.exportToJSON());
  }

  readJSONFile(file) {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target.result);
        if (this.validateJSONStructure(data)) {
          this.importJSONData(data);
          alert("✅ Data imported successfully.");
        }
      } catch (err) {
        alert("❌ Invalid JSON format.");
        console.error("JSON parsing error:", err);
      }
    };
    reader.readAsText(file);
  }

  exportToJSON() {
    const data = {
      metadata: { exportedAt: new Date().toISOString(), version: "1.0" },
      expenses: this.expenses,
      categories: this.categories,
      budgets: this.budgets,
    };

    const jsonString = JSON.stringify(data, null, 2);
    this.downloadFile(
      jsonString,
      `expenses_${new Date().toISOString().split("T")[0]}.json`,
      "application/json"
    );
  }

  downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  validateJSONStructure(data) {
    if (!data || !Array.isArray(data.expenses)) {
      alert('❌ Invalid JSON: "expenses" array is required.');
      return false;
    }

    for (let i = 0; i < data.expenses.length; i++) {
      const exp = data.expenses[i];
      if (
        typeof exp.id !== "string" ||
        typeof exp.amount !== "number" ||
        !exp.category ||
        typeof exp.date !== "string" ||
        (exp.description && typeof exp.description !== "string")
      ) {
        alert(`❌ Invalid expense format at index ${i}.`);
        return false;
      }
      if (isNaN(Date.parse(exp.date))) {
        alert(`❌ Invalid date format at index ${i}.`);
        return false;
      }
      if (exp.amount < 0.01 || exp.amount > 1000000) {
        alert(`❌ Invalid amount at index ${i}. Must be between 0.01 and 1,000,000.`);
        return false;
      }
    }

    return true;
  }

  importJSONData(data) {
    this.expenses = [...this.expenses, ...data.expenses];

    if (Array.isArray(data.categories)) {
      this.categories = [...this.categories, ...data.categories];
      this.saveCategories?.();
    }

    if (Array.isArray(data.budgets)) {
      this.budgets = [...this.budgets, ...data.budgets];
      this.saveBudgets?.();
    }

    this.updateCategoryDropdown?.();
    this.createCategoryFilters?.();
    this.applyFilters?.();
    this.updateCharts?.();
    this.updateBudgetUI?.();
    this.updateSummary?.();
  }
}

const app = new ImportExportManager();