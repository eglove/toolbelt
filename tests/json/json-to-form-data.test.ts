import isNil from "lodash/isNil.js";
// eslint-disable-next-line barrel/avoid-importing-barrel-files
import { describe, expect, it } from "vitest";

import { formDataToJson, jsonToFormData } from "../../src/json/json-form-data.js";

const data = {
  hello: "world",
  iam: 99,
  stuff: ["ape", "cat", "billboard"],
};

describe("jsonToFormData", () => {
  it("should return correctly formatted data", () => {
    const formData = jsonToFormData(data);
    const json = formData.get("json");

    expect(json).not.toBeNull();
    if (isNil(json)) {
      return;
    }

    expect(JSON.parse(json as string)).toStrictEqual(data);
  });
});

describe("formDataToJson", () => {
  it("should return correctly formatted data", () => {
    const formData = new FormData();
    formData.append("json", JSON.stringify(data));

    const json = formDataToJson(formData);
    expect(json).toStrictEqual(data);
  });
});
