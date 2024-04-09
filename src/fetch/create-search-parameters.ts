import isNil from 'lodash/isNil.js';
import type { ZodError, ZodSchema } from 'zod';

type SearchParametersRecord = Record<
  string,
  number[] | string[] | number | string | undefined
>;

export function createSearchParameters<Z extends ZodSchema>(
  searchParameters: SearchParametersRecord,
  searchParametersSchema: ZodSchema,
): URLSearchParams | ZodError<Z> {
  const result = searchParametersSchema.safeParse(searchParameters);

  if (!result.success) {
    return result.error;
  }

  const search = new URLSearchParams();

  for (const key of Object.keys(searchParameters)) {
    if (Object.hasOwn(searchParameters, key)) {
      const values = searchParameters[key];

      if (Array.isArray(values)) {
        for (const value of values) {
          if (!isNil(value)) {
            search.append(key, String(value));
          }
        }
      } else if (!isNil(values)) {
        search.append(key, String(searchParameters[key]));
      }
    }
  }

  return search;
}
