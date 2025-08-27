import React from "react";
import { Link } from "react-router-dom";
import {
  FiBookOpen,
  FiSearch,
  FiBook,
  FiEye,
  FiUsers,
  FiAward,
} from "react-icons/fi";
import { motion } from "framer-motion";

const QuickActions = ({ dashboardData }) => {
  const overview = dashboardData?.overview || {};

  const actions = [
    {
      icon: FiBookOpen,
      label: "Take Assessment",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50 hover:bg-blue-100",
      description: "Discover your strengths",
      link: "/assessments",
      priority: overview.assessmentsCompleted === 0 ? "high" : "normal",
    },
    {
      icon: FiSearch,
      label: "Explore Careers",
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50 hover:bg-emerald-100",
      description: "Find your ideal path",
      link: "/careers",
      priority: "normal",
    },
    {
      icon: FiBook,
      label: "Find Colleges",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50 hover:bg-purple-100",
      description: "Explore institutions",
      link: "/colleges",
      priority: "normal",
    },
    {
      icon: FiEye,
      label: "View Reports",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50 hover:bg-orange-100",
      description: "Track your progress",
      link: "/dashboard/analytics",
      priority: "normal",
    },
    {
      icon: FiUsers,
      label: "Recommendations",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50 hover:bg-pink-100",
      description: "Get personalized advice",
      link: "/recommendations",
      priority: "normal",
    },
    {
      icon: FiAward,
      label: "Achievements",
      color: "from-yellow-500 to-yellow-600",
      bgColor: "bg-yellow-50 hover:bg-yellow-100",
      description: "View your badges",
      link: "/dashboard/achievements",
      priority: "normal",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
        <div className="text-sm text-gray-500">Get started</div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {actions.map((action, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
          >
            <Link
              to={action.link}
              className={`relative block p-4 rounded-xl transition-all duration-200 ${action.bgColor} group`}
            >
              {action.priority === "high" && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
              )}

              <div
                className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
              >
                <action.icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-700">
                {action.label}
              </h3>

              <p className="text-sm text-gray-600 group-hover:text-gray-500">
                {action.description}
              </p>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Pro Tip */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.8 }}
        className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl p-4 border border-amber-100"
      >
        <div className="flex items-start space-x-3">
          <span className="text-2xl">💡</span>
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Pro Tip</p>
            <p className="text-sm text-gray-600">
              {overview.assessmentsCompleted === 0
                ? "Start with assessments to unlock personalized recommendations"
                : overview.profileCompletion < 100
                ? "Complete your profile to get better career matches"
                : "Explore colleges and careers based on your assessment results"}
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default QuickActions;
