import { isNil } from '../is/nil.ts';
import { isNumber } from '../is/number.ts';
import { isString } from '../is/string.ts';
import type { HandledError } from '../types/error.ts';

export function getCookieValue(
  cookieName: string,
  cookieSource: Headers | string,
): HandledError<string, Error> {
  const cookies =
    typeof cookieSource === 'string'
      ? cookieSource
      : cookieSource.get('Cookie');

  if (isNil(cookies)) {
    return { error: new Error('cookies not found'), isSuccess: false };
  }

  const cookieArray = cookies.split(';');
  for (const cookie of cookieArray) {
    const [name, value] = cookie.split('=');

    if (name.trim() === cookieName.trim()) {
      return { data: value.trim(), isSuccess: true };
    }
  }

  return { error: new Error('failed to get cookie'), isSuccess: false };
}

type SetCookieValueProperties = {
  config?: {
    Domain?: string;
    Expires?: Date;
    HttpOnly?: boolean;
    'Max-Age'?: number;
    Partitioned?: boolean;
    Path?: string;
    SameSite?: 'Lax' | 'None' | 'Secure' | 'Strict';
    Secure?: boolean;
  };
  cookieName: string;
  cookieValue: string;
  response: Response;
};

export function setCookieValue({
  config,
  response,
  cookieValue,
  cookieName,
}: SetCookieValueProperties) {
  let cookieString = `${cookieName}=${cookieValue}`;

  if (!isNil(config)) {
    for (const key of Object.keys(config)) {
      const value = config[key as keyof typeof config];

      if (isString(value) || isNumber(value)) {
        cookieString += `; ${key}=${String(value)}`;
      } else if (value === true) {
        cookieString += `; ${key}`;
      } else if (value instanceof Date) {
        cookieString += `; Expires=${value.toUTCString()}`;
      }
    }
  }

  response.headers.append('Set-Cookie', cookieString);
}
