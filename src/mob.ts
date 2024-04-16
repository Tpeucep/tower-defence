import { getRandID } from './App';
import { RoadPoints } from './types';
import { HpBar } from './hpBar';
import { Movable } from './movable';
import { gameState } from './state';
import { Guard, Rekrut } from './guards etc';

import deadgobl from "./assets/mob/deadGoblin.png";
import goblMoveR from "./assets/mob/goblinMoveRight.png";
import goblMoveD from "./assets/mob/goblinDown.png";
import goblMoveU from "./assets/mob/goblinMoveUp.png";
import goblAttack from "./assets/mob/goblinAttack.png";
import goblDie from "./assets/mob/goblinDying.png";
import wolfDie from "./assets/mob/wolfDie.png";
import wolfRight from "./assets/mob/wolfRight2.png";
import wolfDown from "./assets/mob/wolfDown.png";
import wolfUp from "./assets/mob/wolfUp.png";
import wolFight from "./assets/mob/wolfKusj.png";
import deadOrc from "./assets/mob/deadOrc.png";
import orcDie from "./assets/mob/orcDying.png";
import orcMoveD from "./assets/mob/orcMoveDown.png";
import orcMoveU from "./assets/mob/orcMoveUp.png";
import orcMoveR from "./assets/mob/orcMoving.png";
import orcAttack from "./assets/mob/orcAttack.png";

enum Direction {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down',
}

enum State {
  Idle = 'idle',
  Moving = 'moving',
  Fighting = 'fighting',
  Dying = 'dying',
  Dead = 'dead',
}

interface AnimData {
  img: HTMLImageElement;
  frameSeq: number[];
}

export class Mob extends Movable {
  startX: number;
  startY: number;
  maxHP: number;
  lastX: number = 0;
  lastY: number = 0;
  hp: number = 20;
  minDmg = 1;
  maxDmg = 4;
  cost = 3;

  enemy: Guard | Rekrut | undefined;
  id: string = getRandID().toString();
  mobElement: HTMLDivElement;
  hpBar: HpBar;
  audio: HTMLAudioElement;

  isDead: boolean = false;
  points: RoadPoints;
  currentPointIndex: number = 0;
  distancePassed: number = 0;
  freezePoint: number = 0;
  attackSpeed = 900;
  lastHitAt: number = 0;
  radius = 30;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  spriteWidth = 0; // Ширина каждого спрайта в изображении
  spriteHeight = 30; // Высота каждого спрайта в изображении
  animationFrame = 0;
  lastFrame = 0;
  drawInterval = 90;

  moveRightImg = new Image();

  moveDownImg = new Image();
  
  moveUpImg = new Image();

  fightImg = new Image();

  dyingImg = new Image();

  deadMob = new Image();


  horizontalWalkSequence: number[] = [0, 1, 2, 3, 1, 2, 3 ];
  verticalWalkSequence: number[] = [0, 1, 2, 3, 4, 5, 6, 7,];
  fightSequence = [0, 1, 2, 3, 4, 5, 6, 7];
  idleSequence = [7];
  dyingSequence = [0, 1, 2, 3];


  direction = Direction.Down;
  state = State.Moving;
  constructor(road: RoadPoints) {
    super();
    this.maxHP = this.hp;
    this.startX = road.points[0].x;
    this.startY = road.points[0].y;
    this.points = road;

    this.speed = 30
    
    this.moveRightImg.src =goblMoveR;

    this.moveDownImg.src = goblMoveD;

    this.moveUpImg.src = goblMoveU;

    this.fightImg.src = goblAttack;

    this.dyingImg.src = goblDie;

    this.mobElement = document.createElement('div');
    this.mobElement.className = 'mob';
    this.mobElement.style.left = this.startX + 'px';
    this.mobElement.style.top = this.startY + 'px';
    document.body.appendChild(this.mobElement);
    this.hpBar = new HpBar(this.mobElement, 30, 2, '0', (-this.spriteHeight).toString());

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'myCanvas';
    this.canvas.width = 37;
    this.canvas.height = 30;
    this.mobElement.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.deadMob.src = deadgobl;
    this.deadMob.className = 'dead';

    this.audio = new Audio();
    this.audio.muted = true
    this.audio.src =
      'https://audio.buzzsprout.com/qlji81nzjf0doe8o212ow0g32i1u?response-content-disposition=inline&'

  }

  update(deltaTime: number) {
    // console.log(this.enemy, 'live? -');а
    if (this.isDead) {
      // do nothing
    } else {
      if (this.enemy && !this.enemy.died) {
        this.fight(this.enemy);
      } else {
        this.move(deltaTime);
      }
    }
    this.draw();
    this.render();
  }

  getAnimationData(state: State, direction: Direction): AnimData {
    if (state === State.Fighting)
      return { img: this.fightImg, frameSeq: this.fightSequence };
    if (state === State.Dying)
      return { img: this.dyingImg, frameSeq: this.dyingSequence };
    if (state === State.Moving) {
      const img =
        this.direction === Direction.Up
          ? this.moveUpImg
          : this.direction === Direction.Down
          ? this.moveDownImg
          : this.moveRightImg;
      return {
        img: img,
        frameSeq:
          direction === Direction.Up || direction === Direction.Down
            ? this.verticalWalkSequence
            : this.horizontalWalkSequence,
      };
    }
    return { img: this.fightImg, frameSeq: this.idleSequence };
  }

  // Функция отрисовки анимации
  draw = () => {
    const canDraw = Date.now() - this.lastFrame > this.drawInterval;
    if(this.state === State.Dead) return;
    if (canDraw) {
      const { img, frameSeq } = this.getAnimationData(
        this.state,
        this.direction
      );
      this.spriteWidth = img.width / frameSeq.length
      const frameIndex = frameSeq[this.animationFrame];
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      if (this.direction === Direction.Left) this.ctx.scale(-1, 1);
      this.ctx.drawImage(
        img,
        frameIndex * this.spriteWidth,
        0,
        this.spriteWidth,
        this.spriteHeight,
        this.direction === Direction.Left ? -this.spriteWidth : 0,
        0,
        this.spriteWidth,
        this.spriteHeight
      ); // Отрисовка текущего спрайта
      this.animationFrame = (this.animationFrame + 1) % frameSeq.length; // Переход к следующему спрайту
      this.lastFrame = Date.now();
      this.ctx.resetTransform();
      // this.ctx.drawImage(img, 0, 0);
    }
  };

  move(dt: number) {
    this.state = State.Moving;
    const currentPoint = this.points.points[this.currentPointIndex];
    const nextPoint = this.points.points[this.currentPointIndex + 1];

    const dx = nextPoint.x - currentPoint.x;
    const dy = nextPoint.y - currentPoint.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const step = this.speed * dt;
    let newDistance = this.distancePassed + step;
    const relativePosition = newDistance / distance;

    if (relativePosition > 1) {
      newDistance = 0;
      this.currentPointIndex++;
      this.checkPathEnded();
    }

    this.x = currentPoint.x + dx * relativePosition;
    this.y = currentPoint.y + dy * relativePosition;
    this.calculateDirection();
    this.lastX = this.x;
    this.lastY = this.y;

    this.distancePassed = newDistance;
  }

  checkPathEnded = () => {
    if (this.currentPointIndex >= this.points.points.length - 1) {
      if (gameState.gameMap) {
        gameState.gameMap.hitCastle(this.maxDmg);
        if (gameState.hp != 0) gameState.checkSwitch();
      }
      this.die();
    }
  };

  setEnemy(enemy: Guard | Rekrut) {
    if (!this.enemy || this.enemy.died) {
      this.state = State.Fighting;
      this.enemy = enemy;
      // console.log('enemy= ', this.enemy);
    }
  }
  removeEnenmy() {}

  public hit(dmg: number) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.kill();
      return;
    }
    this.hpBar.setValue(this.hp / this.maxHP);
  }

  freeze() {
    this.freezePoint++;
    this.speed /= 2;
    this.drawInterval *= 2;
    setTimeout(() => {
      this.freezePoint--;
      this.speed *= 2;
      this.drawInterval /= 2;
    }, 3000);
    //this.speed = 0
  }

  randDamage = (min: number, max: number)=>{
    let d = max -  min;
    const random = Math.floor(Math.random()*d)
    const damage = min + random;
    return damage
   }

  fight = (enemy: Guard | Rekrut) => {
    // console.log(damage);
    
    const dx = this.x - enemy.x;
    if (dx > 0) {
      this.direction = Direction.Left;
    }
    
    const canHit = Date.now() - this.lastHitAt > this.attackSpeed;
    if (canHit) {
      this.state = State.Fighting;
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
      );
      if (distance <= this.radius) {
        this.lastHitAt = Date.now();
        enemy.hit(this.randDamage(this.minDmg, this.maxDmg));
      }
    } 
  };

  kill = () => {
    this.audio.play()
    this.hpBar.remove();
    gameState.gold += this.cost;
    this.state = State.Dying;
    this.isDead = true;

    window.setTimeout(() => {
      this.deadMob.style.left = this.x + 'px';
      this.deadMob.style.top = this.y + 'px';
      if (this.direction === Direction.Left) {
        this.deadMob.style.transform =
          'translate(-50%, calc(-100% + 5px)) scaleX(-1)';
      }
      this.state = State.Dead;
      document.body.appendChild(this.deadMob);
      window.setTimeout(() => this.deadMob.remove(), 5000);
      this.die();
    },  this.drawInterval * this.dyingSequence.length);
  };

  die() {
    if (this.hpBar) this.hpBar.remove();
    this.mobElement.remove();
    const index = gameState.monsters.indexOf(this);
    if (index !== -1) {
      gameState.monsters.splice(index, 1);
    }

    gameState.checkSwitch();
  }

  calculateDirection() {
    const dx = this.x - this.lastX;
    const dy = this.y - this.lastY;

    const adx = Math.abs(dx);
    const ady = Math.abs(dy);

    if (adx > ady / 2) {
      /// Horizontal Movement
      this.direction = dx < 0 ? Direction.Left : Direction.Right;
    } else {
      /// Vertical Movement
      this.direction = dy > 0 ? Direction.Down : Direction.Up;
    }
  }

  render = () => {
    this.mobElement.style.left = this.x + 'px';
    this.mobElement.style.top = this.y + 'px';
  };
}

export class Orc extends Mob{
  constructor(road: RoadPoints){
    super(road);
    this.hp = 50;
    this.maxHP = this.hp
    this.minDmg = 4;
    this.maxDmg = 6;
    this.cost = 10;
    this.speed = 20
    this.attackSpeed = 1700;
    this.fightImg.src = orcAttack;
    this.fightSequence = [0,1,2,3,4,5,6];
    this.idleSequence =[0];
    this.moveRightImg.src = orcMoveR;
    this.horizontalWalkSequence =[0,1,2,3,4,5];
    this.moveDownImg.src =orcMoveD;
    this.moveUpImg.src = orcMoveU;
    this.verticalWalkSequence = [0,1,2,3,4,5];
    this.dyingImg.src =orcDie;
    this.dyingSequence = [0,1,2,3,4];
    this.deadMob.src = deadOrc;
  }
}

export class Wolf extends Mob{
  constructor(road: RoadPoints){
    super(road);
  this.hp = 20;
  this.maxHP = this.hp;
  this.minDmg = 2;
  this.maxDmg = 4;
  this.cost = 5;
  this.speed = 55;
  this.attackSpeed = 1100;
  this.idleSequence =[0];
  this.moveRightImg.src = wolfRight;
  this.horizontalWalkSequence =[0,1,2,3,4];
  // this.horizontalWalkSequence =[0,1,2,3,4,5,6,7];
  this.moveDownImg.src = wolfDown;
  this.moveUpImg.src = wolfUp;
  this.verticalWalkSequence = [0,1,2,3,4];
  this.fightImg.src = wolFight;
  this.fightSequence = [0,1,2,3,4,5,6,7,8,9];;
  this.dyingImg.src = wolfDie;
  this.dyingSequence = [0,1,2,3,4,5,6,7];
  this.deadMob.src = '';
  }
}