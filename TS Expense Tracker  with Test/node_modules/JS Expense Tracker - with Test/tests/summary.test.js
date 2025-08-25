const { getExpenseSummary } = require('../src/utils/summary');

describe('getExpenseSummary()', () => {
  test('calculates total amount and count', () => {
    const expenses = [{ amount: 10 }, { amount: 25 }, { amount: 40 }];
    const summary = getExpenseSummary(expenses);
    expect(summary.totalAmount).toBe(75);
    expect(summary.count).toBe(3);
  });
});