/** Represents an abstract handle for a value. */
export type Proxy<T> = {
  get(): T;

  set(value: T): void;
};

/** Represents an initializer for a user input field. */
export type Control<T> = (name: string, proxy: Proxy<T>) => HTMLElement;

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

/** Create a user input field for a boolean. */
export const create_boolean_control: Control<boolean> = (name: string, proxy: Proxy<boolean>) => {
  let elems = $(/*html*/`
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="">
      <label class="form-check-label"></label>
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  label.text(name);
  input.prop("checked", proxy.get());
  input.on("input", () => proxy.set(input.prop("checked")));

  return elems[0];
};

/** Create a user input field for a number. */
export const create_number_control: Control<number> = (name: string, proxy: Proxy<number>) => {
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <input class="form-control" type="number" placeholder="0">
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  label.text(name);
  input.val(proxy.get());
  input.on("input", () => proxy.set(parseFloat(input.val() || "") || 0));

  return elems[0];
};

/** Create a user input field for a string. */
export const create_string_control: Control<string> = (name: string, proxy: Proxy<string>) => {
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <input class="form-control" placeholder="(Empty)">
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  label.text(name);
  input.val(proxy.get());
  input.on("input", () => proxy.set(input.val() || ""));

  return elems[0];
};