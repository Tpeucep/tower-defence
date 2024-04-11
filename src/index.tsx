import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { App } from './App';
import { Gold } from './Gold';
import { Hp } from './hp';
import { Spells } from './spells';
const root = createRoot(document.getElementById('app')!);

root.render(
  <StrictMode>
    <App />
    <Spells />
    <Gold />
    <Hp />
  </StrictMode>
);
