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

  if ((loading && !dashboardData ) || error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600">
              Please login to access your dashboard.
            </p>
          </div>
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
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          <WelcomeBanner dashboardData={dashboardData} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <ProgressSummary dashboardData={dashboardData} />
              <QuickActions dashboardData={dashboardData} />
            </div>

            <div className="space-y-8">
              <RecentActivity dashboardData={dashboardData} />
            </div>
          </div>

          <Recommendations dashboardData={dashboardData} />
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
