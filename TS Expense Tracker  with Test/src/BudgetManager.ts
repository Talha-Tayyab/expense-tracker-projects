import { BudgetConfig } from "./types/interfaces";

export class BudgetManager {
  private static readonly STORAGE_KEY = "budgetConfig";

  // Load budget config from localStorage
  static getBudget(): BudgetConfig {
    const data = localStorage.getItem(this.STORAGE_KEY);
    if (data) return JSON.parse(data);
    return { monthlyLimit: 0, categoryLimits: {} };
  }

  // Save entire budget config
  static save(budget: BudgetConfig): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(budget));
  }

  // Set global monthly limit
static setMonthlyLimit(limit: number): void {
  const budget = this.getBudget();
  budget.monthlyLimit = limit;
  this.save(budget);
}

  // Get global monthly limit
  static getMonthlyLimit(): number {
    return this.getBudget().monthlyLimit;
  }

  // Set limit for a specific category
  static setCategoryLimit(category: string, limit: number): void {
    const budget = this.getBudget();
    budget.categoryLimits[category] = limit;
    this.save(budget);
  }

  // Get limit for a specific category
  static getCategoryLimit(category: string): number {
    const budget = this.getBudget();
    return budget.categoryLimits[category] || 0;
  }

  // Clear budget config (optional, for reset)
  static clear(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }
  
}