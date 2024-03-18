import { observer } from 'mobx-react-lite';
import { FC } from 'react';
import { gameState } from './state';

import './style.css';

export const App: FC = observer(() => {
  return (
    <div>
      {gameState.mapFailed && (
        <div className="gameOverBG">
          <div className="loser"> you loh, ой lose </div>
          <div
            className="continue"
            onClick={() => {
              gameState.createMap(gameState.currentId);
            }}
          >
            RESTART
          </div>
        </div>
      )}
      {gameState.mapFinished && (
        <div className="nextLvLBG">
          <div className="loser"> Good Job! </div>
          <div
            className="continue"
            onClick={() => {
              gameState.createMap(gameState.currentId + 1);
            }}
          >
            CONTINUE
          </div>
        </div>
      )}
      {gameState.lastMapFinished && (
        <div className="nextLvLBG">
          <div className="loser"> You win the game! </div>
          <div
            className="continue"
            onClick={() => {
              // gameState.createMap(0);
            }}
          >
            GG WP
          </div>
        </div>
      )}
    </div>
  );
});

export function getRandID() {
  return Math.floor(Math.random() * 2000);
}

document.body.addEventListener('mousemove', onMouseMove);

export let mouseX = 0;
export let mouseY = 0;
function onMouseMove(e: MouseEvent) {
  mouseX = e.clientX;
  mouseY = e.clientY;
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

/////////////////////////////////////////------MAP------///////////////////////////////////////////

// export let gameMap = new Map(mapConfigs[0]);
// export const map2 = new Map(mapConfigs[1]);

//////////////////////////////////////////-----------ROADS-----------///////////////////////////////////////

// export const monsters: Mob[] = [];
// export const fireBalls: IFireball[] = [];
// export const towers: Tower[] = [];
// export const movables: Movable[] = [];
// export const maps: Map[] = [];

// export const roadMap1: Point[] = [
//   { x: cave1.x, y: cave1.y },
//   { x: 325, y: 200 },
//   { x: 290, y: 240 },
//   { x: 170, y: 290 },
//   { x: 160, y: 350 },
//   { x: 220, y: 420 },
//   { x: 380, y: 415 },
//   { x: 480, y: 440 },
//   { x: 590, y: 350 },
//   // { x: castle1.x, y: castle1.y },
// ];
// export const roadMap2: Point[] = [
//   { x: cave2.x, y: cave2.y },
//   { x: 730, y: 210 },
//   { x: 525, y: 210 },
//   { x: 485, y: 90 },
//   { x: 390, y: 90 },
//   { x: 340, y: 210 },
//   { x: 180, y: 230 },
//   { x: 180, y: 310 },
//   { x: 260, y: 340 },
//   { x: 360, y: 315 },
//   { x: 450, y: 330 },
//   { x: 450, y: 410 },
//   { x: 320, y: 450 },
//   { x: castle2.x, y: castle2.y },
// ];

// export const basements1: Basement[] = [];
// let base1 = new Basement(200, 200);
// basements1.push(base1);
// let base2 = new Basement(100, 317);
// basements1.push(base2);
// let base3 = new Basement(238, 341);
// basements1.push(base3);
// let base4 = new Basement(377, 470);
// basements1.push(base4);
// let base5 = new Basement(147, 455);
// basements1.push(base5);

// export const basements2: Basement[] = [];
// let base6 = new Basement(436, 185);
// basements2.push(base6);
// let base7 = new Basement(295, 153);
// basements2.push(base7);
// let base8 = new Basement(245, 277);
// basements2.push(base8);
// let base9 = new Basement(377, 377);
// basements2.push(base9);
// let base10 = new Basement(91, 255);
// basements2.push(base10);

/////////////////////////////////////////---------CANVAS--------///////////////////////////////////////////

// const canva = document.getElementById('myCanvas') as HTMLCanvasElement;
// export const ctx = canva.getContext('2d')!;
// window.addEventListener('resize', drawRoad);
// drawRoad();
// function drawRoad() {
//   canva.width = window.innerWidth;
//   canva.height = innerHeight;
//   ctx.strokeStyle = 'yellow';
//   ctx.lineWidth = 2;
//   ctx.beginPath();
//   ctx.moveTo(730, 210);
//   ctx.lineTo(525, 210);
//   ctx.lineTo(485, 90);
//   ctx.lineTo(390, 90);
//   ctx.lineTo(340, 210);
//   ctx.lineTo(180, 230);
//   ctx.lineTo(180, 310);
//   ctx.lineTo(260, 340);
//   ctx.lineTo(360, 315);
//   ctx.lineTo(450, 330);
//   ctx.lineTo(450, 410);
//   ctx.lineTo(313, 460);
//   ctx.lineTo(313, 650);
//   ctx.stroke();
// }

// const spawnInterval2 = window.setTimeout(road2.createMob, 2000);
