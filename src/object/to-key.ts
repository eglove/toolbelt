import { isSymbol } from '../is/symbol.ts';

const INFINITY = 1 / 0;

export function toKey(value: unknown) {
  if (typeof value === 'string' || isSymbol(value)) {
    return value;
  }

  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const result = `${value}`;
  return result === '0' && 1 / (value as number) === -INFINITY ? '-0' : result;
}
