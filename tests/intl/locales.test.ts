import { describe, expect, it } from 'vitest';

import { getLocales } from '../../src/intl/locales.ts';

describe('locales', () => {
  it('should get all locales', () => {
    expect(getLocales()).toHaveLength(391);
  });
});
