import type {
  QueryClient,
  QueryKey,
  QueryOptions as TanStackQueryOptions,
} from "@tanstack/query-core";
import type { Merge, ReadonlyDeep } from "type-fest";
import type { z, ZodAny, ZodError } from "zod";

import type {
  PathVariablesRecord,
  SearchParametersRecord,
} from "../fetch/create-url.js";
import type { ZodValidator } from "../types/zod-validator.js";

export type ParameterOptions = ReadonlyDeep<{
  pathVariables?: PathVariablesRecord;
  searchParams?: SearchParametersRecord;
}>;

export type ParameterRequestOptions = ReadonlyDeep<
  ParameterOptions & {
    cacheInterval?: number;
    requestInit?: RequestInit;
  }
>;

export type QueryOptions = ReadonlyDeep<
  ParameterRequestOptions & {
    queryOptions?: Partial<TanStackQueryOptions>;
  }
>;

export type RequestDetails = {
  fetch: (
    options?: QueryOptions,
  ) => Promise<Error | Response | ZodError | undefined>;
  fetchJson: <T extends ZodValidator<T>>(
    options?: ParameterRequestOptions,
  ) => Promise<Error | z.output<T> | ZodError>;
  invalidateRequest: (
    options?: Merge<ParameterRequestOptions, QueryOptions>,
  ) => Promise<void>;
  keys: (options?: ParameterRequestOptions) => Error | string[] | ZodError;
  queryOptions: <T extends ZodValidator<T>>(
    options?: QueryOptions,
  ) => TanStackQueryOptions<z.output<T>> & { queryKey: QueryKey };
  request: (options?: ParameterRequestOptions) => Error | Request | ZodError;
  url: (options?: ParameterOptions) => Error | URL | ZodError;
};

export type RequestConfig = ReadonlyDeep<{
  bodySchema?: ZodValidator<ZodAny>;
  cacheInterval?: number;
  defaultRequestInit?: RequestInit;
  path: string;
  pathSchema?: ZodValidator<ZodAny>;
  responseSchema?: ZodValidator<ZodAny>;
  searchParamsSchema?: ZodValidator<ZodAny>;
}>;

export type RequestConfigObject = ReadonlyDeep<Record<string, RequestConfig>>;

export type ApiConstructor<T extends RequestConfigObject> = ReadonlyDeep<{
  baseUrl: string;
  defaultCacheInterval?: number;
  defaultRequestInit?: RequestInit;
  queryClient?: QueryClient;
  requests: T;
}>;
