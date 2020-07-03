function maskify(inputString = '', options = {}) {
  // Default options
  const {
    maskSymbol = '#',
    matchPattern = /^\d+$/,
    visibleCharsStart = 1,
    visibleCharsEnd = 4,
    minChars = 6
  } = options;

  // Skip e.g. short credit card numbers or empty strings
  if (inputString.length < minChars) {
    return inputString;
  }

  const startChars = inputString.substr(0, visibleCharsStart);
  const endChars = visibleCharsEnd ? inputString.slice(-visibleCharsEnd) : '';
  const charsToMask = visibleCharsEnd ? inputString.slice(visibleCharsStart, -visibleCharsEnd)
    : inputString.slice(visibleCharsStart);
  console.log(startChars, charsToMask, endChars);

  const maskedChars = charsToMask.split('').map(char => {
    const output = matchPattern.test(char) ? maskSymbol : char;
    return output;
  });

  const maskedString = [
    startChars,
    ...maskedChars,
    endChars
  ].join('');

  return maskedString;
}

module.exports = maskify;
