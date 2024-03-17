import { describe, expect, it } from 'vitest';

import { getCookieValue, setCookieValue } from '../../src/http/cookie.ts';

// eslint-disable-next-line max-lines-per-function
describe('get cookie', () => {
  it('should get cookie from string', () => {
    // @ts-expect-error allow for test
    globalThis.document = { cookie: 'token=123; Secure;' };

    const value = getCookieValue('token', document.cookie);

    expect(value.isSuccess).toBe(true);
    if (value.isSuccess) {
      expect(value.data).toBe('123');
    }
  });

  it('should get cookies from headers', () => {
    const headers = new Headers();
    headers.append('Cookie', 'token=123; Secure; HttpOnly;');

    const value = getCookieValue('token', headers);

    expect(value.isSuccess).toBe(true);
    if (value.isSuccess) {
      expect(value.data).toBe('123');
    }
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
});
