import { Proxy } from "../types";

/** Create a user input field for a single-line string. */
export function create_text_input(name: string, proxy: Proxy<string>): HTMLElement {
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