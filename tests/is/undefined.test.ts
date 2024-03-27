import { describe, expect, it } from 'vitest';

import { isUndefined } from '../../src/is/undefined.ts';
import { arguments_, falsey } from '../util-test.ts';

describe('isUndefined', () => {
  it('should return true for undefined values', () => {
    // @ts-expect-error for testing only
    expect(isUndefined()).toBe(true);
    // eslint-disable-next-line unicorn/no-useless-undefined
    expect(isUndefined(undefined)).toBe(true);
  });

  it.each([
    ...falsey.filter(value => {
      return value !== undefined;
    }),
    arguments_,
    [1, 2, 3],
    true,
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    // eslint-disable-next-line @typescript-eslint/unbound-method
    Array.prototype.slice,
    { a: 1 },
    1,
    /x/,
    'a',
    Symbol('desc'),
  ])('should return false for %s', value => {
    expect(isUndefined(value)).toBe(false);
  });
});
