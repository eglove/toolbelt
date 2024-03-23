import { describe, expect, it } from 'vitest';

import { isNaN } from '../../src/is/nan.ts';

describe('isNaN', () => {
  it.each([Number.NaN, new Object(Number.NaN)])(
    'should return `true` for %s',
    value => {
      expect(isNaN(value)).toBe(true);
    },
  );

  it.each([
    [1, 2, 3],
    true,
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    { a: 1 },
    1,
    new Object(1),
    /x/u,
    'a',
  ])('should return `false` for %s', value => {
    expect(isNaN(value)).toBe(false);
  });
});
