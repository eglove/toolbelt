import { beforeEach, describe, expect, it } from 'vitest';

import { isSymbol } from '../../src/is/symbol.ts';
import { arguments_, falsey } from '../util-test.ts';

describe('symbol', () => {
  let symbol = Symbol('test');

  beforeEach(() => {
    symbol = Symbol('test');
  });

  it.each([symbol, new Object(symbol)])('should return true for %s', value => {
    expect(isSymbol(value)).toBe(true);
  });

  it.each([
    ...falsey,
    arguments_,
    [1, 2, 3],
    true,
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    { 0: 1, length: 1 },
    1,
    /x/u,
    'a',
  ])('should return false for %s', value => {
    expect(isSymbol(value)).toBe(false);
  });
});
