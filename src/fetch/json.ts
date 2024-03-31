import isError from 'lodash/isError.js';

import { attemptAsync } from '../functional/try-catch.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export async function parseFetchJson<Z extends ZodValidator>(
  value: Request | Response,
  schema: Z,
) {
  const unparsed = await attemptAsync(async () => {
    return value.json();
  });

  if (isError(unparsed)) {
    return unparsed;
  }

  const parsed = schema.safeParse(unparsed);

  if (!parsed.success) {
    return parsed.error;
  }

  return parsed.data;
}
