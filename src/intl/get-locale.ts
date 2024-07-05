import get from "lodash/get.js";
import isError from "lodash/isError.js";
import isNil from "lodash/isNil.js";

import { getCookieValue } from "../http/cookie.ts";
import { getAcceptLanguage } from "../http/headers.ts";

type LocaleSource = "accept-language" | "cookie" | "localStorage" | "navigator";

export const getLocale = (
  sourceTypes: readonly LocaleSource[],
  source?: Readonly<Headers | string>,
  valueName?: Readonly<string>,
  // eslint-disable-next-line sonar/cognitive-complexity
) => {
  for (const sourceType of sourceTypes) {
    if ("accept-language" === sourceType && !isNil(source)) {
      const value = getAcceptLanguage(source);

      if (isError(value)) {
        return;
      }

      let language = get(value, [0, "language"]);
      const country = get(value, [0, "country"]);
      if (!isNil(language)) {
        if (!isNil(country)) {
          language += `-${country}`;
        }

        return language;
      }
    }

    if ("cookie" === sourceType && !isNil(valueName) && !isNil(source)) {
      const value = getCookieValue(valueName, source);

      if (!isError(value)) {
        return value;
      }
    }

    if ("navigator" === sourceType && "undefined" !== typeof navigator) {
      return navigator.language;
    }

    if (
      "localStorage" === sourceType &&
      "undefined" !== typeof localStorage &&
      !isNil(valueName)
    ) {
      const value = localStorage.getItem(valueName);

      if (!isNil(value)) {
        return value;
      }
    }
  }
};
