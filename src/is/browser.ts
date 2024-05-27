export const isBrowser =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  "undefined" !== typeof window && window.document !== undefined;
