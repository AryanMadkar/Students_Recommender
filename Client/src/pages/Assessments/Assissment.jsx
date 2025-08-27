import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiPlay,
  FiEye,
  FiArrowRight,
  FiFilter,
  FiClock,
  FiTarget,
  FiCheckCircle,
  FiLoader,
  FiRefreshCw,
} from "react-icons/fi";
import axios from "axios";

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchAssessments();
  }, []);

  const fetchAssessments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const stage = user.educationStage;

      const response = await axios.get(
        `${
          process.env.REACT_APP_API_URL || "http://localhost:5000"
        }/api/assessments${stage ? `?stage=${stage}` : ""}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.data.success) {
        setAssessments(response.data.data);
      }
    } catch (err) {
      setError("Failed to load assessments");
      console.error("Assessment fetch error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case "easy":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusConfig = (assessment) => {
    if (assessment.completed) {
      return {
        badge: { text: "Completed", className: "bg-green-100 text-green-800" },
        button: {
          text: "View Results",
          icon: FiEye,
          className: "bg-gray-600 hover:bg-gray-700",
          action: () => navigate(`/assessments/${assessment._id}/results`),
        },
      };
    } else {
      return {
        badge: { text: "Available", className: "bg-blue-100 text-blue-800" },
        button: {
          text: "Start Assessment",
          icon: FiPlay,
          className: "bg-blue-600 hover:bg-blue-700",
          action: () => navigate(`/assessments/${assessment._id}/start`),
        },
      };
    }
  };

  const filteredAssessments = assessments.filter((assessment) => {
    if (filter === "all") return true;
    if (filter === "completed") return assessment.completed;
    if (filter === "available") return !assessment.completed;
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Assessments
              </h1>
              <p className="text-gray-600">
                Discover your strengths and get personalized career
                recommendations
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center space-x-4">
              <button
                onClick={fetchAssessments}
                className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                <FiRefreshCw className="w-4 h-4" />
                <span>Refresh</span>
              </button>

              <div className="flex items-center space-x-2 bg-white border border-gray-300 rounded-lg p-1">
                <FiFilter className="w-4 h-4 text-gray-400 ml-2" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent border-none focus:outline-none text-sm"
                >
                  <option value="all">All Assessments</option>
                  <option value="available">Available</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
          >
            <p className="text-red-700">{error}</p>
          </motion.div>
        )}

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Total Assessments</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.length}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FiTarget className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Completed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter((a) => a.completed).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FiCheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Available</p>
                <p className="text-2xl font-bold text-gray-900">
                  {assessments.filter((a) => !a.completed).length}
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <FiPlay className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Assessment Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssessments.map((assessment, index) => {
            const statusConfig = getStatusConfig(assessment);

            return (
              <motion.div
                key={assessment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${statusConfig.badge.className}`}
                      >
                        {statusConfig.badge.text}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded-full font-medium ${getDifficultyColor(
                          "medium"
                        )}`}
                      >
                        Medium
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {assessment.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {assessment.description}
                </p>

                {/* Meta Info */}
                <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
                  <div className="flex items-center space-x-1">
                    <FiClock className="w-4 h-4" />
                    <span>{assessment.duration} mins</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FiTarget className="w-4 h-4" />
                    <span>{assessment.questionCount || 0} questions</span>
                  </div>
                </div>

                {/* Progress Bar (if in progress) */}
                {assessment.progress && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                      <span>Progress</span>
                      <span>{assessment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${assessment.progress}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Score (if completed) */}
                {assessment.completed && assessment.score && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-green-700">Your Score</span>
                      <span className="text-lg font-bold text-green-800">
                        {assessment.score}%
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={statusConfig.button.action}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium text-white transition-colors ${statusConfig.button.className}`}
                >
                  <statusConfig.button.icon className="w-4 h-4" />
                  <span>{statusConfig.button.text}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <FiTarget className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No assessments found
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "all"
                ? "No assessments available for your education stage"
                : `No ${filter} assessments found`}
            </p>
            <button
              onClick={() => setFilter("all")}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all assessments
            </button>
          </motion.div>
        )}

        {/* Help Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Need Help Getting Started?
              </h3>
              <p className="text-gray-600">
                Our assessments are designed to help you discover your strengths
                and find the perfect career path.
              </p>
            </div>
            <Link
              to="/help"
              className="inline-flex items-center space-x-2 bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              <span>Get Help</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentDashboard;
