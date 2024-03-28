import { isArrayLike } from '../array/is-array-like.ts';
import { isNil } from '../is/nil.ts';
import type { ObjectIteratee } from '../types/array.js';
import { baseForOwn } from './base-for-own.ts';

export function each<T extends NonNullable<unknown> | unknown[]>(
  collection: T | undefined,
  iteratee: ObjectIteratee<T>,
) {
  if (isNil(collection)) {
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
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument,@typescript-eslint/no-confusing-void-expression,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/strict-boolean-expressions
    if (!iteratee(iterable[index], index, iterable)) {
      break;
    }
  }

  return collection;
}
