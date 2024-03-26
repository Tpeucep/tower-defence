export type Point = {
  x: number;
  y: number;
};

export interface IFireball {
  update(dt: number): void;
  render(): void;
  delete(): void;
}

export interface Ibase {
  x: number;
  y: number;
  element: HTMLImageElement;
}

export enum MobType {
  Goblin = 'Goblin',
  Orc = 'Orc',
  Wolf = 'Wolf',
}

export interface WaveSpawn {
  time: number;
  mob: MobType;
}

export enum SpellType {
  Rain = 'Rain',
  Guards = 'Guards',
}

export enum TowerType {
  Base = 'Base',
  Fire = 'Fire',
  Freeze = 'Freeze',
  Bomb = 'Bomb',
  Barracks = 'Barracks',
}

interface TowerConfig extends Point {
  type: TowerType;
}

export interface MapConfig {
  id: number;
  img: string;
  song: string;
  gold: number;
  road: Point[];
  towers: TowerConfig[];
  spells: SpellType[];
  vawes: WaveSpawn[];
}
