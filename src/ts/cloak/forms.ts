import {
  ControlString as str,
  ControlNumber as num,
  ControlBoolean as bool
} from "../api/controls";

import { create_form } from "../api/forms";
import * as data from "./types/data";

export function create_image_form(image: data.Image) {
  return create_form([
    ["path", "Path", str]
    // TODO: ...
  ], image);
}

export function create_sprite_form(images: data.Image[], sprite: data.Sprite) {
  return create_form([
    ["x", "X", num],
    ["y", "Y", num],
    ["height", "Height", num],
    ["width", "Width", num]
    // TODO: ...
  ], sprite);
}

export function create_tile_form(tile: data.Tile) {
  return create_form([
    ["name", "Name", str],
    ["description", "Description", str],
    ["is_opaque", "Is Opaque", bool],
    ["is_solid", "Is Solid", bool]
  ], tile);
}