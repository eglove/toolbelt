import type { ReadonlyDeep } from "type-fest";

const categorizeResults = <K extends PropertyKey, T>(
  promiseKeys: readonly K[],
  results: ReadonlyDeep<PromiseSettledResult<Awaited<T>>[]>,
) => {
  let settledPromises = {} as Record<K, Awaited<T> | Error>;

  for (const [index, key] of promiseKeys.entries()) {
    const result = results[index];

    if (result.status === "fulfilled") {
      settledPromises = {
        ...settledPromises,
        [key]: result.value,
      };
    }

    if (result.status === "rejected") {
      settledPromises[key] = result.reason as Error;
    }
  }

  return settledPromises;
};

export const promiseAllSettled = async <
  K extends PropertyKey,
  T extends Record<K, Promise<unknown>>,
>(
  promises: T,
) => {
  const promiseKeys = Object.keys(promises) as K[];
  const promiseValues = Object.values(promises);
  const results = await Promise.allSettled(promiseValues);

  return categorizeResults(promiseKeys, results) as {
    [P in keyof T]: Awaited<T[P]> | Error;
  };
};
