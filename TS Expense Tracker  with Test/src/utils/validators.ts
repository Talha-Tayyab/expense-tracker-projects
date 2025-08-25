// testig filter.ts
// src/validators.ts
export function isValidAmount(amount: number): boolean {
  return amount > 0;
}

export function isValidDate(date: string): boolean {
  return !isNaN(Date.parse(date));
}

export function isValidCategory(category: string): boolean {
  return category.trim().length > 0;
}
