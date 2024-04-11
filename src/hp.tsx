import { observer } from 'mobx-react-lite';
import { gameState } from './state';

export const Hp = observer(() => {
  return <div className="hp"> HP = {gameState.hp} </div>;
});
