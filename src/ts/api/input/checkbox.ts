import { Proxy } from "../types";

/** Create a boolean input control. */
export function create_checkbox(name: string, proxy: Proxy<boolean>) {
  let container = $(/*html*/`
    <div class="mb-3 form-check">
      <input class="form-check-input" type="checkbox" value="">
      <label class="form-check-label"></label>
    </div>
  `);

  let label = container.find("label");
  let input = container.find("input");

  label.text(name);
  input.prop("checked", proxy.get());

  input.on("input", () => {
    let value = input.prop("checked");

    proxy.set(value);
  });

  return container;
}