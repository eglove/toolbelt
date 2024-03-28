import { isNullish } from '../is/nullish.ts';
import { isValidArrayLength } from '../is/valid-array-length.ts';

export function isArrayLike(value: unknown): value is typeof Array {
  return (
    !isNullish(value) &&
    typeof value !== 'function' &&
    // @ts-expect-error undefined is fine to pass here
    isValidArrayLength(value?.length)
  );
}
