import { gameState } from "./state";

const flags:Flag[] =[];

export class GlobalMap{
    mapImg:HTMLImageElement;

    public audio: HTMLAudioElement;

    flag0: Flag;
    flag1: Flag;
    flag2: Flag;
    constructor(){

        this.mapImg = document.createElement('img');
        this.mapImg.src ='https://i.ibb.co/8YdC1NP/Image-1363-at-frame-1.png';
        this.mapImg.className = 'map';
        this.mapImg.style.top = 0 + "px";
        document.body.appendChild(this.mapImg);

        this.flag0 = new Flag(0, 90, 420);
        this.flag1 = new Flag(1, 184, 336);
        this.flag2 = new Flag(2, 147, 240);

        this.audio = document.createElement('audio');
        this.audio.src ='https://audio.buzzsprout.com/26vftk4ffox14ws8166xls9nxog3?response-content-disposition=inline&';
        this.audio.volume = 0.5;
        this.audio.loop = true;
        this.audio.muted = true;
        this.mapImg.onload = () =>{
            console.log('play');
            this.audio.play();
        }
    }
    public deleteMap=()=>{
        this.mapImg.remove();
    }

    public createMap=()=>{
        document.body.appendChild(this.mapImg);

        this.flag0 = new Flag(0, 90, 420);
        this.flag1 = new Flag(1, 184, 336);
        this.flag2 = new Flag(2, 147, 240);
    }

}

class Flag{
    img:HTMLImageElement;
    constructor(private id:number, public x:number, public y:number){
        this.img = document.createElement('img');
        this.img.src = 'https://i.ibb.co/8dVGc5j/Image-619-at-frame-1.png';
        this.img.className = 'demo';
        document.body.appendChild(this.img);

        this.img.style.left = x + 'px';
        this.img.style.top = y + 'px';

        this.img.addEventListener('mouseover', this.onHover);
        this.img.addEventListener('mouseleave', this.onLeave);
        this.img.addEventListener('click', this.onClick);

        flags.push(this);
    }

    delete =() =>{
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
        gameState.createMap(this.id);
        flags.forEach((flag)=>{
            flag.delete();
        })
      }
}
