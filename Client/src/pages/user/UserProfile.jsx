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
      dateOfBirth: "",
      gender: "",
      state: "",
      city: "",
    },
    educationStage: "",
    academicInfo: {
      class10: {
        board: "",
        percentage: "",
        subjects: [],
        year: "",
      },
      class12: {
        stream: "",
        board: "",
        percentage: "",
        subjects: [],
        year: "",
      },
      currentCourse: {
        degree: "",
        specialization: "",
        college: "",
        year: "",
        cgpa: "",
        semester: "",
      },
    },
    parentalInfluence: {
      preferredFields: [],
      supportLevel: 1,
      expectations: "",
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
          name: user.personalInfo?.name || "",
          email: user.personalInfo?.email || "",
          phone: user.personalInfo?.phone || "",
          dateOfBirth: user.personalInfo?.dateOfBirth
            ? new Date(user.personalInfo.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          gender: user.personalInfo?.gender || "",
          state: user.personalInfo?.state || "",
          city: user.personalInfo?.city || "",
        },
        educationStage: user.educationStage || "",
        academicInfo: {
          class10: {
            board: user.academicInfo?.class10?.board || "",
            percentage: user.academicInfo?.class10?.percentage || "",
            subjects: user.academicInfo?.class10?.subjects || [],
            year: user.academicInfo?.class10?.year || "",
          },
          class12: {
            stream: user.academicInfo?.class12?.stream || "",
            board: user.academicInfo?.class12?.board || "",
            percentage: user.academicInfo?.class12?.percentage || "",
            subjects: user.academicInfo?.class12?.subjects || [],
            year: user.academicInfo?.class12?.year || "",
          },
          currentCourse: {
            degree: user.academicInfo?.currentCourse?.degree || "",
            specialization:
              user.academicInfo?.currentCourse?.specialization || "",
            college: user.academicInfo?.currentCourse?.college || "",
            year: user.academicInfo?.currentCourse?.year || "",
            cgpa: user.academicInfo?.currentCourse?.cgpa || "",
            semester: user.academicInfo?.currentCourse?.semester || "",
          },
        },
        parentalInfluence: {
          preferredFields: user.parentalInfluence?.preferredFields || [],
          supportLevel: user.parentalInfluence?.supportLevel || 1,
          expectations: user.parentalInfluence?.expectations || "",
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

  const handleArrayInputChange = (section, field, value) => {
    const arrayValue = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: arrayValue,
      },
    }));
  };

  const handleDirectFieldChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // Convert string numbers to actual numbers for numeric fields
      const processedData = {
        ...formData,
        academicInfo: {
          ...formData.academicInfo,
          class10: {
            ...formData.academicInfo.class10,
            percentage: formData.academicInfo.class10.percentage
              ? parseFloat(formData.academicInfo.class10.percentage)
              : undefined,
            year: formData.academicInfo.class10.year
              ? parseInt(formData.academicInfo.class10.year)
              : undefined,
          },
          class12: {
            ...formData.academicInfo.class12,
            percentage: formData.academicInfo.class12.percentage
              ? parseFloat(formData.academicInfo.class12.percentage)
              : undefined,
            year: formData.academicInfo.class12.year
              ? parseInt(formData.academicInfo.class12.year)
              : undefined,
          },
          currentCourse: {
            ...formData.academicInfo.currentCourse,
            year: formData.academicInfo.currentCourse.year
              ? parseInt(formData.academicInfo.currentCourse.year)
              : undefined,
            cgpa: formData.academicInfo.currentCourse.cgpa
              ? parseFloat(formData.academicInfo.currentCourse.cgpa)
              : undefined,
            semester: formData.academicInfo.currentCourse.semester
              ? parseInt(formData.academicInfo.currentCourse.semester)
              : undefined,
          },
        },
        parentalInfluence: {
          ...formData.parentalInfluence,
          supportLevel: parseInt(formData.parentalInfluence.supportLevel),
        },
      };

      const response = await api.put("/api/users/profile", processedData);
      if (response.data.success) {
        updateUser(response.data.data);
        toast.success("Profile updated successfully!");
        setIsEditing(false);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
      console.error("Profile update error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        personalInfo: {
          name: user.personalInfo?.name || "",
          email: user.personalInfo?.email || "",
          phone: user.personalInfo?.phone || "",
          dateOfBirth: user.personalInfo?.dateOfBirth
            ? new Date(user.personalInfo.dateOfBirth)
                .toISOString()
                .split("T")[0]
            : "",
          gender: user.personalInfo?.gender || "",
          state: user.personalInfo?.state || "",
          city: user.personalInfo?.city || "",
        },
        educationStage: user.educationStage || "",
        academicInfo: {
          class10: {
            board: user.academicInfo?.class10?.board || "",
            percentage: user.academicInfo?.class10?.percentage || "",
            subjects: user.academicInfo?.class10?.subjects || [],
            year: user.academicInfo?.class10?.year || "",
          },
          class12: {
            stream: user.academicInfo?.class12?.stream || "",
            board: user.academicInfo?.class12?.board || "",
            percentage: user.academicInfo?.class12?.percentage || "",
            subjects: user.academicInfo?.class12?.subjects || [],
            year: user.academicInfo?.class12?.year || "",
          },
          currentCourse: {
            degree: user.academicInfo?.currentCourse?.degree || "",
            specialization:
              user.academicInfo?.currentCourse?.specialization || "",
            college: user.academicInfo?.currentCourse?.college || "",
            year: user.academicInfo?.currentCourse?.year || "",
            cgpa: user.academicInfo?.currentCourse?.cgpa || "",
            semester: user.academicInfo?.currentCourse?.semester || "",
          },
        },
        parentalInfluence: {
          preferredFields: user.parentalInfluence?.preferredFields || [],
          supportLevel: user.parentalInfluence?.supportLevel || 1,
          expectations: user.parentalInfluence?.expectations || "",
        },
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Link to="/dashboard/profile" className="mr-4">
              <FiChevronLeft className="w-6 h-6 text-gray-600" />
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">
              Edit Profile
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  disabled={loading}
                  className="p-2 text-gray-600 hover:text-gray-900"
                >
                  <FiX className="w-5 h-5" />
                </button>
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="p-2 text-blue-600 hover:text-blue-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                  ) : (
                    <FiSave className="w-5 h-5" />
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="p-2 text-blue-600 hover:text-blue-700"
              >
                <FiEdit2 className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Personal Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center mb-4">
            <FiUser className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Personal Information
            </h2>
          </div>
          <div className="space-y-4">
            <InfoField
              label="Name"
              value={formData.personalInfo.name}
              isEditing={isEditing}
              onChange={(value) =>
                handleInputChange("personalInfo", "name", value)
              }
            />
            <InfoField
              label="Email"
              value={formData.personalInfo.email}
              isEditing={isEditing}
              type="email"
              onChange={(value) =>
                handleInputChange("personalInfo", "email", value)
              }
            />
            <InfoField
              label="Phone"
              value={formData.personalInfo.phone}
              isEditing={isEditing}
              type="tel"
              onChange={(value) =>
                handleInputChange("personalInfo", "phone", value)
              }
            />
            <InfoField
              label="Date of Birth"
              value={formData.personalInfo.dateOfBirth}
              isEditing={isEditing}
              type="date"
              onChange={(value) =>
                handleInputChange("personalInfo", "dateOfBirth", value)
              }
            />
            <InfoField
              label="Gender"
              value={formData.personalInfo.gender}
              isEditing={isEditing}
              type="select"
              options={["Male", "Female", "Other"]}
              onChange={(value) =>
                handleInputChange("personalInfo", "gender", value)
              }
            />
            <InfoField
              label="State"
              value={formData.personalInfo.state}
              isEditing={isEditing}
              onChange={(value) =>
                handleInputChange("personalInfo", "state", value)
              }
            />
            <InfoField
              label="City"
              value={formData.personalInfo.city}
              isEditing={isEditing}
              onChange={(value) =>
                handleInputChange("personalInfo", "city", value)
              }
            />
          </div>
        </motion.div>

        {/* Education Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <div className="flex items-center mb-4">
            <FiBook className="w-5 h-5 text-blue-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">
              Education Stage
            </h2>
          </div>
          <InfoField
            label="Current Education Stage"
            value={formData.educationStage}
            isEditing={isEditing}
            type="select"
            options={["after10th", "after12th", "ongoing"]}
            onChange={(value) =>
              handleDirectFieldChange("educationStage", value)
            }
          />
        </motion.div>

        {/* Class 10th Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Class 10th Information
          </h2>
          <div className="space-y-4">
            <InfoField
              label="Board"
              value={formData.academicInfo.class10.board}
              isEditing={isEditing}
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class10",
                  "board",
                  value
                )
              }
            />
            <InfoField
              label="Percentage"
              value={formData.academicInfo.class10.percentage}
              isEditing={isEditing}
              type="number"
              step="0.01"
              max="100"
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class10",
                  "percentage",
                  value
                )
              }
            />
            <InfoField
              label="Year"
              value={formData.academicInfo.class10.year}
              isEditing={isEditing}
              type="number"
              min="2000"
              max="2030"
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class10",
                  "year",
                  value
                )
              }
            />
          </div>
        </motion.div>

        {/* Class 12th Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Class 12th Information
          </h2>
          <div className="space-y-4">
            <InfoField
              label="Stream"
              value={formData.academicInfo.class12.stream}
              isEditing={isEditing}
              type="select"
              options={["Science", "Commerce", "Arts"]}
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class12",
                  "stream",
                  value
                )
              }
            />
            <InfoField
              label="Board"
              value={formData.academicInfo.class12.board}
              isEditing={isEditing}
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class12",
                  "board",
                  value
                )
              }
            />
            <InfoField
              label="Percentage"
              value={formData.academicInfo.class12.percentage}
              isEditing={isEditing}
              type="number"
              step="0.01"
              max="100"
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class12",
                  "percentage",
                  value
                )
              }
            />
            <InfoField
              label="Year"
              value={formData.academicInfo.class12.year}
              isEditing={isEditing}
              type="number"
              min="2000"
              max="2030"
              onChange={(value) =>
                handleNestedInputChange(
                  "academicInfo",
                  "class12",
                  "year",
                  value
                )
              }
            />
          </div>
        </motion.div>

        {/* Current Course Information (for ongoing students) */}
        {formData.educationStage === "ongoing" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-xl shadow-sm border p-6"
          >
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Current Course Information
            </h2>
            <div className="space-y-4">
              <InfoField
                label="Degree"
                value={formData.academicInfo.currentCourse.degree}
                isEditing={isEditing}
                onChange={(value) =>
                  handleNestedInputChange(
                    "academicInfo",
                    "currentCourse",
                    "degree",
                    value
                  )
                }
              />
              <InfoField
                label="Specialization"
                value={formData.academicInfo.currentCourse.specialization}
                isEditing={isEditing}
                onChange={(value) =>
                  handleNestedInputChange(
                    "academicInfo",
                    "currentCourse",
                    "specialization",
                    value
                  )
                }
              />
              <InfoField
                label="College"
                value={formData.academicInfo.currentCourse.college}
                isEditing={isEditing}
                onChange={(value) =>
                  handleNestedInputChange(
                    "academicInfo",
                    "currentCourse",
                    "college",
                    value
                  )
                }
              />
              <InfoField
                label="Year"
                value={formData.academicInfo.currentCourse.year}
                isEditing={isEditing}
                type="number"
                min="1"
                max="5"
                onChange={(value) =>
                  handleNestedInputChange(
                    "academicInfo",
                    "currentCourse",
                    "year",
                    value
                  )
                }
              />
              <InfoField
                label="CGPA"
                value={formData.academicInfo.currentCourse.cgpa}
                isEditing={isEditing}
                type="number"
                step="0.01"
                min="0"
                max="10"
                onChange={(value) =>
                  handleNestedInputChange(
                    "academicInfo",
                    "currentCourse",
                    "cgpa",
                    value
                  )
                }
              />
              <InfoField
                label="Semester"
                value={formData.academicInfo.currentCourse.semester}
                isEditing={isEditing}
                type="number"
                min="1"
                max="10"
                onChange={(value) =>
                  handleNestedInputChange(
                    "academicInfo",
                    "currentCourse",
                    "semester",
                    value
                  )
                }
              />
            </div>
          </motion.div>
        )}

        {/* Parental Influence */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl shadow-sm border p-6"
        >
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Parental Influence
          </h2>
          <div className="space-y-4">
            <InfoField
              label="Preferred Fields"
              value={formData.parentalInfluence.preferredFields.join(", ")}
              isEditing={isEditing}
              placeholder="Engineering, Technology (comma separated)"
              onChange={(value) =>
                handleArrayInputChange(
                  "parentalInfluence",
                  "preferredFields",
                  value
                )
              }
            />
            <InfoField
              label="Support Level (1-5)"
              value={formData.parentalInfluence.supportLevel}
              isEditing={isEditing}
              type="number"
              min="1"
              max="5"
              onChange={(value) =>
                handleInputChange("parentalInfluence", "supportLevel", value)
              }
            />
            <InfoField
              label="Expectations"
              value={formData.parentalInfluence.expectations}
              isEditing={isEditing}
              onChange={(value) =>
                handleInputChange("parentalInfluence", "expectations", value)
              }
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

const InfoField = ({
  label,
  value,
  isEditing,
  type = "text",
  options = [],
  onChange,
  ...props
}) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">
      {label}
    </label>
    {isEditing ? (
      type === "select" ? (
        <select
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...props}
        >
          <option value="">Select {label}</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : (
        <input
          type={type}
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          {...props}
        />
      )
    ) : (
      <p className="text-gray-900 py-2">{value || "Not provided"}</p>
    )}
  </div>
);

export default UserProfile;
