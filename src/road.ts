// import { monsters } from './App';
import { Mob } from './mob';
import { Castle, Cave } from './Start-End';
import { gameState } from './state';
import { Point } from './types';

export class Road {
  public canSwitchMap = false;
  constructor(
    public startPoint: Cave,
    public endpoint: Castle,
    public points: Point[]
  ) {
    // document.body.appendChild(this.img);
    // this.wave1();
  }
  public wave1 = () => {
    for (let i = 0; i < 3; i++) {
      window.setTimeout(this.createMob, i * 500);
    }
    window.setTimeout(this.wave2, 6000);
  };
  public wave2 = () => {
    this.canSwitchMap = true;
    for (let i = 0; i < 4; i++) {
      window.setTimeout(this.createMob, i * 500);
    }
    // window.setTimeout(this.wave3, 7000);
  };
  public wave3 = () => {
    for (let i = 0; i < 4; i++) {
      window.setTimeout(this.createMob, i * 500);
    }
    window.setTimeout(this.wave4, 6000);
  };
  public wave4 = () => {
    for (let i = 0; i < 3; i++) {
      window.setTimeout(this.createMob, i * 500);
    }
    window.setTimeout(this.wave5, 5000);
  };
  public wave5 = () => {
    for (let i = 0; i < 3; i++) {
      window.setTimeout(this.createMob, i * 200);
    }
    window.setTimeout(this.wave6, 5000);
  };
  public wave6 = () => {
    for (let i = 0; i < 7; i++) {
      window.setTimeout(this.createMob, i * 500);
    }
    this.canSwitchMap = true;
  };
  createMob = () => {
    // console.log('====', this);
    const mob = new Mob(this.points);
    gameState.monsters.push(mob);
  };
}
