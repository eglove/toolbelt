import { isNullish } from './nullish.ts';
import { isSymbol } from './symbol.ts';

const reIsDeepProperty = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)]/;
const reIsPlainProperty = /^\w*$/;

export function isKey(value: unknown, object: NonNullable<unknown>) {
  if (Array.isArray(value)) {
    return false;
  }

  const type = typeof value;
  if (
    type === 'number' ||
    type === 'boolean' ||
    isNullish(value) ||
    isSymbol(value)
  ) {
    return true;
  }

  return (
    reIsPlainProperty.test(value as string) ||
    !reIsDeepProperty.test(value as string) ||
    // @ts-expect-error allow unknown
    (!isNullish(object) && value in new Object(object))
  );
}
