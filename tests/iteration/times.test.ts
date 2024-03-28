import { describe, expect, it } from 'vitest';

import { times } from '../../src/iteration/times.ts';
import { falsey } from '../util-test.ts';

describe('times', () => {
  it.each([Number.NEGATIVE_INFINITY, Number.NaN, Number.POSITIVE_INFINITY])(
    'should coerce %s n values to 0',
    value => {
      expect(
        times(value, () => {
          return true;
        }),
      ).toEqual([]);
    },
  );

  it('should coerce n to an integer', () => {
    const actual = times(2.6, n => {
      return n;
    });

    expect(actual).toEqual([0, 1, 2]);
  });

  it('should return an array of the results of each execution', () => {
    expect(
      times(3, n => {
        return n * 2;
      }),
    ).toEqual([0, 2, 4]);
  });

  it.each([...falsey, -1, Number.NEGATIVE_INFINITY])(
    'should return an empty array for %s',
    value => {
      expect(
        times(value as number, () => {
          return false;
        }),
      ).toEqual([]);
    },
  );
});
