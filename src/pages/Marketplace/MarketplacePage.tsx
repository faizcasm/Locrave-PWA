import React from 'react';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';

const MarketplacePage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Marketplace</h1>
      <EmptyState
        icon="🛒"
        title="Marketplace Coming Soon"
        description="Buy and sell items in your local community"
      />
    </div>
  );
};

export default MarketplacePage;
