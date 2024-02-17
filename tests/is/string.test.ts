import { describe, expect, it } from 'vitest';

import { isString } from '../../src/is/string.ts';

describe('isObject', () => {
  // eslint-disable-next-line no-new-wrappers,unicorn/new-for-builtins
  it.each(['', 'test', new String('hello')])('should return true', value => {
    expect(isString(value)).toBe(true);
  });
});
