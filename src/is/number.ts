import { isNaN } from './nan.ts';
import { isObject } from './object.ts';

export function isNumber(value: unknown): value is number {
  if (value instanceof Date) {
    return false;
  }

  if (isObject(value)) {
    return typeof value.valueOf() === 'number' && !isNaN(value);
  }

  return typeof value === 'number' && !isNaN(value);
}
