import type { z } from 'zod';

import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.ts';

export type RequestConfig = {
  bodySchema?: ZodValidator;
  defaultRequestInit?: RequestInit;
  path: string;
  pathVariableSchema?: ZodValidator;
  responseSchema?: ZodValidator;
  searchParamSchema?: ZodValidator;
};

export type ApiConfig<T extends Record<string, Readonly<RequestConfig>>> = {
  baseUrl: string;
  cacheInterval?: number;
  defaultRequestInit?: RequestInit;
  requests: T;
};

export type RequestOptions = {
  pathVariables?: Record<string, number | string>;
  requestInit?: RequestInit;
  searchParams?: Record<string, number | string | undefined>;
};

export type RequestFunction = (
  options?: RequestOptions,
) => HandledError<Request, Error | z.ZodError>;

export type FetchOptions = RequestOptions & { cacheInterval?: number };

export type FetchFunction = (
  options?: FetchOptions,
) =>
  | HandledError<Response | undefined, Error | z.ZodError>
  | Promise<HandledError<Response | undefined, Error>>;
