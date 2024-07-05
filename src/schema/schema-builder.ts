import type { OpenApiZodAny } from "@anatine/zod-openapi";
import type { SchemaObject } from "openapi3-ts/oas31";

import { generateSchema } from "@anatine/zod-openapi";
import forEach from "lodash/forEach.js";
import get from "lodash/get.js";
import isNil from "lodash/isNil.js";

export function schemaBuilder(typeName: string, schema: OpenApiZodAny) {
  const openApi: SchemaObject = generateSchema(schema);

  let properties = "";

  forEach(openApi.properties, (property, key) => {
    let type = get(property, ["type", 0]) as string;

    const isObject = "object" === type;
    const isArray = "array" === type;
    const minItems = get(property, "minItems");
    const isNonEmptyArray = isArray && !isNil(minItems) && 0 < minItems;

    if (isArray) {
      type = get(property, ["items", "type", 0]) as string;
    }

    let value = "";

    if (isObject) {
      const name = `${key.charAt(0).toUpperCase()}${key.slice(1)}`;
      const nestedSchema = get(schema, ["shape", key]) as OpenApiZodAny;
      schemaBuilder(name, nestedSchema);
      type = name;
    }

    value += `${key}: ${isArray ? "[" : ""}${type.charAt(0).toUpperCase()}${type.slice(1)}${isNonEmptyArray ? "!" : ""}${isArray ? "]" : ""}`;

    if (true === openApi.required?.includes(key)) {
      value += "!";
    }

    properties += `${value} `;
  });

  const graphql = `type ${typeName} {
  ${properties}
}`;

  return { graphql, openApi, zod: schema };
}
