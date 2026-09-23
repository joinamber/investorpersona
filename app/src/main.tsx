import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
// Only the weights the design loads (400/600/800); 700 falls back to 800 as in the prototype.
import '@fontsource/archivo/400.css';
import '@fontsource/archivo/600.css';
import '@fontsource/archivo/800.css';
import './modernist.css';
import './app.css';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
