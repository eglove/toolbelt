/* eslint-disable sonar/no-duplicate-string */
/* eslint-disable cspell/spellchecker */
import {
  ACCELERATION,
  ANGLE,
  AREA,
  CONSUMPTION,
  DIGITAL,
  DIGITAL_DECIMAL,
  DURATION,
  ELECTRIC,
  ENERGY,
  type FactorDef,
  FORCE,
  FREQUENCY,
  GRAPHICS_PER,
  GRAPHICS_PIXEL,
  LENGTH,
  MASS,
  POWER,
  PRESSURE,
  SPEED,
  TORQUE,
  VOLUME,
  VOLUME_UK,
} from "@phensley/unit-converter";

export const accelerationUnits = new Set([
  "g-force",
  "meter-per-square-second",
] as const);

export const angleUnits = new Set([
  "revolution",
  "degree",
  "arc-minute",
  "arc-second",
  "radian",
] as const);

export const areaUnits = new Set([
  "square-kilometer",
  "square-meter",
  "hectare",
  "square-centimeter",
  "square-inch",
  "square-mile",
  "square-yard",
  "square-foot",
  "acre",
  "square-inch",
] as const);

export const consumptionUnits = new Set([
  "liter-per-100-kilometer",
  "liter-per-kilometer",
] as const);

export const digitalUnits = new Set([
  "terabit",
  "gigabit",
  "megabit",
  "kilobit",
  "bit",
  "byte",
  "terabyte",
  "gigabyte",
  "megabyte",
  "kilobyte",
] as const);

export const digitalDecimalUnits = new Set([
  "terabitDecimal",
  "gigabitDecimal",
  "megabitDecimal",
  "kilobitDecimal",
  "bitDecimal",
  "byteDecimal",
  "terabyteDecimal",
  "gigabyteDecimal",
  "megabyteDecimal",
  "kilobyteDecimal",
  "byteDecimal",
] as const);

export const durationUnits = new Set([
  "century",
  "second",
  "year",
  "month",
  "day",
  "week",
  "hour",
  "minute",
  "millisecond",
  "microsecond",
  "nanosecond",
] as const);

export const electricUnits = new Set([
  "ampere",
  "milliampere",
] as const);

export const energyUnits = new Set([
  "kilojoule",
  "joule",
  "kilowatt-hour",
  "calorie",
  "foodcalorie",
  "kilocalorie",
] as const);

export const frequencyUnits = new Set([
  "gigahertz",
  "megahertz",
  "kilohertz",
  "hertz",
] as const);

export const forceUnits = new Set([
  "pound-force",
  "newton",
] as const);

export const graphicsPerUnits = new Set([
  "dot-per-inch",
  "pixel-per-inch",
  "dot-per-centimeter",
] as const);

export const graphicsPixelUnits = new Set([
  "megapixel",
  "pixel",
] as const);

export const lengthUnits = new Set([
  "kilometer",
  "centimeter",
  "meter",
  "decimeter",
  "millimeter",
  "micrometer",
  "nanometer",
  "picometer",
  "mile",
  "foot",
  "yard",
  "inch",
  "light-year",
  "astronomical-unit",
  "parsec",
  "furlong",
  "fathom",
  "nautical-mile",
  "mile-scandinavian",
  "point",
] as const);

export const massUnits = new Set([
  "tonne",
  "kilogram",
  "gram",
  "milligram",
  "microgram",
  "carat",
  "pound",
  "kilogram",
  "ton",
  "stone",
  "ounce",
  "ounce-troy",
] as const);

export const powerUnits = new Set([
  "gigawatt",
  "megawatt",
  "kilowatt",
  "watt",
  "horsepower",
] as const);

export const pressureUnits = new Set([
  "hectopascal",
  "millibar",
  "pound-force-per-square-inch",
  "inch-ofhg",
  "millimeter-ofhg",
] as const);

export const speedUnits = new Set([
  "kilometer-per-hour",
  "meter-per-second",
  "mile-per-hour",
  "knot",
] as const);

export const torqueUnits = new Set([
  "pound-force-foot",
  "newton-meter",
] as const);

export const volumeBaseUnits = new Set([
  "cubic-kilometer",
  "cubic-meter",
  "cubic-centimeter",
  "cubic-inch",
  "liter",
  "megaliter",
  "liter",
  "hectoliter",
  "deciliter",
  "centiliter",
  "milliliter",
  "cup-metric",
  "cubic-mile",
  "cubic-yard",
  "cubic-foot",
  "cubic-meter",
  "cubic-inch",
  "acre-foot",
  "pint-metric",
  "milliliter",
  "tablespoon",
  "fluid-ounce",
  "teaspoon",
  "gallon-US",
  "gallon-imperial-US",
  "bushel-US",
  "gallon-US",
  "fluid-ounce-US",
  "quart-US",
  "pint-US",
  "cup-US",
] as const);

export const volumeUkUnits = new Set([
  "gallon-UK",
  "gallon-imperial-UK",
  "bushel-UK",
  "fluid-ounce-UK",
  "quart-UK",
  "pint-UK",
  "cup-UK",
] as const);

export const unitsMap = new Map<Set<string>, FactorDef[]>([
  [
    accelerationUnits,
    ACCELERATION,
  ],
  [
    angleUnits,
    ANGLE,
  ],
  [
    areaUnits,
    AREA,
  ],
  [
    consumptionUnits,
    CONSUMPTION,
  ],
  [
    digitalDecimalUnits,
    DIGITAL_DECIMAL,
  ],
  [
    digitalUnits,
    DIGITAL,
  ],
  [
    durationUnits,
    DURATION,
  ],
  [
    electricUnits,
    ELECTRIC,
  ],
  [
    energyUnits,
    ENERGY,
  ],
  [
    forceUnits,
    FORCE,
  ],
  [
    frequencyUnits,
    FREQUENCY,
  ],
  [
    graphicsPerUnits,
    GRAPHICS_PER,
  ],
  [
    graphicsPixelUnits,
    GRAPHICS_PIXEL,
  ],
  [
    lengthUnits,
    LENGTH,
  ],
  [
    massUnits,
    MASS,
  ],
  [
    powerUnits,
    POWER,
  ],
  [
    pressureUnits,
    PRESSURE,
  ],
  [
    speedUnits,
    SPEED,
  ],
  [
    torqueUnits,
    TORQUE,
  ],
  [
    volumeBaseUnits,
    VOLUME,
  ],
  [
    volumeUkUnits,
    VOLUME_UK,
  ],
]);

type UnitMap = {
  acre: ["square-foot"];
  "acre-foot": ["cubic-foot"];
  ampere: ["milliampere"];
  "arc-minute": ["degree"];
  "arc-second": ["arc-minute"];
  "astronomical-unit": ["meter"];
  "bushel-UK": ["gallon-imperial"];
  "bushel-US": ["cubic-inch"];
  byte: ["bit"];
  byteDecimal: ["bitDecimal"];
  calorie: ["joule"];
  carat: ["milligram"];
  centiliter: ["liter"];
  century: ["second"];
  "cubic-centimeter": ["cubic-inch"];
  "cubic-foot": ["cubic-meter", "liter"];
  "cubic-inch": ["cubic-foot"];
  "cubic-kilometer": ["cubic-meter"];
  "cubic-meter": ["cubic-centimeter"];
  "cubic-mile": ["cubic-yard"];
  "cubic-yard": ["cubic-foot"];
  "cup-metric": ["liter"];
  "cup-UK": ["milliliter"];
  "cup-US": ["fluid-ounce"];
  day: ["hour"];
  deciliter: ["liter"];
  decimeter: ["centimeter"];
  "dot-per-centimeter": ["dot-per-inch"];
  "dot-per-inch": ["pixel-per-inch"];
  fathom: ["foot"];
  "fluid-ounce_US": ["gallon"];
  "fluid-ounce-UK": ["gallon-imperial"];
  foodcalorie: ["joule"];
  foot: ["inch"];
  furlong: ["yard"];
  "gallon-imperial_US": ["liter"];
  "gallon-imperial-UK": ["liter"];
  "gallon-UK": ["liter"];
  "gallon-US": ["liter", "cubic-inch"];
  gigabit: ["megabit"];
  gigabitDecimal: ["megabitDecimal"];
  gigabyte: ["megabyte"];
  gigabyteDecimal: ["megabyteDecimal"];
  gigahertz: ["megahertz"];
  gigawatt: ["megawatt"];
  gram: ["kilogram"];
  hectare: ["square-meter"];
  hectoliter: ["liter"];
  hectopascal: ["millibar", "pound-force-per-square-inch"];
  horsepower: ["watt"];
  hour: ["minute"];
  inch: ["centimeter"];
  "inch-ofhg": ["hectopascal"];
  kilobit: ["bit"];
  kilobitDecimal: ["bitDecimal"];
  kilobyte: ["byte"];
  kilobyteDecimal: ["byteDecimal"];
  kilocalorie: ["calorie"];
  kilohertz: ["hertz"];
  kilojoule: ["joule"];
  kilometer: ["centimeter"];
  "kilometer-per-hour": ["meter-per-second"];
  kilowatt: ["watt"];
  "kilowatt-hour": ["joule"];
  knot: ["meter-per-second"];
  "light-year": ["meter"];
  liter: ["cubic-centimeter"];
  "liter-per-100-kilometer": ["liter-per-kilometer"];
  megabit: ["kilobit"];
  megabitDecimal: ["kilobitDecimal"];
  megabyte: ["kilobyte"];
  megabyteDecimal: ["kilobyteDecimal"];
  megahertz: ["kilohertz"];
  megaliter: ["liter"];
  megapixel: ["pixel"];
  megawatt: ["kilowatt"];
  meter: ["centimeter"];
  microgram: ["milligram"];
  micrometer: ["centimeter"];
  microsecond: ["nanosecond"];
  mile: ["foot"];
  "mile-per-hour": ["meter-per-second"];
  "mile-scandinavian": ["meter"];
  milligram: ["gram"];
  milliliter: ["liter"];
  millimeter: ["centimeter"];
  "millimeter-ofhg": ["hectopascal"];
  millisecond: ["microsecond"];
  minute: ["second"];
  month: ["day"];
  nanometer: ["centimeter"];
  "nautical-mile": ["meter"];
  ounce: ["pound"];
  "ounce-troy": ["pound"];
  parsec: ["astronomical-unit"];
  picometer: ["centimeter"];
  "pint-metric": ["milliliter"];
  "pint-UK": ["gallon-imperial"];
  "pint-US": ["gallon"];
  point: ["inch"];
  pound: ["kilogram"];
  "pound-force": ["newton"];
  "pound-force-foot": ["newton-meter"];
  "quart-UK": ["gallon-imperial"];
  "quart-US": ["gallon"];
  radian: ["revolution"];
  revolution: ["degree"];
  second: ["millisecond"];
  "square-centimeter": ["square-meter", "square-inch"];
  "square-foot": ["square-inch"];
  "square-kilometer": ["square-meter"];
  "square-mile": ["square-meter", "square-yard", "square-foot"];
  "square-yard": ["square-foot"];
  stone: ["pound"];
  tablespoon: ["fluid-ounce"];
  teaspoon: ["fluid-ounce"];
  terabit: ["gigabit"];
  terabitDecimal: ["gigabitDecimal"];
  terabyteDecimal: ["gigabyteDecimal"];
  ton: ["pound"];
  tonne: ["kilogram"];
  week: ["day"];
  yard: ["inch"];
  year: ["month", "second"];
};

export type FromUnit = keyof UnitMap;
export type ToUnit<From extends FromUnit> = UnitMap[From][number];
