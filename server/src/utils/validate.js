function requireString(x, fieldName) {
  if (x === undefined || x === null) {
    throw new Error(`${fieldName} is required`);
  }
  if (typeof x !== 'string') {
    throw new Error(`${fieldName} must be a string`);
  }
  if (x.trim().length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  return x;
}

function require2x2Matrix(x, fieldName) {
  if (!Array.isArray(x) || x.length !== 2 || !Array.isArray(x[0]) || !Array.isArray(x[1])) {
    throw new Error(`${fieldName} must be a 2x2 matrix [[a,b],[c,d]]`);
  }
  if (x[0].length !== 2 || x[1].length !== 2) {
    throw new Error(`${fieldName} must be a 2x2 matrix [[a,b],[c,d]]`);
  }
  for (let i = 0; i < 2; i++) {
    for (let j = 0; j < 2; j++) {
      if (typeof x[i][j] !== 'number' || !Number.isInteger(x[i][j])) {
        throw new Error(`${fieldName} must contain only integers`);
      }
    }
  }
  return x;
}

function requirePadCharAZ(x) {
  if (x === undefined || x === null || x === '') {
    return 'X';
  }
  if (typeof x !== 'string' || x.length !== 1) {
    throw new Error('padChar must be a single A-Z character');
  }
  const code = x.toUpperCase().charCodeAt(0);
  if (code < 65 || code > 90) {
    throw new Error('padChar must be A-Z');
  }
  return x.toUpperCase();
}

module.exports = { requireString, require2x2Matrix, requirePadCharAZ };