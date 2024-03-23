import { tryCatch } from '../functional/try-catch.js';
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
  if (isObject(path) && !Array.isArray(path)) {
    path =
      (path as Object).valueOf() === -0
        ? ['-0']
        : String((path as Object).valueOf()).split('.');
  } else if (isNumber(path)) {
    path = path === -0 ? ['-0'] : String(path).split('.');
  } else if (isString(path)) {
    if (!isNil(path) && !isNil(object) && object.hasOwnProperty(path)) {
      return object[path] as T;
    }

    path = path.replaceAll('[]', '[ ]');
    const matches = path.match(
      /[^.[\]]+|\[\s*-?[\d.]+\s*]|\["(?:[^"\\]|\\.)*"]|\['(?:[^'\\]|\\.)*']/g,
    );

    if (!isNil(matches)) {
      for (let index = 0; index < matches.length; index++) {
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

            if (value.startsWith("'") && value.endsWith("'")) {
              value = value.slice(1);
              value = value.slice(0, -1);
            }

            value = value.replaceAll(/\\(.)/g, '$1');
          }
        }

        matches[index] = value;
      }
      path = matches;
    }

    // path = path.split(/\.|\[]/);
  } else if (isSymbol(path)) {
    path = [path as unknown as string];
  }

  if (!Array.isArray(path) || path.length === 0) {
    return object as T;
  }

  const newPath = path.shift();

  if (!isNil(object) && !isNil(newPath) && object[newPath] === undefined) {
    return fallback as T;
  }

  if (!isNil(object) && !isNil(newPath) && object[newPath] !== undefined) {
    return get(object[newPath] as typeof object, path, fallback);
  }
}
