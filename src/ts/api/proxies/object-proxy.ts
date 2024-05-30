import { Proxy } from "./types";

/** Create a simple proxy for a property of an object. */
export function create_object_proxy<T, K extends keyof T>(object: T, property: K): Proxy<T[K]> {
  return {
    set(value: T[K]) {
      object[property] = value;
    },

    get() {
      return object[property];
    }
  };
}