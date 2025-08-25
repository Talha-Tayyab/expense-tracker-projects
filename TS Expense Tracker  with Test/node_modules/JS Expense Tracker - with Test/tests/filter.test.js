const { filterExpenses } = require('../src/utils/filter');
describe('filterExpenses()', () => {
  test('filters by category and amount range', () => {
    const expenses = [
      { category: 'Food', amount: 10 },
      { category: 'Food', amount: 50 },
      { category: 'Travel', amount: 30 }
    ];
    const result = filterExpenses(expenses, 'Food', 0, 20);
    expect(result).toEqual([{ category: 'Food', amount: 10 }]);
  });
});