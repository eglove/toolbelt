import { getTag } from '../object/get-tag.ts';
import { isNil } from './nil.ts';

export function isSymbol(value: unknown): value is symbol {
  const type = typeof value;

  return (
    type === 'symbol' ||
    (type === 'object' && !isNil(value) && getTag(value) === '[object Symbol]')
  );
}
