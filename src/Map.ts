import { Basement } from './basement';
import { Castle, Cave } from './Start-End';
import { gameState } from './state';
import { MapConfig, TowerType } from './types';

export class Map {
  public audio: HTMLAudioElement;
  img: HTMLImageElement;
  public castle: Castle;
  cave: Cave;
  constructor(private config: MapConfig) {
    this.img = document.createElement('img');
    this.img.className = 'map';
    this.img.style.left = 0 + 'px';
    this.img.style.top = 0 + 'px';
    // this.img.style.opacity = '0.6';
    this.img.src = config.img;
    document.body.appendChild(this.img);

    gameState.gold = config.gold;

    const start = config.road[0];
    const end = config.road[config.road.length - 1];

    this.castle = new Castle(end.x, end.y);
    this.cave = new Cave(start.x, start.y);

    this.audio = new Audio();
    this.audio.src = config.song
    this.audio.volume = 0.5;
    this.audio.loop = true;
    this.audio.play();

    gameState.mapConfig = config;

    config.towers.forEach((tower) => {
      const towerType = tower.type;
      switch (towerType) {
        case TowerType.Base:
          gameState.basements.push(new Basement(tower.x, tower.y));
          break;
      }
    });
  }
  hitCastle(damage: number) {
    this.castle.hp -= damage;

    if (this.castle.hp <= 0) {
      this.reset();
      gameState.gameRunning = false;
      gameState.loseMap();
    }
    let decade = this.castle.hp / this.castle.maxHp;
    this.castle.drawHP(decade);
  }
  reset() {
    this.castle.delete();
    this.cave.delete();
    this.img.remove();
    this.audio.pause()
    this.audio.currentTime = 0
  }
}
