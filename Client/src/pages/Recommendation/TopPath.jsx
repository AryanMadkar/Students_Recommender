import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiTrendingUp,
  FiTarget,
  FiAward,
  FiArrowRight,
  FiStar,
  FiUsers,
  FiDollarSign,
  FiClock,
  FiBarChart,
  FiBookOpen,
  FiCheckCircle,
  FiChevronLeft,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";

const TopPath = () => {
  const navigate = useNavigate();
  const [careerPaths, setCareerPaths] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPath, setSelectedPath] = useState(null);
  const [activeTab, setActiveTab] = useState("trending");

  const { isAuthenticated, api } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchTopPaths();
    fetchPersonalizedRoadmap();
  }, [isAuthenticated]);

  const fetchTopPaths = async () => {
    try {
      const response = await api.get("/api/recommendations/careers");

      if (response.data.success) {
        setCareerPaths(response.data.data || []);
      }
    } catch (err) {
      console.error("Top paths fetch error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      } else {
        setError("Failed to load career paths");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedRoadmap = async () => {
    try {
      const response = await api.get("/api/recommendations/roadmap");

      if (response.data.success) {
        setRoadmap(response.data.data);
      }
    } catch (err) {
      console.error("Roadmap fetch error:", err);
    }
  };

  const handlePathSelect = (path) => {
    setSelectedPath(path);
  };

  const formatSalary = (amount) => {
    if (amount >= 1000000) {
      return `₹${(amount / 1000000).toFixed(1)}L`;
    }
    return `₹${(amount / 1000).toFixed(0)}K`;
  };

  const getGrowthColor = (growth) => {
    switch (growth?.toLowerCase()) {
      case "high":
        return "text-green-600 bg-green-50";
      case "medium":
        return "text-orange-600 bg-orange-50";
      case "low":
        return "text-red-600 bg-red-50";
      default:
        return "text-blue-600 bg-blue-50";
    }
  };

  const defaultPaths = [
    {
      _id: "1",
      title: "Software Engineer",
      description:
        "Design and develop software applications, systems, and platforms",
      matchPercentage: 90,
      salaryRange: "8-25 LPA",
      growth: "High",
      demand: "Very High",
      skills: ["Programming", "Problem Solving", "System Design"],
    },
    {
      _id: "2",
      title: "Data Scientist",
      description:
        "Analyze complex data to help organizations make better decisions",
      matchPercentage: 85,
      salaryRange: "12-30 LPA",
      growth: "High",
      demand: "High",
      skills: ["Statistics", "Machine Learning", "Python"],
    },
    {
      _id: "3",
      title: "Product Manager",
      description: "Lead product development from conception to launch",
      matchPercentage: 75,
      salaryRange: "15-40 LPA",
      growth: "Medium",
      demand: "High",
      skills: ["Strategy", "Communication", "Analytics"],
    },
  ];

  const defaultRoadmap = {
    title: "Your Personalized Career Roadmap",
    summary:
      "Based on your profile and assessments, here's your recommended path",
    steps: [
      "Complete your current education with focus on technical subjects",
      "Build a strong foundation in programming languages",
      "Work on personal projects and build a portfolio",
      "Apply for internships in your chosen field",
      "Continue learning and stay updated with industry trends",
    ],
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading career paths...</p>
        </div>
      </div>
    );
  }

  const displayPaths = careerPaths.length > 0 ? careerPaths : defaultPaths;
  const displayRoadmap = roadmap || defaultRoadmap;

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
              <h1 className="text-3xl font-bold text-gray-900">
                Top Career Paths
              </h1>
              <p className="text-gray-600">
                Discover trending careers and get personalized roadmaps for your
                future
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          <button
            onClick={() => setActiveTab("trending")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "trending"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiTrendingUp className="w-4 h-4" />
              <span>Trending Careers</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab("roadmap")}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              activeTab === "roadmap"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <div className="flex items-center space-x-2">
              <FiTarget className="w-4 h-4" />
              <span>My Roadmap</span>
            </div>
          </button>
        </div>

        {/* Content */}
        {activeTab === "trending" && (
          <div className="space-y-6">
            {/* Career Paths Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {displayPaths.map((career, index) => (
                <motion.div
                  key={career._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-white rounded-xl shadow-sm border p-6 cursor-pointer transition-all ${
                    selectedPath?._id === career._id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handlePathSelect(career)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {career.title}
                    </h3>
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                      {career.matchPercentage || 85}% Match
                    </span>
                  </div>

                  <p className="text-gray-600 mb-4">{career.description}</p>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center space-x-2">
                      <FiDollarSign className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-600">
                        {career.salaryRange || "8-25 LPA"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiBarChart className="w-4 h-4 text-blue-500" />
                      <span
                        className={`text-xs px-2 py-1 rounded-full ${getGrowthColor(
                          career.growth || "High"
                        )}`}
                      >
                        {career.growth || "High"} Growth
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiUsers className="w-4 h-4 text-purple-500" />
                      <span className="text-sm text-gray-600">
                        {career.demand || "High"} Demand
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FiStar className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">
                        {career.rating || "4.5"}/5
                      </span>
                    </div>
                  </div>

                  {/* Skills */}
                  {career.skills && (
                    <div className="flex flex-wrap gap-1 mb-4">
                      {career.skills.slice(0, 3).map((skill, skillIndex) => (
                        <span
                          key={skillIndex}
                          className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  <Link
                    to={`/careers/${career._id}`}
                    className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    <span>Learn More</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Call to Action */}
            {displayPaths.length === 0 && (
              <div className="text-center py-12">
                <FiTarget className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No career paths available
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete your assessment to get personalized career
                  recommendations
                </p>
                <Link
                  to="/assessments"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span>Take Assessment</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === "roadmap" && (
          <div className="space-y-6">
            {/* Roadmap Card */}
            <div className="bg-white rounded-xl shadow-sm p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FiTarget className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {displayRoadmap.title}
                  </h2>
                  <p className="text-gray-600">{displayRoadmap.summary}</p>
                </div>
              </div>

              {/* Key Highlights */}
              {displayRoadmap.highlights && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {displayRoadmap.highlights.map((highlight, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {highlight.value}
                      </div>
                      <p className="text-sm text-gray-600">{highlight.label}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Key Points */}
              {displayRoadmap.keyPoints && (
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Key Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {displayRoadmap.keyPoints.map((point, index) => (
                      <div
                        key={index}
                        className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg"
                      >
                        <FiCheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                        <p className="text-gray-700">{point}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Steps */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Your Action Plan
                </h3>
                <div className="space-y-4">
                  {displayRoadmap.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-gray-50 rounded-lg p-4">
                        <p className="text-gray-800">{step}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Empty State */}
            {!roadmap && (
              <div className="text-center py-12">
                <FiBookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Roadmap not available
                </h3>
                <p className="text-gray-600 mb-4">
                  Complete assessments and update your profile to get a
                  personalized career roadmap
                </p>
                <Link
                  to="/assessments"
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <span>Take Assessment</span>
                  <FiArrowRight className="w-4 h-4" />
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Selected Path Details */}
        {selectedPath && (
          <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              About {selectedPath.title}
            </h3>
            <p className="text-gray-600 mb-4">{selectedPath.description}</p>

            {selectedPath.requirements && (
              <div className="mb-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Requirements:
                </h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {selectedPath.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex space-x-4">
              <Link
                to={`/careers/${selectedPath._id}`}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                View Full Details
              </Link>
              <Link
                to="/colleges/recommended"
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                Find Related Colleges
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopPath;
