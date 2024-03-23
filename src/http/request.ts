import { isEmpty } from '../is/empty.ts';
import { isNil } from '../is/nil.ts';

export function getRequestKeys(request: Request) {
  const url = new URL(request.url);

  const keys = [request.method, url.origin];

  const varyHeader = request.headers.get('Vary');

  if (!isEmpty(url.pathname) && url.pathname !== '/') {
    keys.push(url.pathname);
  }

  if (!isEmpty(url.search)) {
    keys.push(url.search);
  }

  if (!isNil(varyHeader)) {
    keys.push(varyHeader);
  }

  return keys;
}
