import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuthStore } from '../../../stores/authStore';
import { useUIStore } from '../../../stores/uiStore';
import { UserRole } from '../../../types/global.types';
import styles from './Sidebar.module.css';

const navItems = [
  { path: '/feed', label: 'Feed', icon: '📰', roles: [] },
  { path: '/services', label: 'Services', icon: '🛠️', roles: [] },
  { path: '/marketplace', label: 'Marketplace', icon: '🛒', roles: [] },
  { path: '/emergency', label: 'Emergency', icon: '🚨', roles: [] },
  { path: '/chat', label: 'Messages', icon: '💬', roles: [] },
  { path: '/profile', label: 'Profile', icon: '👤', roles: [] },
  { path: '/settings', label: 'Settings', icon: '⚙️', roles: [] },
  {
    path: '/moderation',
    label: 'Moderation',
    icon: '🛡️',
    roles: [UserRole.MODERATOR, UserRole.ADMIN],
  },
];

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  const handleLogout = async () => {
    await logout();
  };

  const filteredNavItems = navItems.filter(
    (item) => item.roles.length === 0 || (user && item.roles.includes(user.role))
  );

  return (
    <aside className={`${styles.sidebar} ${sidebarOpen ? styles.open : ''}`}>
      <nav className={styles.nav}>
        {filteredNavItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navLink} ${isActive ? styles.active : ''}`
            }
            onClick={() => {
              // Close sidebar on mobile after navigation
              if (window.innerWidth <= 768) {
                setSidebarOpen(false);
              }
            }}
          >
            <span className={styles.icon}>{item.icon}</span>
            <span className={styles.label}>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className={styles.footer}>
        <button className={styles.logoutButton} onClick={handleLogout}>
          <span className={styles.icon}>🚪</span>
          <span className={styles.label}>Logout</span>
        </button>
      </div>
    </aside>
  );
};
