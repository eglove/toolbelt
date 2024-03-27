import { describe, expect, it } from 'vitest';

import { MAX_SAFE_INTEGER } from '../../src/constants/number.ts';
import { isValidArrayIndex } from '../../src/is/valid-array-index.ts';

describe('valid array index', () => {
  it.each([
    [0, undefined],
    ['0', undefined],
    ['1', undefined],
    [3, 4],
    [MAX_SAFE_INTEGER - 1, undefined],
  ])('should return true for %s', (value, length) => {
    expect(isValidArrayIndex(value, length)).toBe(true);
  });

  it.each([
    ['1abc', undefined],
    ['07', undefined],
    ['0001', undefined],
    [-1, undefined],
    [3, 3],
    [1.1, undefined],
    [MAX_SAFE_INTEGER, undefined],
  ])('should return false for %s', (value, length) => {
    expect(isValidArrayIndex(value, length)).toBe(false);
  });
});
