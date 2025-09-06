import React from "react";
import { useNavigate } from "react-router-dom";
import SettingsItem from "./SettingsItem";
import { FiUser, FiKey, FiLink } from "react-icons/fi";

const AccountPreferences = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Account Preferences
      </h2>
      <div className="space-y-2">
        <SettingsItem
          icon={FiUser}
          title="Edit Profile"
          subtitle="Update your personal details"
          onClick={() => navigate("/profile")}
        />
        <SettingsItem
          icon={FiKey}
          title="Change Password"
          subtitle="Update your login credentials securely"
          onClick={() => navigate("/change-password")}
        />
        <SettingsItem
          icon={FiLink}
          title="Linked Accounts"
          subtitle="Manage connected social and academic accounts"
          onClick={() => navigate("/linked-accounts")}
        />
      </div>
    </div>
  );
};

export default AccountPreferences;
