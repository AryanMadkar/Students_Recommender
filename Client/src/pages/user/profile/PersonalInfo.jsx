import React from 'react';
import InfoRow from './InfoRow';
import { FiUser } from 'react-icons/fi';

const PersonalInfo = ({ user, isEditing, onEdit }) => (
  <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold text-gray-900 flex items-center">
        <FiUser className="w-5 h-5 mr-2" />
        Personal Information
      </h2>
    </div>
    <div className="space-y-4">
      <InfoRow 
        label="Full Name" 
        value={user?.personalInfo?.name || user?.name || 'Not provided'} 
        isEditable={true}
      />
      <InfoRow 
        label="Email" 
        value={user?.personalInfo?.email || user?.email || 'Not provided'} 
        isEditable={true}
      />
      <InfoRow 
        label="Phone" 
        value={user?.personalInfo?.phone || 'Not provided'} 
        isEditable={true}
      />
      <InfoRow 
        label="City" 
        value={user?.personalInfo?.city || 'Not provided'} 
        isEditable={true}
      />
      <InfoRow 
        label="State" 
        value={user?.personalInfo?.state || 'Not provided'} 
        isEditable={true}
      />
    </div>
  </div>
);

export default PersonalInfo;
