import { describe, expect, it } from "vitest";

import { betterNumber } from "../../src/number/number.ts";

describe("basic usage", () => {
  it.each([
    [123, 123],
    ["123", 123],
    [BigInt(123), BigInt(123)],
    ["12345678901234567890", BigInt("12345678901234567890")],
  ])("should accept numbers, strings, and BigInt", (given, expected) => {
    const value = betterNumber(given);

    expect(value.number).toBe(expected);
  });
});

describe("handle NaN", () => {
  it.each([undefined, null, Number.NaN, "what?"])(
    "should return undefined for invalid values",
    () => {
      const length = betterNumber(Number.NaN, "en-US");

      expect(length.number).toBe(undefined);
      expect(length.format()).toBe(undefined);
    },
  );
});

describe("format with locale", () => {
  it("should use navigators language when undefined", () => {
    Object.defineProperty(globalThis, "navigator", {
      value: {
        language: "fr",
      },
    });

    const value = betterNumber(123, undefined, {
      style: "unit",
    });
    expect(value.locale).toBe("fr");
  });

  it.each([
    ["en-US", "1,000 in"],
    ["pt-Br", "1.000 pol."],
  ])("should format to the proper locale", (locale, expected) => {
    const value = betterNumber(1000, locale, {
      style: "unit",
      unit: "inch",
    });

    expect(value.format()).toBe(expected);
  });
});

describe("handle conversions", () => {
  it.each([[120, "minute", 7200, "second"] as const])(
    "should make correct conversions",

    (originalValue, originalUnit, expectedValue, expectedUnit) => {
      const value = betterNumber(originalValue);
      const conversion = value.convert(originalUnit, expectedUnit);

      expect(Math.round(conversion as unknown as number)).toBe(expectedValue);
    },
  );
});
