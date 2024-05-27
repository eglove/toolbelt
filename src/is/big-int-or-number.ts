export const isBigIntOrNumber = (value: unknown): boolean => {
  if (
    ("number" === typeof value || "bigint" === typeof value) &&
    !Number.isNaN(value)
  ) {
    return true;
  }

  if ("string" === typeof value) {
    return /^-?\d*\.?\d+$/u.test(value);
  }

  return false;
};
