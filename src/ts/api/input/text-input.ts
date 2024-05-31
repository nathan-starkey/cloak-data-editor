import { Proxy } from "../types";

/** Create a text input control. */
export function create_text_input(name: string, proxy: Proxy<string>) {
  let container = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <input class="form-control" placeholder="(Empty)">
    </div>
  `);

  let label = container.find("label");
  let input = container.find("input");

  label.text(name);
  input.val(proxy.get());

  input.on("input", () => {
    let value = input.val() || "";

    proxy.set(value);
  });

  return container;
}