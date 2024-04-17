import isEmpty from "lodash/isEmpty.js";
import type { ReadonlyDeep } from "type-fest";

export const requestKeys = (request: ReadonlyDeep<Request>): string[] => {
  const url = new URL(request.url);

  return [
    request.method,
    url.origin,
    url.pathname,
    [...url.searchParams.entries()]
      .map((item: Readonly<[string, string]>) => {
        return `${item[0]}=${item[1]}`;
      })
      .join(""),
    request.headers.get("Vary"),
  ].filter((item) => {
    return !isEmpty(item);
  }) as string[];
};
