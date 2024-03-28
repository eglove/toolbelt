import { describe, expect, it } from 'vitest';

import { isIterable } from '../../src/is/iterable.ts';

describe('isIterable', () => {
  it.each([
    [1, 2, 3],
    'hello',
    new Set([4, 'a', 'b']),
    new Map([
      ['hey', 'there'],
      ['some', 'text'],
    ]),
  ])('should return true for %s', value => {
    expect(isIterable(value)).toBe(true);
  });

  it.each([1, { a: 3 }])('should return false for %s', value => {
    expect(isIterable(value)).toBe(false);
  });
});
