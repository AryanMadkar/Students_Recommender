import React from 'react';
import Header from './Header';
import WelcomeBanner from './WelcomeBanner';
import ProgressSummary from './ProgressSummary';
import QuickActions from './QuickActions';
import RecentActivity from './RecentActivity';
import Recommendations from './Recommendations';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <WelcomeBanner />
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8">
          {/* Left Column - Progress & Actions */}
          <div className="xl:col-span-1 space-y-6">
            <ProgressSummary />
            <QuickActions />
          </div>

          {/* Right Column - Activity & Recommendations */}
          <div className="xl:col-span-3 space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <RecentActivity />
              <div className="lg:col-span-1">
                <Recommendations />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
