import React, { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FiChevronLeft } from "react-icons/fi";
import ProfileHeader from "./ProfileHeader";
import PersonalInfo from "./PersonalInfo";
import AcademicInfo from "./AcademicInfo";
import QuickLinks from "./QuickLinks";
import { useAuth } from "../../../context/AuthContext";

const ProfilePage = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    console.log(user);
  }, [user, isAuthenticated]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center space-x-4 mb-8">
          <Link
            to="/dashboard"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <FiChevronLeft className="w-6 h-6" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
            <p className="text-gray-600">Manage your personal information</p>
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          <ProfileHeader user={user} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <PersonalInfo user={user} />
              <AcademicInfo user={user} />
            </div>
            <div>
              <QuickLinks />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
