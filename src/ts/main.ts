import { create_creature_form } from "./cloak/forms";
import * as data from "./cloak/types/data";

let creature: data.Creature = {
  name: "",
  description: "",
  width: 1,
  height: 1,
  can_fly: false,
  sprites: []
};

let form = create_creature_form(creature);

$(document.body).append(...form);