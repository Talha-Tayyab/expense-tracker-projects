// test/validators.test.ts
import { isValidAmount, isValidDate, isValidCategory } from "../src/utils/validators";

describe("Validator Functions", () => {
  test("isValidAmount() - returns true for positive number", () => {
    expect(isValidAmount(100)).toBe(false);
  });

  test("isValidAmount() - returns false for 0 or negative", () => {
    expect(isValidAmount(0)).toBe(false);
    expect(isValidAmount(-10)).toBe(false);
  });

  test("isValidDate() - returns true for valid date string", () => {
    expect(isValidDate("2025-08-04")).toBe(true);
  });

  test("isValidDate() - returns false for invalid date", () => {
    expect(isValidDate("not-a-date")).toBe(false);
  });

  test("isValidCategory() - returns true for non-empty string", () => {
    expect(isValidCategory("Food")).toBe(true);
  });

  test("isValidCategory() - returns false for empty string", () => {
    expect(isValidCategory("")).toBe(false);
    expect(isValidCategory("   ")).toBe(false);
  });
});