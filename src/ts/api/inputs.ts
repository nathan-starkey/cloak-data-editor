/** Represents an abstract handle for a value. */
export type Proxy<T> = {
  get(): T;

  set(value: T): void;
};

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
export function create_input_checkbox(name: string, proxy: Proxy<boolean>): HTMLElement {
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
}

/** Create a user input field for a number. */
export function create_input_number(name: string, proxy: Proxy<number>): HTMLElement {
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
}

/** Create a user input field for a single-line string. */
export function create_input_text(name: string, proxy: Proxy<string>): HTMLElement {
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
}

/** Create a user input field for a multi-line string. */
export function create_textarea(name: string, proxy: Proxy<string>): HTMLElement {
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <textarea class="form-control" rows="5" placeholder="(Empty)"></textarea>
    </div>
  `);

  let label = elems.find("label");
  let textarea = elems.find("textarea");

  label.text(name);
  textarea.val(proxy.get());
  textarea.on("input", () => proxy.set(textarea.val() || ""));

  return elems[0];
}