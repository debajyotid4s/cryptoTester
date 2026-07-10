const MAX_TEXT_LENGTH = 100;

function requireString(x, fieldName, maxLength = MAX_TEXT_LENGTH) {
  if (x === undefined || x === null) {
    throw new Error(`${fieldName} is required`);
  }
  if (typeof x !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  if (x.trim().length === 0) {
    throw new Error(`${fieldName} cannot be empty`);
  }
  if (x.length > maxLength) {
    throw new Error(`${fieldName} must be at most ${maxLength} characters`);
  }
  return x;
}

function requirePositiveInt(x, fieldName) {
  if (x === undefined || x === null) {
    throw new Error(`${fieldName} is required`);
  }
  if (typeof x !== "number" || !Number.isInteger(x) || x < 1) {
    throw new Error(`${fieldName} must be a positive integer`);
  }
  return x;
}

function requireOptionalPositiveInt(x, fieldName) {
  if (x === undefined || x === null) return undefined;
  return requirePositiveInt(x, fieldName);
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
      if (typeof x[i][j] !== "number" || !Number.isInteger(x[i][j])) {
        throw new Error(`${fieldName} must contain only integers`);
      }
    }
  }
  return x;
}

function requirePadCharAZ(x) {
  if (x === undefined || x === null || x === "") {
    return "X";
  }
  if (typeof x !== "string" || x.length !== 1) {
    throw new Error("padChar must be a single A-Z character");
  }
  const code = x.toUpperCase().charCodeAt(0);
  if (code < 65 || code > 90) {
    throw new Error("padChar must be A-Z");
  }
  return x.toUpperCase();
}

function requireKey(x, fieldName, defaultVal = "CIPHER") {
  if (x === undefined || x === null || x === "") {
    return defaultVal;
  }
  if (typeof x !== "string") {
    throw new Error(`${fieldName} must be a string`);
  }
  const sanitized = x.toUpperCase().replace(/[^A-Z]/g, "");
  if (sanitized.length === 0) {
    throw new Error(`${fieldName} must contain at least one letter`);
  }
  if (sanitized.length > MAX_TEXT_LENGTH) {
    throw new Error(`${fieldName} must be at most ${MAX_TEXT_LENGTH} characters`);
  }
  return sanitized;
}

module.exports = {
  requireString,
  requirePositiveInt,
  requireOptionalPositiveInt,
  require2x2Matrix,
  requirePadCharAZ,
  requireKey,
  MAX_TEXT_LENGTH,
};