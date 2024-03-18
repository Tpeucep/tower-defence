import { getRandID } from './App';
import { Point } from './types';
import { HpBar } from './hpBar';
import { Movable } from './movable';
import { gameState } from './state';
import { Guard, Rekrut } from './guards etc';

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

const moveRightImg = new Image();
moveRightImg.src =
  'https://stackblitz.com/storage/blobs/redirect/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBMTNSQ3c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--e576042a8b0ea8e0013d4b1c0f458080e8719343/spritesheet.png';

const moveDownImg = new Image();
moveDownImg.src = 'https://i.ibb.co/nn7cDQS/goblin-Move-Down.png';

const moveUpImg = new Image();
moveUpImg.src = 'https://i.ibb.co/XzJFhMQ/goblin-Move-Up.png';

const fightImg = new Image();
fightImg.src = 'https://i.ibb.co/KzMdqmQ/goblin-Attack.png';

const dyingImg = new Image();
dyingImg.src = 'https://i.ibb.co/Kb5KD4Z/goblin-Dying.png';

const deadMob = new Image();

const horizontalWalkSequence: number[] = [0, 1, 2, 3, 7, 1, 2, 3];
const verticalWalkSequence: number[] = [0, 1, 2, 3, 4, 5, 6, 7];
const fightSequence = [0, 1, 2, 3, 4, 5, 6, 7];
const idleSequence = [7];
const dyingSequence = [0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3];

export class Mob extends Movable {
  startX: number;
  startY: number;
  maxHP: number;
  lastX: number = 0;
  lastY: number = 0;
  hp: number = 20;
  dmg = 2;
  cost = 10;

  enemy: Guard | Rekrut | undefined;
  id: string = getRandID().toString();
  mobElement: HTMLDivElement;
  hpBar: HpBar;
  audio: HTMLAudioElement;

  isDead: boolean = false;
  points: Point[];
  currentPointIndex: number = 0;
  distancePassed: number = 0;
  freezePoint: number = 0;
  attackSpeed = 900;
  lastHitAt: number = 0;
  radius = 30;

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  spriteWidth = 37; // Ширина каждого спрайта в изображении
  spriteHeight = 30; // Высота каждого спрайта в изображении
  animationFrame = 0;
  lastFrame = 0;
  drawInterval = 100;

  direction = Direction.Down;
  state = State.Moving;
  constructor(point: Point[]) {
    super();
    this.maxHP = this.hp;
    this.startX = point[0].x;
    this.startY = point[0].y;
    this.points = point;

    this.mobElement = document.createElement('div');
    this.mobElement.className = 'mob';
    this.mobElement.style.left = this.startX + 'px';
    this.mobElement.style.top = this.startY + 'px';
    document.body.appendChild(this.mobElement);
    this.hpBar = new HpBar(this.mobElement, 30, 2, '0', '-120%');

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'myCanvas';
    this.canvas.width = 37;
    this.canvas.height = 30;
    this.mobElement.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    deadMob.src = 'https://i.ibb.co/3kXtKyV/Image-4429-at-frame-1.png';
    deadMob.className = 'dead';

    this.audio = new Audio();
    this.audio.src =
      'https://d1eav5o1141ef7.cloudfront.net/g3m1uj%2Ffile%2F9ed59e99febf590b57d7a13c1fa5eb8b_91d33e58296cbc5a8654821f96b7f89e.mp3?response-content-disposition=inline%3Bfilename%3D%229ed59e99febf590b57d7a13c1fa5eb8b_91d33e58296cbc5a8654821f96b7f89e.mp3%22%3B&response-content-type=audio%2Fmpeg&Expires=1710798685&Signature=XfdERDhyWixIE8WfjMg1fyIdkXpaIRim-9qf-hwqxDGCBDAJGIMON633KacYyGlB8nG6SCcqTqo4XwZgxVvlQMiBEbBHP5-dpyEMSDJUErOla9Tq7LUlr770~z9YSgiuX7ioqyQrjtRUakXqgGRnZUCTIeh5-H6MQixvb3UBhRt~pEJZjdvsbavNZ2HD5jgvKJKdVnKxrHB-ybOIfdXmhWX5C9nZaqAUXoYNwzdbzHHr9WDQRpxO44EZgrUDAsunjAUT~7VU26J-rl66kiyv1Ct1CRW7Ns4UE2wSEbNzADJLehFSe4hoChqmQi-pEtfX6-qFKxJcjaOWi1pZ7mPnuQ__&Key-Pair-Id=APKAJT5WQLLEOADKLHBQ';

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
      return { img: fightImg, frameSeq: fightSequence };
    if (state === State.Dying)
      return { img: dyingImg, frameSeq: dyingSequence };
    if (state === State.Moving) {
      const img =
        this.direction === Direction.Up
          ? moveUpImg
          : this.direction === Direction.Down
          ? moveDownImg
          : moveRightImg;
      return {
        img: img,
        frameSeq:
          direction === Direction.Up || direction === Direction.Down
            ? verticalWalkSequence
            : horizontalWalkSequence,
      };
    }
    return { img: fightImg, frameSeq: idleSequence };
  }

  // Функция отрисовки анимации
  draw = () => {
    const canDraw = Date.now() - this.lastFrame > this.drawInterval;
    if (canDraw) {
      const { img, frameSeq } = this.getAnimationData(
        this.state,
        this.direction
      );
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
    const currentPoint = this.points[this.currentPointIndex];
    const nextPoint = this.points[this.currentPointIndex + 1];

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
    if (this.currentPointIndex >= this.points.length - 1) {
      if (gameState.gameMap) {
        gameState.gameMap.hitCastle(this.dmg);
        if (gameState.gameMap.castle.hp != 0) gameState.checkSwitch();
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

  fight = (enemy: Guard | Rekrut) => {
    // console.log(damage);
    this.state = State.Fighting;

    const dx = this.x - enemy.x;
    if (dx > 0) {
      this.direction = Direction.Left;
    }

    const canHit = Date.now() - this.lastHitAt > this.attackSpeed;
    if (canHit) {
      const distance = Math.sqrt(
        Math.pow(enemy.x - this.x, 2) + Math.pow(enemy.y - this.y, 2)
      );
      if (distance <= this.radius) {
        this.lastHitAt = Date.now();
        enemy.hit(this.dmg);
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
      deadMob.style.left = this.x + 'px';
      deadMob.style.top = this.y + 'px';
      if (this.direction === Direction.Left) {
        deadMob.style.transform =
          'translate(-50%, calc(-100% + 5px)) scaleX(-1)';
      }
      document.body.appendChild(deadMob);
      window.setTimeout(() => deadMob.remove(), 10000);
      this.die();
    }, 1000);
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
