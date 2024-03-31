import type { z } from 'zod';

import { tryCatch } from '../functional/try-catch.ts';
import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export function parseJson<Z extends ZodValidator>(
  text: string,
  validator: Z,
  reviver?: (this: unknown, key: string, value: unknown) => unknown,
): HandledError<z.output<Z>, Error | z.ZodError<Z>> {
  const caught = tryCatch(() => {
    return JSON.parse(text, reviver);
  });

  if (!caught.isSuccess) {
    return { error: caught.error, isSuccess: false };
  }

  const unparsed = validator.safeParse(caught.data);

  if (!unparsed.success) {
    return { error: unparsed.error, isSuccess: false };
  }

  return { data: unparsed.data, isSuccess: true };
}
