export function arrayEach<T extends unknown[]>(
  array: T,
  iteratee: (value: unknown, index: number, array: unknown[]) => boolean,
) {
  let index = -1;
  const { length } = array;

  while (index < length) {
    index += 1;

    if (!iteratee(array[index], index, array)) {
      break;
    }

    return array;
  }
}
