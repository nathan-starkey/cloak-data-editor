function deserialize(content) {
  for (let item of [...content.creatures, ...content.tiles]) {
    item.sprites = item.sprites.join("\n");
  }

  for (let item of content.worlds) {
    item.tilePalette = item.tilePalette.join("\n");
  }

  /*
  for (let item of content.creatures) {
    item.healthMin = item.health[0];
    item.healthMax = item.health[1];
    item.damageMin = item.damage[0];
    item.damageMax = item.damage[1];
    delete item.health;
    delete item.damage;
  }

  for (let item of content.descriptors) {
    item.replacers = item.replacers.map(({value, weight}) => weight == 1 ? value : `${value}=${weight}`).join("\n");
  }
  */

  return content;
}

function serialize(content) {
  for (let item of [...content.creatures, ...content.tiles]) {
    item.sprites = item.sprites.split("\n").filter(s => s);
  }

  for (let item of content.worlds) {
    item.tilePalette = item.tilePalette.split("\n").filter(s => s);
    item.spawns ||= [];
    item.chunks ||= [];
  }

  /*
  for (let item of content.creatures) {
    item.health = [item.healthMin, item.healthMax];
    item.damage = [item.damageMin, item.damageMax];
    delete item.healthMin;
    delete item.healthMax;
    delete item.damageMin;
    delete item.damageMax;
  }
  */

  /*
  for (let item of content.descriptors) {
    item.replacers = item.replacers.split("\n").filter(s => s)
      .map(s => {
        let [value, weight] = splitByFirst(s, "=");
        weight = parseFloat(weight);
        weight = !Number.isFinite(weight) ? 1 : weight;
        return {value, weight};
      });
  }
  */

  return content;
}

function splitByFirst(string, delim) {
  return splitAt(string, string.indexOf(delim));
}

function splitAt(string, index) {
  return [string.slice(0, index), string.slice(index)];
}