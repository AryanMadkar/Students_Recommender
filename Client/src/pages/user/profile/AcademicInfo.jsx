// src/components/profile/AcademicInfo.js
import React from 'react';
import InfoRow from './InfoRow';

const AcademicInfo = () => (
  <div className="bg-white rounded-lg shadow-sm p-5">
    <h3 className="text-lg font-bold text-gray-900 mb-2">Academic Information</h3>
    <InfoRow label="Education Stage" value="Ongoing College" />
    <InfoRow label="Current Grade" value="B.Tech - 2nd Year (7.8 CGPA)" />
  </div>
);

export default AcademicInfo;
