import type { HandledError } from '../types/error.ts';

export function tryCatch<T extends () => ReturnType<T>>(
  function_: T,
): HandledError<ReturnType<T>, Error> {
  try {
    return { data: function_(), isSuccess: true };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return { error, isSuccess: false };
    }

    return { error: new Error(`${function_.name} failed`), isSuccess: false };
  }
}

export async function tryCatchAsync<T extends () => unknown>(
  function_: T,
): Promise<HandledError<Awaited<ReturnType<T>>, Error>> {
  try {
    const data = (await function_()) as Awaited<ReturnType<T>>;
    return { data, isSuccess: true };
  } catch (error) {
    if (error instanceof Error) {
      return { error, isSuccess: false };
    }

    return { error: new Error(`${function_.name} failed`), isSuccess: false };
  }
}
