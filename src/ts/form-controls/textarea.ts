import { Proxy, Observer } from "../types";

/** Create a multi-line text input control. */
export function create_textarea(name: string, proxy: Proxy<string> & Observer<string>) {
  let $outer = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>

      <textarea class="form-control" rows="5" placeholder="(Empty)"></textarea>
    </div>
  `);

  let $label = $outer.find("label");

  // Set the label text
  $label.text(name);

  let $textarea = $outer.find("textarea");

  // Pressing 'Enter' without 'Shift' blurs the input
  $textarea.on("keypress", ev => {
    if (ev.key == "Enter" && !ev.shiftKey) {
      $textarea.trigger("blur");
      return false;
    }

    return true;
  });

  // Changing the textarea updates the proxy
  $textarea.on("change", () => {
    let value = $textarea.val() || "";

    proxy.set(value);
  });

  // Update the textarea when the proxy is changed
  proxy.observe(value => $textarea.val(value));

  // Set the initial value
  $textarea.val(proxy.get());

  return $outer;
}