import React from 'react';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';
import { Card } from '../../components/common/Card/Card';

const EmergencyPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Emergency</h1>
      <Card variant="elevated" padding="lg" style={{ marginBottom: '2rem' }}>
        <p style={{ color: 'var(--color-error)', fontWeight: 600, margin: 0 }}>
          🚨 Emergency alerts allow you to quickly notify nearby community members
        </p>
      </Card>
      <EmptyState
        icon="🚨"
        title="Emergency Feature"
        description="Create emergency posts to alert your community"
      />
    </div>
  );
};

export default EmergencyPage;
