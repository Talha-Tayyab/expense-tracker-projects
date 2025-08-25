export class BudgetManager {
    // Load budget config from localStorage
    static getBudget() {
        const data = localStorage.getItem(this.STORAGE_KEY);
        if (data)
            return JSON.parse(data);
        return { monthlyLimit: 0, categoryLimits: {} };
    }
    // Save entire budget config
    static save(budget) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(budget));
    }
    // Set global monthly limit
    static setMonthlyLimit(limit) {
        const budget = this.getBudget();
        budget.monthlyLimit = limit;
        this.save(budget); // ✅ Save back to "budgetConfig"
    }
    // Get global monthly limit
    static getMonthlyLimit() {
        return this.getBudget().monthlyLimit;
    }
    // Set limit for a specific category
    static setCategoryLimit(category, limit) {
        const budget = this.getBudget();
        budget.categoryLimits[category] = limit;
        this.save(budget);
    }
    // Get limit for a specific category
    static getCategoryLimit(category) {
        const budget = this.getBudget();
        return budget.categoryLimits[category] || 0;
    }
    // Clear budget config (optional, for reset)
    static clear() {
        localStorage.removeItem(this.STORAGE_KEY);
    }
}
BudgetManager.STORAGE_KEY = "budgetConfig";
