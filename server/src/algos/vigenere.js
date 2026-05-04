const { mod } = require('../utils/math');
const { sanitizeAZ, charToNumAZ, numToCharAZ } = require('../utils/text');

function generateKeyStream(text, key) {
  const sanitizedKey = key.toUpperCase().replace(/[^A-Z]/g, '');
  let keyStream = '';
  let keyIndex = 0;

  for (const char of text) {
    if (char >= 'A' && char <= 'Z') {
      keyStream += sanitizedKey[keyIndex % sanitizedKey.length];
      keyIndex++;
    }
  }

  return keyStream;
}

function encrypt(text, options = {}) {
  const key = options.key || 'KEY';
  const sanitized = sanitizeAZ(text);
  const keyStream = generateKeyStream(sanitized, key);

  const rows = [];
  let resultText = '';

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const keyChar = keyStream[i];
    const inputNum = charToNumAZ(char);
    const keyNum = charToNumAZ(keyChar);
    const shift = keyNum;
    const outputNum = mod(inputNum + shift, 26);
    const outputChar = numToCharAZ(outputNum);

    rows.push({
      char,
      keyChar,
      inputNum,
      keyNum,
      outputNum,
      outputChar
    });

    resultText += outputChar;
  }

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Key stream: "${keyStream}"`
    ],
    facts: {
      key,
      keyStream,
      length: sanitized.length
    },
    tables: [],
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

function decrypt(text, options = {}) {
  const key = options.key || 'KEY';
  const sanitized = sanitizeAZ(text);
  const keyStream = generateKeyStream(sanitized, key);

  const rows = [];
  let resultText = '';

  for (let i = 0; i < sanitized.length; i++) {
    const char = sanitized[i];
    const keyChar = keyStream[i];
    const inputNum = charToNumAZ(char);
    const keyNum = charToNumAZ(keyChar);
    const shift = keyNum;
    const outputNum = mod(inputNum - shift, 26);
    const outputChar = numToCharAZ(outputNum);

    rows.push({
      char,
      keyChar,
      inputNum,
      keyNum,
      shift,
      outputNum,
      outputChar
    });

    resultText += outputChar;
  }

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Key stream: "${keyStream}"`
    ],
    facts: {
      key,
      keyStream,
      length: sanitized.length
    },
    tables: [],
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };