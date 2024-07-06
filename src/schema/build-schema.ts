import type { OpenApiZodAny } from "@anatine/zod-openapi";
import type { SchemaObject } from "openapi3-ts/oas31";

import { generateSchema } from "@anatine/zod-openapi";
import forEach from "lodash/forEach.js";
import get from "lodash/get.js";
import isNil from "lodash/isNil.js";
import keys from "lodash/keys.js";
import set from "lodash/set.js";
import upperFirst from "lodash/upperFirst.js";

export function buildSchema(
  typeName: string,
  schema: OpenApiZodAny,
  parameterSchema?: OpenApiZodAny,
  _typeLabel = "type",
) {
  const openApi: SchemaObject = generateSchema(schema);

  let properties = "";
  const nestedTypes: string[] = [];
  let inputType: string | undefined;
  const [functionName] = keys(openApi.properties);
  const inputLabel = `${upperFirst(functionName)}Input`;
  if (!isNil(parameterSchema)) {
    inputType = buildSchema(
      inputLabel,
      parameterSchema,
      undefined,
      "input",
    ).graphql;
  }

  if ("array" === openApi.type?.[0]) {
    set(openApi, ["properties"], get(openApi, ["items", "properties"]));
  }

  forEach(openApi.properties, (property, key) => {
    let type = get(property, ["type", 0]) as string;

    const isArray = "array" === type;
    const minItems = get(property, "minItems");
    const isNonEmptyArray = isArray && !isNil(minItems) && 0 < minItems;
    let value = "";

    if (isArray) {
      type = get(property, ["items", "type", 0]) as string;
    }

    switch (type) {
      case "object": {
        const name = upperFirst(key);
        const nestedSchema = get(schema, ["shape", key]) as OpenApiZodAny;
        const nestedGql = buildSchema(name, nestedSchema);
        nestedTypes.push(nestedGql.graphql);
        type = name;
        break;
      }

      case "integer": {
        type = "Int";
        break;
      }

      case "number": {
        type = "Float";
        break;
      }
    }

    const parameters = isNil(inputType)
      ? ""
      : `(parameters: ${inputLabel}${true === parameterSchema?.isOptional() ? "" : "!"})`;
    value += `${key}${parameters}: ${isArray ? "[" : ""}${upperFirst(type)}${isNonEmptyArray ? "!" : ""}${isArray ? "]" : ""}`;

    if (true === openApi.required?.includes(key)) {
      value += "!";
    }

    properties += `${value} `;
  });

  let graphql = `${_typeLabel} ${typeName} {
  ${properties}
}`;

  if (!isNil(inputType)) {
    graphql += inputType;
  }

  for (const type of nestedTypes) {
    graphql += type;
  }

  return { graphql, openApi, zod: schema };
}
