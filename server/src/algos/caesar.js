const { mod } = require('../utils/math');
const { sanitizeAZ, charToNumAZ, numToCharAZ } = require('../utils/text');

function encrypt(text, options = {}) {
  const shift = options.shift || 3;
  const m = options.m || 26;

  const sanitized = sanitizeAZ(text);

  const rows = [];
  let resultText = '';

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const inputNum = charToNumAZ(char);
    const outputNum = mod(inputNum + shift, m);
    const outputChar = numToCharAZ(outputNum);

    rows.push({
      char,
      inputNum,
      shift,
      outputNum,
      outputChar
    });

    resultText += outputChar;
  }

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Shift: ${shift}`
    ],
    facts: {
      m,
      shift
    },
    tables: [],
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

function decrypt(text, options = {}) {
  const shift = options.shift || 3;
  const m = options.m || 26;

  const sanitized = sanitizeAZ(text);

  const rows = [];
  let resultText = '';

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const inputNum = charToNumAZ(char);
    const outputNum = mod(inputNum - shift, m);
    const outputChar = numToCharAZ(outputNum);

    rows.push({
      char,
      inputNum,
      shift,
      outputNum,
      outputChar
    });

    resultText += outputChar;
  }

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Shift: ${shift}`
    ],
    facts: {
      m,
      shift
    },
    tables: [],
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };