// import { monsters } from './App';
import { Mob } from './mob';
import { Castle, Cave } from './Start-End';
import { gameState } from './state';
import { RoadPoints } from './types';

export class Road {
  public canSwitchMap = false;
  constructor(
    public startPoint: Cave,
    public endpoint: Castle,
    public points: RoadPoints
  ) {}
    createMob = () => {
      // console.log('====', this);
      const mob = new Mob(this.points);
      gameState.monsters.push(mob);
    };
}
