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
  ])('should get accept language', (header, result) => {
    expect(getAcceptLanguage(header)).toStrictEqual(result);
  });
});
