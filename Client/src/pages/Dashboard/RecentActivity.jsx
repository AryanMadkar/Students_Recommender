import React from 'react';
import { FiCheckCircle, FiEye, FiHeart, FiBookmark, FiDownload } from 'react-icons/fi';
import { motion } from 'framer-motion';

const RecentActivity = () => {
  const activities = [
    { 
      icon: FiCheckCircle, 
      text: 'Completed "Career Aptitude Test"', 
      time: '2 days ago', 
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    { 
      icon: FiEye, 
      text: 'Viewed details for "IIT Bombay"', 
      time: '3 days ago', 
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    { 
      icon: FiHeart, 
      text: 'Saved "Data Scientist" as favorite', 
      time: '1 week ago', 
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200'
    },
    { 
      icon: FiBookmark, 
      text: 'Bookmarked "Software Engineering Guide"', 
      time: '1 week ago', 
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    },
    { 
      icon: FiDownload, 
      text: 'Downloaded "Career Roadmap PDF"', 
      time: '2 weeks ago', 
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200'
    }
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Activity</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">View All</button>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`flex items-start space-x-4 p-4 rounded-xl border ${activity.borderColor} ${activity.bgColor} hover:shadow-md transition-all duration-200`}
          >
            <div className={`p-2 rounded-lg bg-white shadow-sm`}>
              <activity.icon className={`${activity.color} w-5 h-5`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 leading-relaxed">
                {activity.text}
              </p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </motion.div>
        ))}
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full mt-6 py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-xl font-medium transition-colors"
      >
        View Complete Timeline
      </motion.button>
    </div>
  );
};

export default RecentActivity;
