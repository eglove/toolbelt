import entries from "lodash/entries.js";
import every from "lodash/every.js";
import filter from "lodash/filter.js";
import find from "lodash/find.js";

type CrudderEvent = "created" | "deleted" | "updated";

export class Crudder<T extends { [key in K]: unknown }, K extends keyof T> {
  private readonly data = new Map<T[K], T>();

  private readonly listeners = new Map<CrudderEvent, ((item: T) => void)[]>();

  public constructor(private readonly key: K) {}

  private checkHas(key: T[K]) {
    if (this.data.has(key)) {
      return new Error(`Item with ${String(key)} already exists.`);
    }
  }

  private emit(event: CrudderEvent, item: T) {
    const listeners = this.listeners.get(event);
    if (listeners) {
      for (const listener of listeners) {
        listener(item);
      }
    }
  }

  public count() {
    return this.data.size;
  }

  public create(item: T) {
    const check = this.checkHas(item[this.key]);

    if (check) {
      return check;
    }

    this.data.set(item[this.key],
      item);
    this.emit("created",
      item);
    return item;
  }

  // Calls create
  public createMany(items: T[]) {
    const results = [];
    for (const item of items) {
      const result = this.create(item);
      results.push(result);
    }

    return results;
  }

  public delete(key: T[K]) {
    const datum = this.data.get(key);
    this.data.delete(key);

    if (datum) {
      this.emit("deleted",
        datum);
    }
    return datum;
  }

  // Calls delete
  public deleteMany(keys: T[K][]) {
    const results = [];
    for (const key of keys) {
      results.push(this.delete(key));
    }

    return results;
  }

  public findFirst(query: Partial<T>) {
    return find([...this.data.values()],
      (item) => {
        return every(entries(query),
          ([
            key,
            value,
          ]) => {
            return item[key as keyof T] === value;
          });
      });
  }

  public findMany() {
    return [...this.data.values()];
  }

  public findUnique(key: T[K]) {
    return this.data.get(key);
  }

  public listenerCount(type: CrudderEvent) {
    return this.listeners.get(type)?.length;
  }

  public subscribe(event: CrudderEvent, listener: (item: T) => void) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event,
        []);
    }

    this.listeners.get(event)?.push(listener);
  }

  public unsubscribe(event: CrudderEvent, listener: (item: T) => void) {
    this.listeners.set(
      event,
      filter(this.listeners.get(event),
        (l) => {
          return l !== listener;
        }),
    );
  }

  public update(key: T[K], data: Partial<Omit<T, K>>) {
    const item = {
      ...this.findUnique(key),
      ...data,
      [this.key]: key,
    } as T;

    this.data.set(key,
      item);
    this.emit("updated",
      item);
    return item;
  }

  // Calls update
  public updateMany(items: {
    data: Partial<Omit<T, K>>;
    key: T[K];
  }[]) {
    const results = [];
    for (const item of items) {
      results.push(this.update(item.key,
        item.data));
    }

    return results;
  }

  // Calls update
  public upsert(key: T[K], data: Omit<T, K>) {
    const found = this.findUnique(key);

    if (found) {
      return this.update(key,
        data);
    }
    return this.create({
      ...data,
      [this.key]: key,
    } as T);
  }
}
