import { FC } from 'react';
import // road1,
// road2,
'./App';
import { FireBomb } from './fireballs';
import { Rekrut } from './guards etc';
import { gameState } from './state';

export const Spells: FC = () => {
  
  const guardDemo = document.createElement('img')
  guardDemo.className = 'demo'
  guardDemo.src = 'https://i.ibb.co/Y2rWZVj/demo.png'

  let fire:Rotate;
    class Rotate{
      canva:HTMLCanvasElement;
      ctx: CanvasRenderingContext2D;
      animationFrame = 0;
      spriteWidth = 107
      spriteHeight = 65;

      x =0;
      y =0;

      image:HTMLImageElement;

      constructor(private img:string, private w: number, private h:number){
        this.canva = document.createElement('canvas');
        document.body.appendChild(this.canva)
        this.canva.className ='rotate'
        this.canva.style.left = this.x + 'px';
        this.canva.style.top = this.y + 'px';
        this.canva.width = this.w ;
        this.canva.height = this.h ;
        this.ctx = this.canva.getContext('2d')!;

        this.image = document.createElement('img');
        this.image.src = this.img
        window.setInterval(this.draw, 35)
      
      }
       updateFrblCrds =(e:MouseEvent)=>{
        this.x = e.x
        this.y = e.y
        this.canva.style.left = this.x + 'px';
        this.canva.style.top = this.y + 'px';
      }

      draw =()=>{
        this.animationFrame = (this.animationFrame + 1) % 39; // Переход к следующему спрайту
        // console.log('===', this.animationFrame, frameIndex, this.frameSeq);
        this.ctx.clearRect(0, 0, this.w, this.h);
        this.ctx.drawImage(
          this.image,
          this.animationFrame * this.spriteWidth,
          0,
          this.spriteWidth,
          this.spriteHeight,
          0,
          0,
          this.spriteWidth,
          this.spriteHeight
        ); // Отрисовка текущего спрайта
        this.ctx.resetTransform();
        // this.ctx.drawImage(img, 0, 0);
      }

      delete(){
        console.log('delete')
        this.canva.remove()
        document.body.removeEventListener('mousemove', this.updateFrblCrds);
      }
  }
  const SetUp = () => {
    if (gameState.gameRunning) {
      const canCast = Date.now() - gameState.lastRainAt > 200;
      if (canCast) {
        document.body.style.cursor = 'none';
        
        fire = new Rotate('https://i.ibb.co/0yDzTwt/spritesheet-1.png',105,65)
        document.body.addEventListener('mousemove', fire.updateFrblCrds)
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
        document.body.appendChild(guardDemo)
        document.body.addEventListener('mousemove', updateGrdCrds)
        window.setTimeout(() => {
          document.body.addEventListener('click', createGuards);
        }, 200);
        gameState.lastGuardAt = Date.now();
      }
    }
  };

  const updateGrdCrds =(e:MouseEvent)=>{
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
  const createFire = (e: MouseEvent) => {
    document.body.removeEventListener('click', createFire);
    fire.delete()
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
