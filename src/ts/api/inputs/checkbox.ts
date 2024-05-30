import { Proxy } from "../types";

/** Create a user input field for a boolean. */
export function create_checkbox(name: string, proxy: Proxy<boolean>): HTMLElement {
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