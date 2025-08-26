// src/components/profile/QuickLinkItem.js
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const QuickLinkItem = ({ icon, title }) => (
  <div className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
    <div className="flex items-center">
      <div className="text-blue-500 mr-3 text-lg">{icon}</div>
      <span className="font-semibold text-gray-700">{title}</span>
    </div>
    <FiChevronRight className="text-gray-400" />
  </div>
);

export default QuickLinkItem;
