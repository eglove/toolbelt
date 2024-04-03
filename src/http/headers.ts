import isNil from 'lodash/isNil.js';
import isString from 'lodash/isString.js';

import { isBigIntOrNumber } from '../is/big-int-or-number.ts';

type AcceptLanguageResults = {
  country: string | undefined;
  language: string | undefined;
  name: string;
  quality: number;
}[];

export function getAcceptLanguage(
  acceptLanguage: Headers | string,
): AcceptLanguageResults | Error {
  const languages = isString(acceptLanguage)
    ? acceptLanguage.split(',')
    : acceptLanguage.get('accept-language')?.split(',');

  if (isNil(languages)) {
    return new Error('accept-language not found');
  }

  return languages
    .map(lang => {
      const [name, q] = lang.split(';');
      const [language, country] = name.split('-') as [
        string | undefined,
        string | undefined,
      ];

      let quality = 1;
      if (!isNil(q)) {
        const [_, value] = q.split('=');
        if (isBigIntOrNumber(value)) {
          quality = Number(value);
        }
      }

      return {
        country,
        language,
        name: name.trim(),
        quality,
      };
    })
    .sort((a, b) => {
      return b.quality - a.quality;
    });
}
