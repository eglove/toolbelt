import type { QueryOptions as TanStackQueryOptions } from '@tanstack/query-core';
import forEach from 'lodash/forEach.js';
import get from 'lodash/get.js';
import isNil from 'lodash/isNil.js';
import merge from 'lodash/merge.js';
import type { z, ZodError } from 'zod';

import { createFetcher } from '../fetch/fetcher.ts';
import { parseFetchJson } from '../fetch/json.ts';
import { requestKey } from '../fetch/request-key.ts';
import { urlBuilder } from '../fetch/url-builder.ts';
import { parseJson } from '../json/json.ts';
import type { HandledError } from '../types/error.ts';
import type { ZodValidator } from '../types/zod-validator.js';
import type {
  ApiConstructor,
  ParameterOptions,
  ParameterRequestOptions,
  QueryOptions,
  RequestConfig,
  RequestConfigObject,
  RequestDetails,
} from './api-types.ts';

export class Api<T extends RequestConfigObject> {
  private readonly _baseUrl: string;
  private readonly _defaultRequestInit?: RequestInit;
  private readonly _requestConfig?: RequestConfigObject;
  private readonly _defaultCacheInterval?: number;
  // @ts-expect-error initialized in constructor
  private readonly _request: { [K in keyof T]: RequestDetails } = {};

  public constructor({
    baseUrl,
    requests,
    defaultRequestInit,
    defaultCacheInterval,
  }: ApiConstructor<T>) {
    this._defaultCacheInterval = defaultCacheInterval;
    this._baseUrl = baseUrl;
    this._defaultRequestInit = defaultRequestInit;
    this._requestConfig = requests;
    this.generateRequests();
  }

  public get baseUrl() {
    return this._baseUrl;
  }

  public get init() {
    return this._request;
  }

  private generateRequests() {
    forEach(this._requestConfig, (item, key) => {
      this._request[key as keyof T] = {
        fetch: async (options?: QueryOptions) => {
          return this.fetch(item, options);
        },
        fetchJson: async <T extends ZodValidator>(
          options?: ParameterRequestOptions,
        ) => {
          return this.fetchJson<T>(item, options);
        },
        keys: (options?: ParameterRequestOptions) => {
          return this.createKeys(item, options);
        },
        queryOptions: (options?: QueryOptions) => {
          return this.createQueryOptions(item, options);
        },
        request: (options?: ParameterRequestOptions) => {
          return this.createRequest(item, options);
        },
        url: (options?: ParameterOptions) => {
          const request = this.createRequest(item, options);

          if (!request.isSuccess) {
            return { error: request.error, isSuccess: false };
          }

          return { data: new URL(request.data.url), isSuccess: true };
        },
      };
    });
  }

  private async fetch(
    item: RequestConfig,
    options?: QueryOptions,
  ): Promise<HandledError<Response | undefined, Error | ZodError>> {
    const fetchRequest = this.createRequest(item, options);

    if (!fetchRequest.isSuccess) {
      return { error: fetchRequest.error, isSuccess: false };
    }

    const fetcher = createFetcher({
      cacheInterval:
        this._defaultCacheInterval ??
        item.cacheInterval ??
        options?.cacheInterval,
      request: fetchRequest.data,
    });

    const response = await fetcher.fetch();

    if (!response.isSuccess) {
      return { error: response.error, isSuccess: false };
    }

    return { data: response.data, isSuccess: true };
  }

  private async fetchJson<T extends ZodValidator>(
    item: RequestConfig,
    options?: QueryOptions,
  ): Promise<HandledError<z.output<T>, Error | ZodError>> {
    const response = await this.fetch(item, options);

    if (!response.isSuccess) {
      return { error: response.error, isSuccess: false };
    }

    if (isNil(response.data)) {
      return { error: new Error('failed to get response'), isSuccess: false };
    }

    if (isNil(item.bodySchema)) {
      return { error: new Error('no bodySchema provided'), isSuccess: false };
    }

    // @ts-expect-error force this
    return parseFetchJson<T>(response.data, item.bodySchema);
  }

  private createKeys(
    item: RequestConfig,
    options?: ParameterRequestOptions,
  ): HandledError<string[], Error | ZodError> {
    const request = this.createRequest(item, options);

    if (!request.isSuccess) {
      return { error: request.error, isSuccess: false };
    }

    return {
      data: [requestKey(request.data)],
      isSuccess: true,
    };
  }

  private createQueryOptions(
    item: RequestConfig,
    options?: QueryOptions,
  ): HandledError<TanStackQueryOptions, Error | ZodError> {
    const keys = this.createKeys(item, options);

    if (!keys.isSuccess) {
      return { error: keys.error, isSuccess: false };
    }

    const queryOptions = {
      queryFn: async () => {
        return this.fetchJson(item, options);
      },
      queryKey: keys.data,
      ...options?.queryOptions,
    } satisfies TanStackQueryOptions;

    return { data: queryOptions, isSuccess: true };
  }

  private createRequest(
    requestConfig: RequestConfig,
    options?: QueryOptions,
  ): HandledError<Request, Error | ZodError> {
    const result = this.validateRequestBody(requestConfig, options);

    if (!result.isSuccess) {
      return { error: result.error, isSuccess: false };
    }

    const builder = urlBuilder(requestConfig.path, {
      pathVariables: options?.pathVariables,
      pathVariablesSchema: requestConfig.pathSchema,
      searchParams: options?.searchParams,
      searchParamsSchema: requestConfig.searchParamsSchema,
      urlBase: this._baseUrl,
    });

    if (!builder.url.isSuccess) {
      return builder.url;
    }

    const requestInit = merge(
      {},
      this._defaultRequestInit,
      requestConfig.defaultRequestInit,
      options?.requestInit,
    );

    return {
      data: new Request(builder.url.data, requestInit),
      isSuccess: true,
    };
  }

  private validateRequestBody(
    requestConfig: RequestConfig,
    options?: ParameterRequestOptions,
  ): HandledError<undefined, Error | ZodError> {
    const body = get(options, 'requestInit.body');

    if (isNil(requestConfig.bodySchema) && !isNil(body)) {
      return { error: new Error('no bodySchema provided'), isSuccess: false };
    }

    if (!isNil(requestConfig.bodySchema) && !isNil(body)) {
      if (typeof body === 'string') {
        return this.validateRequestBodyString(body, requestConfig.bodySchema);
      }

      const parsed = requestConfig.bodySchema.safeParse(body);

      if (!parsed.success) {
        return { error: parsed.error, isSuccess: false };
      }
    }

    return { data: undefined, isSuccess: true };
  }

  private validateRequestBodyString(
    body: string,
    bodySchema: ZodValidator,
  ): HandledError<undefined, Error | ZodError> {
    const parsedString = parseJson(body, bodySchema);

    return parsedString.isSuccess
      ? { data: undefined, isSuccess: true }
      : { error: parsedString.error, isSuccess: false };
  }
}
