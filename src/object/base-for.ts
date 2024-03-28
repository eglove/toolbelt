import type { ArrayIteratee } from '../types/array.js';

export function baseFor<T extends unknown[]>(
  object: T,
  iteratee: ArrayIteratee<T>,
  keysFunction: (object: T) => (keyof T)[],
) {
  const iterable = new Object(object) as T;
  const properties = keysFunction(object);
  let { length } = properties;
  let index = -1;

  while (length) {
    index += 1;
    const key = properties[index];
    // @ts-expect-error ignore this thing
    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression,@typescript-eslint/no-unnecessary-condition,@typescript-eslint/strict-boolean-expressions
    if (!iteratee(iterable[key], key, iterable)) {
      break;
    }
    length -= 1;
  }
  return object;
}
