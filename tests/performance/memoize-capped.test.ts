import { describe, expect, it } from 'vitest';

import { memoizeCapped } from '../../src/performance/memoize-capped.ts';
import { identity } from '../util-test.ts';

describe('memoize capped', () => {
  it('should enforce max cache size', () => {
    const memoize = memoizeCapped(identity);
    const { cache } = memoize;

    for (let index = 0; index < 500; index += 1) {
      memoize(index);
    }
    expect(cache.size).toBe(500);

    memoize(500);
    expect(cache.size).toBe(1);
  });
});
