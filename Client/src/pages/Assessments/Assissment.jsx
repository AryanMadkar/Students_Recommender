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
  FiChevronLeft,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const AssessmentDashboard = () => {
  const [assessments, setAssessments] = useState([]);
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, isAuthenticated, api } = useAuth();
  const { refreshAssessments } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAssessments();
  }, [isAuthenticated]);

  const fetchAssessments = async () => {
    try {
      setLoading(true);
      const stage = user?.educationStage;
      const response = await api.get(
        `/api/assessments${stage ? `?stage=${stage}` : ""}`
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
        <div className="text-center">
          <FiLoader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading assessments...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Assessments</h1>
              <p className="text-gray-600">
                Discover your strengths and get personalized career
                recommendations
              </p>
            </div>
          </div>
          <button
            onClick={fetchAssessments}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Total Assessments
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {assessments.length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Completed
            </h3>
            <p className="text-3xl font-bold text-green-600">
              {assessments.filter((a) => a.completed).length}
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Available
            </h3>
            <p className="text-3xl font-bold text-orange-600">
              {assessments.filter((a) => !a.completed).length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-6">
          <FiFilter className="text-gray-400" />
          <div className="flex space-x-2">
            {["all", "available", "completed"].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === filterOption
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Assessments Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredAssessments.map((assessment, index) => {
            const status = getStatusConfig(assessment);
            const ButtonIcon = status.button.icon;

            return (
              <motion.div
                key={assessment._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {assessment.title}
                    </h3>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${status.badge.className}`}
                    >
                      {status.badge.text}
                    </span>
                  </div>
                  {assessment.difficulty && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                        assessment.difficulty
                      )}`}
                    >
                      {assessment.difficulty}
                    </span>
                  )}
                </div>

                <p className="text-gray-600 mb-4">{assessment.description}</p>

                {/* Meta Info */}
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-6">
                  {assessment.duration && (
                    <div className="flex items-center space-x-1">
                      <FiClock className="w-4 h-4" />
                      <span>{assessment.duration} mins</span>
                    </div>
                  )}
                  {assessment.questionCount && (
                    <div className="flex items-center space-x-1">
                      <FiTarget className="w-4 h-4" />
                      <span>{assessment.questionCount} questions</span>
                    </div>
                  )}
                  {assessment.completed && assessment.score && (
                    <div className="flex items-center space-x-1">
                      <FiCheckCircle className="w-4 h-4 text-green-500" />
                      <span>Score: {assessment.score}%</span>
                    </div>
                  )}
                </div>

                <button
                  onClick={status.button.action}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg text-white font-medium transition-colors ${status.button.className}`}
                >
                  <ButtonIcon className="w-5 h-5" />
                  <span>{status.button.text}</span>
                </button>
              </motion.div>
            );
          })}
        </div>

        {filteredAssessments.length === 0 && (
          <div className="text-center py-12">
            <FiTarget className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filter === "all"
                ? "No assessments available for your education stage"
                : `No ${filter} assessments found`}
            </h3>
            <p className="text-gray-600 mb-4">
              Our assessments are designed to help you discover your strengths
              and find the perfect career path.
            </p>
            <Link
              to="/profile"
              className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <span>Update Profile</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentDashboard;
