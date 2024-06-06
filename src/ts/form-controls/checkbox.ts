import { Proxy, Observer } from "../types";

/** Create a checkbox control. */
export function create_checkbox(name: string, proxy: Proxy<boolean> & Observer<boolean>) {
  let $outer = $(/*html*/`
    <div class="mb-3 form-check">
      <input class="form-check-input" type="checkbox" value="">

      <label class="form-check-label"></label>
    </div>
  `);

  let $label = $outer.find("label");

  // Set the label text
  $label.text(name);

  let $input = $outer.find("input");

  // Changing the input updates the proxy
  $input.on("change", () => {
    let value = $input.prop("checked");

    proxy.set(value);
  });

  // Update the input when the proxy is changed
  proxy.observe(value => $input.prop("checked", value));

  // Set the initial value
  $input.prop("checked", proxy.get());

  return $outer;
}