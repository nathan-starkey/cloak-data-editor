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
  // Create the elements
  let elems = $(/*html*/`
    <div class="form-check">
      <input class="form-check-input" type="checkbox" value="">

      <label class="form-check-label"></label>
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  // Set the label's text
  label.text(name);

  // Set the initial value
  input.prop("checked", proxy.get());

  // Update the proxy when the value is changed
  input.on("input", () => proxy.set(input.prop("checked")));

  return elems[0];
}

/** Create a user input field for a number. */
export function create_input_number(name: string, proxy: Proxy<number>): HTMLElement {
  // Create the elements
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>

      <input class="form-control" type="number" placeholder="0">
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  // Set the label's text
  label.text(name);

  // Set the initial value
  input.val(proxy.get());

  // Update the proxy when the value is changed
  input.on("input", () => proxy.set(parseFloat(input.val() || "") || 0));

  return elems[0];
}

/** Create a user input field for a single-line string. */
export function create_input_text(name: string, proxy: Proxy<string>): HTMLElement {
  // Create the elements
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>

      <input class="form-control" placeholder="(Empty)">
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  // Set the label's text
  label.text(name);

  // Set the initial value
  input.val(proxy.get());

  // Update the proxy when the value is changed
  input.on("input", () => proxy.set(input.val() || ""));

  return elems[0];
}

/** Create a user input field for a multi-line string. */
export function create_textarea(name: string, proxy: Proxy<string>): HTMLElement {
  // Create the elements
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>

      <textarea class="form-control" rows="5" placeholder="(Empty)"></textarea>
    </div>
  `);

  let label = elems.find("label");
  let textarea = elems.find("textarea");

  // Set the label's text
  label.text(name);

  // Set the initial value
  textarea.val(proxy.get());

  // Update the proxy when the value is changed
  textarea.on("input", () => proxy.set(textarea.val() || ""));

  return elems[0];
}

/** Create a user input for selecting a single value from a list. */
export function create_searchable_dropdown<T>(name: string, proxy: Proxy<T>, entries: [name: string, value: T][]): HTMLElement {
  // Create the elements
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>

      <div class="dropdown">
        <button class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown"></button>

        <ul class="dropdown-menu">
          <li>
            <input class="form-control w-auto m-2 px-2 py-1" placeholder="Filter...">
          </li>
        </ul>
      </div>
    </div>
  `);

  let main_label = elems.find("label");
  let main_button = elems.find("button");
  let main_list = elems.find("ul");
  let main_input = elems.find("input");

  // Set the label's text
  main_label.text(name);

  // Update the list when the query string changes
  main_input.on("input", () => update_inner());

  // Allow Enter to click the first item matching the query string
  main_input.on("keypress", ev => {
    if (ev.key == "Enter" && get_query_string()) {
      let item = main_list.find("li>button.dropdown-item:first");

      if (item.length != 0) {
        // item.trigger("click") wasn't working how I expected it to, so I'm
        // gonna use the standard HTML click method.
        item[0].click();
      }
    }
  });

  // Clear the query string when the dropdown is hidden
  main_button.on("hidden.bs.dropdown", () => {
    if (get_query_string()) {
      main_input.val("");
      update_inner();
    }
  });

  // Focus the query input when the dropdown is shown
  main_button.on("shown.bs.dropdown", () => main_input.trigger("focus"));

  update_outer(find_associated_name(proxy.get()));
  update_inner();

  /** Find the name associated with the given value. */
  function find_associated_name(value: T) {
    let entry = entries.find(([name, other]) => other == value);
    let name = entry ? entry[0] : "<empty>";

    return name;
  }

  /** Get the query string used to filter the list items. */
  function get_query_string() {
    return main_input.val() || "";
  }

  /** Get a list of entries filtered with the query string. */
  function get_filtered_entries() {
    // Get the query string
    let query = get_query_string().toLowerCase();

    // Find entries that contain the query
    let results = entries.filter(([name]) => name.toLowerCase().includes(query));

    // Bring entries starting with the query to the top of the list
    results.sort(([name], [other]) => {
      let priority = name.toLowerCase().startsWith(query);

      priority &&= !other.toLowerCase().startsWith(query);

      return priority ? -1 : (name < other ? -1 : 1);
    });

    return results;
  }

  /** Create a list item. */
  function create_list_item(name: string, value: T, selected: boolean) {
    // Create the list item's elements
    let item = $(/*html*/`<li><button class="dropdown-item"></button></li>`);
    let button = item.find("button");

    button.text(name);

    // Change the value when the list item is clicked
    button.on("click", () => set_value(name, value));

    if (selected) {
      button.addClass("active");
    }

    return item;
  }

  /** Update the inner display. */
  function update_inner() {
    // Remove the existing list items, except the first
    main_list.find("li:nth-of-type(n+2)").remove();

    let index = 0;
    let query = get_query_string();

    for (let [name, value] of get_filtered_entries()) {
      // Determine if the item either:
      // 1. Represents the first item matching the query string, or
      // 2. Represents the current selected value
      let show_as_selected = query ? index == 0 : value == proxy.get();

      main_list.append(create_list_item(name, value, show_as_selected));

      index++;
    }
  }

  /** Update the outer display. */
  function update_outer(name: string) {
    main_button.text(name);
  }

  /** Set the value and update the display. */
  function set_value(name: string, value: T) {
    if (value == proxy.get()) {
      return;
    }

    proxy.set(value);

    update_outer(name);
    update_inner();
  }

  return elems[0];
}