import { Proxy } from "../types";

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