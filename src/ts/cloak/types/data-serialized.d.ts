export type Image = {
  path: string;
};

export type Sprite = {
  x: number;
  y: number;
  width: number;
  height: number;
  image: number;
};

export type Tile = {
  name: string;
  description: string;
  is_opaque: boolean;
  is_solid: boolean;
  sprites: number[];
};

export type Creature = {
  name: string;
  description: string;
  width: number;
  height: number;
  can_fly: boolean;
  sprites: number[];
};

export type Spawn = {
  x: number;
  y: number;
  chance_day: number;
  chance_night: number;
  creatures: number[];
};

export type Chunk = {
  x: number;
  y: number;
  data: number[];
  spawns: number[];
};

export type World = {
  name: string;
  chunks: number[];
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