import type { FunctionToMemoize } from './memoize.ts';
import { memoize } from './memoize.ts';

const MAX_MEMOIZE_SIZE = 500;

export function memoizeCapped<T extends unknown[], R>(
  function_: FunctionToMemoize<T, R>,
) {
  const result = memoize(function_, (...key: T) => {
    const { cache } = result;

    if (cache.size === MAX_MEMOIZE_SIZE) {
      cache.clear();
    }

    return key;
  });

  return result as (...arguments_: T) => R;
}
