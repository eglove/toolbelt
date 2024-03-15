// https://262.ecma-international.org/7.0/#sec-samevaluezero
export function isSameValueZero(x: unknown, y: unknown) {
  return x === y || (Number.isNaN(x) && Number.isNaN(y));
}
