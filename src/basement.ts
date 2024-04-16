import { BarakTower, BombTower, FreezeTower, Tower } from './towers';
import { gameState } from './state';

import basementSrc from "./assets/basement/basement.png";
import frezEl from "./assets/basement/freezEl.png";
import bombEl from "./assets/basement/bombEl.png";
import firEl from "./assets/basement/firEl.png";
import barakEl from "./assets/basement/barakEl.png";

export class Basement {
  basementEl: HTMLImageElement;
  FrzCost = 60;
  FireCost = 70;
  BaraCost = 70;
  BombCost = 125;
  freezeEl!: HTMLImageElement;
  fireEL!: HTMLImageElement;
  barakEl!: HTMLImageElement;
  BombEl!: HTMLImageElement;
  open: boolean = false;
  constructor(private x: number, private y: number) {
    this.basementEl = document.createElement('img');
    this.basementEl.className = 'base';
    this.basementEl.src = basementSrc;
    this.basementEl.draggable = false;
    this.basementEl.style.left = this.x + 'px';
    this.basementEl.style.top = this.y + 'px';
    // this.basementEl.innerHTML = 'TOWER';
    // this.basementEl.onclick = this.onClick;
    this.basementEl.addEventListener('click', this.onClick);

    document.body.appendChild(this.basementEl);
  }
  onClick = () => {
    if(!gameState.gameRunning) return;
    this.open = true;
    // if (this.open > 1) {
    if (!this.open) {
      return;
    }
    
    this.freezeEl = document.createElement('img');
    this.freezeEl.className = 'snow';
    if(gameState.gold < this.FrzCost) this.freezeEl.style.filter ='grayscale(1)';
    this.freezeEl.draggable = false;
    this.freezeEl.src = frezEl;
    this.freezeEl.style.left = this.x - 30 + 'px';
    this.freezeEl.style.top = this.y - 30 + 'px';
    document.body.appendChild(this.freezeEl);
    this.freezeEl.onclick = this.createSnowTower;

    this.fireEL = document.createElement('img');
    this.fireEL.className = 'fire';
    if(gameState.gold < this.FireCost) this.fireEL.style.filter ='grayscale(1)';
    this.fireEL.draggable = false;
    this.fireEL.src = firEl;
    this.fireEL.style.left = this.x + 30 + 'px';
    this.fireEL.style.top = this.y - 30 + 'px';
    document.body.appendChild(this.fireEL);
    this.fireEL.onclick = this.createFireTower;

    this.barakEl = document.createElement('img');
    this.barakEl.className = 'barak';
    if(gameState.gold < this.BaraCost) this.barakEl.style.filter ='grayscale(1)';
    this.barakEl.draggable = false;
    this.barakEl.src = barakEl;
    this.barakEl.style.left = this.x + 30 + 'px';
    this.barakEl.style.top = this.y + 27 + 'px';
    document.body.appendChild(this.barakEl);
    this.barakEl.onclick = this.createBarakTower;

    this.BombEl = document.createElement('img');
    this.BombEl.className = 'bomb';
    if(gameState.gold < this.BombCost) this.BombEl.style.filter ='grayscale(1)';
    this.BombEl.draggable = false;
    this.BombEl.src = bombEl;
    this.BombEl.style.left = this.x - 30 + 'px';
    this.BombEl.style.top = this.y + 27 + 'px';
    document.body.appendChild(this.BombEl);
    this.BombEl.onclick = this.createBombTower;

    window.setTimeout(() => {
      document.body.addEventListener('click', this.onClickOutside);
    }, 100);
  };

  onClickOutside = () => {
    document.body.removeEventListener('click', this.onClickOutside);
    // console.log('onClickOutside');
    this.closeMenu();
  };

  closeMenu() {
    if (!this.open) return;
    this.open = false;
    this.freezeEl.remove();
    this.fireEL.remove();
    this.barakEl.remove();
    this.BombEl.remove();
  }

  createFireTower = () => {
    if (gameState.gold < this.FireCost) {
      this.closeMenu();
      return;
    }
    // gold -= this.FireCost;
    gameState.gold -= this.FireCost;
    this.basementEl.remove();
    this.closeMenu();
    // console.log(this);
    const newFireTower = new Tower(this.x, this.y);
    gameState.towers.push(newFireTower);
  };
  createSnowTower = () => {
    if (gameState.gold < this.FrzCost) {
      this.closeMenu();
      return;
    }
    gameState.gold -= this.FrzCost;
    this.basementEl.remove();
    this.closeMenu();
    // console.log(this);
    const newFreezeTower = new FreezeTower(this.x, this.y);
    gameState.towers.push(newFreezeTower);
  };
  createBarakTower = () => {
    if (gameState.gold < this.BaraCost) {
      this.closeMenu();
      return;
    }
    gameState.gold -= this.FireCost;
    this.basementEl.remove();
    this.closeMenu();
    // console.log(this);
    const newBarakTower = new BarakTower(this.x, this.y);
    gameState.towers.push(newBarakTower);
  };
  createBombTower = () => {
    if (gameState.gold < this.BombCost) {
      this.closeMenu();
      return;
    }
    gameState.gold -= this.BombCost;
    this.basementEl.remove();
    this.closeMenu();
    // console.log(this);
    const newBombTower = new BombTower(this.x, this.y);
    gameState.towers.push(newBombTower);
  };
  reset() {
    this.closeMenu();
    this.basementEl.remove();
  }
}
