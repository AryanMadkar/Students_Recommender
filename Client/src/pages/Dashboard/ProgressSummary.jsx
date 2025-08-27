import React from "react";
import { motion } from "framer-motion";
import { FiCheckCircle, FiUser, FiTarget, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";

const ProgressSummary = ({ dashboardData }) => {
  const overview = dashboardData?.overview || {};
  const stats = dashboardData?.stats || {};

  const progressData = [
    {
      icon: FiCheckCircle,
      title: "Assessments Completed",
      value: overview.assessmentsCompleted || 0,
      total: "12",
      percentage: Math.round(((overview.assessmentsCompleted || 0) / 12) * 100),
      color: "from-emerald-500 to-teal-500",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      icon: FiUser,
      title: "Profile Completion",
      value: overview.profileCompletion || 0,
      total: "100",
      percentage: overview.profileCompletion || 0,
      color: "from-blue-500 to-indigo-500",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      icon: FiTarget,
      title: "Recommendations Generated",
      value: stats.recommendationsGenerated || 0,
      total: "5",
      percentage: Math.round(((stats.recommendationsGenerated || 0) / 5) * 100),
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
  ];

  const getNextMilestone = () => {
    if ((overview.assessmentsCompleted || 0) < 3) {
      return `Complete ${
        3 - (overview.assessmentsCompleted || 0)
      } more assessments to unlock personalized recommendations`;
    }
    if ((overview.profileCompletion || 0) < 100) {
      return "Complete your profile for better recommendations";
    }
    return "Great progress! Keep exploring new opportunities";
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.1 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Your Progress</h2>
        <FiTrendingUp className="w-6 h-6 text-green-500" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {progressData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 + index * 0.1 }}
            className="relative"
          >
            <div className="flex items-center space-x-4">
              <div
                className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}
              >
                <item.icon className={`w-6 h-6 ${item.textColor}`} />
              </div>

              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {item.title}
                </p>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </span>
                  {item.title.includes("Profile") ? (
                    <span className="text-sm text-gray-500">%</span>
                  ) : (
                    <span className="text-sm text-gray-500">/{item.total}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-500">Progress</span>
                <span className="text-xs font-medium text-gray-700">
                  {Math.min(item.percentage, 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(item.percentage, 100)}%` }}
                  transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  className={`h-2 bg-gradient-to-r ${item.color} rounded-full`}
                />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Next Milestone */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100"
      >
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
            <FiTarget className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-1">Next Milestone</h3>
            <p className="text-sm text-gray-600 mb-3">{getNextMilestone()}</p>
            <Link
              to="/assessments"
              className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              Take Action
              <FiTarget className="w-4 h-4 ml-1" />
            </Link>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProgressSummary;
