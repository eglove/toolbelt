import isError from 'lodash/isError.js';
import { describe, expect, it } from 'vitest';

import { getCookieValue, setCookieValue } from '../../src/http/cookie.ts';

// eslint-disable-next-line max-lines-per-function
describe('get cookie', () => {
  it('should get cookie from string', () => {
    // @ts-expect-error allow for test
    globalThis.document = { cookie: 'token=123; Secure;' };

    const value = getCookieValue('token', document.cookie);

    expect(isError(value)).toBe(false);
    expect(value).toBe('123');
  });

  it('should get cookies from headers', () => {
    const headers = new Headers();
    headers.append('Cookie', 'token=123; Secure; HttpOnly;');

    const value = getCookieValue('token', headers);

    expect(isError(value)).toBe(false);
    expect(value).toBe('123');
  });

  it('should set cookie', () => {
    const cookieName = 'test-cookie';
    const cookieValue = 'test-val';

    const mockResponse = new Response();

    setCookieValue({
      cookieName,
      cookieValue,
      response: mockResponse,
    });

    expect(mockResponse.headers.get('Set-Cookie')).toBe(
      `${cookieName}=${cookieValue}`,
    );
  });

  it('should set cookie with options', () => {
    const cookieName = 'test-cookie';
    const cookieValue = 'test-val';
    const expires = new Date();

    const config = {
      Expires: expires,
      HttpOnly: true,
      Path: '/some-path',
    };

    const mockResponse = new Response();

    setCookieValue({
      config,
      cookieName,
      cookieValue,
      response: mockResponse,
    });

    expect(mockResponse.headers.get('Set-Cookie')).toBe(
      `${cookieName}=${cookieValue}; Expires=${expires.toUTCString()}; HttpOnly; Path=${config.Path}`,
    );
  });

  it('should return error if cookiesource is not found', () => {
    globalThis.document = {
      // @ts-expect-error allow for test
      cookie: {
        get() {
          return null;
        },
      },
    };
    const value = getCookieValue('nonexistent', document.cookie);

    expect(isError(value)).toBe(true);
    expect(value).toBeInstanceOf(Error);
    if (value instanceof Error) {
      expect(value.message).toBe('cookies not found');
    }
  });

  it('should return error if the cookie is not found', () => {
    const value = getCookieValue('nope', '');

    expect(isError(value)).toBe(true);
    expect(value).toBeInstanceOf(Error);
    if (value instanceof Error) {
      expect(value.message).toBe('failed to get cookie');
    }
  });
});
