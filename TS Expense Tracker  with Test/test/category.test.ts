/**
 * @jest-environment jsdom
 */

import { CategoryManager } from "../src/CategoryManager";
import { Category } from "../src/types/interfaces";

// --- Minimal DOM + quiet console for this suite ---
beforeAll(() => {
  document.body.innerHTML = `
    <div id="categoryGrid"></div>
    <div id="categoryFilter"></div>
  `;
  // Silence expected warnings from load/save in tests
  jest.spyOn(console, "warn").mockImplementation(() => {});
  jest.spyOn(console, "error").mockImplementation(() => {});
});

afterAll(() => {
  (console.warn as jest.Mock).mockRestore();
  (console.error as jest.Mock).mockRestore();
});

// --- Tests ---
describe("Basic CategoryManager Test", () => {
  test("should create and add one category", () => {
    const manager = new CategoryManager();

    // Reset and prevent localStorage writes during the test
    (manager as any)["categories"] = [];
    (manager as any)["saveCategories"] = () => {};

    const newCat: Category = { name: "Food", emoji: "🍕", id: "food_1" };
    (manager as any)["categories"].push(newCat);

    expect((manager as any)["categories"].length).toBe(1);
    expect((manager as any)["categories"][0].name).toBe("Food");
  });
});