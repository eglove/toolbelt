// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
/* eslint-disable unicorn/no-abusive-eslint-disable */
/* eslint-disable */
import { freeGlobal } from './free-global.ts';

const freeExports =
  typeof exports === 'object' &&
  exports !== null &&
  !exports.nodeType &&
  exports;

const freeModule =
  freeExports &&
  typeof module === 'object' &&
  module !== null &&
  !module.nodeType &&
  module;

const moduleExports = freeModule && freeModule.exports === freeExports;

const freeProcess = moduleExports && freeGlobal.process;

export const nodeTypes = (() => {
  try {
    const typesHelper = freeModule?.require?.('util').types;
    return typesHelper
      ? typesHelper
      : freeProcess?.binding?.('util');
  } catch {}
})();
