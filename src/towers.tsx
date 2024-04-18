import { getDistance, mouseY, mouseX } from './App';
import { gameState } from './state';
import { Bomb, FireBall, FrostBall } from './fireballs';
import { Point } from './types';
import { Guard, Guard2 } from './guards etc';
import { Basement } from './basement';

import ringSrc from "./assets/towers/ring.png";
import towerImg from "./assets/towers/tower.png";
import tower2 from "./assets/towers/Tower2.png";
import upgrade from "./assets/towers/upgrade.png";
import sell from "./assets/towers/sell.png";
import upgradeLock from "./assets/towers/upgradeLocked.png";
import flag from "./assets/towers/flag.png";
import bomb from "./assets/towers/bomb1.png";
import bomb2 from "./assets/towers/bomb2.png";
import freeze from "./assets/towers/freeze.png";
import freeze2 from "./assets/towers/freeze2.png";
import barak1 from "./assets/towers/barak.png";
import barak2 from "./assets/towers/barak2.png";

export class Tower {
  towerElement: HTMLDivElement;
  bulletElement!: HTMLImageElement;
  menu: HTMLDivElement;
  menuUpgrade: HTMLDivElement;
  menuUpgradeImg: HTMLImageElement;
  menuSell: HTMLImageElement;
  menuRing: HTMLImageElement;
  damage = 3;
  upgradeCost = 110;
  sellCost = 30;
  menuOpen = false;
  img: HTMLImageElement;
  x: number;
  y: number;
  radius: number = 85;
  lastShotAt: number = 0;
  attackSpeed = 700;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
    this.towerElement = document.createElement('div');
    this.img = document.createElement('img');
    this.towerElement.className = 'tower';
    this.img.src = towerImg;
    this.img.draggable = false;
    console.log(towerImg)

    this.menu = document.createElement('div');
    this.menu.className = 'menu';
    this.menu.style.left = 7 + "px";

    this.menuUpgrade = document.createElement('div');
    // this.menuUpgrade.className ='menuUpgrade';
    this.menuUpgrade.innerHTML = this.upgradeCost.toString();
    this.menu.appendChild(this.menuUpgrade);
    this.menuUpgrade.className = 'menuUpgrd';
    this.menuUpgradeImg = document.createElement('img');
    this.menuUpgradeImg.src = upgrade;
    this.menuUpgradeImg.className = 'menuUpgrdImg';
    if (gameState.gold < this.upgradeCost) this.menuUpgradeImg.style.filter = 'grayscale(1)';
    this.menuUpgrade.appendChild(this.menuUpgradeImg);


    this.menuRing = document.createElement('img');
    // this.menuRing.src ='https://i.ibb.co/94Wtbt4/2024-04-03-0sw-Kleki.png';
    this.menuRing.src = ringSrc;
    this.menuRing.className = 'menuRing'

    this.menuSell = document.createElement('img');
    this.menuSell.src = sell;
    this.menuSell.addEventListener('click', this.sell);
    this.menuSell.className = 'menuSell';
    this.menuSell.style.top = 80 + 'px'
    this.menu.appendChild(this.menuSell);

    this.menu.appendChild(this.menuRing);

    document.body.appendChild(this.towerElement);
    this.towerElement.appendChild(this.img);
    this.render();
    this.menuUpgradeImg.addEventListener('click', this.upgrade)
    this.img.addEventListener('mouseover', this.onHover);
    this.img.addEventListener('mouseleave', this.onLeave);
    this.img.addEventListener('click', this.openMenu);
  }
  
  upgrade =()=>  {
    console.log('===upgrade))' , this)
    if (gameState.gold >= this.upgradeCost) {
      gameState.gold -= this.upgradeCost;
      this.reset() ; /// удаление этой башни
      const tier2Tower = new Tower2(this.x, this.y); // зоздание башни следуйщего уровня
    }
    this.closeMenu()
  };
  
  sell = () => {
    console.log('===sell')
    gameState.gold += this.sellCost;
    this.reset();
    const basement = new Basement(this.x, this.y);
    this.closeMenu();
  }

  onHover = () => {
    this.handleHover();
  }
  handleHover() {
    this.img.style.filter = 'drop-shadow(yellow 0px 0px 4px)'
  }

  onLeave = () => {
    this.handleLeave();
  }

  handleLeave() {
    this.img.style.filter = 'drop-shadow(yellow 0px 0px 0px)';
  }

  openMenu = () => {
    // if(!gameState.gameRunning) return;
    console.log('open');
    this.img.removeEventListener('click', this.openMenu);
    this.towerElement.appendChild(this.menu);
    window.setTimeout(() => {
      document.body.addEventListener('click', this.closeMenu);
    }, 100);
  }

  closeMenu = () => {
    console.log('close');
    this.menu.remove();
    document.body.removeEventListener('click', this.closeMenu);
    window.setTimeout(() => {
      this.img.addEventListener('click', this.openMenu);
    }, 100);
  }

  public update = () => {
    const towerCenterX = this.x;
    const towerCenterY = this.y;
    const canShoot = Date.now() - this.lastShotAt > this.attackSpeed;

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
          const fireball = new FireBall(this.x, this.y - 15, this.damage, monster);
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

export class Tower2 extends Tower {
  constructor(x: number, y: number) {
    super(x, y);
    this.radius = 100;
    this.sellCost = 60;
    this.damage = 5;
    this.img.src = tower2;
    // this.menuUpgrade.innerHTML ='';
    this.menuUpgradeImg.src = upgradeLock;
    this.menuUpgradeImg.addEventListener('click', this.closeMenu)
  }
  upgrade = () => {
    this.closeMenu();
    console.log('===DONT UPRGADE!!', this);
    return;
  }
}
export class FreezeTower extends Tower {
  frezeLevel = 3
  constructor(x: number, y: number) {
    super(x, y);
    this.menu.style.left = 0 + 'px'
    this.menu.style.top = -2 + 'px'
    this.x;
    this.y;
    this.damage = 5;
    this.radius = 100;
    this.attackSpeed = 500;
    this.img.src = freeze;
    this.render();
  }

  upgrade = () => {
    if (gameState.gold >= this.upgradeCost) {
      gameState.gold -= this.upgradeCost
      this.reset()  /// удаление этой башни
      const tier2Tower = new FreezeTower2(this.x, this.y)
    }
    this.closeMenu()
  }

  public update = () => {

    const towerCenterX = this.x;
    const towerCenterY = this.y;
    const canShoot = Date.now() - this.lastShotAt > this.attackSpeed;

    if (canShoot) {
      for (let i = 0; i < gameState.monsters.length; i++) {
        const monster = gameState.monsters[i];
        if (monster.freezePoint <= this.frezeLevel) {
          const distance = Math.sqrt(
            Math.pow(monster.x - towerCenterX, 2) +
            Math.pow(monster.y - towerCenterY, 2)
          );
          // console.log('stop shoting');

          if (distance <= this.radius && !monster.isDead) {
            this.lastShotAt = Date.now();
            const frostball = new FrostBall(this.x, this.y - 15, this.damage, monster);
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

export class FreezeTower2 extends FreezeTower {
  constructor(x: number, y: number) {
    super(x, y);
    this.damage = 4;
    this.radius = 110;
    this.frezeLevel = 2;
    this.attackSpeed = 400;
    this.sellCost = 80;
    this.img.src = freeze2;
    // this.menuUpgrade.innerHTML ='';
    this.menuUpgradeImg.src = upgradeLock;
    this.menuUpgradeImg.addEventListener('click', this.closeMenu)
  }
  upgrade = () => {
    this.closeMenu()
    return;
  }
}

export class BombTower extends Tower {
  audio: HTMLAudioElement;
  constructor(x: number, y: number) {
    super(x, y);
    this.x;
    this.y;
    this.upgradeCost = 220;
    this.menuUpgrade.innerHTML = this.upgradeCost.toString();
    this.menuUpgrade.appendChild(this.menuUpgradeImg);
    this.sellCost = 185;
    this.attackSpeed = 2500
    this.damage = 8
    this.radius = 100;
    this.img.src = bomb;
    this.audio = new Audio();
    this.menu.style.top = -13 + 'px'
    this.menu.style.left = 2 + 'px'
    // this.audio.muted = true
    this.audio.src =
      'https://audio.buzzsprout.com/a09dv2jfild2q9szwny8ymo0b3g9?response-content-disposition=inline&';

    this.render();
  }

  upgrade = () => {
    if (gameState.gold >= this.upgradeCost) {
      gameState.gold -= this.upgradeCost
      this.reset()  /// удаление этой башни
      const tier2Tower = new BombTower2(this.x, this.y)
    }
    this.closeMenu()
  }

  public update = () => {
    const towerCenterX = this.x;
    const towerCenterY = this.y;
    const canShoot = Date.now() - this.lastShotAt > this.attackSpeed;

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
            monster.y,
            this.damage,
          );
          this.audio.play();
          gameState.fireBalls.push(bomb);
          break;
        }
      }
    }
  };
}

class BombTower2 extends BombTower {
  constructor(x: number, y: number) {
    super(x, y);
    this.damage = 14;
    this.radius = 115;
    this.img.src = bomb2;
    this.sellCost = 130;
    this.menuUpgrade.innerHTML = '';
    this.menuUpgradeImg.src = upgradeLock;
  }
  upgrade = () => {
    this.closeMenu();
    return;
  }
}

export class BarakTower extends Tower {
  towerRadius: HTMLDivElement;
  rallyPoint: Point;
  public guardCount = 0;
  guardCountLimit = 3;
  public active = true;
  public guardList: Guard[] = [];
  mobRadiusPoint: HTMLDivElement;
  markerSign: HTMLImageElement;
  constructor(x: number, y: number) {
    super(x, y);
    this.x;
    this.y;
    this.rallyPoint = { x: x, y: y };
    this.radius = 100;
    this.img.src = barak1;
    // this.img.style.position = 'absolute';
    this.towerRadius = document.createElement('div');
    this.towerElement.appendChild(this.towerRadius);
    this.towerRadius.style.borderRadius = this.radius + 'px';
    this.towerRadius.style.width = 2 * this.radius + 'px';
    this.towerRadius.style.height = 2 * this.radius + 'px';
    // this.towerRadius.style.display = 'none';
    this.towerRadius.style.border = 'solid aqua';
    this.towerRadius.className = 'radius';

    this.menu.style.top = -10 + 'px';
    this.menu.style.left = 0 + 'px';


    this.markerSign = document.createElement('img');
    this.markerSign.src = flag;
    this.markerSign.className = 'menu';
    this.markerSign.style.left = 67 + 'px'
    this.markerSign.style.top = 50 + 'px'
    this.menu.appendChild(this.markerSign);

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
    this.closeRadius();
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
    const currentRoad = gameState.mapConfig.roads[0].points;
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
  update = () => { }; // ----------НЕ----ТРОГАТЬ----------

  upgrade = () => {
    if (gameState.gold >= this.upgradeCost) {
      gameState.gold -= this.upgradeCost
      this.reset()  /// удаление этой башни
      const tier2Tower = new BarakTower2(this.x, this.y)
    }
    this.closeMenu()
  }

  handleHover() {
    super.handleHover()
    this.guardList.forEach((g) => g.onHover())
  }

  handleLeave() {
    super.handleLeave()
    this.guardList.forEach((g) => g.onLeave())
  }

  openRadius = () => {
    this.closeMenu()
    this.towerElement.appendChild(this.towerRadius);
    // console.log(this.towerRadius);
    this.markerSign.removeEventListener('click', this.openRadius);
    window.setTimeout(() => {
      document.body.addEventListener('click', this.closeRadius);
    }, 100);
  };

  closeRadius = () => {
    this.towerRadius.remove();
    // console.log('phase1');
    document.body.removeEventListener('click', this.closeRadius);
    window.setTimeout(() => {
      this.markerSign.addEventListener('click', this.openRadius);
    }, 100);
  };
  reset() {
    this.active = false;
    this.closeRadius();
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

  render() {
    this.towerElement.style.left = this.x + 'px';
    this.towerElement.style.top = this.y + 'px';
  }
}

class BarakTower2 extends BarakTower {
  constructor(x: number, y: number) {
    super(x, y);
    // this.damage = 10;
    this.radius = 115;
    this.img.src = barak2;
    this.sellCost = 70;
    this.menuUpgrade.innerHTML = '';
    this.menuUpgradeImg.src = upgradeLock;
  }
  upgrade = () => {
    this.closeMenu();
    return;
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
      const guard = new Guard2(this.x, this.y, closestPoint, this, ids[i]);
      // console.log(this.x, this.y);
      this.guardList.push(guard);
      gameState.movables.push(guard);
      // guard.moveTo(closestPoint.x, closestPoint.y);
    }
  };

}
