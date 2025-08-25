const { addExpenseToList } = require('../src/utils/expenses');
describe('addExpenseToList() failing test', () => {
  test('fails on purpose', () => {
    const start = [
      { id: 'e0', amount: 5, category: 'food', date: '2025-08-01' }
    ];
    const e1 = { id: 'e1', amount: 12.5, category: 'food', date: '2025-08-12' };

    const next = addExpenseToList(start, e1);

    // This will fail because length is actually 2, not 99
    expect(next.length).toBe(2);
  });
});