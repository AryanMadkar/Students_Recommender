// src/components/settings/SettingsItem.js
import React from 'react';
import { FiChevronRight } from 'react-icons/fi';

const SettingsItem = ({ icon, title, subtitle }) => (
  <div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm hover:bg-gray-50 cursor-pointer">
    <div className="flex items-center">
      <div className="text-blue-500 mr-4 text-xl">{icon}</div>
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
    <FiChevronRight className="text-gray-400" />
  </div>
);

export default SettingsItem;
