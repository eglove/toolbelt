/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
 
// @ts-nocheck strict arguments
export function stubFalse() {
  return false;
}

 
export function noop() {}

export function identity(value: unknown) {
  return value;
}

 
export const falsey = [, null, undefined, false, 0, Number.NaN, ''];

function toArguments(array) {
  return function () {
    return arguments;
  }.apply(undefined, array);
}

export const arguments_ = toArguments([1, 2, 3]);

export const strictArguments = (function () {
  'use strict';

  return arguments;
})(1, 2, 3);
