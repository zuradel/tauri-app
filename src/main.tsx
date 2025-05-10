import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Prevent right-click context menu
document.addEventListener(
  'contextmenu',
  (e) => {
    e.preventDefault();
    return false;
  },
  { capture: true }
);

// Prevent F12 and other developer tools keyboard shortcuts
document.addEventListener(
  'keydown',
  (e) => {
    // Prevent F12
    if (e.key === 'F12') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+Shift+I / Cmd+Option+I (alternative to F12)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'I') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+Shift+J / Cmd+Option+J (Chrome console)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'J') {
      e.preventDefault();
      return false;
    }

    // Prevent Ctrl+Shift+C / Cmd+Option+C (Chrome inspector)
    if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
      e.preventDefault();
      return false;
    }
  },
  { capture: true }
);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
