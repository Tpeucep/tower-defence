import { getDistance, mouseY, mouseX } from './App';
import { gameState } from './state';
import { Bomb, FireBall, FrostBall } from './fireballs';
import { Point } from './types';
import { Guard } from './guards etc';

export class Tower {
  towerElement: HTMLDivElement;
  bulletElement!: HTMLImageElement;
  img: HTMLImageElement;
  x: number;
  y: number;
  radius: number = 105;
  distancePassed: number = 0;
  lastShotAt: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.towerElement = document.createElement('div');
    this.img = document.createElement('img');
    this.towerElement.className = 'tower';
    this.img.src = 'https://i.ibb.co/Hnh20MM/Image-154-at-frame-1.png';
    this.img.draggable = false;

    document.body.appendChild(this.towerElement);
    this.towerElement.appendChild(this.img);
    this.render();
  }

  public update = () => {
    const towerCenterX = this.x;
    const towerCenterY = this.y;
    const canShoot = Date.now() - this.lastShotAt > 700;

    if (canShoot) {
      for (let i = 0; i < gameState.monsters.length; i++) {
        const monster = gameState.monsters[i];
        const distance = Math.sqrt(
          Math.pow(monster.x - towerCenterX, 2) +
            Math.pow(monster.y - towerCenterY, 2)
        );
        if (distance <= this.radius && !monster.isDead) {
          // console.log(Date.now() - this.lastShotAt);
          this.lastShotAt = Date.now();
          const fireball = new FireBall(this.x, this.y - 15, monster);
          gameState.fireBalls.push(fireball);
          break;
        }
      }
      const distanceToMouse = Math.sqrt(
        Math.pow(mouseX - towerCenterX, 2) + Math.pow(mouseY - towerCenterY, 2)
      );
    }
    const distanceToMouse = getDistance(
      towerCenterX,
      towerCenterY,
      mouseX,
      mouseY
    );
    // console.log(distanceToMouse);
  };
  reset() {
    const index = gameState.towers.indexOf(this);
    if (index !== -1) {
      gameState.towers.splice(index, 1);
    }
    this.towerElement.remove();
  }
  render() {
    this.towerElement.style.left = this.x + 'px';
    this.towerElement.style.top = this.y + 'px';
  }
}

export class FreezeTower extends Tower {
  constructor(x: number, y: number) {
    super(x, y);
    this.x;
    this.y;
    this.radius = 100;
    this.img.src =
      'https://stackblitz.com/storage/blobs/eyJfcmFpbHMiOnsibWVzc2FnZSI6IkJBaHBBNEF2Q3c9PSIsImV4cCI6bnVsbCwicHVyIjoiYmxvYl9pZCJ9fQ==--eb890839916c483c01d6b8825af970716dcc8caf/Image%2098%20at%20frame%201.png';
    this.render();
  }
  public update = () => {
    const towerCenterX = this.x;
    const towerCenterY = this.y;
    const canShoot = Date.now() - this.lastShotAt > 400;

    if (canShoot) {
      for (let i = 0; i < gameState.monsters.length; i++) {
        const monster = gameState.monsters[i];
        if (monster.freezePoint <= 3) {
          const distance = Math.sqrt(
            Math.pow(monster.x - towerCenterX, 2) +
              Math.pow(monster.y - towerCenterY, 2)
          );
          // console.log('stop shoting');

          if (distance <= this.radius && !monster.isDead) {
            this.lastShotAt = Date.now();
            const frostball = new FrostBall(this.x, this.y - 15, monster);
            gameState.fireBalls.push(frostball);
            break;
          }
        }
      }
      const distanceToMouse = Math.sqrt(
        Math.pow(mouseX - towerCenterX, 2) + Math.pow(mouseY - towerCenterY, 2)
      );
    }
    const distanceToMouse = getDistance(
      towerCenterX,
      towerCenterY,
      mouseX,
      mouseY
    );
    // console.log(distanceToMouse);
  };
}

export class BombTower extends Tower {
  audio: HTMLAudioElement;
  constructor(x: number, y: number) {
    super(x, y);
    this.x;
    this.y;
    this.radius = 120;
    this.img.src = 'https://i.ibb.co/5jm0fN9/Image-246-at-frame-1.png';

    this.audio = new Audio();
    this.audio.src =
      'https://audio.buzzsprout.com/a09dv2jfild2q9szwny8ymo0b3g9?response-content-disposition=inline&';

    this.render();
  }
  public update = () => {
    const towerCenterX = this.x;
    const towerCenterY = this.y;
    const canShoot = Date.now() - this.lastShotAt > 2500;

    if (canShoot) {
      for (let i = 0; i < gameState.monsters.length; i++) {
        const monster = gameState.monsters[i];
        const distance = Math.sqrt(
          Math.pow(monster.x - towerCenterX, 2) +
            Math.pow(monster.y - towerCenterY, 2)
        );
        if (distance <= this.radius && !monster.isDead) {
          // console.log(Date.now() - this.lastShotAt);
          this.lastShotAt = Date.now();
          const bomb = new Bomb(
            this.x + 2.5,
            this.y - 20,
            monster.x,
            monster.y
          );
          this.audio.play();
          gameState.fireBalls.push(bomb);
          break;
        }
      }
    }
  };
}

export class BarakTower extends Tower {
  towerRadius: HTMLDivElement;
  rallyPoint: Point;
  public guardCount = 0;
  guardCountLimit = 1;
  public active = true;
  public guardList: Guard[] = [];
  mobRadiusPoint: HTMLDivElement;
  constructor(x: number, y: number) {
    super(x, y);
    this.x;
    this.y;
    this.rallyPoint = { x: x, y: y };
    this.radius = 100;
    this.img.src = 'https://i.ibb.co/LNWNW5F/Image-27-at-frame-1.png';
    // this.img.style.position = 'absolute';
    this.towerRadius = document.createElement('div');
    this.towerElement.appendChild(this.towerRadius);
    this.towerRadius.style.borderRadius = this.radius + 'px';
    this.towerRadius.style.width = 2 * this.radius + 'px';
    this.towerRadius.style.height = 2 * this.radius + 'px';
    // this.towerRadius.style.display = 'none';
    this.towerRadius.style.border = 'solid aqua';
    this.towerRadius.className = 'radius';
    this.mobRadiusPoint = document.createElement('div');
    this.mobRadiusPoint.className = 'point';
    this.towerRadius.addEventListener('click', (e) => {
      // console.log(e.x, e.y);
      this.rallyPoint = { x: e.x, y: e.y };
      this.mobRadiusPoint.style.left = e.x + 'px';
      this.mobRadiusPoint.style.top = e.y + 'px';
      document.body.appendChild(this.mobRadiusPoint);

      for (let i = 0; i < this.guardList.length; i++) {
        const guards = this.guardList[i];
        guards.setRallyPoint(this.rallyPoint);
      }
    });
    this.closeMenu();
    // this.openMenu();
    this.render();
    this.checkRoad();
  }
  checkRoad() {
    const targetPoint = { x: this.x, y: this.y };

    let closestPointOnRoad: Point | undefined;
    let minDistance = Infinity;

    // Итерируем по каждому углу дороги
    if (!gameState.mapConfig) return;
    const currentRoad = gameState.mapConfig.road;
    for (let i = 0; i < currentRoad.length - 1; i++) {
      const startCorner = currentRoad[i];
      const endCorner = currentRoad[i + 1];

      // Находим ближайшую точку на отрезке между углами к заданным координатам
      const closestPoint = this.findClosestPointOnSegment(
        targetPoint,
        startCorner,
        endCorner
      );

      const distance = this.distanceBetweenPoints(targetPoint, closestPoint);

      if (distance < minDistance) {
        closestPointOnRoad = closestPoint;
        minDistance = distance;
      }
    }
    if (!closestPointOnRoad) return;
    // ctx.lineWidth = 2;
    // ctx.strokeStyle = 'green';
    // ctx.beginPath();
    // // ctx.moveTo(this.x, this.y);
    // ctx.moveTo(0, 0);
    // ctx.lineTo(closestPointOnRoad.x, closestPointOnRoad.y);
    // ctx.stroke();
    // console.log(
    //   `Ближайшая точка на дороге: x: ${closestPointOnRoad.x}, y: ${closestPointOnRoad.y}`
    // );
    // console.log('блять');
    for (let i = 0; i < this.guardCountLimit; i++) {
      this.createGuardsAtPoint(closestPointOnRoad);
      this.guardCount++;
    }
  }

  findClosestPointOnSegment(p: Point, s1: Point, s2: Point) {
    const v = { x: p.x - s1.x, y: p.y - s1.y };
    const w = { x: s2.x - s1.x, y: s2.y - s1.y };

    const wLength = Math.sqrt(w.x * w.x + w.y * w.y);
    const wNormalized = { x: w.x / wLength, y: w.y / wLength };

    const projection = v.x * wNormalized.x + v.y * wNormalized.y;

    if (projection <= 0) {
      return s1;
    }

    if (projection >= wLength) {
      return s2;
    }

    const closestPoint = {
      x: s1.x + projection * wNormalized.x,
      y: s1.y + projection * wNormalized.y,
    };

    return closestPoint;
  }

  distanceBetweenPoints(point1: Point, point2: Point) {
    const dx = point1.x - point2.x;
    const dy = point1.y - point2.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public createGuardsAtPoint = (closestPoint: Point) => {
    const ids: number[] = [];
    for (let i = 0; i < this.guardCountLimit; i++) {
      let found = false;
      for (let j = 0; j < this.guardList.length; j++) {
        if (this.guardList[j].id === i) {
          found = true;
          break;
        }
      }
      if (!found) ids.push(i);
    }
    // console.log('ids', ids);

    for (let i = 0; i < ids.length; i++) {
      const guard = new Guard(this.x, this.y, closestPoint, this, ids[i]);
      // console.log(this.x, this.y);
      this.guardList.push(guard);
      gameState.movables.push(guard);
      // guard.moveTo(closestPoint.x, closestPoint.y);
    }
  };
  public createGuards(coords: Point) {
    this.createGuardsAtPoint(coords);
    // console.log(coords);
  }
  update = () => {}; // ----------НЕ----ТРОГАТЬ----------

  closeMenu = () => {
    this.towerRadius.remove();
    // console.log('phase1');
    document.body.removeEventListener('click', this.closeMenu);
    window.setTimeout(() => {
      this.towerElement.addEventListener('click', this.openMenu);
    }, 100);
  };
  reset() {
    this.active = false;
    this.closeMenu();
    for (let i = this.guardList.length - 1; i >= 0; i--) {
      const gvard = this.guardList[i];
      gvard.die();
    }

    const index = gameState.towers.indexOf(this);
    if (index !== -1) {
      gameState.towers.splice(index, 1);
    }
    this.mobRadiusPoint.remove();
    this.towerElement.remove();
  }
  deleteGuard(guard: Guard) {
    const index = this.guardList.indexOf(guard);
    if (index !== -1) {
      this.guardList.splice(index, 1);
    }
    // console.log('dead: ', this.guardList);
  }
  openMenu = () => {
    this.towerElement.appendChild(this.towerRadius);
    // console.log(this.towerRadius);
    this.towerElement.removeEventListener('click', this.openMenu);
    window.setTimeout(() => {
      document.body.addEventListener('click', this.closeMenu);
    }, 100);
  };

  render() {
    this.towerElement.style.left = this.x + 'px';
    this.towerElement.style.top = this.y + 'px';
  }
}
