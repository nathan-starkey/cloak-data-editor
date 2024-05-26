export type Image = {
  path: string;
  content: HTMLImageElement;
};

export type Sprite = {
  x: number;
  y: number;
  width: number;
  height: number;
  image: Image;
};

export type Tile = {
  name: string;
  description: string;
  is_opaque: boolean;
  is_solid: boolean;
  sprites: Sprite[];
};

export type Creature = {
  name: string;
  description: string;
  width: number;
  height: number;
  can_fly: boolean;
  sprites: Sprite[];
};

export type Spawn = {
  x: number;
  y: number;
  chance_day: number;
  chance_night: number;
  creatures: Creature[];
};

export type Chunk = {
  x: number;
  y: number;
  data: Tile[];
  spawns: Spawn[];
};

export type World = {
  name: string;
  chunks: Chunk[];
};

export type Data = {
  images: Image[];
  sprites: Sprite[];
  tiles: Tile[];
  creatures: Creature[];
  spawns: Spawn[];
  chunks: Chunk[];
  worlds: World[];
};