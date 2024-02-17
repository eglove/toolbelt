import { describe, expect, it } from 'vitest';

import { tryCatch, tryCatchAsync } from '../../src/functional/try-catch.ts';

const foo = (value: number) => {
  if (value !== 1) {
    return 'hello';
  }
  throw new Error('uh oh!');
};

const asyncFoo = async (value: number) => {
  return new Promise<string>((resolve, reject) => {
    if (value === 1) {
      reject(new Error('uh oh!'));
    } else {
      resolve('hello');
    }
  });
};

describe('sync tryCatch', () => {
  it('should return data when it does not throw', () => {
    const result = tryCatch(() => {
      return foo(2);
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.data).toBe('hello');
    }
  });

  it('should get error on throw', () => {
    const result = tryCatch(() => {
      return foo(1);
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toBe('uh oh!');
    }
  });
});

describe('async tryCatch', () => {
  it('should return data when it does not throw', async () => {
    const result = await tryCatchAsync(async () => {
      return asyncFoo(2);
    });

    expect(result.isSuccess).toBe(true);

    if (result.isSuccess) {
      expect(result.data).toBe('hello');
    }
  });

  it('should get error on throw', async () => {
    const result = await tryCatchAsync(async () => {
      return asyncFoo(1);
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toBe('uh oh!');
    }
  });
});
