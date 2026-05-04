const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const encryptBtn = document.getElementById('encrypt-btn');
const decryptBtn = document.getElementById('decrypt-btn');
const copyBtn = document.getElementById('copy-btn');
const keyFactorsContent = document.getElementById('key-factors-content');
const algoSelect = document.getElementById('algo-select');
const errorContainer = document.getElementById('error-container');
const toast = document.getElementById('toast');
const toastMessage = document.getElementById('toast-message');
const sampleBtn = document.getElementById('sample-btn');
const sampleInputBtns = document.querySelectorAll('.samples button');
const stripPaddingCheckbox = document.getElementById('strip-padding');

let currentAlgo = 'hill';
let lastEncryptResult = null;

const SAMPLE_KEY = [[3, 3], [2, 5]];
const ALGO_CONFIGS = {
  hill: {
    name: 'Hill Cipher (2×2)',
    params: ['matrix', 'padChar'],
    hasMatrix: true,
    hasPadChar: true,
    hasShift: false,
    hasKey: false
  },
  caesar: {
    name: 'Caesar Cipher',
    params: ['shift'],
    hasMatrix: false,
    hasPadChar: false,
    hasShift: true,
    hasKey: false
  },
  playfair: {
    name: 'Playfair Cipher',
    params: ['key'],
    hasMatrix: false,
    hasPadChar: false,
    hasShift: false,
    hasKey: true
  },
  vigenere: {
    name: 'Vigenère Cipher',
    params: ['key'],
    hasMatrix: false,
    hasPadChar: false,
    hasShift: false,
    hasKey: true
  }
};

function showError(msg) {
  errorContainer.innerHTML = `<div class="error-message">${msg}</div>`;
}

function clearError() {
  errorContainer.innerHTML = '';
}

function showToast(message) {
  toastMessage.textContent = message;
  toast.classList.add('show');
  setTimeout(() => {
    toast.classList.remove('show');
  }, 2000);
}

function getMatrix() {
  return [
    [parseInt(document.getElementById('m00').value) || 0, parseInt(document.getElementById('m01').value) || 0],
    [parseInt(document.getElementById('m10').value) || 0, parseInt(document.getElementById('m11').value) || 0]
  ];
}

function getPadChar() {
  return document.getElementById('pad-char').value.toUpperCase() || 'X';
}

function getKey() {
  return document.getElementById('key').value.toUpperCase() || 'CIPHER';
}

function getAlgoParams() {
  const config = ALGO_CONFIGS[currentAlgo];
  const params = {};
  if (config.hasMatrix) params.matrix = getMatrix();
  if (config.hasPadChar) params.padChar = getPadChar();
  if (config.hasShift) params.shift = getShift();
  if (config.hasKey) params.key = getKey();
  return params;
}

async function callApi(endpoint) {
  const text = inputText.value;
  if (!text.trim()) {
    throw new Error('Please enter text to encrypt/decrypt');
  }

  const params = getAlgoParams();
  if (endpoint === 'decrypt') {
    params.stripPadding = stripPaddingCheckbox.checked;
    if (lastEncryptResult && lastEncryptResult.explain) {
      params.padAdded = lastEncryptResult.explain.padAdded || 0;
    }
  }

  const response = await fetch(`/api/${currentAlgo}/${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, params })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  if (endpoint === 'encrypt') {
    lastEncryptResult = data;
  }

  return data;
}

function renderKeyFactors(explain) {
  let html = '<ul>';
  for (const item of explain.summary) {
    html += `<li>${item}</li>`;
  }
  html += '</ul>';

  const facts = explain.facts;
  html += '<table>';
  html += `<tr><td>m</td><td>${facts.m}</td></tr>`;

  if (facts.keyMatrix) {
    html += `<tr><td>Key Matrix</td><td>${facts.keyMatrix}</td></tr>`;
    html += `<tr><td>det</td><td>${facts.det}</td></tr>`;
    html += `<tr><td>det mod 26</td><td>${facts.detMod26}</td></tr>`;
    html += `<tr><td>gcd(det, 26)</td><td>${facts.gcdDet26}</td></tr>`;
    const invertible = facts.gcdDet26 === 1 ? 'Yes' : '<span class="warning">No</span>';
    html += `<tr><td>Invertible</td><td>${invertible}</td></tr>`;
    if (facts.detInvMod26) {
      html += `<tr><td>det⁻¹ mod 26</td><td>${facts.detInvMod26}</td></tr>`;
    }
    if (facts.inverseMatrix) {
      html += `<tr><td>Inverse Matrix</td><td>${facts.inverseMatrix}</td></tr>`;
    }
  }

  if (facts.shift !== undefined) {
    html += `<tr><td>Shift</td><td>${facts.shift}</td></tr>`;
  }
  if (facts.key) {
    html += `<tr><td>Key</td><td>${facts.key}</td></tr>`;
    if (facts.keyStream) {
      html += `<tr><td>Key Stream</td><td>${facts.keyStream}</td></tr>`;
    }
    if (facts.pairCount) {
      html += `<tr><td>Pairs</td><td>${facts.pairCount}</td></tr>`;
    }
    if (facts.length) {
      html += `<tr><td>Length</td><td>${facts.length}</td></tr>`;
    }
  }
  html += '</table>';

  if (explain.rows && explain.rows.length > 0) {
    const firstRow = explain.rows[0];
    if (firstRow.block !== undefined) {
      html += '<table>';
      html += '<tr><th>Block</th><th>Input (num)</th><th>Output (num)</th><th>Output</th></tr>';
      for (const row of explain.rows) {
        html += `<tr><td>${row.block}</td><td>[${row.inputNums.join(',')}]</td><td>[${row.outputNums.join(',')}]</td><td>${row.outputBlock}</td></tr>`;
      }
      html += '</table>';
    } else if (firstRow.pair !== undefined) {
      html += '<table>';
      html += '<tr><th>Pair</th><th>Result</th></tr>';
      for (const row of explain.rows) {
        html += `<tr><td>${row.pair}</td><td>${row.result}</td></tr>`;
      }
      html += '</table>';
    } else if (firstRow.keyChar !== undefined) {
      html += '<table>';
      html += '<tr><th>Char</th><th>Key</th><th>Input</th><th>Key Num</th><th>Output</th></tr>';
      for (const row of explain.rows) {
        html += `<tr><td>${row.char}</td><td>${row.keyChar}</td><td>${row.inputNum}</td><td>${row.keyNum}</td><td>${row.outputChar}</td></tr>`;
      }
      html += '</table>';
    } else {
      html += '<table>';
      html += '<tr><th>Char</th><th>Input</th><th>Shift</th><th>Output</th></tr>';
      for (const row of explain.rows) {
        html += `<tr><td>${row.char}</td><td>${row.inputNum}</td><td>${row.shift}</td><td>${row.outputChar}</td></tr>`;
      }
      html += '</table>';
    }
  }

  if (explain.notes && explain.notes.length > 0) {
    html += '<p class="warning">' + explain.notes.join(' ') + '</p>';
  }

  keyFactorsContent.innerHTML = html;
}

function setMatrix(matrix) {
  document.getElementById('m00').value = matrix[0][0];
  document.getElementById('m01').value = matrix[0][1];
  document.getElementById('m10').value = matrix[1][0];
  document.getElementById('m11').value = matrix[1][1];
}

function updateButtonStates() {
  const m00 = parseInt(document.getElementById('m00').value) || 0;
  const m01 = parseInt(document.getElementById('m01').value) || 0;
  const m10 = parseInt(document.getElementById('m10').value) || 0;
  const m11 = parseInt(document.getElementById('m11').value) || 0;
  const det = m00 * m11 - m01 * m10;
  const g = gcd(det, 26);
  const isValid = g === 1;
  encryptBtn.disabled = !isValid;
  decryptBtn.disabled = !isValid;
}

function toggleAlgoFields() {
  const config = ALGO_CONFIGS[currentAlgo];
  document.querySelector('.matrix').parentElement.style.display = config.hasMatrix ? '' : 'none';
  document.getElementById('pad-char-field').style.display = config.hasPadChar ? '' : 'none';
  document.getElementById('shift-field').style.display = config.hasShift ? '' : 'none';
  document.getElementById('key-field').style.display = config.hasKey ? '' : 'none';
  document.getElementById('strip-padding-row').style.display = config.hasPadChar ? '' : 'none';
}

function gcd(a, b) {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const t = b;
    b = a % b;
    a = t;
  }
  return a;
}

algoSelect.addEventListener('change', (e) => {
  currentAlgo = e.target.value;
  clearError();
  outputText.value = '';
  keyFactorsContent.innerHTML = '';
  lastEncryptResult = null;
  toggleAlgoFields();
});

sampleBtn.addEventListener('click', () => {
  inputText.value = 'HELLO';
  setMatrix(SAMPLE_KEY);
updateButtonStates();
toggleAlgoFields();
});

sampleInputBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    inputText.value = btn.dataset.input;
  });
});

['m00', 'm01', 'm10', 'm11'].forEach(id => {
  document.getElementById(id).addEventListener('change', updateButtonStates);
  document.getElementById(id).addEventListener('input', updateButtonStates);
});

updateButtonStates();

encryptBtn.addEventListener('click', async () => {
  clearError();
  const startTime = performance.now();
  try {
    const data = await callApi('encrypt');
    const endTime = performance.now();
    outputText.value = data.result;
    renderKeyFactors(data.explain);
    showToast(`Encrypted in ${(endTime - startTime).toFixed(2)}ms`);
  } catch (err) {
    outputText.value = '';
    showError(err.message);
  }
});

decryptBtn.addEventListener('click', async () => {
  clearError();
  const startTime = performance.now();
  try {
    const data = await callApi('decrypt');
    const endTime = performance.now();
    outputText.value = data.result;
    renderKeyFactors(data.explain);
    showToast(`Decrypted in ${(endTime - startTime).toFixed(2)}ms`);
  } catch (err) {
    outputText.value = '';
    showError(err.message);
  }
});

copyBtn.addEventListener('click', async () => {
  if (!outputText.value) return;
  try {
    await navigator.clipboard.writeText(outputText.value);
    copyBtn.style.background = '#22c55e';
    setTimeout(() => {
      copyBtn.style.background = '';
    }, 1000);
  } catch (err) {
    outputText.select();
    document.execCommand('copy');
  }
});

const swapBtn = document.getElementById('swap-btn');

function swapOutputToInput({ clearOutput = false, switchMode = true } = {}) {
  const out = (outputText.value || '').trim();
  if (!out) {
    showToast('Nothing to swap (output is empty)');
    return;
  }
  inputText.value = out;
  if (clearOutput) outputText.value = '';
  inputText.focus();

  if (switchMode) {
    decryptBtn.classList.add('active');
    encryptBtn.classList.remove('active');
  }
}

swapBtn.addEventListener('click', () => {
  console.log('Swap button clicked');
  swapOutputToInput({
    clearOutput: false,
    switchMode: true
  });
});

document.addEventListener('keydown', (e) => {
  if (e.ctrlKey && e.shiftKey && (e.key === 'S' || e.key === 's')) {
    e.preventDefault();
    swapOutputToInput({ clearOutput: false, switchMode: true });
  }
});