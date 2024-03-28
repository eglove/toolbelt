import { isBigIntOrNumber } from '../is/big-int-or-number.ts';
import { isNil } from '../is/nil.ts';
import { isString } from '../is/string.ts';

export function getAcceptLanguage(acceptLanguage: Headers | string) {
  const languages = isString(acceptLanguage)
    ? acceptLanguage.split(',')
    : acceptLanguage.get('accept-language')?.split(',');

  if (isNil(languages)) {
    return { error: new Error('accept-language not found'), isSuccess: false };
  }

  const result = languages
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

  return { data: result, isSuccess: true };
}
