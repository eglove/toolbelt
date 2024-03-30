import { describe, expect, it } from 'vitest';

import { getAcceptLanguage } from '../../src/http/headers.ts';

describe('headers', () => {
  it.each([
    [
      'en-US,en;q=0.9',
      [
        { country: 'US', language: 'en', name: 'en-US', quality: 1 },
        { country: undefined, language: 'en', name: 'en', quality: 0.9 },
      ],
    ],
    [
      'en-US,en;q=0.9,fr;q=0.8,de;q=0.7',
      [
        {
          country: 'US',
          language: 'en',
          name: 'en-US',
          quality: 1,
        },
        {
          country: undefined,
          language: 'en',
          name: 'en',
          quality: 0.9,
        },
        {
          country: undefined,
          language: 'fr',
          name: 'fr',
          quality: 0.8,
        },
        {
          country: undefined,
          language: 'de',
          name: 'de',
          quality: 0.7,
        },
      ],
    ],
    [
      new Headers({ 'accept-language': 'en-US,en;q=0.9' }),
      [
        { country: 'US', language: 'en', name: 'en-US', quality: 1 },
        { country: undefined, language: 'en', name: 'en', quality: 0.9 },
      ],
    ],
  ])('should get accept language', (header, result) => {
    const value = getAcceptLanguage(header);

    expect(value.isSuccess).toBe(true);
    if (value.isSuccess) {
      expect(value.data).toStrictEqual(result);
    }
  });

  it('should return error if accept-language source is not found', () => {
    const headers = new Headers();

    const result = getAcceptLanguage(headers);

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toBe('accept-language not found');
    }
  });
});
