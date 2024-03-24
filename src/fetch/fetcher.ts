import type { IDBPDatabase } from 'idb';
import { openDB } from 'idb';

import { tryCatchAsync } from '../functional/try-catch.ts';
import { isBrowser } from '../is/browser.ts';
import { isNil } from '../is/nil.ts';
import type { HandledError } from '../types/error.ts';

type FetcherOptions = {
  cacheInterval?: number;
  cacheKey?: string;
  request: Request;
};

type RequestMeta = {
  expires: Date;
  key: string;
};

class Fetcher {
  private static readonly _DB_NAME = 'requests';
  private static readonly _DB_KEY = 'key';

  private _cacheInterval: number;
  private readonly _cacheKey: string;
  private readonly _request: Request;

  public constructor({ cacheKey, cacheInterval, request }: FetcherOptions) {
    this._cacheKey = cacheKey ?? 'cache';
    this._cacheInterval = cacheInterval ?? 0;
    this._request = request;
  }

  public get request(): Request {
    return this._request;
  }

  public get cacheKey(): string {
    return this._cacheKey;
  }

  public get cacheInterval(): number {
    return this._cacheInterval;
  }

  public set cacheInterval(interval: number) {
    this._cacheInterval = interval;
  }

  // eslint-disable-next-line max-lines-per-function,max-statements
  public async fetch(): Promise<HandledError<Response | undefined, Error>> {
    if (
      !isBrowser ||
      isNil(this._cacheInterval) ||
      this._cacheInterval <= 0 ||
      this._request.method !== 'GET'
    ) {
      return tryCatchAsync(async () => {
        return fetch(this._request);
      });
    }

    const cache = await caches.open(this._cacheKey);
    const requestKey = this.getRequestKey();
    const database = await this.getRequestDatabase();

    if (!database.isSuccess) {
      return database;
    }

    const expired = await this.isExpired();

    if (!expired.isSuccess) {
      return expired;
    }

    if (expired.data) {
      await cache.delete(this._request);
    }

    const cachedResponse = await cache.match(this._request);
    if (cachedResponse) {
      return { data: cachedResponse, isSuccess: true };
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this._cacheInterval);

    const results = await tryCatchAsync(async () => {
      return Promise.all([
        cache.add(this._request),
        database.data
          .transaction(Fetcher._DB_NAME, 'readwrite')
          .objectStore(Fetcher._DB_NAME)
          .put({ expires, key: requestKey } satisfies RequestMeta),
      ]);
    });

    if (!results.isSuccess) {
      return results;
    }

    return tryCatchAsync(async () => {
      return cache.match(this._request);
    });
  }

  public getRequestKey(): string {
    const varyHeader = this._request.headers.get('Vary');

    return `${
      this._request.method
    }_${this._request.url}${isNil(varyHeader) ? '' : `_${varyHeader}`}`;
  }

  public async isExpired(): Promise<HandledError<boolean, Error>> {
    const database = await this.getRequestDatabase();

    if (!database.isSuccess) {
      return database;
    }

    const requestKey = this.getRequestKey();

    const cachedMeta = (await database.data.get(
      Fetcher._DB_NAME,
      requestKey,
    )) as RequestMeta | undefined;

    if (cachedMeta === undefined) {
      return { data: true, isSuccess: true };
    }

    return { data: new Date() >= cachedMeta.expires, isSuccess: true };
  }

  public async cacheBust() {
    const database = await this.getRequestDatabase();

    if (!database.isSuccess) {
      return database;
    }

    const requestKey = this.getRequestKey();
    await database.data.delete(Fetcher._DB_NAME, requestKey);
  }

  private readonly getRequestDatabase = async (): Promise<
    HandledError<
      Awaited<ReturnType<() => Promise<IDBPDatabase<typeof Fetcher._DB_NAME>>>>,
      Error
    >
  > => {
    const DB_VERSION = 1;

    return tryCatchAsync(async () => {
      return openDB<typeof Fetcher._DB_NAME>(Fetcher._DB_NAME, DB_VERSION, {
        upgrade(database_) {
          const store = database_.createObjectStore(Fetcher._DB_NAME, {
            keyPath: Fetcher._DB_KEY,
          });
          store.createIndex(Fetcher._DB_KEY, Fetcher._DB_KEY);
        },
      });
    });
  };
}

export function fetcher(options: FetcherOptions): Fetcher {
  return new Fetcher(options);
}
