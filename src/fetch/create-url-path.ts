import isEmpty from "lodash/isEmpty.js";
import isNil from "lodash/isNil.js";
import type { ReadonlyDeep } from "type-fest";
import type { ZodError, ZodSchema } from "zod";

export type ParseUrlParameters<Url> =
  Url extends `${infer Path}(${infer OptionalPath})`
    ? ParseUrlParameters<Path> & Partial<ParseUrlParameters<OptionalPath>>
    : Url extends `${infer Start}/${infer Rest}`
      ? ParseUrlParameters<Rest> & ParseUrlParameters<Start>
      : Url extends `:${infer Parameter}`
        ? { [K in Parameter]: string }
        : NonNullable<unknown>;

export const createUrlPath = <T extends string>(
  path: T,
  parameters: ReadonlyDeep<ParseUrlParameters<T>>,
  parametersSchema?: ReadonlyDeep<ZodSchema>,
): Error | ZodError<typeof parametersSchema> | string => {
  let url = String(path);

  if (!isEmpty(parameters) && isNil(parametersSchema)) {
    return new Error("must provide path variables schema");
  }

  if (!isNil(parametersSchema)) {
    const result = parametersSchema.safeParse(parameters);

    if (!result.success) {
      return result.error;
    }
  }

  // @ts-expect-error force param type
  for (const [key, value] of Object.entries<string>(parameters)) {
    url = path.replace(`:${key}`, value);
  }

  return url.replaceAll(/(\(|\)|\/?:[^/]+)/g, "");
};
