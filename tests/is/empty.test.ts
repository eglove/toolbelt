import { describe, expect, it } from 'vitest';

import { isEmpty } from '../../src/is/empty.ts';

describe('isEmpty', () => {
  it.each([
    undefined,
    null,
    '',
    ' ',
    [],
    {},
    new Map(),
    new Set(),
    Buffer.from(''),
  ])('should return true', value => {
    expect(isEmpty(value)).toBe(true);
  });

  it.each([
    '1',
    [1],
    { hello: 'world' },
    new Map([['hello', 'world']]),
    new Set(['hello', 'world']),
    Buffer.from('1'),
  ])('should return false', value => {
    expect(isEmpty(value)).toBe(false);
  });
});
