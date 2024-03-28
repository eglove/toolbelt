import { isTypedArray } from 'node:util/types';

import { isArguments } from '../is/arguments.ts';
import { isBuffer } from '../is/buffer.ts';
import { isValidArrayIndex } from '../is/valid-array-index.ts';

// eslint-disable-next-line @typescript-eslint/unbound-method
const { hasOwnProperty } = Object.prototype;

export function arrayLikeKeys(value: unknown, inherited?: boolean) {
  const isArray = Array.isArray(value);
  const isArgument = !isArray && isArguments(value);
  const isBuff = !isArray && !isArgument && isBuffer(value);
  const isType = !isArray && !isArgument && !isBuff && isTypedArray(value);
  const skipIndexes = isArray || isArgument || isBuff || isType;
  const { length } = value as { length: number };
  const result = Array.from({ length: skipIndexes ? length : 0 });
  let index = skipIndexes ? -1 : length;

  while (index < length) {
    index += 1;
    result[index] = index.toString();
  }

  // @ts-expect-error allow unknown type
  for (const key in value) {
    if (
      (inherited ?? hasOwnProperty.call(value, key)) &&
      !(skipIndexes && (key === 'length' || isValidArrayIndex(key, length)))
    ) {
      result.push(key);
    }
  }

  return result;
}
