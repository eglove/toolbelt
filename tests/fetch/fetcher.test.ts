import isError from 'lodash/isError.js';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createFetcher } from '../../src/fetch/fetcher.ts';

describe('fetcher', () => {
  const mockFetch = vi.fn();

  const mockOptions = {
    cacheInterval: 101,
    request: new Request('https://example.com'),
  };

  beforeEach(() => {
    globalThis.fetch = mockFetch;
  });

  it('should construct fetcher', () => {
    const fetcher = createFetcher(mockOptions);

    expect(fetcher.request).toBeInstanceOf(Request);
    expect(fetcher.cacheKey).toBe('cache');
    expect(fetcher.cacheInterval).toBe(101);
    expect(fetcher.getRequestKey()).toBe('GET,https://example.com,/');
  });

  it('should call fetch and return data', async () => {
    mockFetch.mockResolvedValueOnce({ data: true });

    const fetcher = createFetcher(mockOptions);
    const result = await fetcher.fetch();

    expect(isError(result)).toBe(false);
    expect(result).toStrictEqual({ data: true });
  });

  it('should be able to set new cache interval', () => {
    const fetcher = createFetcher(mockOptions);
    fetcher.cacheInterval = 22;

    expect(fetcher.cacheInterval).toBe(22);
  });
});
