import { ExpenseTracker } from "../src/ExpenseTracker";
import { Expense } from "../src/types/interfaces";

// Mock localStorage for testing
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    clear: () => { store = {}; },
    removeItem: (key: string) => { delete store[key]; },
  };
})();

Object.defineProperty(global, "localStorage", { value: localStorageMock });

describe("ExpenseTracker", () => {
  let tracker: ExpenseTracker;

  beforeEach(() => {
    localStorage.clear();
    tracker = new ExpenseTracker();
  });

  test("should add expenses and return correct list", () => {
    const expense: Expense = {
      id: "1",
      amount: 50,
      category: "food",
      date: "2025-08-04",
      description: "Lunch",
    };
    tracker.addExpense(expense);

    const allExpenses = tracker.getExpenses();
    expect(allExpenses.length).toBe(1);
    expect(allExpenses[0].description).toBe("Lunch");
  });

  test("should delete the correct expense", () => {
    const expense1: Expense = { id: "1", amount: 10, category: "food", date: "2025-08-04", description: "A" };
    const expense2: Expense = { id: "2", amount: 20, category: "shopping", date: "2025-08-04", description: "B" };
    tracker.addExpense(expense1);
    tracker.addExpense(expense2);

    tracker.deleteExpense("1");

    const result = tracker.getExpenses();
    expect(result.length).toBe(1);
    expect(result[0].id).toBe("2");
  });
});