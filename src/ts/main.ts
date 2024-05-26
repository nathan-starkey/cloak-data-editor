import { ControlNumber, ControlString } from "./api/controls";
import { create_form } from "./api/forms";

let form = create_form([
  ["name", "Name", ControlString],
  ["description", "Description", ControlString],
  ["width", "Width", ControlNumber],
  ["height", "Height", ControlNumber]
], {
  name: "",
  description: "",
  width: 0,
  height: 0
});

document.body.append(...form);