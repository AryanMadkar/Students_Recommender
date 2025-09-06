import React, { useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import ToggleItem from "./ToggleItem";
import { FiBell, FiMail, FiClock } from "react-icons/fi";
import toast from "react-hot-toast";

const Notifications = () => {
  const { api } = useAuth();
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    assessmentReminders: true,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotificationSettings();
  }, []);

  const fetchNotificationSettings = async () => {
    try {
      const response = await api.get("/api/users/notification-settings");
      if (response.data.success) {
        setSettings(response.data.data);
      }
    } catch (error) {
      console.error("Failed to fetch notification settings:", error);
    }
  };

  const updateSetting = async (key, value) => {
    setLoading(true);
    try {
      const response = await api.put("/api/users/notification-settings", {
        [key]: value,
      });
      if (response.data.success) {
        setSettings((prev) => ({ ...prev, [key]: value }));
        toast.success("Settings updated successfully");
      }
    } catch (error) {
      toast.error("Failed to update settings");
      console.error("Failed to update notification settings:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Notifications
      </h2>
      <div className="space-y-2">
        <ToggleItem
          icon={FiBell}
          title="Push Notifications"
          subtitle="Receive alerts and updates for key activities"
          enabled={settings.pushNotifications}
          onChange={(value) => updateSetting("pushNotifications", value)}
        />
        <ToggleItem
          icon={FiMail}
          title="Email Notifications"
          subtitle="Get important information and digests"
          enabled={settings.emailNotifications}
          onChange={(value) => updateSetting("emailNotifications", value)}
        />
        <ToggleItem
          icon={FiClock}
          title="Assessment Reminders"
          subtitle="Never miss an upcoming assessment"
          enabled={settings.assessmentReminders}
          onChange={(value) => updateSetting("assessmentReminders", value)}
        />
      </div>
    </div>
  );
};

export default Notifications;
