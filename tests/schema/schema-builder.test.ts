import { describe, expect, it } from "vitest";
import { z } from "zod";

import { schemaBuilder } from "../../src/schema/schema-builder.js";

describe("schema builder", () => {
  it("should work with basic object", () => {
    const mySchema = z.object({
      address: z
        .object({
          number: z.number().int(),
        })
        .optional(),
      float: z.number().optional(),
      hello: z.string(),
      name: z.boolean().optional(),
      other: z.array(z.string()).optional(),
      person: z.object({
        name: z.object({
          firstName: z.string(),
          lastName: z.string(),
        }),
      }),
      requiredArray: z.array(z.string()).min(1),
    });

    const schema = schemaBuilder("MySchema", mySchema);

    expect(schema.zod).toStrictEqual(mySchema);
    expect(schema.openApi).toBeDefined();
    expect(schema.openApi.required).toStrictEqual([
      "hello",
      "person",
      "requiredArray",
    ]);
    expect(schema.graphql).toContain("hello: String!");
    expect(schema.graphql).toContain("name: Boolean");
  });
});
