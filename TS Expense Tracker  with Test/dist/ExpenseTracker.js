export class ExpenseTracker {
    constructor() {
        this.expenses = [];
        this.loadExpenses();
    }
    loadExpenses() {
        const data = localStorage.getItem("expenses");
        if (data) {
            this.expenses = JSON.parse(data);
        }
    }
    saveExpenses() {
        localStorage.setItem("expenses", JSON.stringify(this.expenses));
    }
    addExpense(expense) {
        this.expenses.unshift(expense);
        this.saveExpenses();
    }
    deleteExpense(id) {
        this.expenses = this.expenses.filter(exp => exp.id !== id);
        this.saveExpenses();
    }
    getExpenses() {
        return this.expenses;
    }
    getTotal() {
        return this.expenses.reduce((total, expense) => total + expense.amount, 0);
    }
}
