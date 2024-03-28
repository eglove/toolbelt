import { isNil } from '../is/nil.ts';

export const freeGlobalThis =
  typeof globalThis === 'object' &&
  !isNil(globalThis) &&
  globalThis.Object === Object &&
  globalThis;
