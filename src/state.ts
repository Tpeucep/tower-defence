import { observable } from 'mobx';
import { makeObservable } from 'mobx';
import { Map } from './Map';
import { Basement } from './basement';
import { Mob, Orc, Wolf } from './mob';
import { Movable } from './movable';
import { Tower } from './towers';
import { IFireball, MapConfig, MobType, SpellType, TowerType } from './types';

export const mapConfigs: MapConfig[] = [
  {
    id: 0,
    img: 'https://i.ibb.co/SRY5MHh/Image-5-at-frame-1.png',
    song: 'https://audio.buzzsprout.com/8tpu5wtccnaylc7t7g271t5tkkfa?response-content-disposition=inline&',
    gold: 200,
    roads: [
      {
        points: [
          { x: 325, y: -35 },
          { x: 325, y: 200 },
          { x: 290, y: 240 },
          { x: 170, y: 290 },
          { x: 170, y: 360 },
          { x: 220, y: 420 },
          { x: 380, y: 415 },
          { x: 480, y: 440 },
          { x: 590, y: 350 },
          { x: 700, y: 330 },
        ], 
      }, { points:[
        { x: -25, y: 365 },
        { x: 170, y: 360 },
        { x: 215, y: 420 },
        { x: 380, y: 415 },
        { x: 480, y: 440 },
        { x: 590, y: 350 },
        { x: 700, y: 330 },
      ]}
    ],
    towers: [
      { x: 220, y: 185, type: TowerType.Base },
      { x: 245, y: 340, type: TowerType.Base },
    ],
    spells: [SpellType.Rain, SpellType.Guards],
    vawes: [
      { time: 1, mob: MobType.Wolf, road: 0 },
      // { time: 3, mob: MobType.Goblin },
      { time: 3, mob: MobType.Goblin, road: 0 },
      { time: 7, mob: MobType.Orc, road: 0 },
      ////
      // { time: 13, mob: MobType.Goblin },
      // { time: 15, mob: MobType.Goblin },
      // { time: 17, mob: MobType.Orc },
      // { time: 19, mob: MobType.Goblin },
      // ////
      // { time: 25, mob: MobType.Goblin },
      // { time: 27, mob: MobType.Orc },
      // { time: 29, mob: MobType.Goblin },
      // { time: 31, mob: MobType.Orc },
      // { time: 33, mob: MobType.Goblin },
      // { time: 35, mob: MobType.Orc },
      // //
      // { time: 39, mob: MobType.Goblin },
      // { time: 41, mob: MobType.Orc },
      // { time: 43, mob: MobType.Goblin },
      { time: 4300, mob: MobType.Goblin, road:0 },
    ],
  },
  {
    id: 1,
    img: 'https://i.ibb.co/SRY5MHh/Image-5-at-frame-1.png',
    song: 'https://audio.buzzsprout.com/0r0r4hqrlydq1si4n3ypqmzr03va?response-content-disposition=inline&',
    gold: 100,
    roads: [
      {
        points: [
          { x: 325, y: -35 },
          { x: 325, y: 200 },
          { x: 290, y: 240 },
          { x: 170, y: 290 },
          { x: 170, y: 360 },
          { x: 220, y: 420 },
          { x: 380, y: 415 },
          { x: 480, y: 440 },
          { x: 590, y: 350 },
          { x: 700, y: 330 },
        ]
      },
    ],
    towers: [
      { x: 220, y: 185, type: TowerType.Base },
      { x: 245, y: 340, type: TowerType.Base },
      { x: 100, y: 315, type: TowerType.Base },
    ],
    spells: [SpellType.Rain, SpellType.Guards],
    vawes: [
      { time: 1, mob: MobType.Goblin, road: 0 },
      // { time: 3, mob: MobType.Goblin },
      ////
      { time: 7, mob: MobType.Goblin, road: 0 },
      // { time: 8, mob: MobType.Goblin },
      // { time: 9, mob: MobType.Goblin },
      // { time: 10, mob: MobType.Goblin },
      // ////
      // { time: 13, mob: MobType.Goblin },
      // { time: 15, mob: MobType.Goblin },
      // { time: 17, mob: MobType.Goblin },
      // { time: 19, mob: MobType.Goblin },
      // { time: 21, mob: MobType.Goblin },
      // { time: 22, mob: MobType.Goblin },
      // { time: 23, mob: MobType.Goblin },
      // ////
      // { time: 28, mob: MobType.Goblin },
      // { time: 30, mob: MobType.Goblin },
      // { time: 32, mob: MobType.Goblin },
      // { time: 34, mob: MobType.Goblin },
      // ////
      // { time: 38, mob: MobType.Goblin },
      // { time: 39, mob: MobType.Goblin },
      // { time: 40, mob: MobType.Goblin },
      // { time: 41, mob: MobType.Goblin },
      // { time: 42, mob: MobType.Goblin },
      // { time: 43, mob: MobType.Goblin },
      // { time: 44, mob: MobType.Goblin },
      // { time: 45, mob: MobType.Goblin },
      // { time: 46, mob: MobType.Goblin },
    ],
  },
  {
    id: 2,
    img: 'https://i.ibb.co/b1tynPL/Image-521-at-frame-1.png',
    song: 'https://audio.buzzsprout.com/zkklqymtoh5y9dvubnagmd8ld0bd?response-content-disposition=inline&',
    gold: 100,
    roads: [{
      points: [{ x: 730, y: 205 },
      { x: 730, y: 210 },
      { x: 525, y: 210 },
      { x: 485, y: 90 },
      { x: 390, y: 90 },
      { x: 340, y: 210 },
      { x: 180, y: 230 },
      { x: 180, y: 310 },
      { x: 260, y: 340 },
      { x: 360, y: 315 },
      { x: 450, y: 330 },
      { x: 450, y: 410 },
      { x: 313, y: 460 },
      { x: 313, y: 575 },]
    }
    ],
    towers: [
      { x: 290, y: 155, type: TowerType.Base },
      { x: 245, y: 277, type: TowerType.Base },
    ],
    spells: [SpellType.Rain, SpellType.Guards],
    vawes: [
      { time: 1, mob: MobType.Goblin, road: 0 },
      { time: 3, mob: MobType.Goblin, road: 0 },
      { time: 5, mob: MobType.Goblin, road: 0 },
    ],
  },
];

export class GameState {
  @observable
  public gold = 0;
  @observable
  public mapFinished = false;
  @observable
  public lastMapFinished = false;
  @observable
  public mapFailed = false;

  public gameRunning = true;
  public mapConfig: MapConfig | undefined;
  public gameMap: Map | undefined;

  public monsters: Mob[] = [];
  public fireBalls: IFireball[] = [];
  public towers: Tower[] = [];
  public movables: Movable[] = [];
  public basements: Basement[] = [];

  public currentId = 0;
  private lastTime = Date.now();
  public gameTime = 0;

  public lastRainAt = 0;
  public lastGuardAt = 0;

  constructor() {
    makeObservable(this);
    this.update();
  }

  public resetMap = () => {
    console.log('resetMap');

    const monstersCopy = this.monsters.slice();
    monstersCopy.forEach((monster) => monster.die());
    this.monsters = [];

    const towerCopy = this.towers.slice();
    towerCopy.forEach((tower) => tower.reset());
    this.towers = [];

    const movableCopy = this.movables.slice();
    movableCopy.forEach((m) => m.delete());
    this.movables = [];

    const firebalCopy = this.fireBalls.slice();
    firebalCopy.forEach((fireball) => fireball.delete());
    this.fireBalls = [];

    // const basementCopy = this.basements.slice();
    // basementCopy.forEach((b) => b.reset());
    this.basements.forEach((b) => b.reset());
    this.basements = [];

    if (this.gameMap) this.gameMap.reset();

    this.gameMap = undefined;
    this.mapConfig = undefined;
    this.gameRunning = false;
    this.gameTime = 0;
    this.gold = 0;
  };

  public createMap = (index: number) => {
    this.resetMap();
    this.mapFailed = false;
    this.mapFinished = false;
    this.gameMap = new Map(mapConfigs[index]);
    this.gameRunning = true;
  };

  public finishMap = () => {
    this.mapFinished = true;
    this.gameRunning = false;
    if (gameState.gameMap) gameState.gameMap.audio.pause();

    if (this.mapConfig) this.currentId = this.mapConfig.id;
  };

  public winGame = () => {
    this.lastMapFinished = true;
    this.gameRunning = false;
  };

  public loseMap = () => {
    this.mapFailed = true;
    this.gameRunning = false;
    if (gameState.gameMap) gameState.gameMap.audio.pause();
    if (this.mapConfig) this.currentId = this.mapConfig.id;
  };

  public draw =(ctx:CanvasRenderingContext2D ,img: HTMLImageElement, cw: number, ch:number, frameSeq: number[], animationFrame: number) =>{
    if(!ctx) return;
    const frameIndex = frameSeq[animationFrame];
    ctx.clearRect(0, 0, cw, ch);
    console.log('===', frameIndex, animationFrame);

    ctx.drawImage(
      img,
      frameIndex * cw,
      0,
      cw,
      ch,
      0,
      0,
      cw,
      ch,
    ); // Отрисовка текущего спрайта
    animationFrame = (animationFrame + 1) % frameSeq.length; // Переход к следующему спрайту
    ctx.resetTransform();
    // this.ctx.drawImage(img, 0, 0);
    return animationFrame;
  } 

  public checkSwitch = () => {
    if (!this.mapConfig) return;
    if (!this.gameMap) return;

    if (
      this.gameTime >
      this.mapConfig.vawes[this.mapConfig.vawes.length - 1].time &&
      gameState.monsters.length === 0
      // && this.gameMap.castle.hp != 0
    ) {
      if (this.mapConfig.id === mapConfigs.length - 1) {
        gameState.winGame();
      } else {
        gameState.finishMap();
      }
    }
  };

  private update = () => {
    requestAnimationFrame(this.update);
    if (!this.gameRunning) return;
    

    const now = Date.now();
    const dt = (now - this.lastTime) / 1000;
    this.lastTime = now;

    if (this.mapConfig) {
      const prefTime = this.gameTime;
      this.gameTime += dt;

      const toSpawn = this.mapConfig.vawes.filter(
        (w) => w.time > prefTime && w.time <= this.gameTime
      );
      // console.log(toSpawn.length);
        toSpawn.forEach((w) => {
          if(!this.mapConfig) return; 
          const road = w.road;
          const mobType = w.mob;
          switch (mobType) {
            case MobType.Goblin:
              this.monsters.push(new Mob(this.mapConfig.roads[road]));
              break;
              case MobType.Orc:
                this.monsters.push(new Orc(this.mapConfig.roads[road]))
                break;
                case MobType.Wolf:
                  this.monsters.push(new Wolf(this.mapConfig.roads[road]))
                  break;
                }
              });
    }

    this.monsters.forEach((monster) => {
      monster.update(dt);
    });
    this.fireBalls.forEach((fireball) => {
      fireball.update(dt);
      fireball.render();
    });
    this.towers.forEach((tower) => {
      tower.update();
      tower.render();
    });
    this.movables.forEach((movable) => {
      movable.update(dt);
      movable.render();
    });

    // if (road2.canSwitchMap && monsters.length === 0) {
    //   switchMap();
    // }
  };
}

export const gameState = new GameState();
gameState.createMap(0);
