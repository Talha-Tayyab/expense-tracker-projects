function generateCategoryId(name) {
  return name.trim().toLowerCase().replace(/\s+/g, '-');
}

module.exports = { generateCategoryId };