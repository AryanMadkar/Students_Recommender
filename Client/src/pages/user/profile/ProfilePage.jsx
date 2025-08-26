// src/pages/ProfilePage.js
import React from "react";
import { FiChevronLeft } from "react-icons/fi";
import ProfileHeader from "./ProfileHeader";
import PersonalInfo from "./PersonalInfo";
import AcademicInfo from "./AcademicInfo";
import QuickLinks from "./QuickLinks";

const ProfilePage = () => {
  return (
    <div className="bg-gray-100 min-h-screen font-sans mb-[6rem]">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <FiChevronLeft className="text-2xl text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-bold text-gray-800 text-center flex-grow -ml-6">
            My Profile
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="space-y-6">
          <ProfileHeader />
          <PersonalInfo />
          <AcademicInfo />
          <QuickLinks />
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
