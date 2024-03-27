import { describe, expect, it } from 'vitest';

import { memoize } from '../../src/performance/memoize.ts';
import { identity, noop } from '../util-test.ts';

describe('memoize', () => {
  it('should memoize results based on the first argument given', () => {
    const memoized = memoize((a: number, b: number, c: number) => {
      return a + b + c;
    });

    expect(memoized(1, 2, 3)).toBe(6);
    expect(memoized(1, 3, 5)).toBe(6);
  });

  it('should support a `resolver`', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const function_ = (a: number, b: number, c: number) => {
      return a + b + c;
    };
    const memoized = memoize(function_, function_);

    expect(memoized(1, 2, 3)).toBe(6);
    expect(memoized(1, 3, 5)).toBe(9);
  });

  it('should use `this` binding of function for `resolver`', () => {
    // eslint-disable-next-line unicorn/consistent-function-scoping,func-style
    const function_ = function (a: number) {
      // @ts-expect-error allow for tests
      // eslint-disable-next-line @typescript-eslint/no-invalid-this,@typescript-eslint/restrict-plus-operands,@typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-member-access
      return a + this.b + this.c;
    };
    const memoized = memoize(function_, function_);

    const object = { b: 2, c: 3, memoized };
    expect(object.memoized(1)).toBe(6);

    object.b = 3;
    object.c = 5;
    expect(object.memoized(1)).toBe(9);
  });

  it('should throw a TypeError if `resolve` is truthy and not a function', () => {
    expect(() => {
      // @ts-expect-error allow for tests
      memoize(noop, true);
    }).toThrowError(TypeError);
  });

  // eslint-disable-next-line no-sparse-arrays
  it.each([, null, undefined])(
    'should not error if `resolver` is nullish',
    value => {
      // @ts-expect-error allow for test
      const actual = memoize(noop, value);

      expect(actual()).toEqual(undefined);
    },
  );

  it.each([
    'constructor',
    'hasOwnProperty',
    'isPrototypeOf',
    'propertyIsEnumerable',
    'toLocaleString',
    'toString',
    'valueOf',
  ])('should check cache for own properties', value => {
    const memoized = memoize(identity);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const actual = memoized(value);

    expect(actual).toEqual(value);
  });

  // eslint-disable-next-line max-statements
  it('should cache the `__proto__` key', () => {
    const array: unknown[] = [];
    const key = '__proto__';

    for (let index = 0; index < 2; index += 1) {
      let count = 0;
      const resolver = index ? identity : undefined;

      const memoized = memoize(() => {
        count += 1;
        return array;
      }, resolver as undefined);

      const { cache } = memoized;

      // @ts-expect-error allow for test
      memoized(key);
      // @ts-expect-error allow for test
      memoized(key);

      expect(count).toBe(1);
      expect(cache.get(key)).toBe(array);
      // @ts-expect-error allow for test
      expect(Array.isArray(cache.__data__)).toBe(false);
      expect(cache.delete(key)).toBe(true);
    }
  });
});
