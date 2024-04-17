export type NumericDictionary<T> = Record<number, T>;

export type Many<T> = T | readonly T[];

export type PropertyName = number | string | symbol;

export type PropertyPath = Many<PropertyName>;

export type FieldWithPossiblyUndefined<T, Key> =
  | Extract<T, undefined>
  | GetFieldType<Exclude<T, undefined>, Key>;

export type GetIndexedField<T, K> = K extends keyof T
  ? T[K]
  : K extends `${number}`
    ? "length" extends keyof T
      ? number extends T["length"]
        ? number extends keyof T
          ? T[number]
          : undefined
        : undefined
      : undefined
    : undefined;

export type IndexedFieldWithPossiblyUndefined<T, Key> =
  | Extract<T, undefined>
  | GetIndexedField<Exclude<T, undefined>, Key>;

export type GetFieldType<T, P> = P extends `${infer Left}.${infer Right}`
  ? Left extends keyof Exclude<T, undefined>
    ?
        | Extract<T, undefined>
        | FieldWithPossiblyUndefined<Exclude<T, undefined>[Left], Right>
    : Left extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? FieldWithPossiblyUndefined<
            IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>,
            Right
          >
        : undefined
      : undefined
  : P extends keyof T
    ? T[P]
    : P extends `${infer FieldKey}[${infer IndexKey}]`
      ? FieldKey extends keyof T
        ? IndexedFieldWithPossiblyUndefined<T[FieldKey], IndexKey>
        : undefined
      : IndexedFieldWithPossiblyUndefined<T, P>;
