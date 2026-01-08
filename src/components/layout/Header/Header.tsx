import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useNotificationStore } from '../../../stores/notificationStore';
import { useUIStore } from '../../../stores/uiStore';
import { useOnlineStatus } from '../../../hooks/useOnlineStatus';
import { Avatar } from '../../common/Avatar/Avatar';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  const { user } = useAuthStore();
  const { unreadCount } = useNotificationStore();
  const { toggleSidebar, toggleTheme, theme } = useUIStore();
  const isOnline = useOnlineStatus();

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.left}>
          <button
            className={styles.menuButton}
            onClick={toggleSidebar}
            aria-label="Toggle menu"
          >
            ☰
          </button>
          <Link to="/feed" className={styles.logo}>
            <img src="/logo.png" alt="Locrave" className={styles.logoImage} />
            <span className={styles.logoText}>Locrave</span>
          </Link>
        </div>

        <div className={styles.right}>
          {!isOnline && (
            <div className={styles.offlineBadge} title="You are offline">
              📡 Offline
            </div>
          )}
          
          <button
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? '🌙' : '☀️'}
          </button>

          <Link to="/chat" className={styles.iconButton} aria-label="Messages">
            💬
          </Link>

          <Link to="/settings" className={styles.iconButton} aria-label="Notifications">
            🔔
            {unreadCount > 0 && (
              <span className={styles.badge}>{unreadCount > 99 ? '99+' : unreadCount}</span>
            )}
          </Link>

          <Link to="/profile" aria-label="Profile">
            <Avatar src={user?.avatar} name={user?.name || 'User'} size="sm" />
          </Link>
        </div>
      </div>
    </header>
  );
};
