import { isObject } from './object.js';

export function isSymbol(value: unknown): value is symbol {
  if (isObject(value)) {
    return typeof value.valueOf() === 'symbol';
  }
  return typeof value === 'symbol';
}
