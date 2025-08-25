function isValidAmount(amount) {
  return typeof amount === 'number' && amount > 0 && amount <= 1000000;
}

function isValidDescription(description) {
  return typeof description === 'string' && description.length <= 200;
}

module.exports = {
  isValidAmount,
  isValidDescription
};