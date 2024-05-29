import {
  create_object_proxy as prop,
  create_input_checkbox as bool,
  create_input_text as str,
  create_textarea as mstr
} from "../api/inputs";

import * as data from "./types/data";

export function create_tile_form(tile: data.Tile) {
  return [
    str("Name", prop(tile, "name")),
    mstr("Description", prop(tile, "description")),
    bool("Is Opaque", prop(tile, "is_opaque")),
    bool("Is Solid", prop(tile, "is_solid"))
  ];
}