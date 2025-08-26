import React from 'react';
import { motion } from 'framer-motion';
import { FiCheckCircle, FiUser, FiTarget, FiTrendingUp } from 'react-icons/fi';

const ProgressSummary = () => {
  const progressData = [
    {
      icon: FiCheckCircle,
      title: 'Assessments Completed',
      value: '8',
      total: '12',
      percentage: 67,
      color: 'from-emerald-500 to-teal-500',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      icon: FiUser,
      title: 'Profile Completion',
      value: '85',
      total: '100',
      percentage: 85,
      color: 'from-blue-500 to-indigo-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      icon: FiTarget,
      title: 'Goals Achieved',
      value: '3',
      total: '5',
      percentage: 60,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Progress Summary</h3>
        <div className="flex items-center space-x-1 text-green-600">
          <FiTrendingUp className="h-4 w-4" />
          <span className="text-sm font-medium">+12%</span>
        </div>
      </div>

      <div className="space-y-6">
        {progressData.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className={`p-2 ${item.bgColor} rounded-lg`}>
                  <item.icon className={`h-5 w-5 ${item.textColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-600">
                    {item.value}{item.title.includes('Profile') ? '%' : `/${item.total}`}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-sm font-semibold ${item.textColor}`}>
                  {item.percentage}%
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.percentage}%` }}
                  transition={{ delay: index * 0.2 + 0.3, duration: 0.8, ease: "easeOut" }}
                  className={`h-full bg-gradient-to-r ${item.color} rounded-full relative`}
                >
                  <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl border border-indigo-100"
      >
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <FiTarget className="h-5 w-5 text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Next Milestone</p>
            <p className="text-xs text-gray-600">Complete 2 more assessments to unlock premium features</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressSummary;
