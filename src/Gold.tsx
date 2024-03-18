import { observer } from 'mobx-react-lite';
import { gameState } from './state';

export const Gold = observer(() => {
  return <div className="gold">GOLD = {gameState.gold}</div>;
});
