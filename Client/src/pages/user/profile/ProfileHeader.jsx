import React from "react";
import { FiEdit2 } from "react-icons/fi";

const ProfileHeader = ({ user, onEdit }) => (
  <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-8 mb-6">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-6">
        <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
          <span className="text-2xl font-bold">
            {(user?.personalInfo?.name || user?.name || "U")
              .charAt(0)
              .toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {user?.personalInfo?.name || user?.name || "User"}
          </h1>
          <p className="text-blue-100 mb-1">
            {user?.personalInfo?.email || user?.email}
          </p>
          <p className="text-blue-100">
            Empowering your academic and career journey with PathPilot
          </p>
        </div>
      </div>
      {onEdit && (
        <button
          onClick={onEdit}
          className="flex items-center space-x-2 px-4 py-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-colors"
        >
          <FiEdit2 className="w-4 h-4" />
          <span>Edit</span>
        </button>
      )}
    </div>
  </div>
);

export default ProfileHeader;
