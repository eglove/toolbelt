import isEmpty from 'lodash/isEmpty.js';

export function requestKeys(request: Request): string[] {
  const url = new URL(request.url);

  return [
    request.method,
    url.origin,
    url.pathname,
    [...url.searchParams.entries()]
      .map(item => {
        return `${item[0]}=${item[1]}`;
      })
      .join(''),
    request.headers.get('Vary'),
  ].filter(item => {
    return !isEmpty(item);
  }) as string[];
}
