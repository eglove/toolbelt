import {
  DIGITAL_DECIMAL,
  type FactorDef,
  UnitFactors,
  VOLUME,
  VOLUME_UK,
} from "@phensley/unit-converter";
import isNil from "lodash/isNil.js";
import replace from "lodash/replace.js";

import { type FromUnit, type ToUnit, unitsMap } from "./conversion-types.ts";

export const convertNumber = <From extends FromUnit, To extends ToUnit<From>,>(
  value: number,
  from: From,
  to: To,
) => {
  let factorDefinition: FactorDef[] = [];
  let mutableTo = to;
  let mutableFrom = from;

  for (const [
    unit,
    factorDefinitions,
  ] of unitsMap) {
    if (unit.has(from)) {
      factorDefinition = factorDefinitions;

      switch (factorDefinitions) {
        case DIGITAL_DECIMAL: {
          mutableTo = replace(to,
            "Decimal",
            "") as To;
          mutableFrom = replace(from,
            "Decimal",
            "") as From;
          break;
        }
        case VOLUME: {
          mutableTo = replace(to,
            "-US",
            "") as To;
          mutableFrom = replace(from,
            "-US",
            "") as From;
          break;
        }
        case VOLUME_UK: {
          mutableTo = replace(to,
            "-UK",
            "") as To;
          mutableFrom = replace(from,
            "-UK",
            "") as From;
          break;
        }
        // No default
      }

      break;
    }
  }

  const factors = new UnitFactors(factorDefinition);
  const factor = factors.get(mutableFrom,
    mutableTo);

  if (isNil(factor)) {
    return new Error("conversion not possible");
  }

  return Number(factor.factors[0].multiply(value).toDecimal()
    .toString());
};
