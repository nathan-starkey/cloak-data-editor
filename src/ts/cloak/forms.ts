import {
  create_object_proxy as prop,
  create_input_checkbox as bool,
  create_input_text as str,
  create_textarea as mstr,
  create_searchable_dropdown as drop
} from "../api/inputs";

// Temp, just to test the searchable dropdown control
type Tile = {
  name: string;
  description: string;
  is_opaque: boolean;
  is_solid: boolean;
  sprite: "sprite1" | "sprite2" | "sprite3" | "other";
};

export function create_tile_form(tile: Tile) {
  return [
    str("Name", prop(tile, "name")),
    mstr("Description", prop(tile, "description")),
    bool("Is Opaque", prop(tile, "is_opaque")),
    bool("Is Solid", prop(tile, "is_solid")),
    drop("Sprite", prop(tile, "sprite"), [
      ["sprite 1", "sprite 1"],
      ["sprite 2", "sprite 2"],
      ["sprite 3", "sprite 3"]
    ])
  ];
}