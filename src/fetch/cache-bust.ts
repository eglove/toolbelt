import { createFetcher } from "./fetcher.ts";

export async function cacheBust(request: Request) {
  const fetcher = createFetcher({ request });
  await fetcher.cacheBust();
}
