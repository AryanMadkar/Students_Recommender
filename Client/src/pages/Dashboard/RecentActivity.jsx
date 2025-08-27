import React from 'react';
import { FiCheckCircle, FiEye, FiHeart, FiBookmark, FiDownload, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RecentActivity = ({ dashboardData }) => {
  const recentActivity = dashboardData?.recentActivity || [];

  const getActivityIcon = (type) => {
    switch (type) {
      case 'assessment_completed':
        return FiCheckCircle;
      case 'college_viewed':
        return FiEye;
      case 'career_saved':
        return FiHeart;
      case 'resource_bookmarked':
        return FiBookmark;
      case 'report_downloaded':
        return FiDownload;
      default:
        return FiClock;
    }
  };

  const getActivityColor = (type) => {
    switch (type) {
      case 'assessment_completed':
        return {
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200'
        };
      case 'college_viewed':
        return {
          color: 'text-blue-600',
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200'
        };
      case 'career_saved':
        return {
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        };
      case 'resource_bookmarked':
        return {
          color: 'text-purple-600',
          bgColor: 'bg-purple-50',
          borderColor: 'border-purple-200'
        };
      case 'report_downloaded':
        return {
          color: 'text-orange-600',
          bgColor: 'bg-orange-50',
          borderColor: 'border-orange-200'
        };
      default:
        return {
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200'
        };
    }
  };

  const formatRelativeTime = (date) => {
    const now = new Date();
    const activityDate = new Date(date);
    const diffInMinutes = Math.floor((now - activityDate) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutes ago`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return `${days} day${days > 1 ? 's' : ''} ago`;
    }
  };

  // Default activities if no real data
  const defaultActivities = [
    {
      type: 'assessment_completed',
      title: 'Welcome to PathPilot!',
      date: new Date(),
      score: null
    },
    {
      type: 'college_viewed',
      title: 'Explore colleges and careers to get started',
      date: new Date(),
      score: null
    }
  ];

  const activities = recentActivity.length > 0 ? recentActivity : defaultActivities;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.3 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
        <FiClock className="w-5 h-5 text-gray-400" />
      </div>

      <div className="space-y-4">
        {activities.slice(0, 5).map((activity, index) => {
          const Icon = getActivityIcon(activity.type);
          const colors = getActivityColor(activity.type);

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 * index }}
              className={`flex items-start space-x-4 p-4 rounded-xl border ${colors.borderColor} ${colors.bgColor} hover:shadow-sm transition-shadow`}
            >
              <div className={`w-10 h-10 ${colors.bgColor} rounded-lg flex items-center justify-center border ${colors.borderColor}`}>
                <Icon className={`w-5 h-5 ${colors.color}`} />
              </div>
              
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 mb-1">
                  {activity.title}
                </p>
                
                {activity.score && (
                  <p className="text-xs text-gray-600 mb-1">
                    Score: {activity.score}%
                  </p>
                )}
                
                <p className="text-xs text-gray-500">
                  {formatRelativeTime(activity.date)}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {activities.length === 0 && (
        <div className="text-center py-8">
          <FiClock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No recent activity yet</p>
          <p className="text-sm text-gray-400 mt-1">
            Start taking assessments to see your activity here
          </p>
        </div>
      )}

      {activities.length > 5 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-6"
        >
          <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
            View All Activity
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default RecentActivity;
