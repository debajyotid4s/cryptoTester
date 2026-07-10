const { mod, gcd, invMod } = require("../utils/math");
const { sanitizeAZ, charToNumAZ, numToCharAZ } = require("../utils/text");

function isPrime(n) {
  if (n < 2) return false;
  if (n === 2) return true;
  if (n % 2 === 0) return false;
  for (let i = 3; i * i <= n; i += 2) {
    if (n % i === 0) return false;
  }
  return true;
}

function nextPrime(n) {
  let candidate = n;
  while (!isPrime(candidate)) candidate++;
  return candidate;
}

function modPow(base, exp, modVal) {
  let result = 1;
  base = base % modVal;
  while (exp > 0) {
    if (exp % 2 === 1) result = (result * base) % modVal;
    exp = Math.floor(exp / 2);
    base = (base * base) % modVal;
  }
  return result;
}

function generateKeys(options = {}) {
  const p = options.p || nextPrime(Math.floor(Math.random() * 20) + 10);
  const q = options.q || nextPrime(p + Math.floor(Math.random() * 20) + 2);
  const n = p * q;
  const phi = (p - 1) * (q - 1);

  let e;
  if (options.e) {
    e = options.e;
    if (gcd(e, phi) !== 1) throw new Error(`e (${e}) is not coprime with φ(n) = ${phi}`);
  } else {
    e = 3;
    while (gcd(e, phi) !== 1 && e < phi) e += 2;
    if (e >= phi) throw new Error("Could not find suitable e");
  }

  const d = mod(invMod(e, phi), phi);

  return { p, q, n, phi, e, d };
}

function encrypt(text, publicKey) {
  const { e, n } = publicKey;
  const sanitized = sanitizeAZ(text);
  const chars = sanitized.split("");

  const rows = [];
  let result = "";

  for (const char of chars) {
    const m = charToNumAZ(char);
    const c = modPow(m, e, n);
    const padded = c.toString().padStart(String(n).length, "0");

    rows.push({
      char,
      m,
      e,
      n,
      c,
      padded,
    });

    result += padded + " ";
  }

  result = result.trim();

  const explain = {
    summary: [
      `Sanitized input: "${sanitized}"`,
      `Public key: (e=${e}, n=${n})`,
      `RSA modulus n = ${n} = ${publicKey.p || "?"} × ${publicKey.q || "?"}`,
    ],
    facts: {
      e,
      n,
      p: publicKey.p || null,
      q: publicKey.q || null,
      phi: publicKey.phi || null,
    },
    rows,
    notes: [],
  };

  return { result, explain };
}

function decrypt(text, privateKey) {
  const { d, n } = privateKey;
  const tokens = text.trim().split(/\s+/);

  const rows = [];
  let result = "";

  for (const token of tokens) {
    const c = parseInt(token, 10);
    const m = modPow(c, d, n);
    const char = numToCharAZ(m);

    rows.push({
      c,
      d,
      n,
      m,
      char,
    });

    result += char;
  }

  const explain = {
    summary: [
      `Decrypted using private key: (d=${d}, n=${n})`,
      `Recovered text: "${result}"`,
    ],
    facts: {
      d,
      n,
      p: privateKey.p || null,
      q: privateKey.q || null,
      phi: privateKey.phi || null,
    },
    rows,
    notes: [],
  };

  return { result, explain };
}

module.exports = { generateKeys, encrypt, decrypt, isPrime, modPow };
