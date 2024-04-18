import { createRoot } from 'react-dom/client';

import { App } from './App';
import { Gold } from './Gold';
import { Hp } from './hp';
import { Spells } from './spells';
import { Menu } from './towerMenu';
const root = createRoot(document.getElementById('app')!);

root.render(
  <>
    <App />
    <Spells />
    <Menu />
    <Gold />
    <Hp />
  </>
);
