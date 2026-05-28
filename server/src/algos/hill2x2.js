const { mod, gcd, invMod } = require('../utils/math');
const { sanitizeAZ, charToNumAZ, numToCharAZ } = require('../utils/text');

function det2x2(A) {
  return A[0][0] * A[1][1] - A[0][1] * A[1][0];
}

function invMat2x2Mod(A, m) {
  const d = det2x2(A);
  const dMod = mod(d, m);
  const g = gcd(d, m);

  if (g !== 1) {
    throw new Error(`Matrix is not invertible: det=${d}, gcd(det,${m})=${g}`);
  }

  const dInv = invMod(d, m);

  const adj = [
    [mod(A[1][1], m), mod(-A[0][1], m)],
    [mod(-A[1][0], m), mod(A[0][0], m)]
  ];

  return [
    [mod(dInv * adj[0][0], m), mod(dInv * adj[0][1], m)],
    [mod(dInv * adj[1][0], m), mod(dInv * adj[1][1], m)]
  ];
}

function textToBlocks(text) {
  const blocks = [];
  for (let i = 0; i < text.length; i += 2) {
    blocks.push(text.slice(i, i + 2));
  }
  return blocks;
}

function padText(text, padChar, blockSize) {
  const padCount = blockSize - (text.length % blockSize);
  if (padCount === blockSize) {
    return { text, padCount: 0 };
  }
  return {
    text: text + padChar.repeat(padCount),
    padCount
  };
}

function blockToNums(block) {
  const nums = [];
  for (let i = 0; i < block.length; i++) {
    nums.push(charToNumAZ(block[i]));
  }
  while (nums.length < 2) {
    nums.push(0);
  }
  return nums;
}

function numsToBlock(nums) {
  let result = '';
  for (let i = 0; i < nums.length; i++) {
    result += numToCharAZ(nums[i]);
  }
  return result;
}

function encryptBlock(matrix, nums, m) {
  return [
    mod(matrix[0][0] * nums[0] + matrix[0][1] * nums[1], m),
    mod(matrix[1][0] * nums[0] + matrix[1][1] * nums[1], m)
  ];
}

function encryptWord(word, matrix, padChar, m) {
  const sanitized = sanitizeAZ(word);
  const { text: paddedText, padCount } = padText(sanitized, padChar, 2);
  const blocks = textToBlocks(paddedText);

  const rows = [];
  let resultText = '';

  for (const block of blocks) {
    const inputNums = blockToNums(block);
    const outputNums = encryptBlock(matrix, inputNums, m);
    const outputBlock = numsToBlock(outputNums);

    rows.push({
      block,
      inputNums,
      outputNums,
      outputBlock
    });

    resultText += outputBlock;
  }

  return { result: resultText, rows, padCount };
}

function decryptWord(word, invMatrix, m) {
  const sanitized = sanitizeAZ(word);
  const blocks = textToBlocks(sanitized);

  const rows = [];
  let resultText = '';

  for (const block of blocks) {
    const inputNums = blockToNums(block);
    const outputNums = encryptBlock(invMatrix, inputNums, m);
    const outputBlock = numsToBlock(outputNums);

    rows.push({
      block,
      inputNums,
      outputNums,
      outputBlock
    });

    resultText += outputBlock;
  }

  return { result: resultText, rows };
}

function encrypt(text, matrix, options = {}) {
  const padChar = options.padChar || 'X';
  const m = options.m || 26;
  const parts = text.split(/(\s+)/);

  let resultText = '';
  let allRows = [];
  let padAddedPerWord = [];

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      resultText += part;
    } else if (part.length > 0) {
      const wordResult = encryptWord(part, matrix, padChar, m);
      resultText += wordResult.result;
      allRows = allRows.concat(wordResult.rows);
      padAddedPerWord.push(wordResult.padCount);
    }
  }

  const totalPadAdded = padAddedPerWord.reduce((s, v) => s + v, 0);
  const d = det2x2(matrix);
  const dMod = mod(d, m);
  const g = gcd(d, m);
  const dInv = g === 1 ? invMod(d, m) : null;

  const explain = {
    summary: [
      `Sanitized input: "${sanitizeAZ(text)}"`,
      totalPadAdded > 0 ? `Padded with ${totalPadAdded} "${padChar}" total across words` : 'No padding needed'
    ],
    facts: {
      m,
      keyMatrix: JSON.stringify(matrix),
      det: d,
      detMod26: dMod,
      gcdDet26: g,
      detInvMod26: dInv
    },
    rows: allRows,
    notes: g !== 1 ? ['Warning: Matrix is not invertible - cannot decrypt!'] : [],
    padAdded: totalPadAdded,
    padAddedPerWord
  };

  return { result: resultText, explain };
}

function decrypt(text, matrix, options = {}) {
  const m = options.m || 26;
  const padChar = options.padChar || 'X';
  const stripPadding = options.stripPadding !== undefined ? options.stripPadding : true;
  const padAddedPerWord = options.padAddedPerWord;

  const invMatrix = invMat2x2Mod(matrix, m);
  const parts = text.split(/(\s+)/);

  let resultText = '';
  let allRows = [];
  let padRemoved = 0;
  let wordIndex = 0;

  for (const part of parts) {
    if (/^\s+$/.test(part)) {
      resultText += part;
    } else if (part.length > 0) {
      const wordResult = decryptWord(part, invMatrix, m);
      let wordText = wordResult.result;

      const shouldStrip = stripPadding && (
        padAddedPerWord
          ? padAddedPerWord[wordIndex] > 0
          : false
      );

      if (shouldStrip) {
        const lastChar = wordText.slice(-1);
        if (lastChar === padChar) {
          wordText = wordText.slice(0, -1);
          padRemoved++;
        }
      }

      resultText += wordText;
      allRows = allRows.concat(wordResult.rows);
      wordIndex++;
    }
  }

  const d = det2x2(matrix);
  const dMod = mod(d, m);
  const g = gcd(d, m);
  const dInv = invMod(d, m);

  const explain = {
    summary: [
      `Sanitized input: "${sanitizeAZ(text)}"`,
      padRemoved > 0 ? `Removed ${padRemoved} padding character(s)` : 'No padding to remove'
    ],
    facts: {
      m,
      keyMatrix: JSON.stringify(matrix),
      inverseMatrix: JSON.stringify(invMatrix),
      det: d,
      detMod26: dMod,
      gcdDet26: g,
      detInvMod26: dInv
    },
    rows: allRows,
    notes: [],
    padRemoved,
    strippedPadding: stripPadding
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };
