import { arrayLikeKeys } from './array-like-keys.ts';
import { isArrayLike } from './is-array-like.ts';

export function keys<T extends NonNullable<unknown>>(object: T): (keyof T)[] {
  return isArrayLike(object)
    ? (arrayLikeKeys(object) as (keyof T)[])
    : (Object.keys(new Object(object)) as (keyof T)[]);
}
