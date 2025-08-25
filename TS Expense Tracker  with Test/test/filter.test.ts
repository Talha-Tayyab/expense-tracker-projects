import { filterByCategory, filterByAmountRange } from "../src/utils/filter";
import { Expense } from "../src/types/interfaces";

const mockExpenses: Expense[] = [
  { id: "1", amount: 10, date: "2025-08-01", description: "Apple", category: "food" },
  { id: "2", amount: 50, date: "2025-08-02", description: "Shirt", category: "shopping" },
  { id: "3", amount: 30, date: "2025-08-03", description: "Bread", category: "food" }
];

describe("Filter Functions", () => {
  test("filterByCategory() - returns only food", () => {
    const result = filterByCategory(mockExpenses, "food");
    expect(result).toHaveLength(2);
    expect(result.every(exp => exp.category === "food")).toBe(true);
  });

  test("filterByAmountRange() - returns expenses in range 20 to 60", () => {
    const result = filterByAmountRange(mockExpenses, 20, 60);
    expect(result).toHaveLength(2);
    expect(result.map(exp => exp.amount)).toEqual(expect.arrayContaining([30, 50]));
  });
});