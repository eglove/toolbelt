import {
  DIGITAL_DECIMAL,
  type FactorDef,
  UnitFactors,
  VOLUME,
  VOLUME_UK,
} from "@phensley/unit-converter";
import isNil from "lodash/isNil.js";

import { type FromUnit, type ToUnit, unitsMap } from "./conversion-types.ts";

export const convertNumber = <From extends FromUnit, To extends ToUnit<From>>(
  value: number,
  from: From,
  to: To,
) => {
  let factorDefinition: FactorDef[] = [];
  let mutableTo = to;
  let mutableFrom = from;

  for (const [unit, factorDefinitions] of unitsMap) {
    if (unit.has(from)) {
      factorDefinition = factorDefinitions;

      switch (factorDefinitions) {
        case DIGITAL_DECIMAL: {
          mutableTo = to.replace("Decimal", "") as To;
          mutableFrom = from.replace("Decimal", "") as From;
          break;
        }
        case VOLUME: {
          mutableTo = to.replace("-US", "") as To;
          mutableFrom = from.replace("-US", "") as From;
          break;
        }
        case VOLUME_UK: {
          mutableTo = to.replace("-UK", "") as To;
          mutableFrom = from.replace("-UK", "") as From;
          break;
        }
        // No default
      }

      break;
    }
  }

  const factors = new UnitFactors(factorDefinition);
  const factor = factors.get(mutableFrom, mutableTo);

  if (isNil(factor)) {
    return new Error("conversion not possible");
  }

  return Number(factor.factors[0].multiply(value).toDecimal().toString());
};
