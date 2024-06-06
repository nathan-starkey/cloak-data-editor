import { Proxy, Observer } from "../types";

/** Create a proxy for getting and setting an object property. */
export function use_object_property<T, K extends keyof T>(object: T, property: K): Proxy<T[K]> & Observer<T[K]> {
  let observers: ((value: T[K]) => void)[] = [];

  let proxy = {
    get() {
      return object[property];
    },

    set(value: T[K]) {
      object[property] = value;
    },

    observe(observer: (value: T[K]) => void) {
      observers.push(observer);
    },

    notify() {
      for (let observer of observers) {
        observer(proxy.get());
      }
    }
  };

  return proxy;
}