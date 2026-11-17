import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import './styles.css';
import './showcase.css';
import './thai.css';
import App from './App';

const container = document.getElementById('root');
if (container) {
  createRoot(container).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}
