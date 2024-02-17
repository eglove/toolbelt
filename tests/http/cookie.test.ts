import { describe, expect, it } from 'vitest';

import { getCookieValue } from '../../src/http/cookie.ts';

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
});
