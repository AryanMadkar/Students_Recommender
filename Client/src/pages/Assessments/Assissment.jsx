import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPlay, FiEye, FiArrowRight, FiFilter, FiClock, FiTarget, FiCheckCircle, FiLoader, FiRefreshCw, FiChevronLeft } from "react-icons/fi";
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
      const stage = user?.educationStage || "ongoing"; // Based on your profile (AI/ML/web dev)
      const response = await api.get(`/api/assessments?stage=${stage}`);
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
      case "easy": return "text-green-600 bg-green-50";
      case "medium": return "text-orange-600 bg-orange-50";
      case "hard": return "text-red-600 bg-red-50";
      default: return "text-gray-600 bg-gray-50";
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
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <p className="ml-2">Loading assessments...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <h1 className="text-3xl font-bold mb-4">Assessments Dashboard</h1>
        <p className="text-gray-600 mb-6">
          Discover your strengths in AI/ML, web development, and DSA. Get personalized career recommendations.
        </p>
        {error && <p className="text-red-600 mb-4">{error}</p>}
      </motion.div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-4">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            All ({assessments.length})
          </button>
          <button onClick={() => setFilter("completed")} className={`px-4 py-2 rounded ${filter === "completed" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            Completed ({assessments.filter((a) => a.completed).length})
          </button>
          <button onClick={() => setFilter("available")} className={`px-4 py-2 rounded ${filter === "available" ? "bg-blue-600 text-white" : "bg-gray-200"}`}>
            Available ({assessments.filter((a) => !a.completed).length})
          </button>
        </div>
        <button onClick={refreshAssessments} className="flex items-center text-blue-600 hover:text-blue-800">
          <FiRefreshCw className="mr-2" /> Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssessments.map((assessment) => {
          const status = getStatusConfig(assessment);
          return (
            <motion.div
              key={assessment._id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-lg shadow p-6"
            >
              <h2 className="text-xl font-semibold mb-2">{assessment.title}</h2>
              <p className="text-gray-600 mb-4">{assessment.description}</p>
              <div className="flex items-center mb-4">
                <FiClock className="mr-2" /> {assessment.duration} min
                <span className={`ml-4 px-2 py-1 rounded ${getDifficultyColor(assessment.difficulty)}`}>
                  {assessment.difficulty}
                </span>
                <span className={`ml-2 px-2 py-1 rounded ${status.badge.className}`}>
                  {status.badge.text}
                </span>
              </div>
              <button
                onClick={status.button.action}
                className={`w-full flex items-center justify-center py-2 rounded text-white ${status.button.className}`}
              >
                <status.button.icon className="mr-2" /> {status.button.text}
              </button>
            </motion.div>
          );
        })}
      </div>

      {filteredAssessments.length === 0 && (
        <p className="text-center text-gray-600 mt-8">No assessments found. Try adjusting filters.</p>
      )}

      <Link to="/profile" className="flex items-center justify-center mt-8 text-blue-600 hover:text-blue-800">
        <FiChevronLeft className="mr-2" /> Update Profile for Better Recommendations
      </Link>
    </div>
  );
};

export default AssessmentDashboard;
