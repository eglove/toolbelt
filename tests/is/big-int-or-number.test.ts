import { describe, expect, it } from 'vitest';

import { isBigIntOrNumber } from '../../src/is/big-int-or-number.ts';

describe('number', () => {
  it.each([
    [0 / 0, false],
    ['not a number', false],
    [undefined, false],
    [null, false],
    ['2', true],
    [2, true],
    [0.1, true],
    ['0.5', true],
  ])('should work for %s', (number, expected) => {
    expect(isBigIntOrNumber(number)).toBe(expected);
  });

  it.each([
    '',
    'abc',
    Number.NaN,
    undefined,
    null,
    [],
    ['123', '456'],
    { a: '123' },
    () => {
      return true;
    },
    true,
    false,
  ])('should return false for %s', value => {
    expect(isBigIntOrNumber(value)).toBe(false);
  });
});
