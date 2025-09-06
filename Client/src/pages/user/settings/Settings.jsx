import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { FiChevronLeft } from "react-icons/fi";
import AccountPreferences from "./AccountPreferences";
import Notifications from "./Notifications";
import AdvancedSettings from "./AdvancedSettings";
import DangerZone from "./DangerZone";

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account preferences</p>
            </div>
          </div>
        </div>

        {/* Settings Sections */}
        <div className="space-y-6">
          <AccountPreferences />
          <Notifications />
          <AdvancedSettings />
          <DangerZone />
        </div>
      </div>
    </div>
  );
};

export default Settings;
