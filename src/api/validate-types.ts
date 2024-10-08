import type { z } from "zod";

type ValidateSuccess<T extends z.ZodType,> = {
  data: z.output<T>;
  isSuccess: true;
};

type ValidateFailure<T extends z.ZodType,> = {
  error: Error | z.ZodError<T>;
  isSuccess: false;
};

type ValidateNoSchema = {
  data: undefined;
  isSuccess: true;
};

export type Validate<T extends undefined | z.ZodType,> = T extends undefined
  ? ValidateNoSchema
  : // @ts-expect-error we can safely assume T is defined
    ValidateFailure<T> | ValidateSuccess<T>;
