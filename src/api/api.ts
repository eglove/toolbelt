import { fetcher } from '../fetch/fetcher.ts';
import { urlBuilder } from '../fetch/url-builder.ts';
import { isNil } from '../is/nil.ts';
import { parseJson } from '../json/json.ts';
import { merge } from '../object/merge.ts';
import type { HandledError } from '../types/error.ts';
import type {
  ApiConfig,
  FetchFunction,
  FetchOptions,
  RequestConfig,
  RequestFunction,
  RequestOptions,
} from './api-types.ts';
import type { Validate } from './validate-types.ts';

export class Api<T extends Record<string, Readonly<RequestConfig>>> {
  // @ts-expect-error initialized in constructor
  public readonly request: {
    [K in keyof T]: RequestFunction;
  } = {};

  // @ts-expect-error initialized in constructor
  public readonly fetch: {
    [K in keyof T]: FetchFunction;
  } = {};

  private readonly config: ApiConfig<T>;
  private readonly globalCacheInterval: number;

  public constructor(config: ApiConfig<T>) {
    this.config = config;
    this.globalCacheInterval = config.cacheInterval ?? 0;

    for (const key of Object.keys(this.config.requests)) {
      this.request[key as keyof T] = this.generateRequestMethod(key);
      this.fetch[key as keyof T] = this.generateFetchMethod(key);
    }
  }

  private generateFetchMethod(key: string): FetchFunction {
    return async (options?: FetchOptions) => {
      const request = this.request[key](options);

      if (!request.isSuccess) {
        return request;
      }

      return fetcher({
        cacheInterval: options?.cacheInterval ?? this.globalCacheInterval,
        request: request.data,
      }).fetch();
    };
  }

  // eslint-disable-next-line max-lines-per-function
  private generateRequestMethod(key: string): RequestFunction {
    const requestConfig = this.config.requests[key];

    // eslint-disable-next-line max-statements
    return (options?: RequestOptions): HandledError<Request, Error> => {
      const bodyValidation = this.validateBody(requestConfig, options);

      if (!bodyValidation.isSuccess) {
        return bodyValidation;
      }

      const builder = urlBuilder(requestConfig.path, {
        pathVariables: options?.pathVariables,
        pathVariablesSchema: requestConfig.pathVariableSchema,
        searchParams: options?.searchParams,
        searchParamsSchema: requestConfig.searchParamSchema,
        urlBase: this.config.baseUrl,
      });

      if (!builder.url.isSuccess) {
        return builder.url;
      }

      const requestInit: RequestInit = merge(
        {} as RequestInit,
        false,
        this.config.defaultRequestInit,
        requestConfig.defaultRequestInit,
        options?.requestInit,
      );

      return {
        data: new Request(builder.url.data, requestInit),
        isSuccess: true,
      };
    };
  }

  private validateBody(
    requestConfig: RequestConfig,
    options?: RequestOptions,
  ): Validate<typeof requestConfig.bodySchema> {
    if (!isNil(requestConfig.bodySchema)) {
      const bodyInit = options?.requestInit?.body;

      if (typeof bodyInit === 'string') {
        return parseJson(bodyInit, requestConfig.bodySchema);
      }

      const parsedBodyInit = requestConfig.bodySchema.safeParse(bodyInit);

      if (!parsedBodyInit.success) {
        return { error: parsedBodyInit.error, isSuccess: false };
      }

      return { data: parsedBodyInit.data, isSuccess: true };
    }

    return { data: undefined, isSuccess: true };
  }
}
