import { freeGlobal } from './free-global.ts';
import { freeGlobalThis } from './free-global-this.ts';
import { freeSelf } from './free-self.ts';

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const root =
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions,@typescript-eslint/no-implied-eval,no-new-func
  freeGlobalThis || freeGlobal || freeSelf || new Function('return this')();
