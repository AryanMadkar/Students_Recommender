import React from 'react';
import { FiBookOpen, FiSearch, FiBook, FiEye, FiUsers, FiAward } from 'react-icons/fi';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const actions = [
    { 
      icon: FiBookOpen, 
      label: 'Take Assessment', 
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      description: 'Discover your strengths'
    },
    { 
      icon: FiSearch, 
      label: 'Explore Careers', 
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50 hover:bg-emerald-100',
      description: 'Find your ideal path'
    },
    { 
      icon: FiBook, 
      label: 'Study Materials', 
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      description: 'Access resources'
    },
    { 
      icon: FiEye, 
      label: 'View Reports', 
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 hover:bg-orange-100',
      description: 'Track your progress'
    },
    { 
      icon: FiUsers, 
      label: 'Connect', 
      color: 'from-pink-500 to-pink-600',
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      description: 'Network with peers'
    },
    { 
      icon: FiAward, 
      label: 'Achievements', 
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 hover:bg-yellow-100',
      description: 'View your badges'
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Quick Actions</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative p-4 text-left ${action.bgColor} rounded-xl border border-gray-100 transition-all duration-200 hover:shadow-md overflow-hidden`}
          >
            {/* Background gradient on hover */}
            <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-200`}></div>
            
            <div className="relative z-10">
              <div className="flex items-start space-x-3">
                <div className={`p-2 bg-gradient-to-r ${action.color} rounded-lg shadow-sm`}>
                  <action.icon className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 group-hover:text-gray-800 transition-colors duration-200">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    {action.description}
                  </p>
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
        className="mt-6 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200"
      >
        <p className="text-sm text-gray-600 text-center">
          💡 <span className="font-medium">Pro Tip:</span> Complete assessments to unlock personalized recommendations
        </p>
      </motion.div>
    </div>
  );
};

export default QuickActions;
