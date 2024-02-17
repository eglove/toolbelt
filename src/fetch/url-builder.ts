/* eslint-disable unicorn/consistent-destructuring */
import type { ZodError, ZodSchema } from 'zod';

import { tryCatch } from '../functional/try-catch.ts';
import { isNil } from '../is/nil.ts';
import { isObject } from '../is/object.ts';
import { isString } from '../is/string.ts';
import type { HandledError } from '../types/error.ts';

type PathVariablesRecord = Record<string, number | string>;
type SearchParametersRecord = Record<string, unknown> | string;

export type UrlConfig = {
  pathVariables?: PathVariablesRecord;
  pathVariablesSchema?: ZodSchema;
  searchParams?: SearchParametersRecord;
  searchParamsSchema?: ZodSchema;
  urlBase?: URL | string;
};

class UrlBuilder {
  // @ts-expect-error built in constructor
  private _url: HandledError<URL, Error | ZodError>;
  private readonly _configUrl: URL | string;
  private readonly _searchParameters?: SearchParametersRecord;
  private readonly _pathVariables?: PathVariablesRecord;
  private readonly _config: UrlConfig | undefined;
  private readonly _searchParametersSchema?: ZodSchema;
  private readonly _pathVariablesSchema?: ZodSchema;

  public constructor(urlString: URL | string, config?: UrlConfig) {
    this._configUrl = urlString;
    this._config = config;
    this._pathVariables = config?.pathVariables;
    this._searchParametersSchema = config?.searchParamsSchema;
    this._pathVariablesSchema = config?.pathVariablesSchema;
    this._searchParameters = config?.searchParams;
    this.buildUrl();
  }

  public get url(): HandledError<URL, Error | ZodError> {
    return this._url;
  }

  // eslint-disable-next-line max-statements,max-lines-per-function
  private buildUrl() {
    let urlString = this._configUrl.toString();

    const { _pathVariables, _pathVariablesSchema } = this;
    if (!isNil(_pathVariables)) {
      if (isNil(_pathVariablesSchema)) {
        this._url = {
          error: new Error('must provide path variables schema'),
          isSuccess: false,
        };
        return;
      }

      const parsePathVariables = _pathVariablesSchema.safeParse(
        this._pathVariables,
      );

      if (!parsePathVariables.success) {
        this._url = {
          error: parsePathVariables.error,
          isSuccess: parsePathVariables.success,
        };
        return;
      }

      for (const key in _pathVariables) {
        if (Object.hasOwn(_pathVariables, key)) {
          const includesColon = tryCatch(() => {
            return urlString.includes(':');
          });

          if (!includesColon.isSuccess) {
            this._url = includesColon;
            return;
          }

          if (includesColon.data) {
            const replaced = tryCatch(() => {
              return urlString.replaceAll(
                new RegExp(`:${key}`, 'gu'),
                String(_pathVariables[key]),
              );
            });

            // eslint-disable-next-line max-depth
            if (!replaced.isSuccess) {
              this._url = replaced;
              return;
            }

            urlString = replaced.data;
          }
        }
      }
    }

    const url = tryCatch(() => {
      return new URL(urlString, this._config?.urlBase);
    });

    if (!url.isSuccess) {
      this._url = url;
      return;
    }

    this._url = url;

    if (!isNil(this._searchParameters)) {
      const parameters = this.buildSearchParameters(this._searchParameters);

      if (!parameters.isSuccess) {
        this._url = parameters;
        return;
      }

      if (!isNil(parameters.data)) {
        for (const [key, value] of parameters.data.entries()) {
          this._url.data.searchParams.append(key, value);
        }
      }
    }
  }

  // eslint-disable-next-line max-statements
  private buildSearchParameters(
    parameters: UrlConfig['searchParams'],
  ): HandledError<URLSearchParams, Error | ZodError> {
    let searchParameters = new URLSearchParams();

    if (isString(parameters)) {
      searchParameters = new URLSearchParams(parameters);
    } else if (isObject(parameters)) {
      if (isNil(this._searchParametersSchema)) {
        return {
          error: new Error('must provide search parameters schema'),
          isSuccess: false,
        };
      }

      const parsedSearchParameters =
        this._searchParametersSchema.safeParse(parameters);

      if (!parsedSearchParameters.success) {
        return {
          error: parsedSearchParameters.error,
          isSuccess: parsedSearchParameters.success,
        };
      }

      for (const key in parameters) {
        if (Object.hasOwn(parameters, key)) {
          searchParameters.append(key, String(parameters[key]));
        }
      }
    }

    return { data: searchParameters, isSuccess: true };
  }
}

export function urlBuilder(urlString: string, config?: UrlConfig): UrlBuilder {
  return new UrlBuilder(urlString, config);
}
