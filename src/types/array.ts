export type ObjectIteratee<T,> = (
  value: T[keyof T],
  key: keyof T,
  object: T,
) => void;

export type ArrayIteratee<T extends unknown[],> = (
  value: T[0],
  index: number,
  array: T,
) => void;
