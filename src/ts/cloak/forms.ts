import {
  create_object_proxy as prop,
  create_boolean_control as bool,
  create_string_control as str
} from "../api/controls";

import * as data from "./types/data";

export function create_tile_form(tile: data.Tile) {
  return [
    str("Name", prop(tile, "name")),
    str("Description", prop(tile, "description")),
    bool("Is Opaque", prop(tile, "is_opaque")),
    bool("Is Solid", prop(tile, "is_solid"))
  ];
}