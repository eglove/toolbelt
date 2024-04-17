import { CLDRFramework } from "@phensley/cldr";

export const getLocales = () => {
  return CLDRFramework.availableLocales();
};
