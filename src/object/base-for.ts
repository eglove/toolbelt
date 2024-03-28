import type { Iteratee } from '../types/array.js';

export function baseFor<T extends NonNullable<unknown>>(
  object: T,
  iteratee: Iteratee<T>,
  keysFunction: (object: T) => (keyof T)[],
) {
  const iterable = new Object(object) as T;
  const properties = keysFunction(object);
  let { length } = properties;
  let index = -1;

  while (length) {
    index += 1;
    const key = properties[index];
    if (!iteratee(iterable[key], key, iterable)) {
      break;
    }
    length -= 1;
  }
  return object;
}
