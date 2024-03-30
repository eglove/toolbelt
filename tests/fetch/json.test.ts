import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';

import { parseFetchJson } from '../../src/fetch/json.ts';

describe('fetch json', () => {
  it('should parse request body correctly', async () => {
    const request = new Request('http://example.com', {
      body: JSON.stringify({ json: 'stuff' }),
      method: 'POST',
    });

    const results = await parseFetchJson(
      request,
      z.object({ json: z.string() }),
    );

    expect(results.isSuccess).toBe(true);

    if (results.isSuccess) {
      expect(results.data).toStrictEqual({ json: 'stuff' });
    }
  });

  it('should parse response body correctly', async () => {
    const response = new Response(
      JSON.stringify({
        json: 'stuff',
      }),
    );

    const results = await parseFetchJson(
      response,
      z.object({ json: z.string() }),
    );

    expect(results.isSuccess).toBe(true);

    if (results.isSuccess) {
      expect(results.data).toStrictEqual({ json: 'stuff' });
    }
  });
});

describe('error cases', () => {
  it('should return ZodError when validation is incorrect', async () => {
    const request = new Request('http://example.com', {
      body: JSON.stringify({ fail: 0 }),
      method: 'POST',
    });

    const results = await parseFetchJson(
      request,
      z.object({ fail: z.string() }),
    );

    expect(results.isSuccess).toBe(false);

    if (!results.isSuccess && results.error instanceof ZodError) {
      expect(results.error.issues[0].message).toStrictEqual(
        'Expected string, received number',
      );
    }
  });

  it('should return ZodError when validation is incorrect with array', async () => {
    const request = new Request('http://example.com', {
      body: JSON.stringify({ fail: 0 }),
      method: 'POST',
    });

    const results = await parseFetchJson(
      request,
      z.array(z.object({ fail: z.string() })),
    );

    expect(results.isSuccess).toBe(false);

    if (!results.isSuccess && results.error instanceof ZodError) {
      expect(results.error.issues[0].message).toStrictEqual(
        'Expected array, received object',
      );
    }
  });

  it('should return error with invalid JSON', async () => {
    const request = new Request('http://example.com', {
      body: '',
      method: 'POST',
    });

    const results = await parseFetchJson(
      request,
      z.array(z.object({ fail: z.string() })),
    );

    expect(results.isSuccess).toBe(false);

    if (!results.isSuccess && results.error instanceof ZodError) {
      expect(results.error.issues[0].message).toStrictEqual(
        'Expected array, received object',
      );
    }
  });
});
