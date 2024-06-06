import { use_object_property } from "../utils/object-property-proxy";
import { create_checkbox } from "../form-controls/checkbox";
import { create_numeric_input } from "../form-controls/numeric-input";
import { create_text_input } from "../form-controls/text-input";
import { create_textarea } from "../form-controls/textarea";
import { Creature } from "./types/data";

export function create_creature_form(creature: Creature) {
  return [
    create_text_input("Name", use_object_property(creature, "name")),
    create_textarea("Description", use_object_property(creature, "description")),
    create_numeric_input("Width", use_object_property(creature, "width")),
    create_numeric_input("Height", use_object_property(creature, "height")),
    create_checkbox("Can Fly?", use_object_property(creature, "can_fly"))
  ];
}