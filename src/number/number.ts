import isNil from "lodash/isNil.js";
import isString from "lodash/isString.js";

import type { FromUnit, ToUnit } from "./conversion-types.js";

import { isBigIntOrNumber } from "../is/big-int-or-number.ts";
import { isNumber } from "../is/number.ts";
import { convertNumber } from "./convert.ts";

type FormatOptions = Readonly<
  BigIntToLocaleStringOptions & Intl.NumberFormatOptions
>;

class BetterNumber {
  private readonly _formatOptions?: FormatOptions;

  private readonly _locale?: Intl.LocalesArgument;

  private readonly _number?: bigint | number;

  public constructor (
    number: unknown,
    locale?: string,
    formatOptions?: FormatOptions,
  ) {
    this._formatOptions = formatOptions;

    if (!isBigIntOrNumber(number)) {
      this._number = undefined;
      // eslint-disable-next-line lodash/prefer-lodash-typecheck
    } else if ("number" === typeof number || "bigint" === typeof number) {
      this._number = number;
    } else if (isString(number)) {
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

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  public convert<From extends FromUnit, To extends ToUnit<From>>(
    from: From,
    to: To,
  ) {
    if (!isNil(this._number) && isNumber(this._number)) {
      return convertNumber(this._number,
        from,
        to);
    }
  }

  public format (options?: FormatOptions): string | undefined {
    if (isNil(this._number)) {
      return undefined;
    }

    return Number(this._number).toLocaleString(
      this._locale,
      options ?? this._formatOptions,
    );
  }

  public get locale (): Intl.LocalesArgument {
    return this._locale;
  }

  public get number (): bigint | number | undefined {
    return this._number;
  }
}

export const betterNumber = (
  number: unknown,
  locale?: string,
  formatOptions?: FormatOptions,
): BetterNumber => {
  return new BetterNumber(number,
    locale,
    formatOptions);
};
