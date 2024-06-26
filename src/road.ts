// import { monsters } from './App';
import { Mob } from './mob';
import { gameState } from './state';
import { RoadPoints } from './types';

export class Road {
  public canSwitchMap = false;
  constructor(
    public points: RoadPoints
  ) {}
    createMob = () => {
      // console.log('====', this);
      const mob = new Mob(this.points);
      gameState.monsters.push(mob);
    };
}
