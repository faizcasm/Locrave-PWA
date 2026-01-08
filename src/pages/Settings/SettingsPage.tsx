import React from 'react';
import { Card } from '../../components/common/Card/Card';
import { Button } from '../../components/common/Button/Button';
import { useUIStore } from '../../stores/uiStore';
import { useAuthStore } from '../../stores/authStore';

const SettingsPage: React.FC = () => {
  const { theme, toggleTheme } = useUIStore();
  const { user } = useAuthStore();

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Settings</h1>
      
      <Card variant="elevated" padding="lg" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Appearance</h3>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span>Theme: {theme === 'light' ? 'Light' : 'Dark'}</span>
          <Button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </Button>
        </div>
      </Card>

      <Card variant="elevated" padding="lg" style={{ marginBottom: '1rem' }}>
        <h3 style={{ marginTop: 0 }}>Notifications</h3>
        <p style={{ color: 'var(--color-text-secondary)' }}>
          Notification settings coming soon
        </p>
      </Card>

      <Card variant="elevated" padding="lg">
        <h3 style={{ marginTop: 0 }}>Account</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <p style={{ margin: 0 }}>Phone: {user?.phone}</p>
          <p style={{ margin: 0 }}>Role: {user?.role}</p>
          <p style={{ margin: 0, color: 'var(--color-text-secondary)' }}>
            More account settings coming soon
          </p>
        </div>
      </Card>
    </div>
  );
};

export default SettingsPage;
