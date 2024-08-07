import { openDB } from "idb";
import attempt from "lodash/attempt.js";
import isError from "lodash/isError.js";
import isNil from "lodash/isNil.js";

import { isBrowser } from "../is/browser.ts";
import { requestKeys } from "./request-keys.ts";

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
  private _cacheInterval: number;

  private readonly _cacheKey: string;

  private static readonly _DB_KEY = "key";

  private static readonly _DB_NAME = "requests";

  private readonly _request: Request;

  private readonly getRequestDatabase = async () => {
    const DB_VERSION = 1;

    return attempt(async () => {
      return openDB<typeof Fetcher._DB_NAME>(Fetcher._DB_NAME,
        DB_VERSION,
        {
          upgrade(database_) {
            const store = database_.createObjectStore(Fetcher._DB_NAME,
              {
                keyPath: Fetcher._DB_KEY,
              });
            store.createIndex(Fetcher._DB_KEY,
              Fetcher._DB_KEY);
          },
        });
    });
  };

  public constructor({ cacheInterval, cacheKey, request }: FetcherOptions) {
    this._cacheKey = cacheKey ?? "cache";
    this._cacheInterval = cacheInterval ?? 0;
    this._request = request;
  }

  public async cacheBust() {
    const database = await this.getRequestDatabase();

    if (isError(database)) {
      return database;
    }

    const requestKey = this.getRequestKeys();
    await database.delete(Fetcher._DB_NAME,
      requestKey.join(","));
  }

  public async fetch(): Promise<Error | Response | undefined> {
    if (
      !isBrowser ||
      isNil(this._cacheInterval) ||
      0 >= this._cacheInterval ||
      "GET" !== this._request.method
    ) {
      return attempt(async () => {
        return fetch(this._request);
      });
    }

    const cache = await caches.open(this._cacheKey);
    const requestKey = this.getRequestKeys();
    const database = await this.getRequestDatabase();

    if (isError(database)) {
      return database;
    }

    const expired = await this.isExpired();

    if (isError(expired)) {
      return expired;
    }

    if (expired) {
      await cache.delete(this._request);
    }

    const cachedResponse = await cache.match(this._request);
    if (!isNil(cachedResponse)) {
      return cachedResponse;
    }

    const expires = new Date();
    expires.setSeconds(expires.getSeconds() + this._cacheInterval);

    const results = await attempt(async () => {
      return Promise.all([
        cache.add(this._request),
        database
          .transaction(Fetcher._DB_NAME,
            "readwrite")
          .objectStore(Fetcher._DB_NAME)
          .put({
            expires,
            key: requestKey.join(","),
          } satisfies RequestMeta),
      ]);
    });

    if (isError(results)) {
      return results;
    }

    return attempt(async () => {
      return cache.match(this._request);
    });
  }

  public getRequestKeys(): string[] {
    return requestKeys(this.request);
  }

  public async isExpired(): Promise<boolean | Error> {
    const database = await this.getRequestDatabase();

    if (isError(database)) {
      return database;
    }

    const requestKey = this.getRequestKeys();
    const cachedMeta = (await database.get(
      Fetcher._DB_NAME,
      requestKey.join(","),
    )) as RequestMeta | undefined;

    if (cachedMeta === undefined) {
      return true;
    }

    return new Date() >= cachedMeta.expires;
  }

  public get cacheInterval(): number {
    return this._cacheInterval;
  }

  public set cacheInterval(interval: number) {
    this._cacheInterval = interval;
  }

  public get cacheKey(): string {
    return this._cacheKey;
  }

  public get request(): Request {
    return this._request;
  }
}

export const createFetcher = (options: FetcherOptions): Fetcher => {
  return new Fetcher(options);
};
