import type { OpenApiZodAny } from "@anatine/zod-openapi";
import type { SchemaObject } from "openapi3-ts/oas31";

import { generateSchema } from "@anatine/zod-openapi";
import forEach from "lodash/forEach.js";
import get from "lodash/get.js";
import isNil from "lodash/isNil.js";

export function schemaBuilder(typeName: string, schema: OpenApiZodAny) {
  const openApi: SchemaObject = generateSchema(schema);

  let properties = "";
  const nestedTypes: string[] = [];

  forEach(openApi.properties, (property, key) => {
    let type = get(property, ["type", 0]) as string;

    const isArray = "array" === type;
    const minItems = get(property, "minItems");
    const isNonEmptyArray = isArray && !isNil(minItems) && 0 < minItems;
    let value = "";

    switch (type) {
      case "array": {
        type = get(property, ["items", "type", 0]) as string;
        break;
      }

      case "object": {
        const name = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
        const nestedSchema = get(schema, ["shape", key]) as OpenApiZodAny;
        const nestedGql = schemaBuilder(name, nestedSchema);
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

    value += `${key}: ${isArray ? "[" : ""}${type.charAt(0).toUpperCase()}${type.slice(1)}${isNonEmptyArray ? "!" : ""}${isArray ? "]" : ""}`;

    if (true === openApi.required?.includes(key)) {
      value += "!";
    }

    properties += `${value} `;
  });

  let graphql = `type ${typeName} {
  ${properties}
}`;

  for (const type of nestedTypes) {
    graphql += type;
  }

  return { graphql, openApi, zod: schema };
}
