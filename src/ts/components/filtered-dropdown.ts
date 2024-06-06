function filter_entries<T>(entries: [name: string, value: T][], filter: string) {
  filter = filter.toLowerCase();

  let results = [];

  for (let entry of entries) {
    let [name] = entry;

    name = name.toLowerCase();

    if (name.includes(filter)) {
      results.push(entry);
    }
  }

  return results;
}

function sort_entries<T>(entries: [name: string, value: T][], filter: string) {
  filter = filter.toLowerCase();

  entries.sort(([name], [other]) => {
    name = name.toLowerCase();
    other = other.toLowerCase();

    let match_a = name.startsWith(filter);
    let match_b = other.startsWith(filter);

    if (match_a && !match_b) {
      return -1;
    }

    else if (!match_a && match_b) {
      return 1;
    }

    else {
      return name < other ? -1 : 1;
    }
  });
}

function render_dropdown_item<T>(name: string, value: T, clicked: (value: T) => void) {
  let $item = $(/*html*/`
    <li>
      <button class="dropdown-item"></button>
    </li>
  `);

  let $btn = $item.find(".dropdown-item");

  $btn.text(name);
  $btn.on("click", () => clicked(value));

  return $item;
}

function render_dropdown_items<T>(entries: [name: string, value: T][], clicked: (value: T) => void) {
  let items: JQuery<HTMLElement>[] = [];

  for (let [name, value] of entries) {
    items.push(render_dropdown_item(name, value, clicked));
  }

  return items;
}

/**
 * Create a searchable dropdown menu.
 * @param name Display text for the dropdown button.
 * @param entries
 * @param clicked Callback for when a dropdown item is clicked.
 * @returns Outermost element representing the dropdown.
 */
export function create_filtered_dropdown<T>(name: string, entries: [name: string, value: T][], clicked: (value: T) => void) {
  let $dropdown = $(/*html*/`
    <div class="dropdown">
      <button class="btn btn-primary dropdown-toggle" data-bs-toggle="dropdown"></button>

      <ul class="dropdown-menu">
        <li>
          <input class="form-control w-auto m-2 px-2 py-1" placeholder="Filter...">
        </li>
      </ul>
    </div>
  `);

  let $dropdown_button = $dropdown.find("button");

  $dropdown_button.text(name);

  // Focus the input when the dropdown is shown
  $dropdown_button.on("shown.dropdown.bs", () => {
    $input.trigger("focus");
  });

  // Clear the input when the dropdown is hidden
  $dropdown_button.on("hidden.dropdown.bs", () => {
    if ($input.val()) {
      $input.val("");
      render();
    }
  });

  let $dropdown_menu = $dropdown.find("ul");

  let $input = $dropdown.find("input");

  // Render everything when the filter is changed
  $input.on("input", () => {
    render();
  });

  // Pressing 'Enter' in the filter input selects the first item
  $input.on("keypress", ev => {
    if (ev.key == "Enter" && $input.val()) {
      let list_item = $dropdown_menu.find("li>button.dropdown-item").get(0);

      if (list_item) list_item.click();
    }
  });

  // Ready
  render();

  return $dropdown;

  function render() {
    // Remove the existing dropdown items
    let $dropdown_items = $dropdown_menu.find("li").slice(1);

    $dropdown_items.remove();

    // Filter and sort the entries
    let filter = $input.val() || "";
    let results = filter_entries(entries, filter);

    sort_entries(results, filter);

    // Create the new dropdown items
    let dropdown_items = render_dropdown_items(results, clicked);

    $dropdown_menu.append(dropdown_items);

    // Highlight the first dropdown item
    if (filter) {
      let $first_item = dropdown_items[0];

      if ($first_item) {
        $first_item.find("button").addClass("active");
      }
    }
  }
}