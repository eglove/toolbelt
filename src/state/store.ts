import { type Draft, produce } from "immer";
import isNil from "lodash/isNil.js";
import { v4 } from "uuid";

export type Listener = () => void;

export class Store<TState> {
  private _state: TState;

  private readonly elementListeners = new Map<string, HTMLElement>();

  private readonly initialState: TState;

  private readonly listeners = new Set<Listener>();

  public constructor(initialState: TState) {
    this._state = initialState;
    this.initialState = initialState;
  }

  private cleanup(id: string, updateElement: Listener): boolean {
    if (this.elementListeners.has(id) && "undefined" !== typeof window) {
      const foundElement = document.querySelector(`[data-listener-id="${id}"]`);

      if (isNil(foundElement)) {
        this.elementListeners.delete(id);
        this.listeners.delete(updateElement);
        return true;
      }
    }

    return false;
  }

  public bind<E>(
    binder: () => E,
    onUpdate: (state: TState, element: E) => void,
  ) {
    this.bindRef(onUpdate)(binder());
  }

  public bindAll<E>(
    binders: () => Iterable<E>,
    onUpdate: (state: TState, element: E) => void,
  ) {
    for (const binder of binders()) {
      this.bindRef(onUpdate)(binder);
    }
  }

  public bindRef<E>(
    onUpdate: (state: TState, element: E) => void,
  ) {
    return (element: E | null) => {
      const id = v4();

      if (!isNil(element)) {
        const updateElement = () => {
          const cleanedUp = this.cleanup(id, updateElement);
          if (!cleanedUp) {
            onUpdate(this.state, element);
          }
        };

        updateElement();
        this.listeners.add(updateElement);
        (element as HTMLElement).dataset.listenerId = id;
        this.elementListeners.set(id, element as HTMLElement);
      }
    };
  }

  public notifySubscribers() {
    for (const listener of this.listeners) {
      listener();
    }
  }

  public resetState() {
    this.state = this.initialState;
  }

  public set(updater: (draft: Draft<TState>) => void) {
    this.state = produce(this.state, updater);
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private set state(state: TState) {
    this._state = state;
    this.notifySubscribers();
  }

  public get state() {
    return this._state;
  }
}
