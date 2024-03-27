import { MAX_SAFE_INTEGER } from '../constants/number.ts';
import { isNil } from './nil.ts';

const reIsUint = /^(?:0|[1-9]\d*)$/;

export function isValidArrayIndex(value: unknown, length?: number) {
  const newLength = isNil(length) ? MAX_SAFE_INTEGER : length;

  const isNumericOrIndex =
    typeof value === 'number' ||
    (typeof value !== 'symbol' && reIsUint.test(value as string));

  const asNumber = value as number;
  const isInIndexRange =
    asNumber > -1 && asNumber % 1 === 0 && asNumber < newLength;

  return newLength > 0 && isNumericOrIndex && isInIndexRange;
}
