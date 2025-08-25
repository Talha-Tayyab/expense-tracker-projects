function filterExpenses(expenses, category, minAmount, maxAmount) {
  return expenses.filter(exp => {
    const isInCategory = exp.category === category;
    const isInRange = exp.amount >= minAmount && exp.amount <= maxAmount;
    return isInCategory && isInRange;
  });
}

module.exports = { filterExpenses };