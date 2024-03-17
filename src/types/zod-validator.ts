import type { z } from 'zod';

export type ZodValidator =
  | z.ZodArray<z.ZodObject<z.ZodRawShape>>
  | z.ZodObject<z.ZodRawShape>
  | z.ZodTypeAny;
