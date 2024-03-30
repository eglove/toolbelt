import { describe, expect, it } from 'vitest';

import { requestKey } from '../../src/fetch/request-key.ts';

describe('request key', () => {
  it('should return correct key for GET request', () => {
    const request = new Request(
      'https://test.com/path?param1=test1&param2=test2',
      {
        headers: new Headers({ Vary: 'Accept-Language' }),
        method: 'GET',
      },
    );

    const result = requestKey(request);
    expect(result).toEqual(
      'GET,https://test.com,/path,param1=test1param2=test2,Accept-Language',
    );
  });

  it('should return correct key for POST request', () => {
    const request = new Request('https://test.com/path', {
      headers: new Headers({ Vary: 'Accept-Language' }),
      method: 'POST',
    });

    const result = requestKey(request);
    expect(result).toEqual('POST,https://test.com,/path,Accept-Language');
  });

  it('should return correct key when no Vary header', () => {
    const request = new Request('https://test.com/path', {
      method: 'GET',
    });

    const result = requestKey(request);
    expect(result).toEqual('GET,https://test.com,/path');
  });

  it('should return correct key when no parameters', () => {
    const request = new Request('https://test.com/path', {
      headers: new Headers({ Vary: 'Accept-Language' }),
      method: 'GET',
    });

    const result = requestKey(request);
    expect(result).toEqual('GET,https://test.com,/path,Accept-Language');
  });
});
