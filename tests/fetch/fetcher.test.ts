import { describe, expect, it } from 'vitest';

import { fetcher } from '../../src/fetch/fetcher.ts';

describe('fetcher', () => {
  it('should fetch with interval', async () => {
    const exampleFetch = fetcher({
      cacheInterval: 60,
      cacheKey: 'myCache',
      request: new Request('https://jsonplaceholder.typicode.com/todos/1', {
        headers: {
          Vary: 'en-US',
        },
      }),
    });

    expect(exampleFetch.cacheInterval).toBe(60);
    expect(exampleFetch.cacheKey).toBe('myCache');
    expect(exampleFetch.getRequestKey()).toBe(
      'GET_https://jsonplaceholder.typicode.com/todos/1_en-US',
    );

    const result = await exampleFetch.fetch();

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.data?.ok).toBe(true);
    }
  });
});
