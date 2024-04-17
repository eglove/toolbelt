import { describe, expect, it } from "vitest";

import { Api } from "../../src/api/api.ts";

describe("api setup", () => {
  it("should construct api", () => {
    const api = new Api({
      baseUrl: "http://example.com",
      requests: {
        todo: { path: "todo" },
      },
    });

    expect(api.baseUrl).toBe("http://example.com");
    expect(api.requests.todo).toBeDefined();
    expect(api.requests.todo.keys()).toStrictEqual([
      "GET",
      "http://example.com",
      "/todo",
    ]);

    expect(api.requests.todo.queryOptions().queryFn).toBeInstanceOf(Function);
    expect(api.requests.todo.queryOptions().queryKey).toStrictEqual([
      "GET",
      "http://example.com",
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
