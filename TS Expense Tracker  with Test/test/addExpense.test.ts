
import { ExpenseTracker} from "../src/ExpenseTracker";
describe ("addExpense",() => {
    test("add one expense", () => {
        const tracker = new ExpenseTracker();
        const e= { id :"1", amount: 50, date: "2025-08-04", category: "food", description: "Lunch" };
    tracker.addExpense(e);
    const all =tracker.getExpenses();
    expect(all.length).toBe(1);
    expect(all[0].amount).toBe(999);
    });
});
