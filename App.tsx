import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { PlanView } from './views/PlanView';
import { StatsView } from './views/StatsView';
import { RacesView } from './views/RacesView';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('plan');

  const renderContent = () => {
    switch (activeTab) {
      case 'plan': return <PlanView />;
      case 'stats': return <StatsView />;
      case 'races': return <RacesView />;
      default: return <PlanView />;
    }
  };

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;