import { Proxy } from "../types";

/** Represents a name/value pair. */
type Item<T> = [name: string, value: T];

/**
 * Get the name associated with a given value.
 * @param items List of name/value pairs to search through.
 * @param value Value to find the associated name for.
 * @param fallback Fallback to return if no associated name is found.
 * @returns Name associated with the value, or the fallback string.
 */
function get_associated_name<T>(items: Item<T>[], value: T, fallback: string) {
  for (let [name, other] of items) {
    if (other == value) return name;
  }

  return fallback;
}

/**
 * Get a list of items containing a given query (case-insensitve).
 * @param items List of items to filter.
 * @param query_lower Query to match with (must be lower case).
 * @returns List of items containing the query.
 */
function get_matching_items<T>(items: Item<T>[], query_lower: string) {
  let results: Item<T>[] = [];

  for (let item of items) {
    let [name] = item;

    name = name.toLowerCase();

    if (name.includes(query_lower)) {
      results.push(item);
    }
  }

  return results;
}

/**
 * Sort a list of items by their name. Names that immediately start with the
 * query are brought to the top. Items are subsequently sorted alphabetically.
 * @param items List of items to sort.
 * @param query_lower Query to match with (must be lower case).
 */
function sort_items<T>(items: Item<T>[], query_lower: string) {
  items.sort(function ([name], [other]) {
    name = name.toLowerCase();
    other = other.toLowerCase();

    if (name.startsWith(query_lower) && !other.startsWith(query_lower)) {
      return -1;
    }

    return name < other ? -1 : 1;
  });
}

/** Get the query string. */
function get_query_string(query_input: JQuery<HTMLInputElement>): string {
  return query_input.val() || "";
}

/** Set the query string. */
function set_query_string(query_input: JQuery<HTMLInputElement>, query_string: string) {
  query_input.val(query_string);
}

/**
 * Create a list item.
 * @param name Display name.
 * @param active Whether or not to render the list item as active.
 * @param clicked Callback for when the list item is clicked.
 * @returns The list item.
 */
function create_list_item<T>(name: string, active: boolean, clicked: () => void) {
  let li = $(/*html*/`<li><button class="dropdown-item"></button></li>`);
  let button = li.find("button");

  button.text(name);
  button.on("click", clicked);

  if (active) {
    button.addClass("active");
  }

  return li;
}

/** Create a user input for selecting a single value from a list. */
export function create_dropdown<T>(name: string, proxy: Proxy<T>, items: Item<T>[]) {
  // Create the elements
  let container = $(/*html*/`
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

  // Get the elements
  let label = container.find("label");
  let dropdown_button = container.find("button");
  let dropdown_list = container.find("ul");
  let query_input = container.find("input");

  // Add the event handlers
  dropdown_button.on("shown.dropdown.bs", on_dropdown_shown);
  dropdown_button.on("hidden.dropdown.bs", on_dropdown_hidden);

  query_input.on("input", on_query_string_changed);
  query_input.on("keypress", ev => ev.key == "Enter" && on_query_string_enter());

  // Initialize the dropdown
  label.text(name);

  render();

  return container;

  // Private methods:

  function render_list() {
    // Remove the existing list items
    dropdown_list.find("li").slice(1).remove();

    // Find the matching entries
    let query = get_query_string(query_input).toLowerCase();
    let results = get_matching_items(items, query);

    sort_items(results, query);

    // Create the new list items
    let i = 0;

    for (let [name, value] of results) {
      let selected = query ? i == 0 : value == proxy.get();
      let clicked = () => change_value(value);
      let list_item = create_list_item(name, selected, clicked);

      dropdown_list.append(list_item);
      i += 1;
    }
  }

  function render() {
    let value = proxy.get();
    let name = get_associated_name(items, value, "<empty>");

    dropdown_button.text(name);

    render_list();
  }

  function change_value(value: T) {
    proxy.set(value);
    render();
  }

  // Event handlers:

  function on_dropdown_shown() {
    // Focus the query input when the dropdown is shown
    query_input.trigger("focus");
  }

  function on_dropdown_hidden() {
    // Clear the query input when the dropdown is hidden
    if (get_query_string(query_input) != "") {
      set_query_string(query_input, "");
      render();
    }
  }

  function on_query_string_changed() {
    // Render the dropdown when the query string is changed
    render();
  }

  function on_query_string_enter() {
    // Select the first matching list item when the query string is entered
    if (get_query_string(query_input)) {
      let list_item = dropdown_list.find("li>button.dropdown-item").get(0);

      if (list_item) list_item.click();
    }
  }
}