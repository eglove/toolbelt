import type { z } from "zod";

interface ValidateSuccess<T extends z.ZodType> {
  data: z.output<T>;
  isSuccess: true;
}

interface ValidateFailure<T extends z.ZodType> {
  error: Error | z.ZodError<T>;
  isSuccess: false;
}

interface ValidateNoSchema {
  data: undefined;
  isSuccess: true;
}

export type Validate<T extends z.ZodType | undefined> = T extends undefined
  ? ValidateNoSchema
  : // @ts-expect-error we can safely assume T is defined
    ValidateFailure<T> | ValidateSuccess<T>;
