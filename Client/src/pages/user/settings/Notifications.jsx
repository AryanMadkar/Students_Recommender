// src/components/settings/Notifications.js
import React from "react";
import ToggleItem from "./ToggleItem";
import { FiBell, FiMail, FiClock } from "react-icons/fi";

const Notifications = () => (
  <section>
    <h2 className="text-xl font-bold text-gray-800 mb-4">Notifications</h2>
    <div className="space-y-3">
      <ToggleItem
        icon={<FiBell />}
        title="Push Notifications"
        subtitle="Receive alerts and updates for key activities"
        enabled={true}
      />
      <ToggleItem
        icon={<FiMail />}
        title="Email Notifications"
        subtitle="Get important information and digests"
        enabled={false}
      />
      <ToggleItem
        icon={<FiClock />}
        title="Assessment Reminders"
        subtitle="Never miss an upcoming assessment"
        enabled={true}
      />
    </div>
  </section>
);

export default Notifications;
