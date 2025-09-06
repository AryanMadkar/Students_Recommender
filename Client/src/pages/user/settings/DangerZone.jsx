import React from "react";
import { useNavigate } from "react-router-dom";
import { FiLogOut, FiTrash2 } from "react-icons/fi";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const DangerZone = () => {
  const { logout, api } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    navigate("/login");
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await api.delete("/api/users/account");
        logout();
        toast.success("Account deleted successfully");
        navigate("/");
      } catch (error) {
        toast.error("Failed to delete account");
        console.error("Delete account error:", error);
      }
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-red-600 mb-4">Danger Zone</h2>
      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center space-x-3">
            <FiLogOut className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Logout</p>
              <p className="text-sm text-red-700">Sign out of your account</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>

        <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
          <div className="flex items-center space-x-3">
            <FiTrash2 className="w-5 h-5 text-red-600" />
            <div>
              <p className="font-medium text-red-900">Delete Account</p>
              <p className="text-sm text-red-700">
                Permanently delete your account and data
              </p>
            </div>
          </div>
          <button
            onClick={handleDeleteAccount}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
};

export default DangerZone;
