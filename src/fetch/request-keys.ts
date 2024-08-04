import compact from "lodash/compact.js";
import map from "lodash/map.js";

export const requestKeys = (request: Request): string[] => {
  const url = new URL(request.url);

  return compact([
    request.method,
    url.origin,
    url.pathname,
    map([...url.searchParams.entries()], (item: Readonly<[string, string]>) => {
      return `${item[0]}=${item[1]}`;
    }).join(""),
    request.headers.get("Vary"),
  ]);
};
