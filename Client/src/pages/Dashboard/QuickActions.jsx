import React from 'react';
import { FiBookOpen, FiSearch, FiBook, FiEye } from 'react-icons/fi';
import { motion } from 'framer-motion';

const QuickActions = () => {
  const actions = [
    { icon: FiBookOpen, label: 'Take Assessment', color: 'bg-blue-50 text-blue-600' },
    { icon: FiSearch, label: 'Explore Careers', color: 'bg-green-50 text-green-600' },
    { icon: FiBook, label: 'Study Materials', color: 'bg-purple-50 text-purple-600' },
    { icon: FiEye, label: 'View Reports', color: 'bg-orange-50 text-orange-600' },
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-4">
        {actions.map((action, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center p-4 rounded-lg border-2 border-gray-100 hover:border-gray-200 transition-all"
          >
            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${action.color}`}>
              <action.icon size={24} />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
