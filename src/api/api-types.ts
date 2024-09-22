import type {
  QueryClient,
  QueryKey,
  QueryOptions as TanStackQueryOptions,
} from "@tanstack/query-core";
import type { Merge } from "type-fest";
import type { z, ZodAny, ZodError } from "zod";

import type {
  PathVariablesRecord,
  SearchParametersRecord,
} from "../fetch/create-url.js";
import type { ZodValidator } from "../types/zod-validator.js";

export type ParameterOptions = {
  pathVariables?: PathVariablesRecord;
  searchParams?: SearchParametersRecord;
};

export type ParameterRequestOptions = {
  cacheInterval?: number;
  requestInit?: RequestInit;
} & ParameterOptions;

export type QueryOptions = {
  queryOptions?: Partial<TanStackQueryOptions>;
} & ParameterRequestOptions;

export type RequestDetails = {
  fetch: (
    options?: QueryOptions,
  ) => Promise<Error | Response | undefined | ZodError>;
  fetchJson: <T extends ZodValidator<T>,>(
    options?: ParameterRequestOptions,
  ) => Promise<Error | z.output<T> | ZodError>;
  invalidateRequest: (
    options?: Merge<ParameterRequestOptions, QueryOptions>,
  ) => Promise<void>;
  keys: (options?: ParameterRequestOptions) => Error | string[] | ZodError;
  queryOptions: <T extends ZodValidator<T>,>(
    options?: QueryOptions,
  ) => { queryKey: QueryKey } & TanStackQueryOptions<z.output<T>>;
  request: (options?: ParameterRequestOptions) => Error | Request | ZodError;
  url: (options?: ParameterOptions) => Error | URL | ZodError;
};

export type RequestConfig = {
  bodySchema?: ZodValidator<ZodAny>;
  cacheInterval?: number;
  defaultRequestInit?: RequestInit;
  graphqlType?: "mutation" | "query";
  path: string;
  pathSchema?: ZodValidator<ZodAny>;
  responseSchema?: ZodValidator<ZodAny>;
  searchParamsSchema?: ZodValidator<ZodAny>;
  skipBodyValidation?: boolean;
};

export type RequestConfigObject = Record<string, RequestConfig>;

export type ApiConstructor<T extends RequestConfigObject,> = {
  baseUrl: string;
  defaultCacheInterval?: number;
  defaultRequestInit?: RequestInit;
  queryClient?: QueryClient;
  requests: T;
};
