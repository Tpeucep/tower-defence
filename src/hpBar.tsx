export class HpBar {
  hpBar: HTMLDivElement;
  hpRemain: HTMLDivElement;
  constructor(container: HTMLDivElement, width: number, height: number, x:string, y: string)  {
    // console.log(container);
    this.hpBar = document.createElement('div');
    // this.hpBar.style.top = -20 + 'px';

    this.hpBar.style.left = x ;
    this.hpBar.style.top = y;
    this.hpBar.style.width = width + 'px';
    this.hpBar.style.height = height + 'px';
    this.hpBar.className = 'hpBar';
    container.appendChild(this.hpBar);

    this.hpRemain = document.createElement('div');
    this.hpRemain.className = 'hpLost';
    this.hpBar.appendChild(this.hpRemain);
  }
  setValue(value: number) {
    // console.log('setvalue', value);
    this.hpRemain.style.width = value * 100 + '%';
  }
  remove() {
    this.hpBar.remove();
    this.hpRemain.remove();
  }
}
