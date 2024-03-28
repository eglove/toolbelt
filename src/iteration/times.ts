import { MAX_ARRAY_LENGTH, MAX_SAFE_INTEGER } from '../constants/number.ts';

export function times<T>(n: number, iteratee: (index: number) => T) {
  if (n < 1 || n > MAX_SAFE_INTEGER) {
    return [];
  }

  let index = 0;
  const length = Math.min(n, MAX_ARRAY_LENGTH);
  const result = Array.from({ length });

  while (index < length) {
    result[index] = iteratee(index);
    index += 1;
  }
  index = MAX_ARRAY_LENGTH;
  // eslint-disable-next-line no-param-reassign
  n -= MAX_ARRAY_LENGTH;

  while (index < n) {
    iteratee(index);
    index += 1;
  }

  return result as number[];
}
