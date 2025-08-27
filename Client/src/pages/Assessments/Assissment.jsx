import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  FiAirplay,
  FiTarget,
  FiTrendingUp,
  FiUser,
  FiMessageCircle,
  FiBarChart2,
  FiCode,
  FiBook,
  FiUsers,
  FiLayout,
  FiPlay,
  FiEye,
  FiArrowRight,
  FiFilter,
} from "react-icons/fi";

const AssessmentDashboard = () => {
  const [filter, setFilter] = useState("all");

  const assignmentsData = [
    {
      id: 1,
      title: "Aptitude Test",
      description:
        "Measures your problem-solving abilities and logical thinking skills relevant for engineering and technical roles.",
      status: "in-progress",
      icon: "FiBrain",
      progress: 45,
      dueDate: "2025-09-15",
      duration: "45 mins",
      difficulty: "Medium",
      category: "Cognitive Skills",
    },
    {
      id: 2,
      title: "Career Interest Assessment",
      description:
        "Discover your interests and explore career matches from our professional career database.",
      status: "recommended",
      icon: "FiTarget",
      dueDate: "2025-09-20",
      duration: "30 mins",
      difficulty: "Easy",
      category: "Career Planning",
    },
    {
      id: 3,
      title: "Logical Reasoning",
      description:
        "Assesses your ability to understand and interpret complex information to draw logical conclusions.",
      status: "recommended",
      icon: "FiTrendingUp",
      dueDate: "2025-09-18",
      duration: "60 mins",
      difficulty: "Hard",
      category: "Analytical Skills",
    },
    {
      id: 4,
      title: "Personality Assessment",
      description:
        "Understand your personality traits to help you understand your strengths and weaknesses in a professional context.",
      status: "completed",
      icon: "FiUser",
      completedDate: "2025-08-20",
      score: 85,
      duration: "25 mins",
      difficulty: "Easy",
      category: "Personality",
    },
    {
      id: 5,
      title: "Communication Skills",
      description:
        "Evaluates your verbal and written communication skills along with presentation and public speaking abilities.",
      status: "recommended",
      icon: "FiMessageCircle",
      dueDate: "2025-09-25",
      duration: "40 mins",
      difficulty: "Medium",
      category: "Soft Skills",
    },
    {
      id: 6,
      title: "Quantitative Aptitude",
      description:
        "Tests your numerical ability and data interpretation skills important for competitive exams.",
      status: "recommended",
      icon: "FiBarChart3",
      dueDate: "2025-09-22",
      duration: "50 mins",
      difficulty: "Hard",
      category: "Mathematics",
    },
    {
      id: 7,
      title: "Technical Programming",
      description:
        "Evaluate your coding skills in data structures, algorithms, and problem-solving approaches.",
      status: "not-started",
      icon: "FiCode",
      dueDate: "2025-10-01",
      duration: "90 mins",
      difficulty: "Hard",
      category: "Technical Skills",
    },
    {
      id: 8,
      title: "English Proficiency",
      description:
        "Assess your command over English language including grammar, vocabulary, and comprehension skills.",
      status: "completed",
      icon: "FiBook",
      completedDate: "2025-08-18",
      score: 92,
      duration: "35 mins",
      difficulty: "Medium",
      category: "Language",
    },
    {
      id: 9,
      title: "Situational Judgment",
      description:
        "Presents workplace scenarios to evaluate your decision-making and problem-solving in professional contexts.",
      status: "in-progress",
      icon: "FiUsers",
      progress: 20,
      dueDate: "2025-09-28",
      duration: "45 mins",
      difficulty: "Medium",
      category: "Professional Skills",
    },
    {
      id: 10,
      title: "Creative Thinking",
      description:
        "Measures your ability to think outside the box and generate innovative solutions to complex problems.",
      status: "recommended",
      icon: "FiLightbulb",
      dueDate: "2025-09-30",
      duration: "55 mins",
      difficulty: "Medium",
      category: "Creativity",
    },
  ];

  const iconMap = {
    FiAirplay,
    FiTarget,
    FiTrendingUp,
    FiUser,
    FiMessageCircle,
    FiBarChart2,
    FiCode,
    FiBook,
    FiUsers,
    FiLayout,
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "text-green-600 bg-green-50";
      case "Medium":
        return "text-orange-600 bg-orange-50";
      case "Hard":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "in-progress":
        return {
          badge: {
            text: "In Progress",
            className: "bg-blue-100 text-blue-800",
          },
          button: {
            text: "Continue",
            icon: FiArrowRight,
            className: "bg-blue-600 hover:bg-blue-700",
          },
        };
      case "completed":
        return {
          badge: {
            text: "Completed",
            className: "bg-green-100 text-green-800",
          },
          button: {
            text: "View Results",
            icon: FiEye,
            className: "bg-gray-600 hover:bg-gray-700",
          },
        };
      case "recommended":
        return {
          badge: {
            text: "Recommended",
            className: "bg-orange-100 text-orange-800",
          },
          button: {
            text: "Start Assessment",
            icon: FiPlay,
            className: "bg-blue-600 hover:bg-blue-700",
          },
        };
      default:
        return {
          badge: { text: "Available", className: "bg-gray-100 text-gray-800" },
          button: {
            text: "Start",
            icon: FiPlay,
            className: "bg-blue-600 hover:bg-blue-700",
          },
        };
    }
  };

  const filteredAssignments = assignmentsData.filter((assignment) => {
    if (filter === "all") return true;
    return assignment.status === filter;
  });

  const handleAssignmentClick = (assignment) => {
    console.log(`Clicked on ${assignment.title}`, assignment);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header with Filter */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Assessments</h1>
          <div className="flex items-center space-x-2">
            <FiFilter className="w-4 h-4 text-gray-500" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="bg-white border border-gray-300 rounded-lg px-3 py-1 text-sm"
            >
              <option value="all">All Status</option>
              <option value="recommended">Recommended</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="not-started">Not Started</option>
            </select>
          </div>
        </div>

        {/* Stats */}
        <div className="flex space-x-4 text-sm text-gray-600">
          <span>Total: {assignmentsData.length}</span>
          <span>
            Completed:{" "}
            {assignmentsData.filter((a) => a.status === "completed").length}
          </span>
          <span>
            In Progress:{" "}
            {assignmentsData.filter((a) => a.status === "in-progress").length}
          </span>
        </div>
      </div>

      {/* Assignment Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAssignments.map((assignment) => {
          const config = getStatusConfig(assignment.status);
          const IconComponent = iconMap[assignment.icon];

          return (
            <motion.div
              key={assignment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2, delay: assignment.id * 0.05 }}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    {IconComponent && (
                      <IconComponent className="w-5 h-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 text-lg">
                      {assignment.title}
                    </h3>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${config.badge.className}`}
                    >
                      {config.badge.text}
                    </span>
                  </div>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {assignment.description}
              </p>

              {/* Meta Info */}
              <div className="flex justify-between items-center mb-4 text-xs text-gray-500">
                <div className="flex items-center space-x-4">
                  <span>⏱️ {assignment.duration}</span>
                  <span
                    className={`px-2 py-1 rounded-full ${getDifficultyColor(
                      assignment.difficulty
                    )}`}
                  >
                    {assignment.difficulty}
                  </span>
                </div>
                {assignment.score && (
                  <span className="font-medium text-green-600">
                    Score: {assignment.score}%
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              {assignment.status === "in-progress" && assignment.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>{assignment.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${assignment.progress}%` }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="bg-blue-600 h-2 rounded-full"
                    />
                  </div>
                </div>
              )}

              {/* Action Button */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleAssignmentClick(assignment)}
                className={`w-full flex items-center justify-center space-x-2 px-4 py-3 text-white font-medium rounded-lg transition-colors duration-200 ${config.button.className}`}
              >
                <span>{config.button.text}</span>
                <config.button.icon className="w-4 h-4" />
              </motion.button>
            </motion.div>
          );
        })}
      </div>

      {filteredAssignments.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-lg">
            No assessments found for the selected filter.
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentDashboard;
