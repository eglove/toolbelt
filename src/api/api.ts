import type {
  QueryClient,
  QueryOptions as TanStackQueryOptions,
} from '@tanstack/query-core';
import forEach from 'lodash/forEach.js';
import get from 'lodash/get.js';
import isError from 'lodash/isError.js';
import isNil from 'lodash/isNil.js';
import merge from 'lodash/merge.js';
import type { z, ZodError } from 'zod';

import { cacheBust } from '../fetch/cache-bust.ts';
import { createUrl } from '../fetch/create-url.ts';
import { createFetcher } from '../fetch/fetcher.ts';
import { parseFetchJson } from '../fetch/json.ts';
import { requestKey } from '../fetch/request-key.ts';
import { parseJson } from '../json/json.ts';
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
  private readonly _queryClient?: QueryClient;
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
    queryClient,
  }: ApiConstructor<T>) {
    this._queryClient = queryClient;
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
        invalidateRequest: async (
          options?: ParameterRequestOptions & QueryOptions,
        ) => {
          return this.invalidateRequest(item, options);
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

          if (isError(request)) {
            return request;
          }

          return new URL(request.url);
        },
      };
    });
  }

  private async fetch(
    item: RequestConfig,
    options?: QueryOptions,
  ): Promise<Error | Response | ZodError | undefined> {
    const fetchRequest = this.createRequest(item, options);

    if (isError(fetchRequest)) {
      return fetchRequest;
    }

    const fetcher = createFetcher({
      cacheInterval:
        this._defaultCacheInterval ??
        item.cacheInterval ??
        options?.cacheInterval,
      request: fetchRequest,
    });

    return fetcher.fetch();
  }

  private async fetchJson<T extends ZodValidator>(
    item: RequestConfig,
    options?: QueryOptions,
  ): Promise<Error | z.output<T> | ZodError> {
    const response = await this.fetch(item, options);

    if (isError(response)) {
      return response;
    }

    if (isNil(response)) {
      return new Error('failed to get response');
    }

    if (isNil(item.responseSchema)) {
      return new Error('no responseSchema provided');
    }

    // @ts-expect-error force this
    return parseFetchJson<T>(response, item.responseSchema);
  }

  private createKeys(
    item: RequestConfig,
    options?: ParameterRequestOptions,
  ): Error | string[] | ZodError {
    const request = this.createRequest(item, options);

    if (isError(request)) {
      return request;
    }

    return [requestKey(request)];
  }

  private createQueryOptions(
    item: RequestConfig,
    options?: QueryOptions,
  ): Error | TanStackQueryOptions | ZodError {
    const keys = this.createKeys(item, options);

    if (isError(keys)) {
      return keys;
    }

    return {
      queryFn: async () => {
        return this.fetchJson(item, options);
      },
      queryKey: keys,
      ...options?.queryOptions,
    } satisfies TanStackQueryOptions;
  }

  private createRequest(
    requestConfig: RequestConfig,
    options?: QueryOptions,
  ): Error | Request | ZodError {
    const result = this.validateRequestBody(requestConfig, options);

    if (isError(result)) {
      return result;
    }

    const url = createUrl(requestConfig.path, {
      pathVariables: options?.pathVariables,
      pathVariablesSchema: requestConfig.pathSchema,
      searchParams: options?.searchParams,
      searchParamsSchema: requestConfig.searchParamsSchema,
      urlBase: this._baseUrl,
    });

    if (isError(url)) {
      return url;
    }

    const requestInit = merge(
      {},
      this._defaultRequestInit,
      requestConfig.defaultRequestInit,
      options?.requestInit,
    );

    return new Request(url, requestInit);
  }

  private async invalidateRequest(
    requestConfig: RequestConfig,
    options?: QueryOptions,
  ) {
    const request = this.createRequest(requestConfig, options);
    const queryOptions = this.createQueryOptions(requestConfig, options);

    if (isError(request) || isError(queryOptions)) {
      return;
    }

    await cacheBust(request);
    await this._queryClient?.invalidateQueries(queryOptions);
  }

  private validateRequestBody(
    requestConfig: RequestConfig,
    options?: ParameterRequestOptions,
  ): Error | ZodError | undefined {
    const body = get(options, 'requestInit.body');

    if (isNil(requestConfig.bodySchema) && !isNil(body)) {
      return new Error('no bodySchema provided');
    }

    if (!isNil(requestConfig.bodySchema) && !isNil(body)) {
      if (typeof body === 'string') {
        return this.validateRequestBodyString(body, requestConfig.bodySchema);
      }

      const parsed = requestConfig.bodySchema.safeParse(body);

      if (!parsed.success) {
        return parsed.error;
      }
    }

    return undefined;
  }

  private validateRequestBodyString(
    body: string,
    bodySchema: ZodValidator,
  ): Error | ZodError | undefined {
    const parsedString = parseJson(body, bodySchema);

    return isError(parsedString) ? parsedString : undefined;
  }
}
