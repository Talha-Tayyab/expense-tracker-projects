const { generateCategoryId } = require('../src/utils/category');

describe('generateCategoryId()', () => {
  test('trims spaces, lowercases, and replaces spaces with dashes', () => {
    expect(generateCategoryId('  Food and Drink  ')).toBe('food-and-drink');
  });

  test('handles single word correctly', () => {
    expect(generateCategoryId('Food')).toBe('food');
  });

  test('handles multiple spaces between words', () => {
    expect(generateCategoryId('Food    And   Drink')).toBe('food-and-drink');
  });
});