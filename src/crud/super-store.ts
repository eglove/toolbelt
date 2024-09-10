import type { Get, StringKeyOf } from "type-fest";

import { type AnyUpdater, Store, type StoreOptions } from "@tanstack/store";
import { produce } from "immer";
import get from "lodash/get.js";
import set from "lodash/set.js";

type BaseRecord = Record<number | string | symbol, unknown>;

type NestedPath<T extends BaseRecord> = {
  [K in StringKeyOf<T>]: T[K] extends BaseRecord
    ? [K, ...NestedPath<T[K]>] | [K]
    : [K]
}[StringKeyOf<T>];

export class SuperStore<
  TState extends BaseRecord,
  TUpdater extends AnyUpdater = (callback: TState) => TState,
> extends Store<TState, TUpdater> {
  private readonly _initialState: TState;

  public constructor(
    initialState: TState, options?: StoreOptions<TState, TUpdater>,
  ) {
    super(initialState, options);
    this._initialState = initialState;
  }

  public getValue<Path extends NestedPath<TState>>(
  // @ts-expect-error allow deeply nested type
    path: Path, fallback?: Get<TState, Path>,
  ) {
    return get(this.state, path, fallback) as Get<TState, Path>;
  }

  public resetState() {
    this.setState((() => {
      return this._initialState;
    }) as TUpdater);
  }

  public setValue<Path extends NestedPath<TState>>(
    path: Path,
    value: Get<TState, Path>,
  ) {
    const produced = produce(this.state, (draft) => {
      set(draft, path, value);
    });

    this.setState((() => {
      return produced;
    }) as TUpdater);
  }
}
