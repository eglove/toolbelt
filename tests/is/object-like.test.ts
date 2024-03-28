import { describe, expect, it } from 'vitest';

import { isObjectLike } from '../../src/is/object-like.ts';
import { arguments_ } from '../util-test.ts';

describe('isObjectLike', () => {
  it.each([
    [...arguments_],
    [1, 2, 3],
    new Object(false),
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    { a: 1 },
    new Object(0),
    /x/,
    new Object('a'),
  ])('should return true for %s', value => {
    expect(isObjectLike(value)).toBe(true);
  });

  // eslint-disable-next-line @typescript-eslint/unbound-method
  it.each([true, Array.prototype.slice, 1, 'a', Symbol('desc')])(
    'should return true for %s',
    value => {
      expect(isObjectLike(value)).toBe(false);
    },
  );
});
