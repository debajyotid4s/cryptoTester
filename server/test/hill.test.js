import { describe, it, expect } from 'vitest';
import { encrypt, decrypt } from './src/algos/hill2x2.js';

const KEY = [[3, 3], [2, 5]];

describe('Hill Cipher 2x2', () => {
  describe('encrypt', () => {
    it('encrypts HELLO correctly', () => {
      const result = encrypt('HELLO', KEY, { padChar: 'X' });
      expect(result.result).toBe('HIOZHN');
    });

    it('encrypts even-length text without padding', () => {
      const result = encrypt('HELP', KEY, { padChar: 'X' });
      expect(result.result.length).toBe(4);
    });

    it('encrypts odd-length text with padding', () => {
      const result = encrypt('HEL', KEY, { padChar: 'X' });
      expect(result.result.length).toBe(4);
      expect(result.explain.summary).toContain('Padded with 1 "X"');
    });

    it('sanitizes input to uppercase A-Z', () => {
      const result = encrypt('hello!', KEY, { padChar: 'X' });
      expect(result.result).toBeDefined();
      expect(result.explain.summary).toContain('Sanitized input: "HELLO"');
    });

    it('ignores non-A-Z characters', () => {
      const result = encrypt('HE@#L$LO', KEY, { padChar: 'X' });
      expect(result.result).toBe('HIOZHN');
    });
  });

  describe('decrypt', () => {
    it('decrypts HIOZHN correctly', () => {
      const result = decrypt('HIOZHN', KEY, { padChar: 'X', stripPadding: true, padAdded: 1 });
      expect(result.result).toBe('HELLO');
    });

    it('roundtrips HELLO correctly', () => {
      const encrypted = encrypt('HELLO', KEY, { padChar: 'X' });
      expect(encrypted.explain.padAdded).toBe(1);
      const decrypted = decrypt(encrypted.result, KEY, { padChar: 'X', stripPadding: true, padAdded: 1 });
      expect(decrypted.result).toBe('HELLO');
    });

    it('roundtrips LATE correctly', () => {
      const encrypted = encrypt('LATE', KEY, { padChar: 'X' });
      expect(encrypted.explain.padAdded).toBe(0);
      const decrypted = decrypt(encrypted.result, KEY, { padChar: 'X', stripPadding: true, padAdded: 0 });
      expect(decrypted.result).toBe('LATE');
    });

    it('roundtrips LATEYX - trailing X preserved (with stripPadding=false)', () => {
      // Safe padding: only strip if padAdded was tracked
      const encrypted = encrypt('LATEYX', KEY, { padChar: 'X' });
      expect(encrypted.explain.padAdded).toBe(0);
      const decrypted = decrypt(encrypted.result, KEY, { padChar: 'X', stripPadding: true, padAdded: 0 });
      expect(decrypted.result).toBe('LATEYX');
    });

    it('strips padding when padAdded > 0', () => {
      const encrypted = encrypt('HEL', KEY, { padChar: 'X' });
      expect(encrypted.explain.padAdded).toBe(1);
      const decrypted = decrypt(encrypted.result, KEY, { padChar: 'X', stripPadding: true, padAdded: 1 });
      expect(decrypted.result).toBe('HEL');
    });

    it('preserves padding when stripPadding=false', () => {
      const encrypted = encrypt('HEL', KEY, { padChar: 'X' });
      const decrypted = decrypt(encrypted.result, KEY, { padChar: 'X', stripPadding: false });
      // Without stripping, we get padded version
      expect(decrypted.result.length).toBe(encrypted.result.length);
    });
  });

  describe('key validation', () => {
    it('accepts invertible key [[3,3],[2,5]]', () => {
      const result = encrypt('HELLO', KEY);
      expect(result.explain.facts.gcdDet26).toBe(1);
    });

    it('non-invertible key [[2,2],[1,1]] produces warning', () => {
      const badKey = [[2, 2], [1, 1]];
      const result = encrypt('HELLO', badKey);
      // Should have warning in notes
      expect(result.explain.notes).toContain('Warning: Matrix is not invertible - cannot decrypt!');
    });
  });

  describe('edge cases', () => {
    it('handles single character input', () => {
      const result = encrypt('A', KEY, { padChar: 'X' });
      expect(result.result.length).toBe(2);
    });

    it('handles lowercase input', () => {
      const result = encrypt('hello', KEY, { padChar: 'X' });
      expect(result.explain.summary).toContain('Sanitized input: "HELLO"');
    });
  });
});