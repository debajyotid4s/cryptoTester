function mod(n, m) {
  return ((n % m) + m) % m;
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

function egcd(a, b) {
  let oldR = a, r = b;
  let oldS = 1, s = 0;
  let oldT = 0, t = 1;

  while (r !== 0) {
    const quotient = Math.floor(oldR / r);
    const tempR = oldR - quotient * r;
    const tempS = oldS - quotient * s;
    const tempT = oldT - quotient * t;

    oldR = r; r = tempR;
    oldS = s; s = tempS;
    oldT = t; t = tempT;
  }

  return { gcd: oldR, s: oldS, t: oldT };
}

function invMod(a, m) {
  const g = gcd(a, m);
  if (g !== 1) {
    throw new Error(`No inverse exists: gcd(${a}, ${m}) = ${g}`);
  }
  const result = egcd(a, m);
  return mod(result.s, m);
}

module.exports = { mod, gcd, egcd, invMod };