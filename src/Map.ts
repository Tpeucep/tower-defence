import { Basement } from './basement';
import { gameState } from './state';
import { BarakTower, BombTower, FreezeTower, Tower } from './towers';
import { MapConfig, TowerType } from './types';

export class Map {
  public audio: HTMLAudioElement;
  img: HTMLImageElement;
  constructor(private config: MapConfig) {
    this.img = document.createElement('img');
    this.img.className = 'map';
    this.img.style.left = 0 + 'px';
    this.img.style.top = 0 + 'px';
    // this.img.style.opacity = '0.6';
    this.img.src = config.img;
    document.body.appendChild(this.img);

    gameState.gold = config.gold;

    const start = config.roads[0].points[0];
    const end = config.roads[0].points[config.roads[0].points.length - 1];


    this.audio = new Audio();
    this.audio.src = config.song
    this.audio.volume = 0.5;
    this.audio.loop = true;
    // this.audio.muted = true
    this.audio.play();

    gameState.mapConfig = config;

    config.towers.forEach((tower) => {
      const towerType = tower.type;
      switch (towerType) {
        case TowerType.Base:
          gameState.basements.push(new Basement(tower.x, tower.y));
          break;
        case TowerType.Barracks:
          gameState.towers.push(new BarakTower(tower.x, tower.y));
          break;
        case TowerType.Fire:
          gameState.towers.push(new Tower(tower.x, tower.y));
          break;
        case TowerType.Freeze:
          gameState.towers.push(new FreezeTower(tower.x, tower.y));
          break;
        case TowerType.Bomb:
          gameState.towers.push(new BombTower(tower.x, tower.y));
          break;
      }
    });
  }
  hitCastle(damage: number) {
    gameState.hp -= damage;

    if (gameState.hp <= 0) {
      this.reset();
      gameState.gameRunning = false;
      gameState.loseMap();
    }
  }

  reset() {
    this.img.remove();
    this.audio.pause()
    this.audio.currentTime = 0
    gameState.hp = 25;
  }
}
