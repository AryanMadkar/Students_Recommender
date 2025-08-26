// src/components/settings/AdvancedSettings.js
import React from "react";
import SettingsItem from "./SettingsItem";
import { FiFileText, FiInfo } from "react-icons/fi";

const AdvancedSettings = () => (
  <section>
    <h2 className="text-xl font-bold text-gray-800 mb-4">Advanced Settings</h2>
    <div className="space-y-3">
      <SettingsItem
        icon={<FiFileText />}
        title="Privacy Policy"
        subtitle="Learn about how we handle your data"
      />
      <SettingsItem
        icon={<FiInfo />}
        title="About PathPilot"
        subtitle="Learn more about our mission and vision"
      />
    </div>
  </section>
);

export default AdvancedSettings;
