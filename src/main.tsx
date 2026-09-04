import React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/tokens.css';
import { App } from './app/App';

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
