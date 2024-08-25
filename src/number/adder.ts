import includes from "lodash/includes.js";
import indexOf from "lodash/indexOf.js";
import map from "lodash/map.js";
import padEnd from "lodash/padEnd.js";
import padStart from "lodash/padStart.js";
import slice from "lodash/slice.js";
import split from "lodash/split.js";
import trim from "lodash/trim.js";

const getTrimmedNumbers = (numbers: string[]) => {
  let trimmed = trim(numbers.join(""), "0");

  if ("." === trimmed.charAt(0)) {
    trimmed = `0${trimmed}`;
  }

  if ("." === trimmed.at(-1)) {
    return trimmed.slice(0, -1);
  }

  return trimmed;
};


const getPaddedNumbers = (numbers: string[]) => {
  const withDecimals = map(numbers, (number) => {
    return includes(number, ".")
      ? number
      : `${number}.0`;
  });

  const decimalArray = map(withDecimals, (number) => {
    return split(number, ".");
  });

  return getPadded(decimalArray);
};

const getPadded = (arrays: string[][]) => {
  const integerMax = Math.max(...map(arrays, (array) => {
    return array[0].length;
  }));

  const decimalMax = Math.max(...map(arrays, (array) => {
    return array[1].length;
  }));

  for (const array of arrays) {
    array[0] = padStart(array[0], integerMax, "0");
    array[1] = padEnd(array[1], decimalMax, "0");
  }

  const padded = map(arrays, (array) => {
    return split(`${array[0]}.${array[1]}`, "");
  });

  const sum = split(`${padStart("", integerMax, "0")}.${padStart("", decimalMax, "0")}`, "");

  return [sum, ...padded];
};

const arrayToNumber = (array: string[]) => {
  let result = 0;
  for (const [index] of array.entries()) {
    // Traverse numbers in reverse order, get complement index
    const number = array[array.length - 1 - index];
    // eslint-disable-next-line prefer-exponentiation-operator
    result += Number(number) * Math.pow(10, index);
  }

  return result;
};

// eslint-disable-next-line sonar/cognitive-complexity
export const adder = (numbers: string[]): string => {
  const [sumArray, ...paddedArrays] = getPaddedNumbers(numbers);

  for (const paddedArray of paddedArrays) {
    if ("-" === paddedArray[0]) {
      paddedArray[0] = "0";
      for (const [index, element] of paddedArray.entries()) {
        // eslint-disable-next-line sonar/nested-control-flow
        if ("." !== element) {
          paddedArray[index] = `-${element}`;
        }
      }
    }

    for (const [index, element] of paddedArray.entries()) {
      if ("." !== element && "-" !== element) {
        sumArray[index] = String(Number(sumArray[index]) + Number(element));
      }
    }
  }

  for (const element of sumArray) {
    const indexOfPeriod = indexOf(sumArray, ".");
    const biggerNumbers = [];
    const integers = slice(sumArray, 0, indexOfPeriod);
    const decimals = slice(sumArray, indexOfPeriod + 1);

    if ("." !== element && 9 < Number(element)) {
      let integerZeros = "";
      for (let index = integers.length - 1; 0 <= index; index -= 1) {
        biggerNumbers.push(`${integers[index]}${integerZeros}`);
        integerZeros += "0";
      }

      let decimalZeros = "";
      for (const [index, decimal] of decimals.entries()) {
        // eslint-disable-next-line sonar/nested-control-flow
        if (9 < Number(decimal) && 0 === index) {
          biggerNumbers[0] = String(Number(biggerNumbers[0]) + 1);
        } else if (9 < Number(decimal)) {
          const oneLessZero = decimalZeros.slice(1);
          biggerNumbers.push(`0.${oneLessZero}${decimal}`);
        } else {
          biggerNumbers.push(`0.${decimalZeros}${decimal}`);
        }
        decimalZeros += "0";
      }

      return adder(biggerNumbers);
    }

    if ("." !== element && 0 > Number(element)) {
      const convertedIntegers = arrayToNumber(integers);
      const convertedDecmals = arrayToNumber(decimals);
      return getTrimmedNumbers([String(convertedIntegers), ".", String(convertedDecmals)]);
    }
  }

  return getTrimmedNumbers(sumArray);
};
