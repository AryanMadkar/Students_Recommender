import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const WelcomeBanner = ({ dashboardData }) => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const userData = dashboardData?.overview || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-8 text-white relative overflow-hidden"
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -translate-y-32 translate-x-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white rounded-full translate-y-24 -translate-x-24"></div>
      </div>

      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-2xl lg:text-3xl font-bold mb-2"
            >
              {greeting}, {user.name || "there"}! 👋
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-lg text-blue-100 mb-6 max-w-2xl"
            >
              Ready to advance your career? Let's explore new opportunities and
              achieve your goals together.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 mb-6"
            >
              <div className="flex items-center space-x-2">
                <FiStar className="w-5 h-5 text-yellow-300" />
                <span className="text-sm">
                  Profile Completion: {userData.profileCompletion || 0}%
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <FiTrendingUp className="w-5 h-5 text-green-300" />
                <span className="text-sm">
                  Assessments: {userData.assessmentsCompleted || 0} completed
                </span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <Link
                to="/assessments"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors group"
              >
                <span>Get Started</span>
                <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          </div>

          {/* Stats Cards */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-8 lg:mt-0 lg:ml-8 grid grid-cols-2 gap-4 min-w-0 lg:min-w-[280px]"
          >
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">
                {userData.assessmentsCompleted || 0}
              </div>
              <div className="text-sm text-blue-100">Assessments</div>
            </div>

            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-xl p-4 text-center">
              <div className="text-2xl font-bold">
                {userData.profileCompletion || 0}%
              </div>
              <div className="text-sm text-blue-100">Profile</div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
