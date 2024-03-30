import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';

import { urlBuilder } from '../../src/fetch/url-builder.ts';

// eslint-disable-next-line max-lines-per-function
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

  it('should build url with an array of search params', () => {
    const multiUrl = urlBuilder('todos/:id', {
      searchParams: { filter: ['done', 'recent', 'expired'] },
      searchParamsSchema: z.object({
        filter: z.string().or(z.array(z.string())),
      }),
      urlBase: 'https://jsonplaceholder.typicode.com',
    });

    expect(multiUrl.url.isSuccess).toBe(true);

    if (multiUrl.url.isSuccess) {
      const searchParameters = new URLSearchParams();
      searchParameters.append('filter', 'done');
      searchParameters.append('filter', 'recent');
      searchParameters.append('filter', 'expired');

      expect(multiUrl.url.data.searchParams).toStrictEqual(searchParameters);
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

  it('should return error if path variables are found but schema is not', () => {
    const builder = urlBuilder('todos', {
      pathVariables: { id: 1 },
      urlBase: 'http://example.com',
    });

    expect(builder.url.isSuccess).toBe(false);

    if (!builder.url.isSuccess) {
      expect(builder.url.error.message).toBe(
        'must provide path variables schema',
      );
    }
  });

  it('should return error for invalid url', () => {
    const builder = urlBuilder('todos', {
      urlBase: undefined,
    });

    expect(builder.url.isSuccess).toBe(false);

    if (!builder.url.isSuccess) {
      expect(builder.url.error.message).toBe('Invalid URL');
    }
  });

  it('should return error for incorrect search params schema', () => {
    const builder = urlBuilder('todos', {
      searchParams: { id: 1 },
      searchParamsSchema: z.object({ name: z.string() }),
      urlBase: 'https://example.com',
    });

    expect(builder.url.isSuccess).toBe(false);

    if (!builder.url.isSuccess) {
      expect(builder.url.error).toBeInstanceOf(ZodError);
    }
  });

  it('should return error is search params are provided but there is no schema', () => {
    const builder = urlBuilder('todos', {
      searchParams: { id: 1 },
      urlBase: 'https://example.com',
    });

    expect(builder.url.isSuccess).toBe(false);

    if (!builder.url.isSuccess) {
      expect(builder.url.error.message).toBe(
        'must provide search parameters schema',
      );
    }
  });
});
