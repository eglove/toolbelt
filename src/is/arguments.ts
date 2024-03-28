import { getTag } from '../object/get-tag.ts';
import { isObjectLike } from './object-like.ts';

export function isArguments(value: unknown) {
  return isObjectLike(value) && getTag(value) === '[object Arguments]';
}
