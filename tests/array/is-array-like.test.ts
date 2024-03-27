import { describe, expect, it } from 'vitest';

import { isArrayLike } from '../../src/array/is-array-like.ts';
import { tryCatchAsync } from '../../src/functional/try-catch.ts';
import { arguments_ } from '../util-test.ts';

describe('isArrayLike', () => {
  it.each([[arguments_], [[1, 2, 3]], [{ 0: 'a', length: 1 }], ['a']])(
    'should return `true` for %s',
    value => {
      expect(isArrayLike(value)).toEqual(true);
    },
  );

  // eslint-disable-next-line no-sparse-arrays
  it.each([
    ,
    null,
    undefined,
    false,
    0,
    Number.NaN,
    true,
    new Date(),
    new Error(),
    tryCatchAsync(() => {
      return true;
    }),
    () => {
      return true;
    },
    { a: 1 },
    1,
    /x/u,
    Symbol('desc'),
  ])('should return `false` for %s', value => {
    expect(isArrayLike(value)).toBe(false);
  });
});
