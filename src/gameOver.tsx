import { gameState } from './state';

class Screen {
  inscription: HTMLDivElement;
  screen: HTMLDivElement;
  button: HTMLDivElement;
  constructor() {
    this.inscription = document.createElement('div');
    this.screen = document.createElement('div');
    this.button = document.createElement('div');

    this.screen.appendChild(this.inscription);
    this.screen.appendChild(this.button);
  }
  hide() {
    this.screen.style.display = 'none';
    this.button.style.display = 'none';
    this.inscription.style.display = 'none';
  }
  show() {

    this.screen.style.display = 'initial';
    this.button.style.display = 'initial';
    this.inscription.style.display = 'initial';
  }
}

class NextLevel extends Screen {
  constructor() {
    super();
    this.screen.className = 'nextLvLBG';

    this.inscription.className = 'loser';
    this.inscription.innerHTML = 'Good Job!';

    this.button.className = 'continue';
    this.button.innerHTML = 'CONTINUE';
  }
}

export const nextLvlScreen = new NextLevel();
