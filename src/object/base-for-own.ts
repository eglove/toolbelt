import { keys } from '../array/keys.ts';
import type { Iteratee } from '../types/array.js';
import { baseFor } from './base-for.ts';

export function baseForOwn<T extends NonNullable<unknown>>(
  object: T,
  iteratee: Iteratee<T>,
) {
  return baseFor(object, iteratee, keys);
}
