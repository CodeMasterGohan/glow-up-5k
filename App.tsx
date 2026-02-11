import React, { useState, Suspense, lazy } from 'react';
import { Layout } from './components/Layout';

// Lazy load views for code splitting
const PlanView = lazy(() => import('./views/PlanView').then(module => ({ default: module.PlanView })));
const StatsView = lazy(() => import('./views/StatsView').then(module => ({ default: module.StatsView })));
const RacesView = lazy(() => import('./views/RacesView').then(module => ({ default: module.RacesView })));

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
      <Suspense fallback={
        <div className="flex items-center justify-center h-full min-h-[50vh] w-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      }>
        {renderContent()}
      </Suspense>
    </Layout>
  );
};

export default App;
