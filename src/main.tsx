import React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/tokens.css';
import './ui/polish.css';
import { App } from './app/App';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}

// Register service worker for offline play
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  });
}
