import { describe, expect, it } from 'vitest';

import { MAX_SAFE_INTEGER } from '../../src/constants/number.js';
import { isValidArrayLength } from '../../src/is/valid-array-length.js';

describe('isValidArrayLength', () => {
  it.each([0, 3, MAX_SAFE_INTEGER])('should return true for %s', value => {
    expect(isValidArrayLength(value)).toBe(true);
  });

  it.each([-1, '1', 1.1, MAX_SAFE_INTEGER + 1])(
    'should return false for %s',
    value => {
      expect(isValidArrayLength(value)).toBe(false);
    },
  );
});
