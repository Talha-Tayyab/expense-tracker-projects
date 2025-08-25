// testig filter.ts
// src/validators.ts
export function isValidAmount(amount) {
    return amount > 0;
}
export function isValidDate(date) {
    return !isNaN(Date.parse(date));
}
export function isValidCategory(category) {
    return category.trim().length > 0;
}
