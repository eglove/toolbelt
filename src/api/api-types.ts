import type {
  QueryClient,
  QueryKey,
  QueryOptions as TanStackQueryOptions,
} from '@tanstack/query-core';
import type { z, ZodError } from 'zod';

import type {
  PathVariablesRecord,
  SearchParametersRecord,
} from '../fetch/create-url.js';
import type { ZodValidator } from '../types/zod-validator.js';

export type ParameterOptions = {
  pathVariables?: PathVariablesRecord;
  searchParams?: SearchParametersRecord;
};

export type ParameterRequestOptions = ParameterOptions & {
  cacheInterval?: number;
  requestInit?: RequestInit;
};

export type QueryOptions = ParameterRequestOptions & {
  queryOptions?: Partial<TanStackQueryOptions>;
};

export type RequestDetails = {
  fetch: (
    options?: QueryOptions,
  ) => Promise<Error | Response | ZodError | undefined>;
  fetchJson: <T extends ZodValidator>(
    options?: ParameterRequestOptions,
  ) => Promise<Error | z.output<T> | ZodError>;
  invalidateRequest: (
    options?: ParameterRequestOptions & QueryOptions,
  ) => Promise<void>;
  keys: (options?: ParameterRequestOptions) => Error | string[] | ZodError;
  queryOptions: <T extends ZodValidator>(
    options?: QueryOptions,
  ) => TanStackQueryOptions<z.output<T>> & { queryKey: QueryKey };
  request: (options?: ParameterRequestOptions) => Error | Request | ZodError;
  url: (options?: ParameterOptions) => Error | URL | ZodError;
};

export type RequestConfig = {
  bodySchema?: ZodValidator;
  cacheInterval?: number;
  defaultRequestInit?: RequestInit;
  path: string;
  pathSchema?: ZodValidator;
  responseSchema?: ZodValidator;
  searchParamsSchema?: ZodValidator;
};

export type RequestConfigObject = Record<string, RequestConfig>;

export type ApiConstructor<T extends RequestConfigObject> = {
  baseUrl: string;
  defaultCacheInterval?: number;
  defaultRequestInit?: RequestInit;
  queryClient?: QueryClient;
  requests: T;
};
