import React from 'react';
import Header from './Header';
import WelcomeBanner from './WelcomeBanner';
import ProgressSummary from './ProgressSummary';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import Recommendations from './Recommendations';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 mb-[3rem]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Header />
        <div className="space-y-6">
          <WelcomeBanner />
          <ProgressSummary />
          <QuickActions />
          <RecentActivity />
          <Recommendations />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
