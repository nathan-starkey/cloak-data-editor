import { Proxy } from "../types";

/** Represents a proxy for getting and setting an object property value. */
export class ObjectPropertyProxy<T, K extends keyof T> implements Proxy<T[K]> {
  constructor(private object: T, private property: K) {}

  public set(value: T[K]) {
    this.object[this.property] = value;
  }

  public get() {
    return this.object[this.property];
  }
}

/** Create a proxy for getting and setting an object property value. */
export function use_object_property<T, K extends keyof T>(object: T, property: K) {
  return new ObjectPropertyProxy(object, property);
}