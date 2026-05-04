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

function decryptBlock(matrix, nums, m) {
  return encryptBlock(matrix, nums, m);
}

function encrypt(text, matrix, options = {}) {
  const padChar = options.padChar || 'X';
  const m = options.m || 26;

  const sanitized = sanitizeAZ(text);
  const { text: paddedText, padCount } = padText(sanitized, padChar, 2);
  const blocks = textToBlocks(paddedText);

  const keyMatrix = matrix;
  const rows = [];
  let resultText = '';

  for (const block of blocks) {
    const inputNums = blockToNums(block);
    const outputNums = encryptBlock(keyMatrix, inputNums, m);
    const outputBlock = numsToBlock(outputNums);

    rows.push({
      block,
      inputNums,
      outputNums,
      outputBlock
    });

    resultText += outputBlock;
  }

  const d = det2x2(keyMatrix);
  const dMod = mod(d, m);
  const g = gcd(d, m);
  const dInv = g === 1 ? invMod(d, m) : null;

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      padCount > 0 ? `Padded with ${padCount} "${padChar}"` : 'No padding needed'
    ],
    facts: {
      m,
      keyMatrix: JSON.stringify(keyMatrix),
      det: d,
      detMod26: dMod,
      gcdDet26: g,
      detInvMod26: dInv
    },
    tables: [],
    rows,
    notes: g !== 1 ? ['Warning: Matrix is not invertible - cannot decrypt!'] : [],
    padAdded: padCount
  };

  return { result: resultText, explain };
}

function decrypt(text, matrix, options = {}) {
  const m = options.m || 26;
  const padChar = options.padChar || 'X';
  const stripPadding = options.stripPadding !== undefined ? options.stripPadding : true;
  const padAdded = options.padAdded || 0;

  const sanitized = sanitizeAZ(text);

  const keyMatrix = matrix;
  const invMatrix = invMat2x2Mod(keyMatrix, m);

  const blocks = textToBlocks(sanitized);

  const rows = [];
  let resultText = '';

  for (const block of blocks) {
    const inputNums = blockToNums(block);
    const outputNums = decryptBlock(invMatrix, inputNums, m);
    const outputBlock = numsToBlock(outputNums);

    rows.push({
      block,
      inputNums,
      outputNums,
      outputBlock
    });

    resultText += outputBlock;
  }

  let padRemoved = 0;
  if (stripPadding && padAdded > 0) {
    const lastChar = resultText.slice(-1);
    if (lastChar === padChar) {
      resultText = resultText.slice(0, -1);
      padRemoved = 1;
    }
  }

  const d = det2x2(keyMatrix);
  const dMod = mod(d, m);
  const g = gcd(d, m);
  const dInv = invMod(d, m);

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      padRemoved > 0 ? `Removed ${padRemoved} padding character` : 'No padding to remove'
    ],
    facts: {
      m,
      keyMatrix: JSON.stringify(keyMatrix),
      inverseMatrix: JSON.stringify(invMatrix),
      det: d,
      detMod26: dMod,
      gcdDet26: g,
      detInvMod26: dInv
    },
    tables: [],
    rows,
    notes: [],
    padRemoved,
    strippedPadding: stripPadding
  };

  return { result: resultText, explain };
}

module.exports = { encrypt, decrypt };