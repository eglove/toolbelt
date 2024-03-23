import { tryCatch } from '../functional/try-catch.ts';
import { isNil } from '../is/nil.ts';
import { isNumber } from '../is/number.ts';
import { isObject } from '../is/object.ts';
import { isString } from '../is/string.ts';
import { isSymbol } from '../is/symbol.ts';

export function get<T>(
  object: Record<number | string | symbol, unknown>,
  path: string[] | string,
  fallback?: T,
) {
  let result = path;

  if (isObject(result) && !Array.isArray(result)) {
    result =
      // eslint-disable-next-line no-compare-neg-zero
      (result as NonNullable<unknown>).valueOf() === -0
        ? ['-0']
        : String((result as NonNullable<unknown>).valueOf()).split('.');
  } else if (isNumber(result)) {
    // eslint-disable-next-line no-compare-neg-zero
    result = result === -0 ? ['-0'] : String(result).split('.');
  } else if (isString(result)) {
    if (!isNil(result) && !isNil(object) && Object.hasOwn(object, result)) {
      return object[result] as T;
    }

    result = result.replaceAll('[]', '[ ]');
    const matches = result.match(
      /[^.[\]]+|\[\s*-?[\d.]+\s*]|\["(?:[^"\\]|\\.)*"]|\['(?:[^'\\]|\\.)*']/g,
    );

    if (!isNil(matches)) {
      for (let index = 0; index < matches.length; index += 1) {
        let value = matches[index];

        if (value === ' ') {
          value = value.trim();
        }

        if (value.startsWith('[') && value.endsWith(']')) {
          const parsed = tryCatch(() => {
            return JSON.parse(value)?.toString();
          });

          if (parsed.isSuccess && !isNil(parsed.data)) {
            value = parsed.data;
          } else {
            value = value.slice(1);
            value = value.slice(0, -1);

            // eslint-disable-next-line max-depth
            if (value.startsWith("'") && value.endsWith("'")) {
              value = value.slice(1);
              value = value.slice(0, -1);
            }

            value = value.replaceAll(/\\(.)/gu, '$1');
          }
        }

        matches[index] = value;
      }
      result = matches;
    }
  } else if (isSymbol(result)) {
    result = [result as unknown as string];
  }

  if (!Array.isArray(result) || result.length === 0) {
    return object as T;
  }

  const newPath = result.shift();

  if (!isNil(object) && !isNil(newPath) && object[newPath] === undefined) {
    return fallback as T;
  }

  if (!isNil(object) && !isNil(newPath) && object[newPath] !== undefined) {
    return get(object[newPath] as typeof object, result, fallback);
  }
}
