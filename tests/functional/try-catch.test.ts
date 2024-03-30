import { describe, expect, it } from 'vitest';

import { tryCatch, tryCatchAsync } from '../../src/functional/try-catch.ts';

const foo = (value: number) => {
  if (value === 1) {
    throw new Error('uh oh!');
  }

  if (value === 2) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error
    throw 'not an error object';
  }

  return 'hello';
};

const asyncFoo = async (value: number) => {
  return new Promise<string>((resolve, reject) => {
    if (value === 1) {
      reject(new Error('uh oh!'));
    } else if (value === 2) {
      // eslint-disable-next-line @typescript-eslint/only-throw-error
      throw 'not an error object';
    } else {
      resolve('hello');
    }
  });
};

describe('sync tryCatch', () => {
  it('should return data when it does not throw', () => {
    const result = tryCatch(() => {
      return foo(3);
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

  it('should show error for other fails', () => {
    const result = tryCatch(() => {
      return foo(2);
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toBe(' failed');
    }
  });
});

describe('async tryCatch', () => {
  it('should return data when it does not throw', async () => {
    const result = await tryCatchAsync(async () => {
      return asyncFoo(3);
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

  it('should show error for other fails', async () => {
    const result = await tryCatchAsync(async () => {
      return asyncFoo(2);
    });

    expect(result.isSuccess).toBe(false);

    if (!result.isSuccess) {
      expect(result.error.message).toBe(' failed');
    }
  });
});
