import * as React from 'react';
import { FireBomb } from './fireballs';
import { Rekrut } from './guards etc';
import { gameState, globalMap } from './state';
import { GlobalMap } from './globalMap';
import { observer } from 'mobx-react-lite';
import { Rotate } from './rotateCursor';

import demo from "./assets/spells/demo.png";
import fireCursor from "./assets/spells/fireCursor.png";

const guardDemo = document.createElement('img')
guardDemo.className = 'demo'
guardDemo.src = demo;

export const Spells = observer(() => { 

  const fireCursorRef = React.useRef<Rotate | null>(null);

  const createFireCursor = () => {
    if (gameState.gameRunning) {
      const canCast = Date.now() - gameState.lastRainAt > 200;
      if (canCast) {
        document.body.style.cursor = 'none';
          const f = new Rotate(fireCursor, 105, 65)
        fireCursorRef.current = f;
        console.log('set fire', f)
        document.body.addEventListener('mousemove', f.updateFrblCrds)
        window.setTimeout(() => {
          document.body.addEventListener('click', createFireRain);
        }, 200);
        gameState.lastRainAt = Date.now();
      }
    }
  };

  const createGuardCursor = () => {
    if (gameState.gameRunning) {
      const canCast = Date.now() - gameState.lastGuardAt > 10000;
      if (canCast) {
        document.body.style.cursor = 'crosshair';
        document.body.appendChild(guardDemo)
        document.body.addEventListener('mousemove', updateGrdCrds)
        window.setTimeout(() => {
          document.body.addEventListener('click', createGuards);
        }, 200);
        gameState.lastGuardAt = Date.now();
      }
    }
  };

  const updateGrdCrds = (e: MouseEvent) => {
    guardDemo.style.left = e.x + 'px';
    guardDemo.style.top = e.y + 'px';
  }

  const createGuards = (e: MouseEvent) => {
    document.body.removeEventListener('click', createGuards);
    document.body.removeEventListener('mousemove', updateGrdCrds);
    guardDemo.remove()
    document.body.style.cursor = 'auto';
    for (let i = 0; i < 2; i++) {
      const guard = new Rekrut(e.x + i * 20, e.y);
      gameState.movables.push(guard);
    }
  };

  const createFireRain = (e: MouseEvent) => {
    document.body.removeEventListener('click', createFireRain);
    console.log('====',fireCursorRef.current);
    if(fireCursorRef.current) fireCursorRef.current.delete();
    document.body.style.cursor = 'auto';
    for (let i = 0; i < 5; i++) {
      window.setTimeout(() => {
        let randomValue = Math.random();
        let randomNumber = randomValue * 30 - 20;
        const fireball = new FireBomb(e.x + randomNumber, e.y + randomNumber);
        gameState.movables.push(fireball);
        // console.log(e.x, e.y);
      }, i * 150);
    }
  };
  const pause = () => {
    gameState.gameRunning = false;
  };
  
  const map = () => {
    globalMap.createMap()
  };

  if (!gameState.gameMap) return null;
  return (
    <div>
      <div className="buttonDiv">
        <button onClick={createFireCursor}> RAIN </button>
        <button onClick={createGuardCursor}> GUARDS </button>
        <button onClick={map}>map</button>
        <button onClick={pause}>pause</button>
        {/* <button onClick={() => gameState.createMap(0)}> MAP1 </button> */}
      </div>
    </div>
  );
});
