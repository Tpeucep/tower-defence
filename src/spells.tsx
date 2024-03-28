import { FC } from 'react';
import // road1,
// road2,
'./App';
import { FireBomb } from './fireballs';
import { Rekrut } from './guards etc';
import { gameState } from './state';

export const Spells: FC = () => {
  const SetUp = () => {
    if (gameState.gameRunning) {
      const canCast = Date.now() - gameState.lastRainAt > 20;
      if (canCast) {
        document.body.style.cursor = 'crosshair';
        window.setTimeout(() => {
          document.body.addEventListener('click', createFire);
        }, 200);
        gameState.lastRainAt = Date.now();
      }
    }
  };
  const SetUpGuards = () => {
    if (gameState.gameRunning) {
      const canCast = Date.now() - gameState.lastGuardAt > 10000;
      if (canCast) {
        document.body.style.cursor = 'crosshair';
        window.setTimeout(() => {
          document.body.addEventListener('click', createGuards);
        }, 200);
        gameState.lastGuardAt = Date.now();
      }
    }
  };
  const createGuards = (e: MouseEvent) => {
    document.body.removeEventListener('click', createGuards);
    document.body.style.cursor = 'auto';
    for (let i = 0; i < 2; i++) {
      const guard = new Rekrut(e.x + i * 20, e.y);
      gameState.movables.push(guard);
    }
  };
  const createFire = (e: MouseEvent) => {
    document.body.removeEventListener('click', createFire);
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
    // gameState.resetMap();
    gameState.gameRunning = false;
    if (!gameState.gameMap) return;
    gameState.gameMap.audio.pause();
    // gameState.finishMap();
    // nextLvlScreen.show();
    // nextLvlScreen.button.onclick = () => {
    //   nextLvlScreen.hide();
    //   gameState.createMap(0);
    // };
  };

  return (
    <div>
      <div className="buttonDiv">
        <button onClick={SetUp}> RAIN </button>
        <button onClick={SetUpGuards}> GUARDS </button>
        <button onClick={pause}>pause</button>
        {/* <button onClick={() => gameState.createMap(0)}> MAP1 </button> */}
        <button onClick={() => gameState.createMap(2)}> MAP3 </button>
      </div>
    </div>
  );
};
