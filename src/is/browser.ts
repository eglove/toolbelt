export const isBrowser =
  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain,@typescript-eslint/no-unnecessary-condition
  typeof window !== 'undefined' && window.document !== undefined;
