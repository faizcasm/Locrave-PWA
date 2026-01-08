import React from 'react';
import { EmptyState } from '../../components/common/EmptyState/EmptyState';

const ServicesPage: React.FC = () => {
  return (
    <div>
      <h1 style={{ marginBottom: '2rem' }}>Local Services</h1>
      <EmptyState
        icon="🛠️"
        title="Services Coming Soon"
        description="Find and book local services in your community"
      />
    </div>
  );
};

export default ServicesPage;
