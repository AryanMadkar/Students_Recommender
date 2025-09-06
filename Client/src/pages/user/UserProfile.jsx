import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiEdit2,
  FiSave,
  FiX,
  FiUser,
  FiMail,
  FiPhone,
  FiMapPin,
  FiBook,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const UserProfile = () => {
  const { user, isAuthenticated, api, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    personalInfo: {
      name: "",
      email: "",
      phone: "",
      city: "",
      state: "",
    },
    academicInfo: {
      educationStage: "",
      class10: {
        board: "",
        percentage: "",
        year: "",
      },
      class12: {
        board: "",
        percentage: "",
        year: "",
        stream: "",
      },
    },
  });

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user) {
      setFormData({
        personalInfo: {
          name: user.personalInfo?.name || user.name || "",
          email: user.personalInfo?.email || user.email || "",
          phone: user.personalInfo?.phone || "",
          city: user.personalInfo?.city || "",
          state: user.personalInfo?.state || "",
        },
        academicInfo: {
          educationStage: user.educationStage || "",
          class10: {
            board: user.academicInfo?.class10?.board || "",
            percentage: user.academicInfo?.class10?.percentage || "",
            year: user.academicInfo?.class10?.year || "",
          },
          class12: {
            board: user.academicInfo?.class12?.board || "",
            percentage: user.academicInfo?.class12?.percentage || "",
            year: user.academicInfo?.class12?.year || "",
            stream: user.academicInfo?.class12?.stream || "",
          },
        },
      });
    }
  }, [user, isAuthenticated]);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value,
        },
      },
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await api.put("/api/users/profile", formData);
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error("Failed to update profile");
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        personalInfo: {
          name: user.personalInfo?.name || user.name || "",
          email: user.personalInfo?.email || user.email || "",
          phone: user.personalInfo?.phone || "",
          city: user.personalInfo?.city || "",
          state: user.personalInfo?.state || "",
        },
        academicInfo: {
          educationStage: user.educationStage || "",
          class10: {
            board: user.academicInfo?.class10?.board || "",
            percentage: user.academicInfo?.class10?.percentage || "",
            year: user.academicInfo?.class10?.year || "",
          },
          class12: {
            board: user.academicInfo?.class12?.board || "",
            percentage: user.academicInfo?.class12?.percentage || "",
            year: user.academicInfo?.class12?.year || "",
            stream: user.academicInfo?.class12?.stream || "",
          },
        },
      });
    }
    setIsEditing(false);
  };

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
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
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
          <div className="flex space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  <FiX className="w-4 h-4" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  <FiSave className="w-4 h-4" />
                  <span>{loading ? "Saving..." : "Save"}</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <FiEdit2 className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        {/* Profile Content */}
        <div className="space-y-6">
          {/* Personal Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FiUser className="w-5 h-5 mr-2" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.personalInfo.name}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "name", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formData.personalInfo.name || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.personalInfo.email}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "email", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formData.personalInfo.email || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    value={formData.personalInfo.phone}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "phone", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formData.personalInfo.phone || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.personalInfo.city}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formData.personalInfo.city || "Not provided"}
                  </p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.personalInfo.state}
                    onChange={(e) =>
                      handleInputChange("personalInfo", "state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                ) : (
                  <p className="text-gray-900">
                    {formData.personalInfo.state || "Not provided"}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Academic Information */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FiBook className="w-5 h-5 mr-2" />
              Academic Information
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Education Stage
                </label>
                {isEditing ? (
                  <select
                    value={formData.academicInfo.educationStage}
                    onChange={(e) =>
                      handleInputChange(
                        "academicInfo",
                        "educationStage",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select education stage</option>
                    <option value="ongoing">Currently Studying</option>
                    <option value="after10th">After 10th</option>
                    <option value="after12th">After 12th</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Post Graduate</option>
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {formData.academicInfo.educationStage || "Not provided"}
                  </p>
                )}
              </div>

              {/* Class 10 Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Class 10
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.academicInfo.class10.board}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class10",
                            "board",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class10.board || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.academicInfo.class10.percentage}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class10",
                            "percentage",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class10.percentage
                          ? `${formData.academicInfo.class10.percentage}%`
                          : "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.academicInfo.class10.year}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class10",
                            "year",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class10.year || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Class 12 Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">
                  Class 12
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Board
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={formData.academicInfo.class12.board}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class12",
                            "board",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class12.board || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Stream
                    </label>
                    {isEditing ? (
                      <select
                        value={formData.academicInfo.class12.stream}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class12",
                            "stream",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Select stream</option>
                        <option value="Science">Science</option>
                        <option value="Commerce">Commerce</option>
                        <option value="Arts">Arts</option>
                      </select>
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class12.stream || "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Percentage
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.academicInfo.class12.percentage}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class12",
                            "percentage",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class12.percentage
                          ? `${formData.academicInfo.class12.percentage}%`
                          : "Not provided"}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year
                    </label>
                    {isEditing ? (
                      <input
                        type="number"
                        value={formData.academicInfo.class12.year}
                        onChange={(e) =>
                          handleNestedInputChange(
                            "academicInfo",
                            "class12",
                            "year",
                            e.target.value
                          )
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="text-gray-900">
                        {formData.academicInfo.class12.year || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
