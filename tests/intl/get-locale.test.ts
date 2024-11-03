import constant from "lodash/constant.js";
import set from "lodash/set.js";
import { describe, expect, it } from "vitest";

import { getLocale } from "../../src/intl/get-locale.ts";

describe("getLocale", () => {
  it("should return the correct locale when sourceType is accept-language and language is not null", () => {
    const source = new Headers({ "accept-language": "en-US" });
    const locale = getLocale(["accept-language"], source);
    expect(locale).toEqual("en-US");
  });

  it("should return undefined if value is not on headers", () => {
    const source = new Headers();
    const locale = getLocale(["accept-language"], source);
    expect(locale).toEqual(undefined);
  });

  it("should return the correct locale when sourceType is cookie and cookie value is success", () => {
    const source = "locale=en-US; test=test";
    const locale = getLocale(["cookie"], source, "locale");
    expect(locale).toEqual("en-US");
  });

  it("should return undefined when sourceType is cookie and cookie value is not success", () => {
    const source = "test=test";
    const locale = getLocale(["cookie"], source, "locale");
    expect(locale).toBeUndefined();
  });

  it("should return undefined when sourceType is localStorage and localStorage is null", () => {
    const locale = getLocale(["localStorage"], "locale");
    expect(locale).toBeUndefined();
  });

  it("should get value from localStorage", () => {
    // @ts-expect-error set for test
    globalThis.localStorage = {
      getItem: constant("value"),
    };

    const locale = getLocale(["localStorage"], undefined, "key");

    expect(locale).toBe("value");
  });

  it("should return undefined if pulling from localStorage and no name provided", () => {
    // @ts-expect-error set for test
    globalThis.localStorage = {
      getItem: constant("value"),
    };

    const locale = getLocale(["localStorage"]);

    expect(locale).toBe(undefined);
  });

  it("should get value from navigator.language", () => {
    set(globalThis, ["navigator", "language"], "en");

    expect(getLocale(["navigator"])).toBe("en");
  });
});
