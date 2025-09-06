import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const QuickLinkItem = ({ icon: Icon, title, onClick }) => (
  <div 
    onClick={onClick}
    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
  >
    <div className="flex items-center space-x-3">
      <Icon className="w-5 h-5 text-gray-600" />
      <span className="font-medium text-gray-900">{title}</span>
    </div>
    <FiChevronRight className="w-4 h-4 text-gray-400" />
  </div>
);

export default QuickLinkItem;
