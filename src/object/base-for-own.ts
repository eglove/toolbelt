import { keys } from '../array/keys.ts';
import type { ObjectIteratee } from '../types/array.ts';
import { baseFor } from './base-for.ts';

export function baseForOwn<T extends NonNullable<unknown>>(
  object: T,
  iteratee: ObjectIteratee<T>,
) {
  // @ts-expect-error will remove later
  return baseFor(object, iteratee, keys);
}
