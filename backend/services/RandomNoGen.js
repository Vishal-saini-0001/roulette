function generateRandomNumber(start = 0, end = 60) {
  if (start > end) throw new Error("Start must be less than or equal to end.");
  return Math.floor(Math.random() * (end - start + 1)) + start;
}

module.exports = generateRandomNumber;
