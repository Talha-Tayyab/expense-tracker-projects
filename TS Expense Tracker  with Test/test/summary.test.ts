import { ExpenseTracker } from "../src/ExpenseTracker";
test("summary total amount", () => {
  const t = new ExpenseTracker();
  t.addExpense({ id: "a", amount: 40, category: "food", date: "2025-08-01", description: "A" });
  t.addExpense({ id: "b", amount: 60, category: "transport", date: "2025-08-02", description: "B" });

  const total = t.getExpenses().reduce((s, e) => s + e.amount, 0);
  expect(total).toBe(100);
});