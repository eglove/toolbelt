import { type Draft, produce } from "immer";
import isNil from "lodash/isNil.js";

type Listener = () => void;
type SetOptions = { notifySubscribers?: boolean };
type BindReferenceOptions<E, TState> = {
  accessor?: keyof E;
  onUpdate?: (state: TState, element: E) => void;
};

export class Store<TState> {
  private readonly initialState: TState;

  private readonly listeners = new Set<Listener>();

  private state: TState;

  public constructor(initialState: TState) {
    this.state = initialState;
    this.initialState = initialState;
  }

  public bindRef<E>(
    bounders: {
      options?: BindReferenceOptions<E, TState>;
      selector: (state: TState) => boolean | null | number | string | undefined;
    }[],
  ) {
    return (element: E | null) => {
      if (!isNil(element)) {
        const updateElement = () => {
          for (const { options, selector } of bounders) {
            if (!isNil(options?.accessor)) {
              element[options.accessor] =
                String(selector(this.state)) as E[keyof E];
            }
            options?.onUpdate?.(this.state, element);
          }
        };

        updateElement();
        this.listeners.add(updateElement);

        const observer = new MutationObserver((mutations) => {
          for (const mutation of mutations) {
            if ("childList" === mutation.type && 0 === mutation.addedNodes.length && 0 < mutation.removedNodes.length) {
              this.listeners.delete(updateElement);
            }
          }
        });

        if ((element as HTMLElement).parentNode) {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          observer.observe((element as HTMLElement).parentNode!, {
            childList: true,
            subtree: true,
          });
        }
      }
    };
  }

  public getSnapshot() {
    return this.state;
  }

  public getState(selector: (state: TState) => TState) {
    return selector(this.state);
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
