import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import { Card } from '../../components/common/Card/Card';
import { Avatar } from '../../components/common/Avatar/Avatar';
import { Button } from '../../components/common/Button/Button';

const ProfilePage: React.FC = () => {
  const { user } = useAuthStore();

  if (!user) return null;

  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Profile</h1>
      <Card variant="elevated" padding="lg">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <Avatar src={user.avatar} name={user.name || 'User'} size="xl" />
          <h2>{user.name || 'Anonymous'}</h2>
          <p style={{ color: 'var(--color-text-secondary)' }}>{user.phone}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <span style={{
              padding: '0.25rem 0.75rem',
              background: 'var(--color-primary)',
              color: 'white',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.875rem',
              fontWeight: 600,
            }}>
              {user.role}
            </span>
            {user.isVerified && (
              <span style={{
                padding: '0.25rem 0.75rem',
                background: 'var(--color-success)',
                color: 'white',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.875rem',
                fontWeight: 600,
              }}>
                ✓ Verified
              </span>
            )}
          </div>
          <Button style={{ marginTop: '1rem' }}>Edit Profile</Button>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
