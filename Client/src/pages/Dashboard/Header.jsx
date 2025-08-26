import React from 'react';
import { FiBell, FiUser } from 'react-icons/fi';

const Header = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold text-gray-800">Dashboard</h1>
      <div className="flex items-center space-x-4">
        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <FiBell size={20} />
        </button>
        <button className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
          <FiUser size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
