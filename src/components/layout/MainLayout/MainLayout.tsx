import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';
import { Sidebar } from '../Sidebar/Sidebar';
import { useUIStore } from '../../../stores/uiStore';
import styles from './MainLayout.module.css';

export const MainLayout: React.FC = () => {
  const { sidebarOpen, setSidebarOpen } = useUIStore();

  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.container}>
        <Sidebar />
        <main className={`${styles.main} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.content}>
            <Outlet />
          </div>
        </main>
      </div>
      {/* Backdrop for mobile */}
      {sidebarOpen && (
        <div
          className={styles.backdrop}
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
    </div>
  );
};
