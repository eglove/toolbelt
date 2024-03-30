import get from 'lodash/get.js';
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

      let language = get(value, 'data[0].language');
      const country = get(value, 'data[0].country');
      if (!isNil(language)) {
        if (!isNil(country)) {
          language += `-${country}`;
        }

        return language;
      }
    }

    if (sourceType === 'cookie' && !isNil(valueName) && !isNil(source)) {
      const value = getCookieValue(valueName, source);

      if (value.isSuccess) {
        return value.data;
      }
    }

    if (sourceType === 'navigator' && typeof window !== 'undefined') {
      return navigator.language;
    }

    if (
      sourceType === 'localStorage' &&
      typeof window !== 'undefined' &&
      !isNil(valueName)
    ) {
      const value = localStorage.getItem(valueName);

      if (!isNil(value)) {
        return value;
      }
    }
  }
}
