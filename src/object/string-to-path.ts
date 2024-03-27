import { isNil } from '../is/nil.ts';
import { memoizeCapped } from '../performance/memoize-capped.ts';

const charCodeOfDot = '.'.codePointAt(0);
const reEscapeChar = /\\(\\)?/g;
const rePropertyName = new RegExp(
  // Match anything that isn't a dot or bracket.
  '[^.[\\]]+' +
    '|' +
    // Or match property names within brackets.
    '\\[(?:' +
    // Match a non-string expression.
    '([^"\'][^[]*)' +
    '|' +
    // Or match strings (supports escaping characters).
    '(["\'])((?:(?!\\2)[^\\\\]|\\\\.)*?)\\2' +
    ')\\]' +
    '|' +
    // Or match "" as the space between consecutive dots or empty brackets.
    '(?=(?:\\.|\\[\\])(?:\\.|\\[\\]|$))',
  'g',
);

export const stringToPath = memoizeCapped((value: string) => {
  const result: string[] = [];

  if (value.codePointAt(0) === charCodeOfDot) {
    result.push('');
  }

  value.replaceAll(
    rePropertyName,
    (
      match: string,
      expression?: string,
      quote?: string,
      subString?: string,
      // eslint-disable-next-line @typescript-eslint/max-params
    ) => {
      let key = match;

      if (!isNil(quote) && !isNil(subString)) {
        key = subString.replaceAll(reEscapeChar, '$1');
      } else if (!isNil(expression)) {
        key = expression.replaceAll(/^ +| +$/g, '');
      }
      result.push(key);

      return key;
    },
  );

  return result;
});
