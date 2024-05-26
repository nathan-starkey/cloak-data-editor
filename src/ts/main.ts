import { create_tile_form } from "./cloak/forms";
import * as data from "./cloak/types/data";

let tile: data.Tile = {
  name: "",
  description: "",
  is_opaque: false,
  is_solid: false,
  sprites: []
};

let form = create_tile_form(tile);

document.body.append(...form);