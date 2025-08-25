import { Expense } from "./types/interfaces";

export class ExpenseTracker {
  private expenses: Expense[] = [];

  constructor() {
    this.loadExpenses();
  }

  private loadExpenses(): void {
    const data = localStorage.getItem("expenses");
    if (data) {
      this.expenses = JSON.parse(data);
    }
  }

  private saveExpenses(): void {
    localStorage.setItem("expenses", JSON.stringify(this.expenses));
  }
  

  public addExpense(expense: Expense): void {
    this.expenses.unshift(expense);
    this.saveExpenses();
  }

  public deleteExpense(id: string): void {
    this.expenses = this.expenses.filter(exp => exp.id !== id);
    this.saveExpenses();
  }

  public getExpenses(): Expense[] {
    return this.expenses;
  }
  public getTotal(): number {
    return this.expenses.reduce((total, expense) => total + expense.amount, 0);
  } 
}