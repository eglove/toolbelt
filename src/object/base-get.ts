import { isNil } from '../is/nil.ts';
import { castPath } from './cast-path.ts';
import { toKey } from './to-key.ts';

export function baseGet<T extends NonNullable<unknown>>(
  object: T,
  path: string[] | string,
) {
  const newPath = castPath(path, object);

  let index = 0;
  const { length } = newPath;

  while (!isNil(object) && index < length) {
    // @ts-expect-error allow here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,no-param-reassign
    object = object[toKey(newPath[index])];
    index += 1;
  }

  return index && index === length ? object : undefined;
}
