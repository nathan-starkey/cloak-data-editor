function packSprites(data) {
  if (typeof data.sprites == "string") {
    data.sprites = data.sprites.split("\n").filter(s => s);
  }

  return data;
}

function unpackSprites(data) {
  if (Array.isArray(data.sprites)) {
    data.sprites = data.sprites.join("\n");
  }

  return data;
}