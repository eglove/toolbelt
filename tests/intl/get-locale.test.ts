import { describe, expect, it } from 'vitest';

import { getLocale } from '../../src/intl/get-locale.ts';

describe('getLocale', () => {
  it('should return the correct locale when sourceType is accept-language and language is not null', () => {
    const source = new Headers({ 'accept-language': 'en-US' });
    const locale = getLocale('accept-language', source);
    expect(locale).toEqual('en-US');
  });

  it('should return the correct locale when sourceType is cookie and cookie value is success', () => {
    const source = 'locale=en-US; test=test';
    const locale = getLocale('cookie', source, 'locale');
    expect(locale).toEqual('en-US');
  });

  it('should return undefined when sourceType is cookie and cookie value is not success', () => {
    const source = 'test=test';
    const locale = getLocale('cookie', source, 'locale');
    expect(locale).toBeUndefined();
  });

  it('should return undefined when sourceType is localStorage and localStorage is null', () => {
    const locale = getLocale('localStorage', 'locale');
    expect(locale).toBeUndefined();
  });
});
