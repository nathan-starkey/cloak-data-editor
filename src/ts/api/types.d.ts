/** Represents an abstract handle for a value. */
export type Proxy<T> = {
  get(): T;

  set(value: T): void;
};