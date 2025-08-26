import React from "react";
import AccountPreferences from "./AccountPreferences";
import Notifications from "./Notifications";
import AdvancedSettings from "./AdvancedSettings";
import DangerZone from "./DangerZone";
import { FiChevronLeft } from "react-icons/fi";

const Settings = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans mb-[6rem]">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <FiChevronLeft className="text-2xl text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-bold text-gray-800 text-center flex-grow">
            Settings
          </h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-10">
          <AccountPreferences />
          <Notifications />
          <AdvancedSettings />
          <DangerZone />
        </div>
      </main>
    </div>
  );
};

export default Settings;
