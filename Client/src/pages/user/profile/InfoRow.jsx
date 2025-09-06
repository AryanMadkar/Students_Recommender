import React from 'react';
import { FiEdit2 } from 'react-icons/fi';

const InfoRow = ({ label, value, isEditable = true }) => (
  <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
    <div className="flex-1">
      <dt className="text-sm font-medium text-gray-500 mb-1">{label}</dt>
      <dd className="text-gray-900">{value}</dd>
    </div>
    {isEditable && (
      <button className="text-gray-400 hover:text-gray-600 ml-4">
        <FiEdit2 className="w-4 h-4" />
      </button>
    )}
  </div>
);

export default InfoRow;
