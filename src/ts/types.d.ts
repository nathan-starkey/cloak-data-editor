/** Represents an interface for getting and setting a value. */
export interface Proxy<T> {
  get(): T;

  set(value: T): void;
}

/** Represents an interface for observing changes to a value. */
export interface Observer<T> {
  observe(callback: (value: T) => void): void;

  notify(): void;
}