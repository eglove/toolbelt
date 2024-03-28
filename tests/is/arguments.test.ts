import { describe, expect, it } from 'vitest';

import { isArguments } from '../../src/is/arguments.ts';
import { arguments_, falsey, noop, strictArguments } from '../util-test.ts';

describe('arguments', () => {
  it.each([[arguments_], [strictArguments]])(
    'should return true for %s',
    value => {
      expect(isArguments(value)).toBe(true);
    },
  );

  it.each([
    ...falsey,
    [1, 2, 3],
    true,
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    Array.prototype.slice,
    { 0: 1, callee: noop, length: 1 },
    1,
    /x/,
    'a',
    Symbol('a'),
  ])('should return false for %s', value => {
    expect(isArguments(value)).toBe(false);
  });
});
