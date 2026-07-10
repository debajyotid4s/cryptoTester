import { describe, it, expect } from "vitest";
import { generateKeys, encrypt, decrypt, isPrime, modPow } from "../src/algos/rsa.js";

describe("RSA utilities", () => {
  it("detects primes correctly", () => {
    expect(isPrime(2)).toBe(true);
    expect(isPrime(17)).toBe(true);
    expect(isPrime(1)).toBe(false);
    expect(isPrime(4)).toBe(false);
    expect(isPrime(15)).toBe(false);
  });

  it("computes modular exponentiation", () => {
    expect(modPow(2, 3, 5)).toBe(3);
    expect(modPow(3, 3, 7)).toBe(6);
    expect(modPow(5, 0, 7)).toBe(1);
  });
});

describe("RSA key generation", () => {
  it("generates keys from given primes", () => {
    const keys = generateKeys({ p: 17, q: 11 });
    expect(keys.n).toBe(187);
    expect(keys.phi).toBe(160);
    expect(keys.e).toBe(3);
    expect(keys.d).toBe(107);
  });

  it("generates keys with custom e", () => {
    const keys = generateKeys({ p: 17, q: 11, e: 7 });
    expect(keys.e).toBe(7);
    const d = keys.d;
    expect((7 * d) % 160).toBe(1);
  });

  it("auto-generates keys", () => {
    const keys = generateKeys();
    expect(keys.p).toBeGreaterThanOrEqual(2);
    expect(keys.q).toBeGreaterThanOrEqual(2);
    expect(keys.n).toBe(keys.p * keys.q);
    expect(keys.e).toBeGreaterThanOrEqual(3);
    expect(keys.d).toBeGreaterThanOrEqual(1);
  });
});

describe("RSA encrypt/decrypt", () => {
  it("encrypts and decrypts a single character", () => {
    const keys = generateKeys({ p: 17, q: 11 });
    const encrypted = encrypt("A", { e: keys.e, n: keys.n });
    const decrypted = decrypt(encrypted.result, { d: keys.d, n: keys.n });
    expect(decrypted.result).toBe("A");
  });

  it("roundtrips HELLO correctly", () => {
    const keys = generateKeys({ p: 17, q: 11 });
    const encrypted = encrypt("HELLO", { e: keys.e, n: keys.n });
    const decrypted = decrypt(encrypted.result, { d: keys.d, n: keys.n });
    expect(decrypted.result).toBe("HELLO");
  });

  it("handles lowercase and strips non-A-Z", () => {
    const keys = generateKeys({ p: 17, q: 11 });
    const encrypted = encrypt("hello!", { e: keys.e, n: keys.n });
    const decrypted = decrypt(encrypted.result, { d: keys.d, n: keys.n });
    expect(decrypted.result).toBe("HELLO");
  });

  it("produces explain data with rows", () => {
    const keys = generateKeys({ p: 17, q: 11 });
    const encrypted = encrypt("HI", { e: keys.e, n: keys.n });
    expect(encrypted.explain.rows).toHaveLength(2);
    expect(encrypted.explain.rows[0].char).toBe("H");
    expect(encrypted.explain.rows[1].char).toBe("I");
    expect(encrypted.explain.facts.n).toBe(187);
  });
});

describe("RSA with larger primes", () => {
  it("roundtrips with different key sizes", () => {
    const keys = generateKeys({ p: 43, q: 59 });
    const message = "RSA";
    const encrypted = encrypt(message, { e: keys.e, n: keys.n });
    const decrypted = decrypt(encrypted.result, { d: keys.d, n: keys.n });
    expect(decrypted.result).toBe(message);
  });

  it("fails with non-coprime e", () => {
    expect(() => generateKeys({ p: 17, q: 11, e: 2 })).toThrow();
  });
});
