import get from "lodash/get.js";
import { describe, expect, it } from "vitest";

import { propertiesIsEqual } from "../../src/object/properties-is-equal.ts";

describe("makeComparator", () => {
  it("should compare simple objects", () => {
    const result = propertiesIsEqual({
      a: "hello",
      b: 10,
      c: true,
    }, {
      a: "hello",
      b: 10,
      c: true,
    }, [["a"], ["b"], ["c"]]);

    expect(result).toBe(true);
  });

  it("should compare objects with nested properties", () => {
    const result = propertiesIsEqual({
      t: false,
      x: {
        y: "world",
        z: 20,
      },
    }, {
      t: false,
      x: {
        y: "world",
        z: 20,
      },
    }, [["x", "y"], ["x", "z"], ["t"]]);

    expect(result).toBe(true);
  });

  it("should return false when comparing different objects", () => {
    const result = propertiesIsEqual({
      a: "hello",
      b: 10,
      c: true,
    }, {
      a: "world",
      b: 20,
      c: false,
    }, [["a"], ["b"], ["c"]]);
    expect(result).toBe(false);
  });

  it("should return false for objects with different structures", () => {
    const result = propertiesIsEqual({
      a: "hello",
      b: 10,
      c: true,
    }, {
      p: "hello",
      q: 10,
    }, [["a"], ["b"], ["c"]]);
    expect(result).toBe(false);
  });

  it("should false for object with missing properties", () => {
    const result = propertiesIsEqual({
      a: "hello",
      b: 10,
    }, {
      a: "hello",
      b: 10,
      c: true,
    }, [["a"], ["b"], ["c"]]);
    expect(result).toBe(false);
  });

  it("should compare objects with partially matching properties", () => {
    const result = propertiesIsEqual({
      a: "hello",
      b: 10,
      c: true,
    }, {
      a: "hello",
      b: 10,
      d: false,
    }, [["a"], ["b"]]);
    expect(result).toBe(true);
  });
});

