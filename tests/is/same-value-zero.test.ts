import { describe, expect, it } from 'vitest';

import { isSameValueZero } from '../../src/is/same-value-zero.ts';

describe('isSameValueZero', () => {
  it.each([
    [0, 0, true],
    [0, 1, false],
    [0, Number.NaN, false],
    [Number.NaN, Number.NaN, true],
    [+0, -0, true],
    [-0, +0, true],
  ])('should work correctly', (value1, value2, expected) => {
    expect(isSameValueZero(value1, value2)).toEqual(expected);
  });
});
