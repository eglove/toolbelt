import type { Paths, Split } from "type-fest";

import get from "lodash/get.js";

export const propertiesIsEqual = <T1, T2,>(
  object1: T1,
  object2: T2,
// @ts-expect-error this seems fine
  paths: Split<Paths<T1 | T2>, ".">[],
) => {
  let result = false;
  for (const path of paths) {
    result = get(object1, path) === get(object2, path);
  }

  return result;
};
