import React from 'react';
import { motion } from 'framer-motion';

const ProgressSummary = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Progress</h3>
      <div className="grid grid-cols-2 gap-6">
        <div className="text-center">
          <div className="flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mx-auto mb-3">
            <div className="text-2xl font-bold text-blue-600">5</div>
            <div className="text-sm text-gray-500">/12</div>
          </div>
          <p className="text-sm text-gray-600">Assessments Completed</p>
        </div>
        <div className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 64 64">
              <circle
                cx="32"
                cy="32"
                r="28"
                stroke="#e5e7eb"
                strokeWidth="4"
                fill="none"
              />
              <motion.circle
                cx="32"
                cy="32"
                r="28"
                stroke="#3b82f6"
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={175.93}
                initial={{ strokeDashoffset: 175.93 }}
                animate={{ strokeDashoffset: 175.93 * (1 - 0.75) }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-blue-600">75%</span>
            </div>
          </div>
          <p className="text-sm text-gray-600">Profile Completion</p>
        </div>
      </div>
    </div>
  );
};

export default ProgressSummary;
