import { beforeEach, describe, expect, it } from 'vitest';

import { isSymbol } from '../../src/is/symbol.ts';

describe('symbol', () => {
  // eslint-disable-next-line symbol-description
  let symbol = Symbol();

  beforeEach(() => {
    // eslint-disable-next-line symbol-description
    symbol = Symbol();
  });

  it.each([symbol, new Object(symbol)])('should return true for %s', value => {
    expect(isSymbol(value)).toBe(true);
  });

  it.each([
    [1, 2, 3],
    true,
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    { 0: 1, length: 1 },
    1,
    /x/u,
    'a',
  ])('should return false for %s', () => {
    //
  });
});
