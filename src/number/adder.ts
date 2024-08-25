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

/*
 * Fundamentally converts numbers into arrays and adds single digits at a time.
 * adder(['123', '777'])
 *
 * [['1', '2', '3'], ['7', '7', '7'], ['0', '0', '0']]
 * ['8', '9', '10'] -> ['800', '90', '10']
 *
 * [['8', '0', '0'], ['0', '9', '0'], ['0', '1', '0']]
 * ['8', '10', '0'] -> ['800', '100', '0']
 *
 * [['8', '0', '0'], ['1', '0', '0'], ['0', '0', '0']]
 * ['9', '0', '0']
 *
 * -> 900
 */
// eslint-disable-next-line sonar/cognitive-complexity
export const adder = (numbers: string[]): string => {
  // Pad 0's to keep array sizes the same. [10, 8.2] -> [10.0, 08.2]
  const [sumArray, ...paddedArrays] = getPaddedNumbers(numbers);

  for (const paddedArray of paddedArrays) {
    // If a number is negative, make each digit negative
    if ("-" === paddedArray[0]) {
      paddedArray[0] = "0";
      for (const [index, element] of paddedArray.entries()) {
        // eslint-disable-next-line sonar/nested-control-flow
        if ("." !== element) {
          paddedArray[index] = `-${element}`;
        }
      }
    }

    // This is where we start adding!
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

    // If sum contains a digit bigger than 9, it's not valid, we'll add bigger numbers
    // [2, 10, 6, ., 3, 5] -> adder([200, 100, 6, 0.3, 0.05])
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

    // If sum contains a negative, this will use powers to convert
    // [1, -4, 3] -> 63
    if ("." !== element && 0 > Number(element)) {
      const convertedIntegers = arrayToNumber(integers);
      const convertedDecmals = arrayToNumber(decimals);
      return getTrimmedNumbers([String(convertedIntegers), ".", String(convertedDecmals)]);
    }
  }

  // Trim extra 0's and return!
  return getTrimmedNumbers(sumArray);
};
