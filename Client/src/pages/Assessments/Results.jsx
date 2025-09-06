import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiRefreshCw,
  FiArrowRight,
  FiDownload,
  FiShare2,
  FiAward,
  FiTarget,
  FiTrendingUp,
} from "react-icons/fi";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { useAuth } from "../../context/AuthContext";

const AssessmentResultPage = () => {
  const { assessmentId, resultId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, api } = useAuth();

  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (!result && (assessmentId || resultId)) {
      fetchResult();
    }
  }, [assessmentId, resultId, isAuthenticated]);

  const fetchResult = async () => {
    try {
      let endpoint;
      if (resultId) {
        endpoint = `/api/assessments/results/${resultId}`;
      } else {
        // Fetch latest result for this assessment
        const response = await api.get("/api/assessments/results");
        const assessmentResult = response.data.data.find(
          (r) => r.assessmentId._id === assessmentId
        );
        if (assessmentResult) {
          endpoint = `/api/assessments/results/${assessmentResult._id}`;
        }
      }

      if (endpoint) {
        const response = await api.get(endpoint);
        if (response.data.success) {
          setResult(response.data.data);
        }
      }
    } catch (err) {
      setError("Failed to load results");
      console.error("Results fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getPerformanceMessage = (score) => {
    if (score >= 80)
      return "Excellent performance! You've demonstrated strong capabilities.";
    if (score >= 60)
      return "Good work! You're on the right track with room for growth.";
    if (score >= 40)
      return "Fair performance. Consider focusing on key areas for improvement.";
    return "There's potential for growth. Use these insights to guide your development.";
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || "Results not found"}</p>
          <Link
            to="/assessments"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Assessments
          </Link>
        </div>
      </div>
    );
  }

  const overallScore = result.overallScore || 0;
  const analysis = result.analysis || {};
  const categoryScores = result.categoryScores || [];

  // Prepare data for charts
  const pieData = categoryScores.map((category, index) => ({
    name: category.category,
    value: category.score,
    color: COLORS[index % COLORS.length],
  }));

  const radarData = categoryScores.map((category) => ({
    category: category.category,
    score: category.score,
  }));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <Link
              to="/assessments"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiChevronLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Assessment Results
              </h1>
              <p className="text-gray-600">
                {result.assessmentId?.title || "Assessment"} completed on{" "}
                {new Date(result.completedAt).toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">
              <FiDownload className="w-4 h-4" />
              <span>Download Report</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              <FiShare2 className="w-4 h-4" />
              <span>Share</span>
            </button>
          </div>
        </div>

        {/* Overall Score Card */}
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl text-white p-8 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-2">Overall Score</h2>
              <div className="text-5xl font-bold mb-2">{overallScore}%</div>
              <p className="text-blue-100">
                {getPerformanceMessage(overallScore)}
              </p>
            </div>
            <div className="w-32 h-32 relative">
              <div className="w-full h-full rounded-full border-8 border-white border-opacity-30 flex items-center justify-center">
                <FiAward className="w-16 h-16" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Category Breakdown */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FiTarget className="w-5 h-5 mr-2" />
              Category Breakdown
            </h3>
            {categoryScores.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No category data available
              </div>
            )}
          </div>

          {/* Radar Chart */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <FiTrendingUp className="w-5 h-5 mr-2" />
              Performance Radar
            </h3>
            {radarData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.6}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-64 text-gray-500">
                No performance data available
              </div>
            )}
          </div>
        </div>

        {/* Detailed Analysis */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Detailed Analysis
          </h3>

          {/* Strengths */}
          {analysis.strengths?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-green-700 mb-3">
                Your Strengths
              </h4>
              <ul className="space-y-2">
                {analysis.strengths.map((strength, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-green-500 mt-1">•</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Areas for Improvement */}
          {analysis.improvements?.length > 0 && (
            <div className="mb-6">
              <h4 className="text-lg font-medium text-orange-700 mb-3">
                Areas for Improvement
              </h4>
              <ul className="space-y-2">
                {analysis.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <span className="text-orange-500 mt-1">•</span>
                    <span className="text-gray-700">{improvement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Learning Style */}
          {analysis.learningStyle && (
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="text-lg font-medium text-blue-700 mb-2">
                Your Learning Style: {analysis.learningStyle}
              </h4>
              <p className="text-blue-600">
                Based on your responses, this learning approach will help you
                maximize your potential.
              </p>
            </div>
          )}
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">
            Next Steps
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              to="/colleges/recommended"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">
                Explore Colleges
              </h4>
              <p className="text-sm text-gray-600">
                Find colleges that match your profile
              </p>
            </Link>
            <Link
              to="/careers/explore"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">Career Paths</h4>
              <p className="text-sm text-gray-600">
                Discover matching career opportunities
              </p>
            </Link>
            <Link
              to="/assessments"
              className="p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors"
            >
              <h4 className="font-medium text-gray-900 mb-2">
                More Assessments
              </h4>
              <p className="text-sm text-gray-600">
                Take additional assessments for better insights
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentResultPage;
