import { Expense } from "./types/interfaces";
import { ExpenseTracker } from "./ExpenseTracker.js";
import { CategoryManager } from "./CategoryManager.js";
import { BudgetManager } from "./BudgetManager.js";
import { ChartManager } from "./ChartManager.js";

(() => {
  const nav = performance.getEntriesByType("navigation")[0] as any;
  const isReload = nav ? nav.type === "reload"
   : (performance as any).navigation?.type === 1;

  if (isReload) {
    ["expenses", "categoryLimits", "monthlyLimit", "budgetConfig"]
      .forEach(k => localStorage.removeItem(k));
  }
})();


const tracker = new ExpenseTracker();
const categoryManager = new CategoryManager();

// Form Elements
const form = document.getElementById("expenseForm") as HTMLFormElement;
const amountInput = document.getElementById("amount") as HTMLInputElement;
const categoryInput = document.getElementById("category") as HTMLSelectElement;
const dateInput = document.getElementById("date") as HTMLInputElement;
const descriptionInput = document.getElementById("description") as HTMLTextAreaElement;

// Filter Elements
const minAmountInput = document.getElementById("minAmount") as HTMLInputElement;
const maxAmountInput = document.getElementById("maxAmount") as HTMLInputElement;
const searchInput = document.getElementById("searchInput") as HTMLInputElement;
const dateFromInput = document.getElementById("dateFrom") as HTMLInputElement;
const dateToInput = document.getElementById("dateTo") as HTMLInputElement;

// Budget Elements
const monthlyBudgetInput = document.getElementById("monthlyBudget") as HTMLInputElement;
const saveMonthlyBudgetBtn = document.getElementById("saveMonthlyBudget") as HTMLButtonElement;
const categorySelect = document.getElementById("budgetCategorySelect") as HTMLSelectElement;
const categoryBudgetInput = document.getElementById("categoryBudgetLimit") as HTMLInputElement;
const saveCategoryBudgetBtn = document.getElementById("saveCategoryBudget") as HTMLButtonElement;

// Utility Functions
function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function getCurrentMonth(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function isCurrentMonth(dateString: string): boolean {
  const currentMonth = getCurrentMonth();
  return dateString.startsWith(currentMonth);
}

function getMonthlyExpenses(): Expense[] {
  const expenses: Expense[] = JSON.parse(localStorage.getItem("expenses") || "[]");
  const currentMonth = getCurrentMonth();
  console.log("Current month:", currentMonth);
  
  const monthlyExpenses = expenses.filter(exp => {
    const expenseMonth = exp.date.substring(0, 7); // Get YYYY-MM from YYYY-MM-DD
    console.log(`Expense date: ${exp.date}, Month: ${expenseMonth}, Matches: ${expenseMonth === currentMonth}`);
    return expenseMonth === currentMonth;
  });
  
  console.log("Monthly expenses:", monthlyExpenses);
  return monthlyExpenses;
}

// Category Filter Functions
function renderCategoryFilters(): void {
  const filterContainer = document.getElementById("categoryFilters");
  if (!filterContainer) return;

  const categories: { name: string; emoji: string }[] =
    JSON.parse(localStorage.getItem("categories") || "[]");

  filterContainer.innerHTML = "";

  categories.forEach(cat => {
    const wrapper = document.createElement("label");
    wrapper.style.marginRight = "10px";
    wrapper.style.display = "inline-block";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = true;
    checkbox.value = cat.name;
    checkbox.className = "category-filter";

    checkbox.addEventListener("change", renderExpenses);

    wrapper.appendChild(checkbox);
    wrapper.append(` ${cat.emoji} ${capitalize(cat.name)}`);
    filterContainer.appendChild(wrapper);
  });
}

function getSelectedCategories(): string[] {
  return Array.from(document.querySelectorAll(".category-filter"))
    .filter(el => (el as HTMLInputElement).checked)
    .map(el => (el as HTMLInputElement).value);
}

// Expense Rendering Functions
function renderExpenses(): void {
  const expenses = tracker.getExpenses();
  const listContainer = document.getElementById("expensesList");
  if (!listContainer) return;

  listContainer.innerHTML = "";

  const categories: { name: string; emoji: string }[] =
    JSON.parse(localStorage.getItem("categories") || "[]");

  const min = parseFloat(minAmountInput.value) || 0;
  const max = parseFloat(maxAmountInput.value) || Infinity;
  const selectedCategories = getSelectedCategories();

  const searchValue = searchInput?.value.toLowerCase() || "";
  const dateFrom = dateFromInput?.value || "";
  const dateTo = dateToInput?.value || "";

  const filtered = expenses.filter(exp => {
    const inAmountRange = exp.amount >= min && exp.amount <= max;
    const inCategory = selectedCategories.length === 0 || selectedCategories.includes(exp.category);

    const inSearch =
      searchValue === "" ||
      (exp.description?.toLowerCase().includes(searchValue)) ||
      exp.category.toLowerCase().includes(searchValue) ||
      exp.amount.toString().includes(searchValue);

    const inDate =
      (!dateFrom || exp.date >= dateFrom) &&
      (!dateTo || exp.date <= dateTo);

    return inAmountRange && inCategory && inSearch && inDate;
  });

  if (filtered.length === 0) {
    listContainer.innerHTML = `<p style="text-align: center; color: #7f8c8d; padding: 20px;">No matching expenses found.</p>`;
    return;
  }

  filtered.forEach((exp) => {
    const matchingCategory = categories.find(cat => cat.name === exp.category);
    const emoji = matchingCategory ? matchingCategory.emoji : "❓";

    const div = document.createElement("div");
    div.className = "expense-item";
    div.style.cssText = `
      border: 1px solid #e0e0e0; 
      border-radius: 8px; 
      padding: 12px; 
      margin-bottom: 10px; 
      background: #f9f9f9;
      display: flex;
      justify-content: space-between;
      align-items: center;
    `;
    
    div.innerHTML = `
      <div>
        <strong>€${exp.amount.toFixed(2)}</strong> • ${emoji} ${capitalize(exp.category)} • ${exp.date}<br>
        <small style="color: #666;">${exp.description || 'No description'}</small>
      </div>
      <button 
        onclick="deleteExpense('${exp.id}')" 
        style="
          background: #e74c3c; 
          color: white; 
          border: none; 
          border-radius: 4px; 
          padding: 6px 10px; 
          cursor: pointer; 
          font-size: 12px;
          transition: background 0.2s;
        "
        onmouseover="this.style.background='#c0392b'"
        onmouseout="this.style.background='#e74c3c'"
      >
        🗑️ Delete
      </button>
    `;
    listContainer.appendChild(div);
  });

  // Update filter count
  const filterCount = document.getElementById("filterCount");
  if (filterCount) {
    filterCount.textContent = `Showing ${filtered.length} of ${expenses.length} expenses`;
  }
}

// Find your deleteExpense function and update it to include chart updates:
function deleteExpense(expenseId: string): void {
  if (confirm("Are you sure you want to delete this expense?")) {
    // Get current expenses
    const expenses: Expense[] = JSON.parse(localStorage.getItem("expenses") || "[]");
    
    // Filter out the expense to delete
    const updatedExpenses = expenses.filter(exp => exp.id !== expenseId);
    
    // Save back to localStorage
    localStorage.setItem("expenses", JSON.stringify(updatedExpenses));
    
    // Update all displays
    renderExpenses();
    renderBudgetOverview();
    updateTotalSummary();
    ChartManager.updateCharts(); // ✅ ADD THIS LINE
    
    console.log("Deleted expense:", expenseId);
  }
}

// Make deleteExpense available globally
(window as any).deleteExpense = deleteExpense;

// Total Summary Functions
function updateTotalSummary(): void {
  const expenses = tracker.getExpenses();
  
  const totalAmount = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalCount = expenses.length;
  
  // Update total expenses display
  const totalExpensesElement = document.getElementById("totalAmount");
  if (totalExpensesElement) {
    totalExpensesElement.textContent = `€ ${totalAmount.toFixed(2)}`;
  }
  
  // Update total count display
  const totalCountElement = document.getElementById("totalCount");
  if (totalCountElement) {
    totalCountElement.textContent = totalCount.toString();
  }
  
  console.log("Updated totals - Amount:", totalAmount, "Count:", totalCount);
}
function populateBudgetCategoryDropdown(): void {
  if (!categorySelect) return;

  const categories = JSON.parse(localStorage.getItem("categories") || "[]");
  categorySelect.innerHTML = `<option value="">Select Category</option>`;
  
  categories.forEach((cat: { name: string; emoji: string }) => {
    const option = document.createElement("option");
    option.value = cat.name;
    option.textContent = `${cat.emoji} ${capitalize(cat.name)}`;
    categorySelect.appendChild(option);
  });
}

function renderBudgetOverview(): void {
  const container = document.getElementById("budgetOverviewContainer");
  if (!container) return;

  // ✅ Use BudgetManager instead of direct localStorage access
  const monthlyLimit = BudgetManager.getMonthlyLimit();
  const budget = BudgetManager.getBudget();
  const categoryLimits = budget.categoryLimits;
  
  const categories: { name: string; emoji: string }[] = JSON.parse(localStorage.getItem("categories") || "[]");

  // Get only current month expenses
  const currentMonthExpenses = getMonthlyExpenses();
  console.log("Rendering budget with expenses:", currentMonthExpenses);

  let totalSpent = 0;
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });
  
  let html = `<p><strong>📅 Budget for: ${monthName}</strong></p>`;

  // Category budgets
  categories.forEach(cat => {
    const limit = categoryLimits[cat.name] || 0;
    const spent = currentMonthExpenses
      .filter(e => e.category === cat.name)
      .reduce((sum, e) => sum + e.amount, 0);

    totalSpent += spent;

    if (limit > 0) {
      const progress = Math.min(100, (spent / limit) * 100);
      const isOverBudget = spent > limit;
      const progressColor = isOverBudget ? '#e74c3c' : '#3498db';

      html += `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong>${cat.emoji} ${capitalize(cat.name)}</strong>
            <span style="color: ${isOverBudget ? '#e74c3c' : '#2c3e50'};">
             €${spent.toFixed(2)} / €${limit.toFixed(2)}
            </span>
          </div>
          <div style="background-color: #ecf0f1; height: 12px; border-radius: 6px; overflow: hidden;">
            <div style="background-color: ${progressColor}; width: ${progress}%; height: 100%; transition: width 0.3s ease;"></div>
          </div>
          ${isOverBudget ? '<small style="color: #e74c3c;">⚠️ Over budget!</small>' : ''}
        </div>
      `;
    } else if (spent > 0) {
      // Show categories with spending but no budget set
      html += `
        <div style="margin-bottom: 15px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px;">
            <strong>${cat.emoji} ${capitalize(cat.name)}</strong>
            <span style="color: #7f8c8d;">
              ${spent.toFixed(2)} (no budget set)
            </span>
          </div>
        </div>
      `;
    }
  });

  console.log("Total spent this month:", totalSpent);
  console.log("Monthly limit:", monthlyLimit);

  // Overall monthly budget
  if (monthlyLimit > 0) {
    const overallProgress = Math.min(100, (totalSpent / monthlyLimit) * 100);
    const isOverMonthlyBudget = totalSpent > monthlyLimit;
    const overallColor = isOverMonthlyBudget ? '#e74c3c' : '#27ae60';

    html += `
      <div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #ecf0f1;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong>💰 Total Monthly</strong>
          <span style="color: ${isOverMonthlyBudget ? '#e74c3c' : '#2c3e50'}; font-size: 1.1em; font-weight: bold;">
            €${totalSpent.toFixed(2)} / €${monthlyLimit.toFixed(2)}
          </span>
        </div>
        <div style="background-color: #ecf0f1; height: 15px; border-radius: 7px; overflow: hidden; margin-bottom: 5px;">
          <div style="background-color: ${overallColor}; width: ${overallProgress}%; height: 100%; transition: width 0.3s ease;"></div>
        </div>
        ${isOverMonthlyBudget ? '<small style="color: #e74c3c;">⚠️ Monthly budget exceeded!</small>' : 
          `<small style="color: #27ae60;">✅ ${((monthlyLimit - totalSpent) / monthlyLimit * 100).toFixed(1)}% budget remaining</small>`}
      </div>
    `;
  } else {
    html += `<div style="margin-top: 20px; padding-top: 15px; border-top: 2px solid #ecf0f1;">
      <strong>💰 Total Spent This Month: ${totalSpent.toFixed(2)}</strong>
      <br><small style="color: #7f8c8d;">Set a monthly budget to track your spending progress</small>
    </div>`;
  }

  container.innerHTML = html;
}

// Event Listeners
function setupEventListeners(): void {
  // Filter event listeners
  minAmountInput?.addEventListener("input", () => {
    const minLabel = document.getElementById("minAmountValue");
    if (minLabel) minLabel.textContent = `€${minAmountInput.value}`;
    renderExpenses();
  });

  maxAmountInput?.addEventListener("input", () => {
    const maxLabel = document.getElementById("maxAmountValue");
    if (maxLabel) maxLabel.textContent = `€${maxAmountInput.value}`;
    renderExpenses();
  });

  searchInput?.addEventListener("input", renderExpenses);
  dateFromInput?.addEventListener("change", renderExpenses);
  dateToInput?.addEventListener("change", renderExpenses);

  // Clear filters
  document.getElementById("clearFilters")?.addEventListener("click", () => {
    document.querySelectorAll(".category-filter").forEach(el => {
      (el as HTMLInputElement).checked = true;
    });
    if (searchInput) searchInput.value = "";
    if (dateFromInput) dateFromInput.value = "";
    if (dateToInput) dateToInput.value = "";
    renderExpenses();
  });

  /// Find your form submission event listener and update it to include chart updates:
// Look for this section in your setupEventListeners() function:
form?.addEventListener("submit", (e) => {
  e.preventDefault();

  const rawDate = dateInput.value.trim();
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!rawDate || !dateRegex.test(rawDate)) {
    alert("❌ Date must be in format YYYY-MM-DD.");
    return;
  }

  const parsed = new Date(rawDate);
  const formatted = parsed.toISOString().split("T")[0];
  if (formatted !== rawDate) {
    alert("❌ Invalid calendar date.");
    return;
  }

  const expense: Expense = {
    id: `exp_${Date.now()}`,
    amount: parseFloat(amountInput.value),
    category: categoryInput.value,
    date: rawDate,
    description: descriptionInput.value.trim()
  };

  tracker.addExpense(expense);
  renderExpenses();
  renderBudgetOverview();
  updateTotalSummary();
  ChartManager.updateCharts(); // ✅ ADD THIS LINE
  form.reset();
});


  // Budget event listeners
  saveMonthlyBudgetBtn?.addEventListener("click", () => {
    const value = parseFloat(monthlyBudgetInput.value);
    if (!isNaN(value) && value >= 0) {
      BudgetManager.setMonthlyLimit(value);
      renderBudgetOverview();
      alert(`✅ Monthly budget set to €${value.toFixed(2)}`);
    } else {
      alert("❌ Please enter a valid number");
    }
  });

  saveCategoryBudgetBtn?.addEventListener("click", () => {
    const category = categorySelect.value;
    const limit = parseFloat(categoryBudgetInput.value);

    if (!category) {
      alert("❌ Please select a category");
      return;
    }

    if (isNaN(limit) || limit < 0) {
      alert("❌ Please enter a valid budget amount");
      return;
    }

    BudgetManager.setCategoryLimit(category, limit);
    renderBudgetOverview();
    populateBudgetCategoryDropdown(); // Refresh dropdown
    
    // Clear inputs
    categorySelect.value = "";
    categoryBudgetInput.value = "";
    
    alert(`✅ Budget set for ${capitalize(category)}: €${limit.toFixed(2)}`);
  });

  // Export & Import Logic
  document.getElementById("exportData")?.addEventListener("click", () => {
    const data = {
      expenses: tracker.getExpenses(),
      categories: localStorage.getItem("categories"),
      categoryLimits: localStorage.getItem("categoryLimits"),
      monthlyLimit: localStorage.getItem("monthlyLimit")
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `expense_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  });

  document.getElementById("importData")?.addEventListener("click", () => {
    const fileInput = document.getElementById("importFile") as HTMLInputElement;
    fileInput.click();

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      // Find your import data section and add chart updates there too:
// Look for this in your setupEventListeners() function and add the chart update:
reader.onload = () => {
  try {
    const data = JSON.parse(reader.result as string);
    if (!data || typeof data !== "object") throw new Error("Invalid format");

    if (Array.isArray(data.expenses)) {
      localStorage.setItem("expenses", JSON.stringify(data.expenses));
    }

    if (data.categories) {
      const imported = typeof data.categories === "string"
        ? JSON.parse(data.categories)
        : data.categories;
      localStorage.setItem("categories", JSON.stringify(imported));
    }

    if (data.categoryLimits) {
      const imported = typeof data.categoryLimits === "string"
        ? JSON.parse(data.categoryLimits)
        : data.categoryLimits;
      localStorage.setItem("categoryLimits", JSON.stringify(imported));
    }

    if (data.monthlyLimit) {
      localStorage.setItem("monthlyLimit", data.monthlyLimit);
    }

    alert("✅ Import successful!");
    // Update all displays instead of reloading
    renderCategoryFilters();
    renderExpenses();
    populateBudgetCategoryDropdown();
    renderBudgetOverview();
    updateTotalSummary();
    ChartManager.updateCharts(); // ✅ ADD THIS LINE
  } catch (err) {
    alert("❌ Failed to import data. Please check the file format.");
    console.error("Import error:", err);
  }
};

      reader.readAsText(file);
    };
  });
  // Add this new event listener in your setupEventListeners() function:
// Add this after your existing event listeners, before the closing brace:

// Chart Dashboard Toggle
document.getElementById("toggleChartDashboard")?.addEventListener("click", () => {
  ChartManager.toggleDashboard();
});
  

}


// Initialization
function initialize(): void {
  
   
  renderCategoryFilters();
  renderExpenses();
  populateBudgetCategoryDropdown();
  renderBudgetOverview();
  updateTotalSummary(); // ✅ Add this line
  setupEventListeners();
  
}

// Start the application
initialize();