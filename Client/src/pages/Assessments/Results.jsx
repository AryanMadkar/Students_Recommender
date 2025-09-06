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
      return "Excellent performance! You've demonstrated strong capabilities in AI/ML and web dev.";
    if (score >= 60)
      return "Good work! You're on the right track with DSA and coding—keep practicing.";
    if (score >= 40)
      return "Fair performance. Focus on key areas like algorithms for improvement.";
    return "There's potential for growth. Use these insights to guide your development in tech fields.";
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiRefreshCw className="animate-spin text-4xl text-blue-600" />
        <p className="ml-2">Loading your results...</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center mt-8">
        <p className="text-red-600">{error || "Results not found"}</p>
        <Link to="/assessments" className="text-blue-600 hover:text-blue-800">
          Back to Assessments
        </Link>
      </div>
    );
  }

  const overallScore = result.scores.overall;
  const pieData = [
    { name: "Your Score", value: overallScore },
    { name: "Remaining", value: 100 - overallScore },
  ];
  const radarData = Object.entries(result.scores)
    .filter(([key]) => key !== "overall")
    .map(([name, value]) => ({
      subject: name.charAt(0).toUpperCase() + name.slice(1),
      A: value,
      fullMark: 100,
    }));

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-lg shadow p-6 mb-8"
      >
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">
            {result.assessmentId?.title || "Assessment"} Results
          </h1>
          <p className="text-gray-600">
            Completed on {new Date(result.completedAt).toLocaleDateString()}
          </p>
        </div>
        <div className="text-center mb-8">
          <div className="text-6xl font-bold text-blue-600">
            {overallScore}%
          </div>
          <p className="text-xl mt-2">{getPerformanceMessage(overallScore)}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiAward className="mr-2" /> Score Breakdown
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4 flex items-center">
            <FiTrendingUp className="mr-2" /> Skills Radar
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="subject" />
              <PolarRadiusAxis />
              <Radar
                name="You"
                dataKey="A"
                stroke="#0088FE"
                fill="#0088FE"
                fillOpacity={0.6}
              />
              <Legend />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 flex items-center">
          <FiTarget className="mr-2" /> Personalized Insights
        </h2>
        <p className="mb-4">
          {result.analysis?.learningStyle ||
            "Balanced Learner - You adapt well to various styles, great for AI/ML and web dev projects."}
        </p>
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Strengths</h3>
            <ul className="list-disc pl-6">
              {result.analysis?.strengths?.map((strength, index) => (
                <li key={index}>
                  {strength.description} ({strength.score}%)
                </li>
              )) || (
                <li>
                  No specific strengths identified yet—take more assessments!
                </li>
              )}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Areas for Improvement</h3>
            <ul className="list-disc pl-6">
              {result.analysis?.weaknesses?.map((weakness, index) => (
                <li key={index}>
                  {weakness.description} - Suggestions:{" "}
                  {weakness.improvement.join(", ")}
                </li>
              )) || <li>You're doing great overall!</li>}
            </ul>
          </div>
          <div>
            <h3 className="font-semibold">Recommendations</h3>
            <ul className="list-disc pl-6">
              {result.analysis?.recommendations?.map((rec, index) => (
                <li key={index}>{rec}</li>
              )) || (
                <li>
                  Consider roles in AI/ML or web development based on your
                  profile.
                </li>
              )}
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          to="/assessments"
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <FiChevronLeft className="mr-2" /> Back to Assessments
        </Link>
        <div className="space-x-4">
          <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded">
            <FiDownload className="mr-2" /> Download Report
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded">
            <FiShare2 className="mr-2" /> Share
          </button>
        </div>
      </div>

      <div className="mt-8 space-y-4">
        <Link
          to="/colleges"
          className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Find colleges that match your profile (e.g., IITs for AI/ML)
        </Link>
        <Link
          to="/recommendations"
          className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Discover matching career opportunities (e.g., Software Engineer in
          FinTech)
        </Link>
        <Link
          to="/assessments"
          className="block p-4 bg-gray-100 rounded-lg hover:bg-gray-200"
        >
          Take additional assessments for better insights (e.g., DSA-focused)
        </Link>
      </div>
    </div>
  );
};

export default AssessmentResultPage;
