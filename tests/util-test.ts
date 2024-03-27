export function stubFalse() {
  return false;
}

// eslint-disable-next-line @typescript-eslint/no-empty-function
export function noop() {}

export function identity(value: unknown) {
  return value;
}

// eslint-disable-next-line no-sparse-arrays
export const falsey = [, null, undefined, false, 0, Number.NaN, ''];

function toArguments(array: unknown[]) {
  return (function (...arguments_: unknown[]) {
    return arguments_;
  })(...array);
}

export const arguments_ = toArguments([1, 2, 3]);
