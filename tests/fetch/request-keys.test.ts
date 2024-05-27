import { describe, expect, it } from "vitest";

import { requestKeys } from "../../src/fetch/request-keys.ts";

const testUrl = "https://test.com";
const testPath = `${testUrl}/path`;
const acceptLanguage = "Accept-Language";

describe("request key", () => {
  it("should return correct key for GET request", () => {
    const request = new Request(`${testPath}?param1=test1&param2=test2`, {
      headers: new Headers({ Vary: acceptLanguage }),
      method: "GET",
    });
    const result = requestKeys(request);
    expect(result).toEqual([
      "GET",
      testUrl,
      "/path",
      "param1=test1param2=test2",
      acceptLanguage,
    ]);
  });

  it("should return correct key for POST request", () => {
    const request = new Request(testPath, {
      headers: new Headers({ Vary: acceptLanguage }),
      method: "POST",
    });
    const result = requestKeys(request);
    expect(result).toEqual(["POST", testUrl, "/path", acceptLanguage]);
  });

  it("should return correct key when no Vary header", () => {
    const request = new Request(testPath, {
      method: "GET",
    });
    const result = requestKeys(request);
    expect(result).toEqual(["GET", testUrl, "/path"]);
  });

  it("should return correct key when no parameters", () => {
    const request = new Request(testPath, {
      headers: new Headers({ Vary: acceptLanguage }),
      method: "GET",
    });
    const result = requestKeys(request);
    expect(result).toEqual(["GET", testUrl, "/path", acceptLanguage]);
  });
});
