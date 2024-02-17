import type { HandledError } from '../types/error.js';

const categorizeResults = <K extends PropertyKey, T>(
  promiseKeys: K[],
  results: PromiseSettledResult<Awaited<T>>[],
) => {
  const settledPromises = {} as Record<K, HandledError<Awaited<T>, Error>>;

  for (const [index, key] of promiseKeys.entries()) {
    const result = results[index];

    if (result.status === 'fulfilled') {
      settledPromises[key] = { data: result.value, isSuccess: true };
    }

    if (result.status === 'rejected') {
      settledPromises[key] = {
        error: result.reason as Error,
        isSuccess: false,
      };
    }
  }

  return settledPromises;
};

export async function promiseAllSettled<
  K extends PropertyKey,
  T extends Record<K, Promise<unknown>>,
>(promises: T) {
  const promiseKeys = Object.keys(promises) as K[];
  const promiseValues = Object.values(promises);

  const results = await Promise.allSettled(promiseValues);

  return categorizeResults(promiseKeys, results) as {
    [P in keyof T]: HandledError<Awaited<T[P]>, Error>;
  };
}
