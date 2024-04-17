export const isBrowser =
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  typeof window !== "undefined" && window.document !== undefined;
