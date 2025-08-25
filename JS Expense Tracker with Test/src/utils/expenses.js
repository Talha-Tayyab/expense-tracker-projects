function addExpenseToList(list, expense) {
  if (!Array.isArray(list)) throw new Error('list must be an array');
  if (!expense || typeof expense !== 'object') throw new Error('expense must be an object');
  const { id, amount, category, date } = expense;
  if (!id || typeof amount !== 'number' || !category || !date) {
    throw new Error('expense is missing required fields');
  }
  return [expense, ...list]; // prepend immutably
}
module.exports = { addExpenseToList };