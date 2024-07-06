import { describe, expect, it } from "vitest";
import { z } from "zod";

import { buildSchema } from "../../src/schema/build-schema.js";

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

    const schema = buildSchema("MySchema", mySchema);

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

  it("should work with nesting types for merging", () => {
    const schema = z.object({
      igdbAgeRating: z.object({
        category: z.number(),
        checksum: z.string(),
        content_descriptions: z.array(z.number().int()).optional(),
        id: z.number().int(),
        rating: z.number(),
        rating_cover_url: z.string().optional(),
        synopsis: z.string().optional(),
      }),
    });

    const inputSchema = z.object({
      sortBy: z.string(),
      where: z.string(),
    });

    const { graphql } = buildSchema("Query", schema, inputSchema);

    expect(graphql).toBeDefined();
  });

  it("should work with nested arrays", () => {
    const schema = z.object({
      igdbAgeRating: z.array(
        z.object({
          category: z.number().optional(),
          checksum: z.string().optional(),
          content_descriptions: z.array(z.number()).optional(),
          id: z.number().optional(),
          rating: z.number().optional(),
          rating_cover_url: z.string().optional(),
          synopsis: z.string().optional(),
        }),
      ),
    });

    const inputSchema = z.object({
      authorization: z.string(),
      body: z.string(),
      clientId: z.string().optional(),
    });

    const { graphql } = buildSchema("Query", schema, inputSchema);
    expect(graphql).toBeDefined();
  });
});
