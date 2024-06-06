import { Proxy, Observer } from "../types";

/** Create a numeric input control. */
export function create_numeric_input(name: string, proxy: Proxy<number> & Observer<number>) {
  let $outer = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>

      <input class="form-control" type="number" placeholder="0">
    </div>
  `);

  let $label = $outer.find("label");

  // Set the label text
  $label.text(name);

  let $input = $outer.find("input");

  // Pressing 'Enter' blurs the input
  $input.on("keypress", ev => {
    if (ev.key == "Enter") {
      $input.trigger("blur");
      return false;
    }

    return true;
  });

  // Changing the input updates the proxy
  $input.on("change", () => {
    let value_string = $input.val() || "";
    let value = parseFloat(value_string) || 0;

    proxy.set(value);
  });

  // Update the input when the proxy is changed
  proxy.observe(value => $input.val(value));

  // Set the initial value
  $input.val(proxy.get());

  return $outer;
}