function sanitizeAZ(text) {
  return text.toUpperCase().replace(/[^A-Z]/g, '');
}

function charToNumAZ(char) {
  const code = char.charCodeAt(0);
  if (code < 65 || code > 90) {
    throw new Error(`Invalid character: ${char}. Must be A-Z.`);
  }
  return code - 65;
}

function numToCharAZ(num) {
  const n = ((num % 26) + 26) % 26;
  return String.fromCharCode(n + 65);
}

module.exports = { sanitizeAZ, charToNumAZ, numToCharAZ };