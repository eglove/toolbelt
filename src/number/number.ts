import isNil from 'lodash/isNil.js';

import { isBigIntOrNumber } from '../is/big-int-or-number.ts';
import { isNumber } from '../is/number.ts';
import type { FromUnit, ToUnit } from './conversion-types.js';
import { convertNumber } from './convert.ts';

type FormatOptions = BigIntToLocaleStringOptions & Intl.NumberFormatOptions;

class BetterNumber {
  private readonly _locale?: Intl.LocalesArgument;
  private readonly _number?: bigint | number;
  private readonly _formatOptions?: FormatOptions;

  public constructor(
    number: unknown,
    locale?: string,
    formatOptions?: FormatOptions,
  ) {
    this._formatOptions = formatOptions;

    if (!isBigIntOrNumber(number)) {
      this._number = undefined;
    } else if (typeof number === 'bigint' || typeof number === 'number') {
      this._number = number;
    } else if (typeof number === 'string') {
      this._number =
        Number(number) > Number.MAX_SAFE_INTEGER
          ? BigInt(number)
          : Number(number);
    }

    if (isNil(locale) && typeof navigator !== 'undefined') {
      this._locale = navigator.language;
    } else if (!isNil(locale)) {
      this._locale = locale;
    }
  }

  public get locale(): Intl.LocalesArgument {
    return this._locale;
  }

  public get number(): bigint | number | undefined {
    return this._number;
  }

  public convert<From extends FromUnit, To extends ToUnit<From>>(
    from: From,
    to: To,
  ) {
    if (!isNil(this._number) && isNumber(this._number)) {
      return convertNumber(this._number, from, to);
    }
  }

  public format(options?: FormatOptions): string | undefined {
    if (isNil(this._number)) {
      return undefined;
    }

    return Number(this._number).toLocaleString(
      this._locale,
      options ?? this._formatOptions,
    );
  }
}

export const betterNumber = (
  number: unknown,
  locale?: string,
  formatOptions?: FormatOptions,
): BetterNumber => {
  return new BetterNumber(number, locale, formatOptions);
};
