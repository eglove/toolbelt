import { isNil } from './nil.ts';

export function isObject(value: unknown): value is object {
  const type = typeof value;
  return !isNil(value) && (type === 'object' || type === 'function');
}
