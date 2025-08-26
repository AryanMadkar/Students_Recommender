// src/components/profile/PersonalInfo.js
import React from 'react';
import InfoRow from './InfoRow';

const PersonalInfo = () => (
  <div className="bg-white rounded-lg shadow-sm p-5">
    <h3 className="text-lg font-bold text-gray-900 mb-2">Personal Information</h3>
    <InfoRow label="Full Name" value="Rohan Sharma" />
    <InfoRow label="Email" value="rohan.sharma@example.com" />
    <InfoRow label="Phone Number" value="+91 98765 43210" />
    <InfoRow label="Date of Birth" value="05/11/2003" isEditable={false} />
  </div>
);

export default PersonalInfo;
