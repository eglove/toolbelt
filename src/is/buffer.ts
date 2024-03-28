import { root } from '../global/root.ts';

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access,@typescript-eslint/no-unsafe-assignment
const nativeIsBuffer = root?.Buffer?.isBuffer;

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const isBuffer: (value: unknown) => boolean =
  typeof nativeIsBuffer === 'function'
    ? nativeIsBuffer
    : () => {
        return false;
      };
