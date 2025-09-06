import React, { useEffect } from "react";
import { motion } from "framer-motion";
import Header from "./Header";
import WelcomeBanner from "./WelcomeBanner";
import ProgressSummary from "./ProgressSummary";
import QuickActions from "./QuickActions";
import RecentActivity from "./RecentActivity";
import Recommendations from "./Recommendations";
import { useApp } from "../../context/AppContext";
import { useAuth } from "../../context/AuthContext";

const Dashboard = () => {
  const { dashboardData, loading, error, clearError } = useApp();
  const { user } = useAuth();

  useEffect(() => {
    if (error) {
      const timer = setTimeout(clearError, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);

  if ((loading && !dashboardData) || !user || error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Welcome Banner */}
          <WelcomeBanner dashboardData={dashboardData} />

          {/* Progress Summary */}
          <ProgressSummary dashboardData={dashboardData} />

          {/* Quick Actions and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <QuickActions dashboardData={dashboardData} />
            <RecentActivity dashboardData={dashboardData} />
          </div>

          {/* Recommendations */}
          <Recommendations dashboardData={dashboardData} />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
