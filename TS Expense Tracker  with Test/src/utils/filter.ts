// src/filter.ts
import { Expense } from "../types/interfaces";

export function filterByCategory(expenses: Expense[], category: string): Expense[] {
  return expenses.filter(exp => exp.category === category);
}

export function filterByAmountRange(expenses: Expense[], min: number, max: number): Expense[] {
  return expenses.filter(exp => exp.amount >= min && exp.amount <= max);
}