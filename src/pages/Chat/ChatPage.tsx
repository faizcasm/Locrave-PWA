import React from 'react';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';

const ChatPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Messages</h1>
      <EmptyState
        icon="💬"
        title="No Messages Yet"
        description="Start a conversation with service providers or buyers/sellers"
      />
    </div>
  );
};

export default ChatPage;
