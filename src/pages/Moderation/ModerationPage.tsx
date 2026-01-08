import React from 'react';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';

const ModerationPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Moderation</h1>
      <EmptyState
        icon="🛡️"
        title="Moderation Dashboard"
        description="Review reports and manage community content"
      />
    </div>
  );
};

export default ModerationPage;
