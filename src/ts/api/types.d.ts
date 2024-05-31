/** Represents a proxy for getting and setting an abstract value. */
export type Proxy<T> = {
  get(): T;

  set(value: T): void;
};