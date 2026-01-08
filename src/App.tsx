import React, { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import AppRoutes from './routes';
import { ErrorBoundary } from './components/common/ErrorBoundary/ErrorBoundary';
import { useUIStore } from './stores/uiStore';
import { useAuthStore } from './stores/authStore';
import { socketClient } from './lib/socket/client';
import { useNotificationStore } from './stores/notificationStore';
import { useFeedStore } from './stores/feedStore';
import { useChatStore } from './stores/chatStore';
import './styles/global.css';

function App() {
  const { setTheme, setOnlineStatus } = useUIStore();
  const { isAuthenticated } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const { loadOfflinePosts } = useFeedStore();
  const { addMessage } = useChatStore();

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('locrave-ui');
    if (savedTheme) {
      try {
        const { state } = JSON.parse(savedTheme);
        if (state?.theme) {
          setTheme(state.theme);
        }
      } catch (error) {
        console.error('Failed to parse saved theme:', error);
      }
    }
  }, [setTheme]);

  // Handle online/offline status
  useEffect(() => {
    const handleOnline = () => setOnlineStatus(true);
    const handleOffline = () => setOnlineStatus(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [setOnlineStatus]);

  // Initialize socket connection when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      socketClient.connect();

      // Setup socket listeners
      socketClient.on('notification:new', (notification) => {
        addNotification(notification);
      });

      socketClient.on('chat:message', (message) => {
        addMessage(message);
      });

      // Load offline data
      loadOfflinePosts();

      return () => {
        socketClient.off('notification:new');
        socketClient.off('chat:message');
      };
    } else {
      socketClient.disconnect();
    }
  }, [isAuthenticated, addNotification, addMessage, loadOfflinePosts]);

  // Handle PWA install prompt
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      useUIStore.getState().setInstallPromptEvent(e);
      useUIStore.getState().setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  return (
    <ErrorBoundary>
      <AppRoutes />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: 'var(--color-bg-primary)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
          },
        }}
      />
    </ErrorBoundary>
  );
}

export default App;
