import { describe, expect, it } from "vitest";

import { Api } from "../../src/api/api.ts";

const testUrl = "http://example.com";

describe("api setup", () => {
  it("should construct api", () => {
    const api = new Api({
      baseUrl: testUrl,
      requests: {
        todo: { path: "todo" },
      },
    });

    expect(api.baseUrl).toBe(testUrl);
    expect(api.requests.todo).toBeDefined();
    expect(api.requests.todo.keys()).toStrictEqual(["GET", testUrl, "/todo"]);

    expect(api.requests.todo.queryOptions().queryFn).toBeInstanceOf(Function);
    expect(api.requests.todo.queryOptions().queryKey).toStrictEqual([
      "GET",
      testUrl,
      "/todo",
    ]);

    expect(api.requests.todo.request()).toStrictEqual(
      new Request("http://example.com/todo"),
    );

    expect(api.requests.todo.url()).toStrictEqual(
      new URL("http://example.com/todo"),
    );
  });
});
