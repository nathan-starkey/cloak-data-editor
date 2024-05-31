import { create_tile_form } from "./cloak/forms";
import * as data from "./cloak/types/data";

let tile = {
  name: "",
  description: "",
  is_opaque: false,
  is_solid: false,
  // Temp, just to test the searchable dropdown control
  sprite: "sprite1" as "sprite1"
};

let form = create_tile_form(tile);

$(document.body).append(...form);