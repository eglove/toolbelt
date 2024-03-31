import isError from 'lodash/isError.js';
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

    expect(isError(exampleUrl.url)).toBe(false);
    expect(exampleUrl.url).toBeInstanceOf(URL);

    if (exampleUrl.url instanceof URL) {
      expect(exampleUrl.url.searchParams).toStrictEqual(
        new URLSearchParams({
          filter: 'done',
          orderBy: 'due',
        }),
      );

      expect(exampleUrl.url.toString()).toBe(
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

    expect(isError(multiUrl.url)).toBe(false);
    expect(multiUrl.url).toBeInstanceOf(URL);

    if (multiUrl.url instanceof URL) {
      const searchParameters = new URLSearchParams();
      searchParameters.append('filter', 'done');
      searchParameters.append('filter', 'recent');
      searchParameters.append('filter', 'expired');

      expect(multiUrl.url.searchParams).toStrictEqual(searchParameters);
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

    expect(isError(badUrl.url)).toBe(true);
    expect(badUrl.url).toBeInstanceOf(ZodError);
  });

  it('should return error if path variables are found but schema is not', () => {
    const builder = urlBuilder('todos', {
      pathVariables: { id: 1 },
      urlBase: 'http://example.com',
    });

    expect(isError(builder.url)).toBe(true);
    expect(builder.url).toBeInstanceOf(Error);
    if (builder.url instanceof Error) {
      expect(builder.url.message).toBe('must provide path variables schema');
    }
  });

  it('should return error for invalid url', () => {
    const builder = urlBuilder('todos', {
      urlBase: undefined,
    });

    expect(isError(builder.url)).toBe(true);
    expect(builder.url).toBeInstanceOf(Error);

    if (builder.url instanceof Error) {
      expect(builder.url.message).toBe('Invalid URL');
    }
  });

  it('should return error for incorrect search params schema', () => {
    const builder = urlBuilder('todos', {
      searchParams: { id: 1 },
      searchParamsSchema: z.object({ name: z.string() }),
      urlBase: 'https://example.com',
    });

    expect(isError(builder.url)).toBe(true);
    expect(builder.url).toBeInstanceOf(ZodError);
  });

  it('should return error is search params are provided but there is no schema', () => {
    const builder = urlBuilder('todos', {
      searchParams: { id: 1 },
      urlBase: 'https://example.com',
    });

    expect(isError(builder.url)).toBe(true);
    expect(builder.url).toBeInstanceOf(Error);

    if (builder.url instanceof Error) {
      expect(builder.url.message).toBe('must provide search parameters schema');
    }
  });
});
