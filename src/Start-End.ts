import { HpBar } from './hpBar';

export class Castle {
  castleElement: HTMLDivElement;
  hp = 25;
  maxHp: number;
  hpBar: HpBar;
  constructor(public x: number, public y: number) {
    const img = new Image();
    this.castleElement = document.createElement('div');
    this.castleElement.className = 'castle';
    img.style.width = 80 + 'px';
    img.src = 'https://cdn-icons-png.flaticon.com/256/619/619097.png';
    this.castleElement.style.left = x + 'px';
    this.castleElement.style.top = y + 'px';
    img.draggable = false;
    document.body.appendChild(this.castleElement);
    this.castleElement.appendChild(img);
    this.hpBar = new HpBar(this.castleElement, 80, 5, '50%', '-20%');
    this.maxHp = this.hp;
  }
  drawHP(value: number) {
    this.hpBar.setValue(value);
  }
  delete = () => {
    this.castleElement.remove();
    this.hpBar.remove();
  };
}
// export const castle2 = new Castle(310, 575);

export class Cave {
  caveElement: HTMLImageElement;
  constructor(public x: number, public y: number) {
    this.caveElement = document.createElement('img');
    this.caveElement.src =
      'https://cdn-icons-png.flaticon.com/256/2559/2559319.png';
    this.caveElement.style.left = x + 'px';
    this.caveElement.style.top = y + 'px';
    this.caveElement.className = 'cave';
    document.body.appendChild(this.caveElement);
  }
  delete = () => {
    this.caveElement.remove();
  };
}

// export const cave2 = new Cave(736, 205);
