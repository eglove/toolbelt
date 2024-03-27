import { isKey } from '../is/key.ts';
import { stringToPath } from './string-to-path.ts';

export function castPath(
  value: unknown,
  object: NonNullable<unknown>,
): string[] {
  if (Array.isArray(value)) {
    return value as string[];
  }

  return isKey(value, object)
    ? [value as string]
    : stringToPath(value as string);
}
