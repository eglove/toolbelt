import { type Draft, produce } from "immer";
import isNil from "lodash/isNil.js";
import { v4 } from "uuid";

export type Listener = () => void;
export type SetOptions = { notifySubscribers?: boolean };

export class Store<TState> {
  private readonly elementListeners = new Map<string, HTMLElement>();

  private readonly initialState: TState;

  private readonly listeners = new Set<Listener>();

  public state: TState;

  public constructor(initialState: TState) {
    this.state = initialState;
    this.initialState = initialState;
  }

  private cleanup(id: string, updateElement: Listener): boolean {
    if (this.elementListeners.has(id) && "undefined" !== typeof window) {
      // eslint-disable-next-line ethang/handle-native-error
      const foundElement = document.querySelector(`[data-listener-id="${id}"]`);

      if (isNil(foundElement)) {
        this.elementListeners.delete(id);
        this.listeners.delete(updateElement);
        return true;
      }
    }

    return false;
  }

  public bindQuerySelector<E>(
  // eslint-disable-next-line @typescript-eslint/no-deprecated
    selector: Parameters<typeof document.querySelector>[0],
    onUpdate: (state: TState, element: E) => void,
  ) {
    // eslint-disable-next-line ethang/handle-native-error
    const element = document.querySelector(selector) as E;
    this.bindRef(onUpdate)(element);
  }

  public bindQuerySelectorAll<E>(
    // eslint-disable-next-line @typescript-eslint/no-deprecated
    selectors: Parameters<typeof document.querySelectorAll>[0],
    onUpdate: (state: TState, element: E) => void,
  ) {
    // eslint-disable-next-line ethang/handle-native-error
    const elements = document.querySelectorAll(selectors);

    for (const element of elements) {
      this.bindRef(onUpdate)(element as E);
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

  public resetState(setOptions?: SetOptions) {
    this.state = this.initialState;

    if (false === setOptions?.notifySubscribers) {
      this.notifySubscribers();
    }
  }

  public setState(
    updater: (draft: Draft<TState>) => void,
    setOptions?: SetOptions,
  ) {
    this.state = produce(this.state, updater);

    if (false !== setOptions?.notifySubscribers) {
      this.notifySubscribers();
    }
  }

  public subscribe(listener: Listener) {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }
}
