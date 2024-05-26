// Provide a default set of Controls for the user:

import { Control } from "./forms";

export const ControlString: Control<string> = (name: string, value: string, changed: (value: string) => void) => {
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <input class="form-control" placeholder="(Empty)">
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  label.text(name);
  input.val(value);
  input.on("input", () => changed(input.val() || ""));

  return elems[0];
};

export const ControlNumber: Control<number> = (name: string, value: number, changed: (value: number) => void) => {
  let elems = $(/*html*/`
    <div class="mb-3">
      <label class="form-label"></label>
      <input class="form-control" type="number" placeholder="0">
    </div>
  `);

  let label = elems.find("label");
  let input = elems.find("input");

  label.text(name);
  input.val(value);
  input.on("input", () => changed(parseFloat(input.val() || "") || 0));

  return elems[0];
};