import isNil from "lodash/isNil.js";
import isNumber from "lodash/isNumber.js";
import isString from "lodash/isString.js";
import type { ReadonlyDeep } from "type-fest";

export const getCookieValue = <T extends string>(
  cookieName: T,
  cookieSource: Readonly<Headers | string>,
): Error | string => {
  const cookies =
    "string" === typeof cookieSource
      ? cookieSource
      : cookieSource.get("Cookie");

  if (isNil(cookies)) {
    return new Error("cookies not found");
  }

  const cookieArray = cookies.split(";");
  for (const cookie of cookieArray) {
    const [name, value] = cookie.split("=");

    if (name.trim() === cookieName.trim()) {
      return value.trim();
    }
  }

  return new Error("failed to get cookie");
};

type SetCookieValueProperties<T extends string> = ReadonlyDeep<{
  config?: {
    Domain?: string;
    Expires?: Date;
    HttpOnly?: boolean;
    "Max-Age"?: number;
    Partitioned?: boolean;
    Path?: string;
    SameSite?: "Lax" | "None" | "Secure" | "Strict";
    Secure?: boolean;
  };
  cookieName: T;
  cookieValue: string;
  response: Response;
}>;

// eslint-disable-next-line @typescript-eslint/prefer-readonly-parameter-types
export const setCookieValue = <T extends string>({
  config,
  response,
  cookieValue,
  cookieName,
}: SetCookieValueProperties<T>) => {
  let cookieString = `${cookieName}=${cookieValue}`;

  if (!isNil(config)) {
    for (const key of Object.keys(config)) {
      const value = config[key as keyof typeof config];

      if (isString(value) || isNumber(value)) {
        cookieString += `; ${key}=${String(value)}`;
      } else if (true === value) {
        cookieString += `; ${key}`;
      } else if (value instanceof Date) {
        cookieString += `; Expires=${value.toUTCString()}`;
      }
    }
  }

  response.headers.append("Set-Cookie", cookieString);
};
