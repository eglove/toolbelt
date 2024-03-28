import { isNullish } from './nullish.ts';

export function isIterable<T>(value: unknown): value is Iterable<T> {
  // @ts-expect-error allow unsafe access
  return !isNullish(value) && typeof value[Symbol.iterator] === 'function';
}
