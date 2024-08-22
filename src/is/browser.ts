import isNil from "lodash/isNil.js";

export const isBrowser = "undefined" !== typeof window && !isNil(window.document);
