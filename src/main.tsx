import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { registerSW } from 'virtual:pwa-register';

// Register service worker
if ('serviceWorker' in navigator && import.meta.env.VITE_ENABLE_PWA === 'true') {
  registerSW({
    onNeedRefresh() {
      if (confirm('New content available. Reload?')) {
        window.location.reload();
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  });
}

// Request notification permission
if ('Notification' in window && import.meta.env.VITE_ENABLE_NOTIFICATIONS === 'true') {
  Notification.requestPermission().then((permission) => {
    console.log('Notification permission:', permission);
  });
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Root element not found');
}

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
