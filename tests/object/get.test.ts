import { describe, expect, it } from 'vitest';

import { get } from '../../src/object/get.ts';

// eslint-disable-next-line symbol-description
const symbol = Symbol();

describe('get', () => {
  it.each([
    [{ a: 1 }, 'a', 1],
    [{ a: 1 }, ['a'], 1],
    [{ '-0': 'a', 0: 'b' }, -0, 'a'],
    [{ '-0': 'a', 0: 'b' }, new Object(-0), 'a'],
    [{ '-2': 'a', 2: 'b' }, new Object(-2), 'a'],
    [{ '-0': 'a', 0: 'b' }, 0, 'a'],
    [{ '-0': 'a', 0: 'b' }, new Object(0), 'a'],
    [{ [symbol]: 1 }, symbol, 1],
    [{ a: { b: 2 } }, 'a.b', 2],
    [{ a: { b: 2 } }, ['a', 'b'], 2],
    [{ a: { b: 2 }, 'a.b': 1 }, 'a.b', 1],
    [{ a: { b: 2 }, 'a.b': 1 }, ['a.b'], 1],
    [{ a: { b: { c: 4 } }, 'a,b,c': 3 }, ['a', 'b', 'c'], 4],
    [{ a: { '': 1 } }, 'a[]', 1],
    [{}, ['', ''], undefined],
    [{ '': 3 }, [[], ['']], undefined],
    [
      {
        a: {
          '-1.23': {
            '["b"]': { c: { "['d']": { '\ne\n': { f: { g: 8 } } } } },
          },
        },
      },
      'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
      8,
    ],
    [
      {
        a: {
          '-1.23': {
            '["b"]': { c: { "['d']": { '\ne\n': { f: { g: 8 } } } } },
          },
        },
      },
      ['a', '-1.23', '["b"]', 'c', "['d']", '\ne\n', 'f', 'g'],
      8,
    ],
    [null, 'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g', undefined],
    [
      undefined,
      'a[-1.23]["[\\"b\\"]"].c[\'[\\\'d\\\']\'][\ne\n][f].g',
      undefined,
    ],
    [null, ['a', '-1.23', '["b"]', 'c', "['d']", '\ne\n', 'f', 'g'], undefined],
    [
      undefined,
      ['a', '-1.23', '["b"]', 'c', "['d']", '\ne\n', 'f', 'g'],
      undefined,
    ],
    [null, 'constructor.prototype.valueOf', undefined],
    [null, ['constructor', 'prototype', 'valueOf'], undefined],
    [undefined, 'constructor.prototype.valueOf', undefined],
    [undefined, ['constructor', 'prototype', 'valueOf'], undefined],
    [{ a: [, null] }, 'a[1].b.c', undefined],
    [{ a: [, null] }, ['a', '1', 'b', 'c'], undefined],
    [{ a: { b: null } }, 'a.b', null],
    [{ a: { b: null } }, ['a', 'b'], null],
  ])('%s with path %s sould get %s', (object, path, result) => {
    expect(
      get(object as Record<string, unknown>, path as string[] | string),
    ).toBe(result);
  });

  it.each([
    [{ a: {} }, 'a.b', 'default', 'default'],
    [{ a: {} }, ['a', 'b'], 'default', 'default'],
  ])('should use default values', (object, path, result, fallback) => {
    expect(get(object, path, fallback)).toBe(result);
  });
});
