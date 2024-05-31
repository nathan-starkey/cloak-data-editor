import { Proxy } from "../types";

/** Create a numeric input control. */
export function create_numeric_input(name: string, proxy: Proxy<number>) {
  let container = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <input class="form-control" type="number" placeholder="0">
    </div>
  `);

  let label = container.find("label");
  let input = container.find("input");

  label.text(name);
  input.val(proxy.get());

  input.on("input", () => {
    let value_string = input.val() || "";
    let value = parseFloat(value_string) || 0;

    proxy.set(value);
  });

  return container;
}