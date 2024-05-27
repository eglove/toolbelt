import isNil from "lodash/isNil.js";

import { isBigIntOrNumber } from "../is/big-int-or-number.ts";
import { isNumber } from "../is/number.ts";
import type { FromUnit, ToUnit } from "./conversion-types.js";
import { convertNumber } from "./convert.ts";

type FormatOptions = Readonly<
  BigIntToLocaleStringOptions & Intl.NumberFormatOptions
>;

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
    } else if ("bigint" === typeof number || "number" === typeof number) {
      this._number = number;
    } else if ("string" === typeof number) {
      this._number =
        Number(number) > Number.MAX_SAFE_INTEGER
          ? BigInt(number)
          : Number(number);
    } else {
      // do nothing
    }

    if (isNil(locale) && "undefined" !== typeof navigator) {
      this._locale = navigator.language;
    } else if (isNil(locale)) {
      // do nothing
    } else {
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
