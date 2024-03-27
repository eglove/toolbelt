import { MAX_SAFE_INTEGER } from '../constants/number.js';

export function isValidArrayLength(value: unknown) {
  return (
    typeof value === 'number' &&
    value > -1 &&
    value % 1 === 0 &&
    value <= MAX_SAFE_INTEGER
  );
}
