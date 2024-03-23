import { describe, expect, it } from 'vitest';

import { isNumber } from '../../src/is/number.ts';

describe('isNumber', () => {
  it.each([0, new Object(0)])('should return true for %s', value => {
    expect(isNumber(value)).toBe(true);
  });

  it.each([
    Number.NaN,
    [1, 2, 3],
    true,
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    { a: 1 },
    /x/u,
    'a',
  ])('should return false %s', value => {
    expect(isNumber(value)).toBe(false);
  });
});
