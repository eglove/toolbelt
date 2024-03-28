import { isArrayLike } from '../array/is-array-like.ts';
import { isNullish } from '../is/nullish.ts';
import type { Iteratee } from '../types/array.js';
import { baseForOwn } from './base-for-own.ts';

export function baseEach<T extends NonNullable<unknown> | unknown[]>(
  collection: T,
  iteratee: Iteratee<T>,
) {
  if (isNullish(collection)) {
    return collection;
  }

  if (!isArrayLike(collection)) {
    return baseForOwn(collection, iteratee);
  }

  const { length } = collection;
  const iterable = new Object(collection);
  let index = -1;

  while (index < length) {
    index += 1;
    // @ts-expect-error allow no types
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    if (!iteratee(iterable[index], index, iterable)) {
      break;
    }
  }

  return collection;
}
