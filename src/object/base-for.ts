export function baseFor<T extends NonNullable<unknown>>(
  object: T,
  iteratee: (value: T[keyof T], key: keyof T, object: T) => boolean,
  keysFunction: (object: T) => (keyof T)[],
) {
  const iterable = new Object(object) as T;
  const properties = keysFunction(object);
  let { length } = properties;
  let index = -1;

  while (length--) {
    const key = properties[++index];
    if (!iteratee(iterable[key], key, iterable)) {
      break;
    }
  }
  return object;
}
