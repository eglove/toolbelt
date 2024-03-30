import type { QueryOptions as TanStackQueryOptions } from '@tanstack/query-core';
import type { ZodError } from 'zod';

import type { HandledError } from '../types/error.js';
import type { ZodValidator } from '../types/zod-validator.js';

export type ParameterOptions = {
  pathVariables?: Record<string, number | string>;
  searchParams?: Record<string, number | string | undefined>;
};

export type ParameterRequestOptions = ParameterOptions & {
  defaultErrorMessage?: string;
  requestInit?: RequestInit;
};

export type QueryOptions = ParameterRequestOptions & {
  queryOptions?: Partial<TanStackQueryOptions>;
};

export type RequestDetails = {
  fetch: (
    options?: QueryOptions,
  ) => Promise<HandledError<Response, Error | ZodError>>;
  fetchJson: <T>(
    options?: ParameterRequestOptions,
  ) => Promise<HandledError<T, Error | ZodError>>;
  keys: (
    options?: ParameterRequestOptions,
  ) => HandledError<string[], Error | ZodError>;
  queryOptions: (
    options?: QueryOptions,
  ) => HandledError<TanStackQueryOptions, Error | ZodError>;
  request: (
    options?: ParameterRequestOptions,
  ) => HandledError<Request, Error | ZodError>;
  url: (options?: ParameterOptions) => HandledError<URL, Error | ZodError>;
};

export type RequestConfig = {
  bodySchema?: ZodValidator;
  defaultErrorMessage: string;
  defaultRequestInit?: RequestInit;
  path: string;
  pathSchema?: ZodValidator;
  searchParamsSchema?: ZodValidator;
};

export type RequestConfigObject = Record<string, RequestConfig>;

export type ApiConstructor<T extends RequestConfigObject> = {
  baseUrl: string;
  defaultRequestInit?: RequestInit;
  requests: T;
};
