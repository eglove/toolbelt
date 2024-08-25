import map from "lodash/map.js";
import random from "lodash/random.js";
import { describe, expect, it } from "vitest";

import { adder } from "../../src/number/adder.js";

describe("add", () => {
  it.each([
    [["2", "2"], "4"],
    [["123", "777"], "900"],
    [["123.456", "777.543", "0.001"], "901"],
    [["123", "999999", "0.3324324"], "1000122.3324324"],
    [["2", "-2"], "0"],
    [["123", "-777", "0"], "-654"],
    [["-123", "777", "0"], "654"],
    [["9999999999999999999", "9999999999999999999"], "19999999999999999998"],
    [["0.3", "0.6"], "0.9"],
    [["0.3", "0.6"], "0.9"],
    [["5"], "5"],
    [[], "0"],
    [["123456789012345678901234567890", "987654321098765432109876543210"], "1111111110111111111011111111100"],
    [["1000", "-999", "-1"], "0"],
    [["0.000000001", "0.000000002"], "0.000000003"],
    [["0", "0", "0", "0"], "0"],
    [["-0.1", "-0.2"], "-0.3"],
    [["123", "45.67"], "168.67"],
    [["0.0001", "0.0002", "0.0003"], "0.0006"],
    [["9999999999", "0.000000001"], "9999999999.000000001"],
    [[BigInt(5).toString(), BigInt("9999999999999999999").toString()], "10000000000000000004"],
  ])("should add %s to get %s", (numbers, result) => {
    expect(adder(numbers)).toEqual(result);
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
