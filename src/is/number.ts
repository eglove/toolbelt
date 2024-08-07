export const isNumber = (value: unknown): value is number => {
  return !Number.isNaN(Number(value));
};
