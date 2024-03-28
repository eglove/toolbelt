import { isNil } from '../is/nil.ts';
import { isUndefined } from '../is/undefined.ts';
import type {
  GetFieldType,
  NumericDictionary,
  PropertyPath,
} from '../types/dictionary.ts';
import { castPath } from './cast-path.ts';
import { toKey } from './to-key.ts';

export function get<T extends object, K extends keyof T>(
  object: T,
  path: K | [K],
): T[K];

export function get<T extends object, K extends keyof T>(
  object: T | null | undefined,
  path: K | [K],
): T[K] | undefined;

export function get<T extends object, K extends keyof T, Default>(
  object: T | null | undefined,
  path: K | [K],
  defaultValue: Default,
): Default | Exclude<T[K], undefined>;

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
>(object: T, path: [K1, K2]): T[K1][K2];

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
>(object: T | null | undefined, path: [K1, K2]): T[K1][K2] | undefined;

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  Default,
>(
  object: T | null | undefined,
  path: [K1, K2],
  defaultValue: Default,
): Default | Exclude<T[K1][K2], undefined>;

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
>(object: T, path: [K1, K2, K3]): T[K1][K2][K3];

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
>(object: T | null | undefined, path: [K1, K2, K3]): T[K1][K2][K3] | undefined;

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  Default,
>(
  object: T | null | undefined,
  path: [K1, K2, K3],
  defaultValue: Default,
): Default | Exclude<T[K1][K2][K3], undefined>;

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
>(object: T, path: [K1, K2, K3, K4]): T[K1][K2][K3][K4];

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
>(
  object: T | null | undefined,
  path: [K1, K2, K3, K4],
): T[K1][K2][K3][K4] | undefined;

export function get<
  T extends object,
  K1 extends keyof T,
  K2 extends keyof T[K1],
  K3 extends keyof T[K1][K2],
  K4 extends keyof T[K1][K2][K3],
  Default,
>(
  object: T | null | undefined,
  path: [K1, K2, K3, K4],
  defaultValue: Default,
): Default | Exclude<T[K1][K2][K3][K4], undefined>;

export function get<T>(object: NumericDictionary<T>, path: number): T;

export function get<T>(
  object: NumericDictionary<T> | null | undefined,
  path: number,
): T | undefined;

export function get<T, Default>(
  object: NumericDictionary<T> | null | undefined,
  path: number,
  defaultValue: Default,
): Default | T;

export function get<Default>(
  object: null | undefined,
  path: PropertyPath,
  defaultValue: Default,
): Default;

export function get(object: null | undefined, path: PropertyPath): undefined;

export function get<T, Path extends string>(
  data: T,
  path: Path,
): string extends Path ? unknown : GetFieldType<T, Path>;

export function get<T, Path extends string, Default = GetFieldType<T, Path>>(
  data: T,
  path: Path,
  defaultValue: Default,
): Default | Exclude<GetFieldType<T, Path>, null | undefined>;

export function get(
  object: unknown,
  path: PropertyPath,
  defaultValue?: unknown,
): unknown;

export function get<T extends object, K extends keyof T>(
  object: T | undefined,
  path: K | [K],
  fallback?: T,
) {
  if (isNil(object)) {
    return;
  }

  const newPath = castPath(path, object);

  let index = 0;
  const { length } = newPath;

  while (!isNil(object) && index < length) {
    // @ts-expect-error allow here
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment,no-param-reassign
    object = object[toKey(newPath[index])];
    index += 1;
  }

  const result = index && index === length ? object : undefined;

  return isUndefined(result) ? fallback : result;
}
