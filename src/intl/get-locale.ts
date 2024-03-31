import get from 'lodash/get.js';
import isError from 'lodash/isError.js';
import isNil from 'lodash/isNil.js';

import { getCookieValue } from '../http/cookie.ts';
import { getAcceptLanguage } from '../http/headers.ts';

type LocaleSource = 'accept-language' | 'cookie' | 'localStorage' | 'navigator';

export function getLocale(
  sourceTypes: LocaleSource[],
  source?: Headers | string,
  valueName?: string,
) {
  for (const sourceType of sourceTypes) {
    if (sourceType === 'accept-language' && !isNil(source)) {
      const value = getAcceptLanguage(source);

      if (isError(value)) {
        return;
      }

      let language = get(value, [0, 'language']);
      const country = get(value, [0, 'country']);
      if (!isNil(language)) {
        if (!isNil(country)) {
          language += `-${country}`;
        }

        return language;
      }
    }

    if (sourceType === 'cookie' && !isNil(valueName) && !isNil(source)) {
      const value = getCookieValue(valueName, source);

      if (!isError(value)) {
        return value;
      }
    }

    if (sourceType === 'navigator' && typeof navigator !== 'undefined') {
      return navigator.language;
    }

    if (
      sourceType === 'localStorage' &&
      typeof localStorage !== 'undefined' &&
      !isNil(valueName)
    ) {
      const value = localStorage.getItem(valueName);

      if (!isNil(value)) {
        return value;
      }
    }
  }
}
