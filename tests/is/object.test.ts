import { describe, expect, it } from 'vitest';

import { isObject } from '../../src/is/object.ts';

describe('isObject', () => {
  it.each([
    [1, 2, 3],
    new Object(false),
    new Date(),
    // eslint-disable-next-line unicorn/error-message
    new Error(),
    { a: 1 },
    new Object(0),
    /x/u,
    new Object('a'),
    new Map(),
    new Set(),
    Buffer.from(''),
    () => {
      return 'hello';
    },
  ])('should return true for %s', value => {
    expect(isObject(value)).toBe(true);
  });

  it.each([undefined, null, ' '])('should return false for %s', value => {
    expect(isObject(value)).toBe(false);
  });
});
