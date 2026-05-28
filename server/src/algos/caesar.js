const { mod } = require('../utils/math');
const { sanitizeAZ, charToNumAZ, numToCharAZ } = require('../utils/text');

function processText(text, shift, direction) {
  const m = 26;
  const rows = [];
  let resultText = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char >= 'A' && char <= 'Z') {
      const inputNum = charToNumAZ(char);
      const outputNum = mod(inputNum + direction * shift, m);
      const outputChar = numToCharAZ(outputNum);

      rows.push({ char, inputNum, shift, outputNum, outputChar });
      resultText += outputChar;
    } else if (/\s/.test(char)) {
      resultText += char;
    }
  }

  return { resultText, rows };
}

function encrypt(text, options = {}) {
  const shift = options.shift || 3;
  const { resultText, rows } = processText(text, shift, 1);
  const sanitized = sanitizeAZ(text);

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Shift: ${shift}`
    ],
    facts: { m: 26, shift },
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

function decrypt(text, options = {}) {
  const shift = options.shift || 3;
  const { resultText, rows } = processText(text, shift, -1);
  const sanitized = sanitizeAZ(text);

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Shift: ${shift}`
    ],
    facts: { m: 26, shift },
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };
