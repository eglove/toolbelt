import { CLDRFramework } from '@phensley/cldr';

export function getLocales() {
  return CLDRFramework.availableLocales();
}
