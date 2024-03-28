/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { isNil } from '../is/nil.ts';

export type FunctionToMemoize<T extends unknown[], R> = (...arguments_: T) => R;
type CacheKeyResolver<T extends unknown[]> = (...arguments_: T) => T[number];

export function memoize<T extends unknown[], R>(
  function_: FunctionToMemoize<T, R>,
  resolver?: CacheKeyResolver<T>,
) {
  if (
    typeof function_ !== 'function' ||
    (!isNil(resolver) && typeof resolver !== 'function')
  ) {
    throw new TypeError('Expected a function');
  }

  const memoized = function (...arguments_: T) {
    // @ts-expect-error
    const key = resolver ? resolver.apply(this, arguments_) : arguments_[0];
    const { cache } = memoized;

    if (cache.has(key)) {
      return cache.get(key);
    }

    // @ts-expect-error
    const result = function_.apply(this, arguments_);
    memoized.cache = cache.set(key, result) || cache;
    return result;
  };
  memoized.cache = new (memoize.Cache || Map)();
  return memoized;
}

memoize.Cache = Map;
