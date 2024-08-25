import map from "lodash/map.js";
import random from "lodash/random.js";
import { describe, expect, it } from "vitest";

import { adder } from "../../src/number/adder.js";

describe("add", () => {
  it("should add small numbers", () => {
    const strings = ["2", "2"];
    expect(adder(strings)).toEqual("4");
  });

  it("should add large integers", () => {
    expect(adder(["123", "777", "0"])).toEqual("900");
  });

  it("should add numbers with decimals", () => {
    expect(adder(["123.456", "777.543", "0.001"])).toEqual("901");
  });

  it("should add numbers with integers and decimals", () => {
    expect(adder(["123", "999999", "0.3324324"])).toEqual("1000122.3324324");
  });

  it("should add negative numbers", () => {
    expect(adder(["123", "-60"])).toEqual("63");
  });

  it("should add ridiculous sized numbers", () => {
    expect(adder(["9999999999999999999", "9999999999999999999"])).toBe("19999999999999999998");
  });

  it("should do decimals right", () => {
    expect(adder(["0.3", "0.6"])).toBe("0.9");
  });

  it("should add BigInts", () => {
    const result = adder([BigInt(5).toString(), BigInt("9999999999999999999").toString()]);
    expect(result).toBe("10000000000000000004");
  });

  it("should not crash", () => {
    const numbers = map(Array.from({ length: 100_000 }), () => {
      return String(random(1, Number.MAX_SAFE_INTEGER));
    });

    const start = performance.now();
    const result = adder(numbers);
    const result2 = adder([result, ...numbers]);
    adder([result2, ...numbers]);
    const end = performance.now() - start;

    expect(result).toBeTypeOf("string");
    expect(end).toBeTypeOf("number");
  });
});
