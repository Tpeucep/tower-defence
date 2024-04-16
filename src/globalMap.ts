import { gameState, globalMap } from "./state";

import map from "./assets/globalMap/map.png";
import flag from "./assets/globalMap/flag.png";

const flags: Flag[] = [];

export class GlobalMap {

  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;

  mapImg: HTMLImageElement;

  public audio: HTMLAudioElement;

  flag0: Flag;
  flag1: Flag;
  flag2: Flag;
  constructor() {

    this.mapImg = document.createElement('img');
    this.mapImg.src = map;
    this.mapImg.className = 'map';
    this.mapImg.style.top = 0 + "px";
    document.body.appendChild(this.mapImg);

    this.flag0 = new Flag(0, 90, 420);
    this.flag1 = new Flag(1, 184, 336);
    this.flag2 = new Flag(2, 147, 240);

    this.audio = document.createElement('audio');
    this.audio.src = 'https://audio.buzzsprout.com/26vftk4ffox14ws8166xls9nxog3?response-content-disposition=inline&';
    this.audio.volume = 0.5;
    this.audio.loop = true;
    this.audio.muted = true;
    this.mapImg.onload = () => {
      console.log('play');
      this.audio.play();
    }

    this.canvas = document.createElement('canvas');
    this.canvas.className = 'myCanvas'
    document.body.appendChild(this.canvas);
    this.canvas.width = 700;
    this.canvas.height = 600;
    // console.log(this.canvas.width, this.canvas.height)
    
    this.ctx = this.canvas.getContext('2d')!;
    
    // this.createMap()
    this.createPath()
  }

  public createPath=()=>{

    console.log('PATHHHFINDER')

    this.ctx.setLineDash([10, 7]);
    this.ctx.beginPath();
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 5;
    this.ctx.moveTo(flags[0].x + 1, flags[0].y +30); // Устанавливаем начальную точку
    // this.ctx.lineTo(189, 363);    
    this.ctx.bezierCurveTo(139,363,159,403,flags[1].x,flags[1].y +30 ) // Рисуем линию до конечной точки
    this.ctx.stroke();    

    this.ctx.beginPath();
    this.ctx.moveTo(flags[1].x,flags[1].y+25) // Устанавливаем начальную точку
    // this.ctx.lineTo(147, 263);     // Рисуем линию до конечной точки
    // this.ctx.arc(100,445,100,0, 360)
    this.ctx.bezierCurveTo(129,323,139,343,flags[2].x,flags[2].y+30)
    this.ctx.stroke();  
  }

  public deleteMap = () => {
    this.mapImg.remove();
    console.log('Path' , this.ctx);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    console.log('Cleared Path' , this.ctx);
  }

  public createMap = () => {
    gameState.resetMap()
    document.body.appendChild(this.mapImg);

    this.flag0 = new Flag(0, 90, 420);
    this.flag1 = new Flag(1, 184, 336);
    this.flag2 = new Flag(2, 147, 240);
    
    this.createPath()
  }

}

class Flag {
  img: HTMLImageElement;
  constructor(private id: number, public x: number, public y: number) {
    this.img = document.createElement('img');
    this.img.src = flag;
    this.img.className = 'demo';
    document.body.appendChild(this.img);

    this.img.style.left = x + 'px';
    this.img.style.top = y + 'px';

    this.img.addEventListener('mouseover', this.onHover);
    this.img.addEventListener('mouseleave', this.onLeave);
    this.img.addEventListener('click', this.onClick);

    flags.push(this);
  }

  delete = () => {
    console.log('FLAGSSSSS ' + flags.length)
    this.img.remove();
  }

  onHover = () => {
    this.handleHover()
  }
  handleHover() {
    this.img.style.filter = 'drop-shadow(yellow 0px 0px 4px)'
  }

  onLeave = () => {
    this.handleLeave()
  }

  handleLeave() {
    this.img.style.filter = 'drop-shadow(yellow 0px 0px 0px)'
  }

  onClick = () => {
    globalMap.deleteMap()
    gameState.createMap(this.id);
    flags.forEach((flag) => {
      flag.delete();
    })
  }
}
