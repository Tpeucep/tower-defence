import { Mob } from './mob';
import { IFireball } from './types';
import { Movable } from './movable';
import { gameState } from './state';

const smallExplosion = new Image();
smallExplosion.src = 'https://i.ibb.co/PT7sJtL/small-Explosion.png';

export class FireBall implements IFireball {
  ballElement: HTMLImageElement;
  isBurned: boolean = false;
  startX: number = 0;
  startY: number = 0;
  x: number;
  y: number;
  target: Mob;
  dmg: number = 3;
  distancePassed = 0;
  radius: number = 10;
  speed = 180;

  constructor(startX: number, startY: number, target: Mob) {
    this.startX = startX;
    this.startY = startY;
    this.target = target;
    this.x = startX;
    this.y = startY;
    this.ballElement = document.createElement('img');
    this.ballElement.className = 'bullet';
    this.ballElement.src = 'https://i.ibb.co/vzmM5Jk/Image-1438-at-frame-1.png';
    this.ballElement.draggable = false;
    this.ballElement.style.width = 40 + 'px';
    this.ballElement.style.left = startX + 'px';
    this.ballElement.style.top = startY + 'px';
    document.body.appendChild(this.ballElement);
    // console.log(this.startX, this.startY);
    // console.log(this.target);
  }
  public update(dt: number) {
    const dx = this.target.x - this.x;
    const dy = this.target.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceToMove = this.speed * dt;

    if (distance < this.radius) {
      //console.log('kill');

      this.onHit();
    } else {
      const relativePosition = distanceToMove / distance;
      this.x = this.x + dx * relativePosition;
      this.y = this.y + dy * relativePosition;
      this.distancePassed += distanceToMove;
      //console.log(this.startX, this.x);
    }
  }

  delete() {
    const index = gameState.fireBalls.indexOf(this);
    if (index !== -1) {
      gameState.fireBalls.splice(index, 1);
    }
    this.ballElement.remove();
    this.isBurned = true;
  }
  public render() {
    this.ballElement.style.left = this.x + 'px';
    this.ballElement.style.top = this.y + 'px';
  }

  onHit() {
    this.delete();
    this.target.hit(this.dmg);
  }
}

export class FrostBall extends FireBall {
  constructor(x: number, y: number, target: Mob) {
    super(x, y, target);
    this.dmg = 1;
    this.ballElement.src = 'https://i.ibb.co/nL7Zq7M/image.png';
  }
  onHit() {
    this.delete();
    this.target.hit(this.dmg);
    this.target.freeze();
  }
}
export class FireBomb extends Movable {
  explosionSrc: string =
    'https://stackblitz.com/storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBOHh3Q3c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--846b3aaaa3de073b9d59561879c0ddff832bdc96/Image%202363%20at%20frame%201.png';
  radius: number = 30;
  dmg: number = 6;
  srcs: string[] = [];
  constructor(x: number, y: number) {
    super();
    this.y = -20;
    this.x = x;
    this.targetX = x;
    this.targetY = y;
    // console.log('&&& ', x, y);
    this.speed = 400;
    const img = new Image();
    img.className = 'bullet';
    img.src = 'https://i.ibb.co/17m8837/Image-2353-at-frame-1.png';
    this.element = img;
    this.element.style.rotate = '90deg';
    document.body.appendChild(img);
    this.moveTo(this.targetX, this.targetY);
  }
  onEnd() {
    super.onEnd();
    const explo = new Explosion(
      this.x,
      this.y,
      smallExplosion,
      this.radius,
      this.dmg
    );
    this.delete();
  }

  delete = () => {
    // console.log(this.rallyPoint);
    const index = gameState.movables.indexOf(this);
    if (index !== -1) {
      gameState.movables.splice(index, 1);
    }
    if(this.element) this.element.remove();
  };
}

export class Bomb extends Movable {
  shadowX: number = 0;
  shadowY: number = 0;
  radius = 30;
  dmg = 7;
  explosion: HTMLImageElement;
  constructor(
    private startX: number,
    private startY: number,
    x: number,
    y: number
  ) {
    super();
    // console.log(startX, startY, x, y);
    this.speed = 60;
    this.element = document.createElement('div');
    this.explosion = document.createElement('img');
    this.explosion.draggable = false;
    const img = new Image();
    document.body.appendChild(this.element);
    this.element.className = 'bullet';
    this.element.appendChild(img);
    img.src = 'https://i.ibb.co/jM3LGkF/Image-1470-at-frame-1.png';

    this.x = startX;
    this.y = startY;
    this.targetX = x;
    this.targetY = y;
    gameState.movables.push(this);
    this.shadowX = this.x;
    this.shadowY = this.y;
  }
  update(dt: number) {
    if (this.targetX === undefined || this.targetY === undefined) return;
    const shadowDx = this.shadowX - this.startX;
    const shadowDy = this.shadowY - this.startY;
    const shadowDistance = Math.sqrt(shadowDx * shadowDx + shadowDy * shadowDy);

    const dx = this.targetX - this.startX;
    const dy = this.targetY - this.startY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const distanceToMove = this.speed * dt;

    const controlPoint = {
      x: this.startX + dx * 0.5,
      y: this.startY + dy * 0.5 - 100,
    };

    if (shadowDistance >= distance) {
      this.x = this.targetX;
      this.y = this.targetY;
      this.onEnd();
    } else {
      const relativePosition = distanceToMove / distance;
      this.shadowX = this.shadowX + dx * relativePosition;
      this.shadowY = this.shadowY + dy * relativePosition;
      const t = shadowDistance / distance;
      // const t = 0;
      // console.log('T???: ', distanceToMove);
      this.x =
        Math.pow(1 - t, 2) * this.x +
        2 * (1 - t) * t * controlPoint.x +
        t * t * this.targetX;
      this.y =
        Math.pow(1 - t, 2) * this.y +
        2 * (1 - t) * t * controlPoint.y +
        t * t * this.targetY;

      this.distancePassed += distanceToMove;
      //console.log(this.startX, this.x);
    }
  }
  onEnd() {
    super.onEnd();
    const explo = new Explosion(
      this.x,
      this.y,
      smallExplosion,
      this.radius,
      this.dmg
    );
    this.delete();
  }

  delete = () => {
    // console.log(this.rallyPoint);
    const index = gameState.movables.indexOf(this);
    if (index !== -1) {
      gameState.movables.splice(index, 1);
    }
    this.element!.remove();
  };
}

export class Explosion {
  element: HTMLDivElement;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  frameSeq = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  spriteWidth = 52; // Ширина каждого спрайта в изображении
  spriteHeight = 67; // Высота каждого спрайта в изображении
  animationFrame = 0;
  lastFrame = 0;
  drawInterval = 100;
  constructor(
    private x: number,
    private y: number,
    private src: HTMLImageElement,
    private radius: number,
    private dmg: number
  ) {
    const audio = new Audio();
    // audio.muted = true
    audio.src =
      'https://audio.buzzsprout.com/9s5qujcaeklbdwfzvt71k8of3jhl?response-content-disposition=inline&';

    this.element = document.createElement('div');
    this.element.draggable = false;
    this.element.className = 'explosion';
    this.element.style.left = x + 'px';
    this.element.style.top = y + 'px';
    document.body.appendChild(this.element);

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'myCanvas';
    this.canvas.width = this.spriteHeight;
    this.canvas.height = this.spriteHeight;
    this.element.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    window.setInterval(() => this.draw(), 100);
    this.hitArea(dmg);
    audio.play();

    window.setTimeout(() => {
      this.element.remove();
    }, 1099);
  }

  draw = () => {
    const frameIndex = this.frameSeq[this.animationFrame];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    // console.log('===', frameIndex, this.animationFrame);

    this.ctx.drawImage(
      this.src,
      frameIndex * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      0,
      0,
      this.spriteWidth,
      this.spriteHeight
    ); // Отрисовка текущего спрайта
    this.animationFrame = (this.animationFrame + 1) % this.frameSeq.length; // Переход к следующему спрайту
    this.ctx.resetTransform();
    // this.ctx.drawImage(img, 0, 0);
  };

  hitArea = (dmg: number) => {
    for (let i = 0; i < gameState.monsters.length; i++) {
      const monster = gameState.monsters[i];
      const distance = Math.sqrt(
        Math.pow(monster.x - this.x, 2) + Math.pow(monster.y - this.y, 2)
      );
      if (distance <= this.radius) {
        monster.hit(this.dmg);
      }
    }
  };
}
