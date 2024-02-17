import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';

import { urlBuilder } from '../../src/fetch/url-builder.ts';

describe('url builder', () => {
  it('build the url', () => {
    const exampleUrl = urlBuilder('todos/:id', {
      pathVariables: { id: 2 },
      pathVariablesSchema: z.object({ id: z.number() }),
      searchParams: { filter: 'done', orderBy: 'due' },
      searchParamsSchema: z.object({ filter: z.string(), orderBy: z.string() }),
      urlBase: 'https://jsonplaceholder.typicode.com',
    });

    expect(exampleUrl.url.isSuccess).toBe(true);

    if (exampleUrl.url.isSuccess) {
      expect(exampleUrl.url.data.searchParams).toStrictEqual(
        new URLSearchParams({
          filter: 'done',
          orderBy: 'due',
        }),
      );

      expect(exampleUrl.url.data.toString()).toBe(
        'https://jsonplaceholder.typicode.com/todos/2?filter=done&orderBy=due',
      );
    }
  });

  it('should fail with bad urls', () => {
    const badUrl = urlBuilder('bad-url', {
      pathVariables: { id: 'invalid' },
      pathVariablesSchema: z.object({ id: z.number() }),
      searchParams: { filter: 'done', orderBy: 'due' },
      searchParamsSchema: z.object({ filter: z.string(), orderBy: z.string() }),
      urlBase: 'https://jsonplaceholder.typicode.com',
    });

    expect(badUrl.url.isSuccess).toBe(false);

    if (!badUrl.url.isSuccess) {
      expect(badUrl.url.error).toBeInstanceOf(ZodError);
    }
  });
});
