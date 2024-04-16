import { HpBar } from './hpBar';
import { Mob } from './mob';
import { Movable } from './movable';
import { gameState } from './state';
import { BarakTower } from './towers';
import { Point } from './types';

import guardMove from "./assets/guards/guardsMove.png";
import guardFight from "./assets/guards/guardsAttack.png";
import guardDie from "./assets/guards/guardDying.png";
import deadGuard from "./assets/guards/deadGuard.png";
import solderAttack from "./assets/guards/soliderAttack.png";
import solderMove from "./assets/guards/soliderMove.png";
import solderDie from "./assets/guards/soliderDie.png";
import deadSolder from "./assets/guards/deadSolder.png";

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


export class Rekrut extends Movable {
  public isInFight = false;
  public died = false;
  hp = 30;
  maxHp: number;
  hpBar: HpBar;
  minDmg: number = 1
  maxDmg: number = 3;
  lastHitAt: number = 0;
  attacksCoolDown = 1200;
  sightRadius = 40;
  attackRaduis = 30;
  mob: Mob | undefined;

  guardMoveImg: HTMLImageElement;
  guardFightImg: HTMLImageElement;
  guardDyingImg: HTMLImageElement;
  deadGuard: HTMLImageElement;


  walkSequence: number[] = [0, 1, 2, 3, 4, 5];
  fightSequence = [0, 0, 1, 1, 2, 2];
  idleSequence = [0];
  dyingSequence = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4];


  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  spriteWidth = 37; // Ширина каждого спрайта в изображении
  spriteHeight = 30; // Высота каждого спрайта в изображении
  animationFrame = 0;
  lastFrame = 0;
  drawInterval = 10;

  direction: Direction.Left | Direction.Right = Direction.Right;
  state = State.Moving;

  lastX: number = 0;
  lastY: number = 0;

  constructor(x: number, y: number) {
    super();
    this.speed = 120;
    this.x = x;
    this.y = y;
    this.maxHp = this.hp;

    this.element = document.createElement('div');
    this.element.style.pointerEvents = 'none';
    this.element.className = 'guard';
    document.body.appendChild(this.element);

    this.moveTo(x, y);
    this.hpBar = new HpBar(this.element, 30, 2, '0', (-this.spriteHeight).toString());

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'myCanvas';
    this.canvas.width = 37;
    this.canvas.height = 30;
    this.element.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.guardMoveImg = document.createElement('img')
    this.guardMoveImg.src = guardMove;

    this.guardFightImg = document.createElement('img')
    this.guardFightImg.src = guardFight;
    
    this.guardDyingImg = document.createElement('img')
    this.guardDyingImg.src = guardDie;
    
    this.deadGuard = document.createElement('img')
    this.deadGuard.src = deadGuard;
    this.deadGuard.style.pointerEvents = 'none';
    this.deadGuard.className = 'dead';

    window.setTimeout(() => {
      this.leave();
    }, 15000);
  }

  update(dt: number) {
    super.update(dt);
    if (this.died) {
      this.draw();
      return;
    }

    this.state = this.isMoving ? State.Moving : State.Idle;
    if (this.mob && !this.mob.isDead) {
      const distance = Math.sqrt(
        Math.pow(this.mob.x - this.x, 2) + Math.pow(this.mob.y - this.y, 2)
      );
      if (distance <= this.attackRaduis) {
        this.fight(this.mob);
      } else {
        const dx = this.mob.x - this.x;
        if (dx > 0) {
          this.moveTo(this.mob.x - this.attackRaduis / 2, this.mob.y);
        } else {
          this.moveTo(this.mob.x + this.attackRaduis / 2, this.mob.y);
        }
      }
    } else {
      this.patrol();
    }
    this.draw();
  }

  getAnimationData(state: State): AnimData {
    if (state === State.Fighting)
      return { img: this.guardFightImg, frameSeq: this.fightSequence };
    if (state === State.Dying)
      return { img: this.guardDyingImg, frameSeq: this.dyingSequence };
    if (state === State.Moving) {
      const img = this.guardMoveImg;
      return { img: img, frameSeq: this.walkSequence };
    }
    return { img: this.guardMoveImg, frameSeq: this.idleSequence };
  }

  draw = () => {
    const canDraw =
      Date.now() - this.lastFrame > this.attacksCoolDown / this.fightSequence.length;
    if (canDraw) {
      const { img, frameSeq } = this.getAnimationData(this.state);
      this.animationFrame = (this.animationFrame + 1) % frameSeq.length; // Переход к следующему спрайту
      const frameIndex = frameSeq[this.animationFrame];
      // console.log('===', this.animationFrame, frameIndex, frameSeq);
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
      this.lastFrame = Date.now();
      this.ctx.resetTransform();
      // this.ctx.drawImage(img, 0, 0);
    }
  };

  patrol = () => {
    // this.state = State.Idle;

    for (let i = 0; i < gameState.monsters.length; i++) {
      const monster = gameState.monsters[i];
      const dx = monster.x - this.x;
      const dy = monster.y - this.y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= this.sightRadius) {
        monster.setEnemy(this);
        this.mob = monster;
        const da = distance - this.attackRaduis;
        const dax = dx / distance + da;
        const day = dy / distance + da;
        this.moveTo(this.x + dax, this.y + day);
      }
    }
  };

  moveTo(x: number, y: number) {
    this.state = State.Moving;
    this.distancePassed = 0;
    this.targetX = x;
    this.targetY = y;
    this.direction = x > this.x ? Direction.Right : Direction.Left;
  }

  randDamage = (min: number, max: number) => {
    let d = max - min;
    const random = Math.floor(Math.random() * d)
    const damage = min + random;
    return damage
  }

  fight(target: Mob) {
    this.isInFight = true
    
    const dx = target.x - this.x;
    if (dx < 0) {
      this.direction = Direction.Left;
    }
    
    const canHit = Date.now() - this.lastHitAt > this.attacksCoolDown;
    if (canHit && !target.isDead) {
      this.state = State.Fighting;
      this.lastHitAt = Date.now();
      target.hit(this.randDamage(this.minDmg, this.maxDmg));
    } else this.state = State.Idle;
  }

  public hit(dmg: number) {
    this.hp -= dmg;
    if (this.hp <= 0) {
      this.die();
      return;
    }
    this.hpBar.setValue(this.hp / this.maxHp);
  }

  die = () => {
    this.state = State.Dying;
    this.died = true;

    this.hpBar.remove();

    window.setTimeout(() => {
      this.deadGuard.style.left = this.x + 'px';
      this.deadGuard.style.top = this.y + 'px';
      if (this.direction === Direction.Left) {
        this.deadGuard.style.transform =
          'translate(-50%, calc(-100% + 5px)) scaleX(-1)';
      }
      document.body.appendChild(this.deadGuard);
      window.setTimeout(() => this.deadGuard.remove(), 7000);
      this.delete();
    }, 1000);
  };

  leave() {
    if (!this.isInFight) {
      this.moveTo(this.x - 20, this.y)
      let o = 100
      window.setInterval(() => {
        o -= 10;
        this.canvas.style.opacity = o + '%'
      }, 50)
      window.setTimeout(() => { this.delete() }, 500)
    }
  }

  delete() {
    const index = gameState.movables.indexOf(this);
    if (index !== -1) {
      gameState.movables.splice(index, 1);
    }
    if (this.element)
      this.element.remove();
  }

  render() {
    if (!this.element) return;
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

export class Guard extends Movable {
  public isInFight = false;
  public died = false;
  hp = 50;
  maxHp: number;
  hpBar: HpBar;
  minDmg: number = 1;
  maxDmg: number = 3
  lastHitAt: number = 0;
  attackSpeed = 1500;
  sightRadius = 50;
  attackRaduis = 30;
  mob: Mob | undefined;

  guardMoveImg: HTMLImageElement;
  guardFightImg: HTMLImageElement;
  guardDyingImg: HTMLImageElement;
  deadGuard: HTMLImageElement;


  walkSequence: number[] = [0, 1, 2, 3, 4, 5];
  fightSequence = [0, 0, 1, 1, 2, 2];
  idleSequence = [0];
  dyingSequence = [0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 4, 4, 4];

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  spriteWidth = 37; // Ширина каждого спрайта в изображении
  spriteHeight = 30; // Высота каждого спрайта в изображении
  animationFrame = 0;
  lastFrame = 0;
  drawInterval = 100;

  direction: Direction.Left | Direction.Right = Direction.Right;
  state = State.Moving;

  lastX: number = 0;
  lastY: number = 0;

  constructor(
    x: number,
    y: number,
    private rallyPoint: Point,
    private tower: BarakTower,
    public id: number
  ) {
    super();
    this.speed = 100;
    this.x = x;
    this.y = y;

    this.element = document.createElement('div');
    // this.element.style.pointerEvents = 'none';
    this.element.className = 'guard';
    document.body.appendChild(this.element);
    this.maxHp = this.hp;

    this.hpBar = new HpBar(this.element, 30, 2, '0', (-this.spriteHeight).toString());
    this.setRallyPoint(rallyPoint);

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'myCanvas';
    this.canvas.width = 37;
    this.canvas.height = 30;
    this.element.appendChild(this.canvas);
    this.ctx = this.canvas.getContext('2d')!;

    this.element.addEventListener('mouseover', this.onHover);
    this.element.addEventListener('mouseleave', this.onLeave)

    this.guardMoveImg = document.createElement('img')
    this.guardMoveImg.src = 'https://i.ibb.co/nbZ7psL/guards-Move.png'

    this.guardFightImg = document.createElement('img')
    this.guardFightImg.src = 'https://i.ibb.co/LtsRKm9/guards-Attack.png';
    
    this.guardDyingImg = document.createElement('img')
    this.guardDyingImg.src = 'https://i.ibb.co/4pLPRBT/guard-Dying.png';
    
    this.deadGuard = document.createElement('img')
    this.deadGuard.src = 'https://i.ibb.co/L9QTVnn/Image-933-at-frame-1.png';
    this.deadGuard.style.pointerEvents = 'none';
    this.deadGuard.className = 'dead';
  }
  update(dt: number) {
    super.update(dt);
    if (this.died) {
      this.draw();
      return;
    }

    this.state = this.isMoving ? State.Moving : State.Idle;
    if (this.mob && !this.mob.isDead) {
      const distance = Math.sqrt(
        Math.pow(this.mob.x - this.x, 2) + Math.pow(this.mob.y - this.y, 2)
      );
      if (distance <= this.attackRaduis) {
        this.fight(this.mob);
      } else {
        const dx = this.mob.x - this.x;
        if (dx > 0) {
          this.moveTo(this.mob.x - this.attackRaduis / 2, this.mob.y);
        } else {
          this.moveTo(this.mob.x + this.attackRaduis / 2, this.mob.y);
        }
      }
    } else {
      this.patrol();
    }
    this.draw();
  }

  randDamage = (min: number, max: number) => {
    let d = max - min;
    const random = Math.floor(Math.random() * d)
    const damage = min + random;
    return damage
  }

  getAnimationData(state: State): AnimData {
    if (state === State.Fighting)
      return { img: this.guardFightImg, frameSeq: this.fightSequence };
    if (state === State.Dying)
      return { img: this.guardDyingImg, frameSeq: this.dyingSequence };
    if (state === State.Moving) {
      const img = this.guardMoveImg;
      return { img: img, frameSeq: this.walkSequence };
    }
    return { img: this.guardMoveImg, frameSeq: this.idleSequence };
  }

  draw = () => {
    const canDraw = Date.now() - this.lastFrame >  this.drawInterval;
    if (canDraw) {
      const { img, frameSeq } = this.getAnimationData(this.state);
      this.animationFrame = (this.animationFrame + 1) % frameSeq.length; // Переход к следующему спрайту
      const frameIndex = frameSeq[this.animationFrame];
      // console.log('===', this.animationFrame, frameIndex, frameSeq);
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
      this.lastFrame = Date.now();
      this.ctx.resetTransform();
      // this.ctx.drawImage(img, 0, 0);
    }
  };

  patrol = () => {
    // this.state = State.Idle;

    for (let i = 0; i < gameState.monsters.length; i++) {
      const monster = gameState.monsters[i];
      const dx = monster.x - this.x;
      const dy = monster.y - this.y;

      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= this.sightRadius) {
        monster.setEnemy(this);
        this.mob = monster;
        const da = distance - this.attackRaduis;
        const dax = dx / distance + da;
        const day = dy / distance + da;
        this.moveTo(this.x + dax, this.y + day);
      }
    }
  };

  moveTo(x: number, y: number) {
    this.state = State.Moving;
    this.distancePassed = 0;
    this.targetX = x;
    this.targetY = y;
    this.direction = x > this.x ? Direction.Right : Direction.Left;
  }

  onHover = () => {
    this.canvas.style.filter = 'drop-shadow(yellow 0px 0px 4px)'
  }

  onLeave = () => {
    this.canvas.style.filter = 'drop-shadow(yellow 0px 0px 0px)'
  }

  fight(target: Mob) {
    
    const dx = target.x - this.x;
    if (dx < 0) {
      this.direction = Direction.Left;
    }
    
    const canHit = Date.now() - this.lastHitAt > this.attackSpeed;
    if (canHit && !target.isDead) {
      this.state = State.Fighting;
      this.lastHitAt = Date.now();
      target.hit(this.randDamage(this.minDmg, this.maxDmg));
    } else this.state = State.Idle
  }

  setRallyPoint(point: Point) {
    if (this.mob) {
      // this.mob.removeEnemy();
    }
    this.rallyPoint = point;
    if (this.id === 0) {
      this.moveTo(point.x - 20, point.y + 20);
    } else if (this.id === 2) {
      this.moveTo(point.x + 20, point.y + 20);
    } else {
      this.moveTo(point.x, point.y);
    }
  }

  public hit(dmg: number) {
    this.hp -= dmg;

    if (this.hp <= 0) {
      this.die();
      return;
    }
    this.hpBar.setValue(this.hp / this.maxHp);
  }

  die = () => {
    this.state = State.Dying;
    this.died = true;

    this.hpBar.remove();

    window.setTimeout(() => {
      this.deadGuard.style.left = this.x + 'px';
      this.deadGuard.style.top = this.y + 'px';
      if (this.direction === Direction.Left) {
        this.deadGuard.style.transform =
          'translate(-50%, calc(-100% + 5px)) scaleX(-1)';
      }
      document.body.appendChild(this.deadGuard);
      window.setTimeout(() => this.deadGuard.remove(), 7000);
      this.delete();
    }, 1000);
  };

  delete() {
    const index = gameState.movables.indexOf(this);
    if (index !== -1) {
      gameState.movables.splice(index, 1);
    }
    this.element!.remove();
    this.tower.deleteGuard(this);

    if (this.tower.active) {
      window.setTimeout(() => {
        this.tower.createGuards(this.rallyPoint);
      }, 7000);
    }
  }

  render() {
    if (!this.element) return;
    this.element.style.left = this.x + 'px';
    this.element.style.top = this.y + 'px';
  }
}

export class Guard2 extends Guard {
  constructor(x: number,
    y: number,
    rallyPoint: Point,
    tower: BarakTower,
    public id: number) {
    super(x,
      y,
      rallyPoint,
      tower,
      id)
    this.hp = 50;
    this.maxHp = this.hp;
    this.minDmg =  3;
    this.maxDmg = 5;
    this.sightRadius = 60;
    this.guardFightImg.src = solderAttack;
    this.guardMoveImg.src =solderMove;
    this.guardDyingImg.src =solderDie;
    this.deadGuard.src =deadSolder;
  }
}