import React from 'react';
import ReactDOM from 'react-dom/client';
import './ui/tokens.css';

export const App: React.FC = () => {
  return (
    <div style={{ padding: '24px' }}>
      <h1>Robo Paths</h1>
      <p>A toy that teaches programming.</p>
    </div>
  );
};

const rootEl = document.getElementById('root');
if (rootEl) {
  ReactDOM.createRoot(rootEl).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
}
