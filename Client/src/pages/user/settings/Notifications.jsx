import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useApp } from "../../../context/AppContext";
import ToggleItem from "./ToggleItem";
import { FiBell, FiMail, FiMonitor } from "react-icons/fi";
import toast from "react-hot-toast";

const Notifications = () => {
  const { api } = useAuth();
  const { userPreferences, updateUserPreferences } = useApp();
  const [loading, setLoading] = useState(false);

  const updateSetting = async (key, value) => {
    setLoading(true);
    try {
      const updatedPreferences = {
        ...userPreferences,
        [key]: value,
      };
      
      const result = await updateUserPreferences(updatedPreferences);
      if (result?.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("Failed to update settings");
      console.error("Failed to update notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Notifications</h3>
      
      <ToggleItem
        icon={FiBell}
        title="Push Notifications"
        subtitle="Receive notifications on your device"
        enabled={userPreferences.notifications}
        onChange={(value) => updateSetting("notifications", value)}
        disabled={loading}
      />
      
      <ToggleItem
        icon={FiMail}
        title="Email Updates"
        subtitle="Get updates via email"
        enabled={userPreferences.emailUpdates}
        onChange={(value) => updateSetting("emailUpdates", value)}
        disabled={loading}
      />
      
      <ToggleItem
        icon={FiMonitor}
        title="Dark Theme"
        subtitle="Use dark theme interface"
        enabled={userPreferences.theme === "dark"}
        onChange={(value) => updateSetting("theme", value ? "dark" : "light")}
        disabled={loading}
      />
    </div>
  );
};

export default Notifications;
