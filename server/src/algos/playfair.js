const { sanitizeAZ, charToNumAZ, numToCharAZ } = require('../utils/text');

function buildKeyMatrix(key) {
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ';
  const keyUpper = key.toUpperCase().replace(/J/g, 'I');
  let uniqueChars = '';
  const seen = new Set();

  for (const char of keyUpper) {
    if (!seen.has(char)) {
      seen.add(char);
      uniqueChars += char;
    }
  }

  for (const char of alphabet) {
    if (!seen.has(char)) {
      uniqueChars += char;
    }
  }

  const matrix = [];
  for (let i = 0; i < 5; i++) {
    matrix.push(uniqueChars.slice(i * 5, i * 5 + 5).split(''));
  }

  return matrix;
}

function findPosition(matrix, char) {
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 5; col++) {
      if (matrix[row][col] === char) {
        return { row, col };
      }
    }
  }
  return null;
}

function prepareText(text) {
  const sanitized = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const pairs = [];
  let i = 0;

  while (i < sanitized.length) {
    let a = sanitized[i];
    let b = null;

    if (i + 1 < sanitized.length) {
      b = sanitized[i + 1];
    }

    if (a === b) {
      pairs.push([a, 'X']);
      i += 1;
    } else if (b !== null) {
      pairs.push([a, b]);
      i += 2;
    } else {
      pairs.push([a, 'X']);
      i += 1;
    }
  }

  return pairs;
}

function encryptPair(matrix, a, b, operation) {
  const posA = findPosition(matrix, a);
  const posB = findPosition(matrix, b);

  let rowA = posA.row;
  let colA = posA.col;
  let rowB = posB.row;
  let colB = posB.col;

  if (rowA === rowB) {
    colA = (colA + operation + 5) % 5;
    colB = (colB + operation + 5) % 5;
  } else if (colA === colB) {
    rowA = (rowA + operation + 5) % 5;
    rowB = (rowB + operation + 5) % 5;
  } else {
    const temp = colA;
    colA = colB;
    colB = temp;
  }

  return [matrix[rowA][colA], matrix[rowB][colB]];
}

function encrypt(text, options = {}) {
  const key = options.key || 'CIPHER';
  const matrix = buildKeyMatrix(key);
  const pairs = prepareText(text);

  const rows = [];
  let resultText = '';

  for (const [a, b] of pairs) {
    const [encA, encB] = encryptPair(matrix, a, b, 1);
    rows.push({ pair: a + b, result: encA + encB });
    resultText += encA + encB;
  }

  const explain = {
    summary: [
      `Sanitized input: "${text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '')}"`,
      `Key: "${key}"`,
      `Pairs processed: ${pairs.length}`
    ],
    facts: {
      key,
      matrix: JSON.stringify(matrix),
      pairCount: pairs.length
    },
    tables: [],
    rows,
    notes: []
  };

  return { result: resultText, explain };
}

function decrypt(text, options = {}) {
  const key = options.key || 'CIPHER';
  const matrix = buildKeyMatrix(key);
  const sanitized = text.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');

  const pairs = [];
  for (let i = 0; i < sanitized.length; i += 2) {
    if (i + 1 < sanitized.length) {
      pairs.push([sanitized[i], sanitized[i + 1]]);
    }
  }

  const rows = [];
  let resultText = '';

  for (const [a, b] of pairs) {
    const [decA, decB] = encryptPair(matrix, a, b, -1);
    rows.push({ pair: a + b, result: decA + decB });
    resultText += decA + decB;
  }

  let cleaned = '';
  for (let i = 0; i < resultText.length; i++) {
    if (resultText[i] === 'X' && i > 0 && i < resultText.length - 1) {
      if (resultText[i - 1] === resultText[i + 1]) {
        continue;
      }
    }
    cleaned += resultText[i];
  }

  cleaned = cleaned.replace(/X$/, '');

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Pairs processed: ${pairs.length}`
    ],
    facts: {
      key,
      matrix: JSON.stringify(matrix),
      pairCount: pairs.length
    },
    tables: [],
    rows,
    notes: []
  };

  return { result: cleaned, explain };
}

module.exports = { encrypt, decrypt };