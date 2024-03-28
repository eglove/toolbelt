import { describe, expect, it } from 'vitest';

import { isBuffer } from '../../src/is/buffer.ts';
import { arguments_, falsey } from '../util-test.ts';

describe('isBuffer', () => {
  it('should return true for %s', () => {
    expect(isBuffer(Buffer.alloc(2))).toBe(true);
  });

  it.each([
    ...falsey,
    arguments_,
    [1],
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
    Symbol('a'),
  ])('should return false for %s', value => {
    expect(isBuffer(value)).toBe(false);
  });
});
