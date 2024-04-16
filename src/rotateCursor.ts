export class Rotate {
    canva: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    animationFrame = 0;
    spriteWidth = 107
    spriteHeight = 65;

    x = 0;
    y = 0;

    image: HTMLImageElement;

    constructor(private img: string, private w: number, private h: number) {
      this.canva = document.createElement('canvas');
      document.body.appendChild(this.canva)
      this.canva.className = 'rotate'
      this.canva.style.left = this.x + 'px';
      this.canva.style.top = this.y + 'px';
      this.canva.width = this.w;
      this.canva.height = this.h;
      this.ctx = this.canva.getContext('2d')!;

      this.image = document.createElement('img');
      this.image.src = this.img
      window.setInterval(this.draw, 35)

    }
    updateFrblCrds = (e: MouseEvent) => {
      this.x = e.x
      this.y = e.y
      this.canva.style.left = this.x + 'px';
      this.canva.style.top = this.y + 'px';
    }

    draw = () => {
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

    delete() {
      this.canva.remove()
      document.body.removeEventListener('mousemove', this.updateFrblCrds);
    }
  }