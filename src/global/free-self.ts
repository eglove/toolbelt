import { isNil } from '../is/nil.ts';

export const freeSelf =
  typeof self === 'object' && !isNil(self) && self.Object === Object && self;
