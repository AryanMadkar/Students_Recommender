// src/components/profile/ProfileHeader.js
import React from 'react';
import { FiEdit2 } from 'react-icons/fi';

const ProfileHeader = () => (
  <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
    <img
      className="w-24 h-24 rounded-full object-cover"
      src="https://i.imgur.com/example-avatar.png" // Replace with actual user avatar URL
      alt="Rohan Sharma"
    />
    <h2 className="text-2xl font-bold text-gray-900 mt-4">Rohan Sharma</h2>
    <p className="text-sm text-gray-600 mt-1">
      Empowering your academic and career journey with PathPilot
    </p>
    <button className="mt-4 flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
      <FiEdit2 className="mr-2 text-blue-500" />
      Edit Profile
    </button>
  </div>
);

export default ProfileHeader;
