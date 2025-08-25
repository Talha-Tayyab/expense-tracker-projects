const { isValidAmount, isValidDescription } = require('../src/utils/validators');

describe('isValidAmount()', () => {
  test('returns true for valid amount', () => {
    expect(isValidAmount(100)).toBe(true);
  });
  test('returns false for invalid amount', () => {
    expect(isValidAmount(-5)).toBe(false);
  });
});

describe('isValidDescription()', () => {
  test('returns true for valid description', () => {
    expect(isValidDescription('Lunch at cafe')).toBe(true);
  });
  test('returns false for overly long description', () => {
    expect(isValidDescription('a'.repeat(201))).toBe(false);
  });
});
