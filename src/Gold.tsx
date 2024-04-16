import { observer } from 'mobx-react-lite';
import { gameState } from './state';

export const Gold = observer(() => {
  if(!gameState.gameMap) return null;
  return <div className="gold">GOLD = {gameState.gold}</div>;
});
