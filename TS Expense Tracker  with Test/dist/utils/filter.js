export function filterByCategory(expenses, category) {
    return expenses.filter(exp => exp.category === category);
}
export function filterByAmountRange(expenses, min, max) {
    return expenses.filter(exp => exp.amount >= min && exp.amount <= max);
}
