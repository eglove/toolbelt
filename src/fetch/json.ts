import isError from 'lodash/isError.js';
import type { z, ZodError } from 'zod';

import { attemptAsync } from '../functional/attempt-async.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export async function parseFetchJson<Z extends ZodValidator<Z>>(
  value: Request | Response,
  schema: Z,
): Promise<Error | z.output<Z> | ZodError<Z>> {
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
