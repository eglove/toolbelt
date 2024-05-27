import { describe, expect, it } from "vitest";

import { getRequestKeys } from "../../src/http/request.ts";

const testUrl = "https://test.com";

describe("getRequestKeys function", () => {
  it("should return the correct keys", () => {
    const mockUrl = `${testUrl}/hello?search=value`;
    const mockHeaders = new Headers();
    mockHeaders.append("Vary", "vary");

    const mockRequest = new Request(mockUrl, {
      headers: mockHeaders,
      method: "GET",
    });
    const keys = getRequestKeys(mockRequest);

    expect(keys).toEqual(["GET", testUrl, "/hello", "?search=value", "vary"]);
  });

  it("doesn't append pathname to keys if it's empty", () => {
    const mockUrl = testUrl;
    const mockRequest = new Request(mockUrl, { method: "GET" });
    const keys = getRequestKeys(mockRequest);
    expect(keys).toEqual(["GET", testUrl]);
  });

  it("doesn't append Vary header value to keys if it's null", () => {
    const mockUrl = "https://test.com/hello?search=value";
    const mockHeaders = new Headers();
    const mockRequest = new Request(mockUrl, {
      headers: mockHeaders,
      method: "GET",
    });
    const keys = getRequestKeys(mockRequest);
    expect(keys).toEqual(["GET", testUrl, "/hello", "?search=value"]);
  });
});
