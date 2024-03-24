import { fetcher } from './fetcher.ts';

export async function cacheBust(request: Request) {
  const buster = fetcher({ request });
  await buster.cacheBust();
}
