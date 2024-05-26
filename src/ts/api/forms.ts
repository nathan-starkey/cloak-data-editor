// Establish the groundwork for our API:

/**
 * Represents a method to create a user input field.
 * @param name Display name for the input.
 * @param value Starting value for the input.
 * @param changed Callback for when the value is changed.
 * @returns Outermost element to append to the page.
 */
export type Control<TValue> = (name: string, value: TValue, changed: (value: TValue) => void) => HTMLElement;

/** Represents a property. */
export type Property<TValue> = {
  set(value: TValue): void;
  get(): TValue;
};

/** Represents a method to bind a property to an object. */
export type PropertyBinder<TObject, TValue> = (data: TObject) => Property<TValue>;

/** Represents an initializer for binding a single user input field to an object. */
export type FormParamEntry<TObject, TValue> = [name: string, factory: Control<TValue>, bind_property: PropertyBinder<TObject, TValue>];

/** Represents an initializer for binding multiple user input fields to an object. */
export type FormParams<TObject> = FormParamEntry<TObject, any>[];

/** Create a simple property accessor for an object. */
export function create_property_accessor<TObject, TProp extends keyof TObject>(prop: TProp): PropertyBinder<TObject, TObject[TProp]> {
  return (data: TObject) => {
    return {
      set: value => void (data[prop] = value),
      get: () => data[prop]
    };
  };
}

/**
 * Create a set of user input fields from a set of parameters and bind them to an object.
 * @param params Parameters to create the user input fields from.
 * @param object Object to bind the user input fields to.
 * @returns Set of elements to append to the page.
 */
export function create_form<T>(object: T, params: FormParams<T>): HTMLElement[] {
  return params.map(([name, factory, bind_property]) => {
    let property = bind_property(object);

    return factory(name, property.get(), property.set);
  });
}