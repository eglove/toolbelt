export type Iteratee<T> = (
  value: T[keyof T],
  key: keyof T,
  object: T,
) => boolean;
