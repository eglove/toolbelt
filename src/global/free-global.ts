import { isNil } from '../is/nil.ts';

export const freeGlobal =
  typeof global === 'object' &&
  !isNil(global) &&
  global.Object === Object &&
  global;
