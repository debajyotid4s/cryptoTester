const { sanitizeAZ } = require("../utils/text");

function buildKeyMatrix(key) {
  const alphabet = "ABCDEFGHIKLMNOPQRSTUVWXYZ";
  const keyUpper = key.toUpperCase().replace(/J/g, "I");
  let uniqueChars = "";
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
    matrix.push(uniqueChars.slice(i * 5, i * 5 + 5).split(""));
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
  const sanitized = text
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");
  const pairs = [];
  let i = 0;

  while (i < sanitized.length) {
    let a = sanitized[i];
    let b = null;

    if (i + 1 < sanitized.length) {
      b = sanitized[i + 1];
    }

    if (a === b) {
      pairs.push([a, "X"]);
      i += 1;
    } else if (b !== null) {
      pairs.push([a, b]);
      i += 2;
    } else {
      pairs.push([a, "X"]);
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

function encryptWord(word, matrix) {
  const pairs = prepareText(word);
  const rows = [];
  let resultText = "";

  for (const [a, b] of pairs) {
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);
    const [encA, encB] = encryptPair(matrix, a, b, 1);
    rows.push({
      pair: a + b,
      input: a + b,
      output: encA + encB,
      result: encA + encB,
      inputPositions: [posA, posB],
    });
    resultText += encA + encB;
  }

  return { result: resultText, rows };
}

function decryptWord(word, matrix) {
  const sanitized = word
    .toUpperCase()
    .replace(/J/g, "I")
    .replace(/[^A-Z]/g, "");

  const pairs = [];
  for (let i = 0; i < sanitized.length; i += 2) {
    if (i + 1 < sanitized.length) {
      pairs.push([sanitized[i], sanitized[i + 1]]);
    }
  }

  const rows = [];
  let resultText = "";

  for (const [a, b] of pairs) {
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);
    const [decA, decB] = encryptPair(matrix, a, b, -1);
    rows.push({
      pair: a + b,
      input: a + b,
      output: decA + decB,
      result: decA + decB,
      inputPositions: [posA, posB],
    });
    resultText += decA + decB;
  }

  return { result: resultText, rows };
}

function stripPlayfairPadding(text) {
  let cleaned = "";
  for (let i = 0; i < text.length; i++) {
    if (text[i] === "X" && i > 0 && i < text.length - 1) {
      if (text[i - 1] === text[i + 1]) {
        continue;
      }
    }
    cleaned += text[i];
  }
  cleaned = cleaned.replace(/X$/, "");
  return cleaned;
}

function encrypt(text, options = {}) {
  const key = options.key || "CIPHER";
  const matrix = buildKeyMatrix(key);
  const parts = text.split(/(\s+)/);

  let resultText = "";
  let allRows = [];
  let totalPairs = 0;

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      resultText += part;
    } else if (part.length > 0) {
      const wordResult = encryptWord(part, matrix);
      resultText += wordResult.result;
      allRows = allRows.concat(wordResult.rows);
      totalPairs += wordResult.rows.length;
    }
  }

  const sanitized = sanitizeAZ(text);

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Pairs processed: ${totalPairs}`,
    ],
    facts: {
      key,
      matrix: JSON.stringify(matrix),
      pairCount: totalPairs,
    },
    rows: allRows,
    notes: [],
  };

  return { result: resultText, explain };
}

function decrypt(text, options = {}) {
  const key = options.key || "CIPHER";
  const matrix = buildKeyMatrix(key);
  const parts = text.split(/(\s+)/);

  let resultText = "";
  let allRows = [];
  let totalPairs = 0;

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      resultText += part;
    } else if (part.length > 0) {
      const wordResult = decryptWord(part, matrix);
      const cleaned = stripPlayfairPadding(wordResult.result);
      resultText += cleaned;
      allRows = allRows.concat(wordResult.rows);
      totalPairs += wordResult.rows.length;
    }
  }

  const sanitized = sanitizeAZ(text);

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Key: "${key}"`,
      `Pairs processed: ${totalPairs}`,
    ],
    facts: {
      key,
      matrix: JSON.stringify(matrix),
      pairCount: totalPairs,
    },
    rows: allRows,
    notes: [],
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };
