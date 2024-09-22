import type {
  QueryClient,
  QueryKey,
  QueryOptions as TanStackQueryOptions,
} from "@tanstack/query-core";
import type { Merge } from "type-fest";
import type { z, ZodError } from "zod";

import forEach from "lodash/forEach.js";
import get from "lodash/get.js";
import isError from "lodash/isError.js";
import isNil from "lodash/isNil.js";
import isString from "lodash/isString.js";
import merge from "lodash/merge.js";

import type { ZodValidator } from "../types/zod-validator.js";
import type {
  ApiConstructor,
  ParameterOptions,
  ParameterRequestOptions,
  QueryOptions,
  RequestConfig,
  RequestConfigObject,
  RequestDetails,
} from "./api-types.ts";

import { cacheBust } from "../fetch/cache-bust.ts";
import { createUrl } from "../fetch/create-url.ts";
import { createFetcher } from "../fetch/fetcher.ts";
import { parseFetchJson } from "../fetch/json.ts";
import { requestKeys } from "../fetch/request-keys.ts";
import { parseJson } from "../json/json.ts";

export class Api<T extends RequestConfigObject,> {
  private readonly _baseUrl: string;

  private readonly _defaultCacheInterval?: number;

  private readonly _defaultRequestInit?: RequestInit;

  private readonly _queryClient?: QueryClient;

  // @ts-expect-error initialized in constructor
  private readonly _request: { [K in keyof T]: RequestDetails } = {};

  private readonly _requestConfig?: RequestConfigObject;

  private readonly validateRequestBodyString = <V extends ZodValidator<V>,>(
    body: string,
    bodySchema: ZodValidator<V>,
  ): Error | undefined | ZodError => {
    const parsedString = parseJson(body,
      bodySchema);

    return isError(parsedString)
      ? parsedString
      : undefined;
  };

  public constructor({
    baseUrl,
    defaultCacheInterval,
    defaultRequestInit,
    queryClient,
    requests,
  }: ApiConstructor<T>) {
    this._queryClient = queryClient;
    this._defaultCacheInterval = defaultCacheInterval;
    this._baseUrl = baseUrl;
    this._defaultRequestInit = defaultRequestInit;
    this._requestConfig = requests;
    this.generateRequests();
  }

  private createKeys(
    item: RequestConfig,
    options?: ParameterRequestOptions,
  ): Error | string[] | ZodError {
    const request = this.createRequest(item,
      options);

    if (isError(request)) {
      return request;
    }

    return requestKeys(request);
  }

  private createQueryOptions<V extends ZodValidator<V>,>(
    item: RequestConfig,
    options?: QueryOptions,
  ) {
    const keys = this.createKeys(item,
      options);

    return {
      queryFn: async () => {
        return this.fetchJson<V>(item,
          options);
      },
      queryKey: isError(keys)
        ? []
        : keys,
      ...options?.queryOptions,
    } as { queryKey: QueryKey } & TanStackQueryOptions<z.output<V>>;
  }

  private createRequest(
    requestConfig: RequestConfig,
    options?: QueryOptions,
  ): Error | Request | ZodError {
    const result = this.validateRequestBody(requestConfig,
      options);

    if (isError(result)) {
      return result;
    }

    const url = createUrl(requestConfig.path,
      {
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

    return new Request(url,
      requestInit);
  }

  private async fetch(
    item: RequestConfig,
    options?: QueryOptions,
  ): Promise<Error | Response | undefined | ZodError> {
    const fetchRequest = this.createRequest(item,
      options);

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

  private async fetchJson<Data extends ZodValidator<Data>,>(
    item: RequestConfig,
    options?: QueryOptions,
  ): Promise<Error | z.output<Data> | ZodError> {
    const response = await this.fetch(item,
      options);

    if (isError(response)) {
      return response;
    }

    if (isNil(response)) {
      return new Error("failed to get response");
    }

    if (isNil(item.responseSchema)) {
      return new Error("no responseSchema provided");
    }

    return parseFetchJson<Data>(response,
    // @ts-expect-error force this
      item.responseSchema);
  }

  private generateRequests() {
    forEach(this._requestConfig,
      (item, key) => {
        this._request[key as keyof T] = {
          fetch: async (options?: QueryOptions) => {
            return this.fetch(item,
              options);
          },
          fetchJson: async <Data extends ZodValidator<Data>,>(
            options?: ParameterRequestOptions,
          ) => {
            return this.fetchJson<Data>(item,
              options);
          },
          invalidateRequest: async (
            options?: Merge<ParameterRequestOptions, QueryOptions>,
          ) => {
            return this.invalidateRequest(item,
              options);
          },
          keys: (options?: ParameterRequestOptions) => {
            return this.createKeys(item,
              options);
          },
          queryOptions:
              <V extends ZodValidator<V>,>(options?: QueryOptions) => {
                return this.createQueryOptions<V>(item,
                  options);
              },
          request: (options?: ParameterRequestOptions) => {
            return this.createRequest(item,
              options);
          },
          url: (options?: ParameterOptions) => {
            const request = this.createRequest(item,
              options);

            if (isError(request)) {
              return request;
            }

            return new URL(request.url);
          },
        };
      });
  }

  private async invalidateRequest(
    requestConfig: RequestConfig,
    options?: QueryOptions,
  ) {
    const request = this.createRequest(requestConfig,
      options);
    const queryOptions = this.createQueryOptions(requestConfig,
      options);

    if (isError(request) || isError(queryOptions)) {
      return;
    }

    await cacheBust(request);
    await this._queryClient?.invalidateQueries(queryOptions);
  }

  private validateRequestBody(
    requestConfig: RequestConfig,
    options?: ParameterRequestOptions,
  ): Error | undefined | ZodError {
    if (true === requestConfig.skipBodyValidation) {
      return;
    }

    const body = get(options,
      "requestInit.body");

    if (isNil(requestConfig.bodySchema) && !isNil(body)) {
      return new Error("no bodySchema provided");
    }

    if (!isNil(requestConfig.bodySchema) && !isNil(body)) {
      if (isString(body)) {
        return this.validateRequestBodyString(body,
          requestConfig.bodySchema);
      }

      const parsed = requestConfig.bodySchema.safeParse(body);

      if (!parsed.success) {
        return parsed.error;
      }
    }

    return undefined;
  }

  public get baseUrl() {
    return this._baseUrl;
  }

  public get requests() {
    return this._request;
  }
}
