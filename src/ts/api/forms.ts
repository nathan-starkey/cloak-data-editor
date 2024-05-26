// Establish the groundwork for our API:

/**
 * Represents a method to create a user input field.
 * @param name Display name for the input.
 * @param value Starting value for the input.
 * @param changed Callback for when the value is changed.
 * @returns Outermost element to append to the page.
 */
export type Control<T> = (name: string, value: T, changed: (value: T) => void) => HTMLElement;

/** Represents an initializer for binding a single user input field to an object. */
export type FormParamEntry<T> = { [K in keyof T]: [prop: K, name: string, factory: Control<T[K]>] }[keyof T];

/** Represents an initializer for binding multiple user input fields to an object. */
export type FormParams<T> = FormParamEntry<T>[];

/**
 * Create a set of user input fields from a set of parameters and bind them to an object.
 * @param params Parameters to create the user input fields from.
 * @param data Object to bind the user input fields to.
 * @returns Set of elements to append to the page.
 */
export function create_form<T>(params: FormParams<T>, data: T): HTMLElement[] {
  return params.map(([prop, name, factory]) => factory(name, data[prop], value => data[prop] = value));
}