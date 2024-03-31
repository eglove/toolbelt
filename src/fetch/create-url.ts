/* eslint-disable unicorn/consistent-destructuring */
import attempt from 'lodash/attempt.js';
import isError from 'lodash/isError.js';
import isNil from 'lodash/isNil.js';
import type { ZodError, ZodSchema } from 'zod';

export type PathVariablesRecord = Record<string, number | string>;
export type SearchParametersRecord = Record<
  string,
  number[] | string[] | number | string | undefined
>;

export type UrlConfig = {
  pathVariables?: PathVariablesRecord;
  pathVariablesSchema?: ZodSchema;
  searchParams?: SearchParametersRecord;
  searchParamsSchema?: ZodSchema;
  urlBase?: URL | string;
};

class UrlBuilder {
  // @ts-expect-error built in constructor
  private _url: Error | URL | ZodError;
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

  public get url() {
    return this._url;
  }

  // eslint-disable-next-line max-statements,max-lines-per-function
  private buildUrl() {
    let urlString = this._configUrl.toString();

    const { _pathVariables, _pathVariablesSchema } = this;
    if (!isNil(_pathVariables)) {
      if (isNil(_pathVariablesSchema)) {
        this._url = new Error('must provide path variables schema');
        return;
      }

      const parsePathVariables = _pathVariablesSchema.safeParse(
        this._pathVariables,
      );

      if (!parsePathVariables.success) {
        this._url = parsePathVariables.error;
        return;
      }

      for (const key in _pathVariables) {
        if (Object.hasOwn(_pathVariables, key)) {
          const includesColon = urlString.includes(':');

          if (includesColon) {
            urlString = urlString.replaceAll(
              new RegExp(`:${key}`, 'gu'),
              String(_pathVariables[key]),
            );
          }
        }
      }
    }

    const url = attempt(() => {
      return new URL(urlString, this._config?.urlBase);
    });

    if (isError(url)) {
      this._url = url;
      return;
    }

    this._url = url;

    if (!isNil(this._searchParameters)) {
      const parameters = this.buildSearchParameters(this._searchParameters);

      if (isError(parameters)) {
        this._url = parameters;
        return;
      }

      if (!isNil(parameters)) {
        for (const [key, value] of parameters.entries()) {
          this._url.searchParams.append(key, value);
        }
      }
    }
  }

  // eslint-disable-next-line max-statements
  private buildSearchParameters(
    parameters: UrlConfig['searchParams'],
  ): Error | URLSearchParams | ZodError {
    const searchParameters = new URLSearchParams();

    if (isNil(this._searchParametersSchema)) {
      return new Error('must provide search parameters schema');
    }

    const parsedSearchParameters =
      this._searchParametersSchema.safeParse(parameters);

    if (!parsedSearchParameters.success) {
      return parsedSearchParameters.error;
    }

    for (const key in parameters) {
      if (Object.hasOwn(parameters, key)) {
        const values = parameters[key];

        if (Array.isArray(values)) {
          // eslint-disable-next-line max-depth
          for (const value of values) {
            // eslint-disable-next-line max-depth
            if (!isNil(value)) {
              searchParameters.append(key, String(value));
            }
          }
        } else if (!isNil(values)) {
          searchParameters.append(key, String(parameters[key]));
        }
      }
    }

    return searchParameters;
  }
}

export function createUrl(urlString: string, config?: UrlConfig) {
  return new UrlBuilder(urlString, config).url;
}
