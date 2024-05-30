import { Proxy } from "../types";

/** Create a user input field for a number. */
export function create_number_input(name: string, proxy: Proxy<number>): HTMLElement {
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