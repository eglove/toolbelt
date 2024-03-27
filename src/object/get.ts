import { isNil } from '../is/nil.ts';
import { isUndefined } from '../is/undefined.ts';
import { baseGet } from './base-get.ts';

export function get<T>(
  object: Record<number | string | symbol, unknown> | undefined,
  path: string[] | string,
  fallback?: T,
) {
  const result = isNil(object) ? undefined : baseGet(object, path);

  return isUndefined(result) ? fallback : result;
}
