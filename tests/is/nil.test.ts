import { describe, expect, it } from 'vitest';

import { isNil } from '../../src/is/nil.ts';

describe('isNil', () => {
  it.each(['1', '', 3, 0, {}, []])('should return false', value => {
    expect(isNil(value)).toBe(false);
  });

  it.each([undefined, null])('should return true', value => {
    expect(isNil(value)).toBe(true);
  });
});
