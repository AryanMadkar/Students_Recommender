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

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mx-6 mb-4"
        >
          {error}
        </motion.div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="space-y-6">
          <WelcomeBanner dashboardData={dashboardData} />
          <ProgressSummary dashboardData={dashboardData} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <QuickActions dashboardData={dashboardData} />
            <RecentActivity dashboardData={dashboardData} />
          </div>

          <Recommendations dashboardData={dashboardData} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
