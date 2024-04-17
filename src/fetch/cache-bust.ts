import type { ReadonlyDeep } from "type-fest";

import { createFetcher } from "./fetcher.ts";

export const cacheBust = async (request: ReadonlyDeep<Request>) => {
  const fetcher = createFetcher({ request });
  await fetcher.cacheBust();
};
