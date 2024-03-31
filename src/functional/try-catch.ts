import attempt from 'lodash/attempt.js';

export async function attemptAsync(...parameters: Parameters<typeof attempt>) {
  try {
    // Assume this is used with async function, force the await to catch the error
    // eslint-disable-next-line @typescript-eslint/return-await, @typescript-eslint/return-await
    return await attempt(...parameters);
  } catch (error: unknown) {
    if (error instanceof Error) {
      return error;
    }

    return new Error(`${parameters[0].name} failed`);
  }
}
