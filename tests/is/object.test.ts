import { describe, expect, it } from 'vitest';

import { isObject } from '../../src/is/object.ts';

describe('isObject', () => {
  it.each([
    [],
    {},
    new Map(),
    new Set(),
    Buffer.from(''),
    () => {
      return 'hello';
    },
  ])('should return true', value => {
    expect(isObject(value)).toBe(true);
  });

  it.each([undefined, null, ' '])('should return false', value => {
    expect(isObject(value)).toBe(false);
  });
});
