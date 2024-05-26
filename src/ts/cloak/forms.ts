import {
  ControlString as str,
  ControlNumber as num,
  ControlBoolean as bool
} from "../api/controls";

import {
  create_form,
  create_property_accessor as prop
} from "../api/forms";

import * as data from "./types/data";

export function create_tile_form(tile: data.Tile) {
  return create_form(tile, [
    ["Name", str, prop("name")],
    ["Description", str, prop("description")],
    ["Is Opaque", bool, prop("is_opaque")],
    ["Is Solid", bool, prop("is_solid")]
  ]);
}