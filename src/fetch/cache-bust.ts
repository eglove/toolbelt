import { createFetcher } from "./fetcher.ts";

export const cacheBust = async (request: Request) => {
  const fetcher = createFetcher({ request });
  await fetcher.cacheBust();
};
