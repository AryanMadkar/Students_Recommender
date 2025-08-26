// src/components/profile/InfoRow.js
import React from 'react';
import { FiEdit2 } from 'react-icons/fi';

const InfoRow = ({ label, value, isEditable = true }) => (
  <div className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-medium text-gray-800">{value}</p>
    </div>
    {isEditable && (
      <FiEdit2 className="text-blue-500 cursor-pointer hover:text-blue-600" />
    )}
  </div>
);

export default InfoRow;
