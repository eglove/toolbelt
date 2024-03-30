import { describe, expect, it } from 'vitest';
import { z, ZodError } from 'zod';

import { parseJson } from '../../src/json/json.ts';

describe('parse json', () => {
  it('should parse json string correctly', () => {
    const json = JSON.stringify({ json: 'stuff' });

    const results = parseJson(json, z.object({ json: z.string() }));

    expect(results.isSuccess).toBe(true);

    if (results.isSuccess) {
      expect(results.data).toStrictEqual({ json: 'stuff' });
    }
  });

  it('should return ZodError when validation is incorrect', () => {
    const json = JSON.stringify({ fail: 0 });

    const results = parseJson(json, z.object({ fail: z.string() }));

    expect(results.isSuccess).toBe(false);

    if (!results.isSuccess && results.error instanceof ZodError) {
      expect(results.error.issues[0].message).toStrictEqual(
        'Expected string, received number',
      );
    }
  });

  it('should return error for invalid JSON', () => {
    const results = parseJson('', z.object({ name: z.string() }));

    expect(results.isSuccess).toBe(false);

    if (!results.isSuccess) {
      expect(results.error.message).toBe('Unexpected end of JSON input');
    }
  });
});
