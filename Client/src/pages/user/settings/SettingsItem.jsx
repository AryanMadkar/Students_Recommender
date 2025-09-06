import React from "react";
import { FiChevronRight } from "react-icons/fi";

const SettingsItem = ({ icon: Icon, title, subtitle, onClick }) => (
  <div
    onClick={onClick}
    className="flex items-center justify-between p-4 hover:bg-gray-50 cursor-pointer rounded-lg transition-colors"
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 text-gray-600">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-medium text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600">{subtitle}</p>
      </div>
    </div>
    <FiChevronRight className="w-5 h-5 text-gray-400" />
  </div>
);

export default SettingsItem;
