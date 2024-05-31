import { Proxy } from "../types";

/** Create a multi-line text input control. */
export function create_textarea(name: string, proxy: Proxy<string>) {
  let container = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <textarea class="form-control" rows="5" placeholder="(Empty)"></textarea>
    </div>
  `);

  let label = container.find("label");
  let textarea = container.find("textarea");

  label.text(name);
  textarea.val(proxy.get());

  textarea.on("input", () => {
    let value = textarea.val() || "";

    proxy.set(value);
  });

  return container;
}