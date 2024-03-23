import { isNil } from './nil.ts';
import { isObject } from './object.ts';

export function isNaN(value: unknown) {
  if (isObject(value) && !isNil(value)) {
    return Number.isNaN(value.valueOf());
  }

  return Number.isNaN(value);
}
