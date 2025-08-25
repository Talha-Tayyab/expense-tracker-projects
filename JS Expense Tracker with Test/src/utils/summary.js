function getExpenseSummary(expenses) {
  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);
  const count = expenses.length;
  return { totalAmount, count };
}

module.exports = { getExpenseSummary };