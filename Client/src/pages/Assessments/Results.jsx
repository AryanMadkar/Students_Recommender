import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiChevronLeft, FiRefreshCw, FiArrowRight, FiDownload, FiShare2 } from "react-icons/fi";
import { PieChart, Pie, Cell, Legend, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from "recharts";
import axios from "axios";

const AssessmentResultPage = () => {
  const { assessmentId, resultId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [result, setResult] = useState(location.state?.result || null);
  const [loading, setLoading] = useState(!result);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!result && (assessmentId || resultId)) {
      fetchResult();
    }
  }, [assessmentId, resultId]);

  const fetchResult = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      let endpoint;
      if (resultId) {
        endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/assessments/results/${resultId}`;
      } else {
        // Fetch latest result for this assessment
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/assessments/results`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        const assessmentResult = response.data.data.find(r => r.assessmentId._id === assessmentId);
        if (assessmentResult) {
          endpoint = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/assessments/results/${assessmentResult._id}`;
        }
      }

      if (endpoint) {
        const response = await axios.get(endpoint, {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (response.data.success) {
          setResult(response.data.data);
        }
      }
    } catch (err) {
      setError('Failed to load results');
      console.error('Results fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Results not found'}</p>
          <button
            onClick={() => navigate('/assessments')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Assessments
          </button>
        </div>
      </div>
    );
  }

  const scores = result.scores || {};
  const analysis = result.analysis || {};
  const overallScore = scores.overall || 0;

  // Prepare data for charts
  const skillsData = Object.entries(scores)
    .filter(([key]) => key !== 'overall')
    .map(([key, value]) => ({
      name: key.charAt(0).toUpperCase() + key.slice(1),
      value: value || 0,
      color: getSkillColor(key)
    }));

  const radarData = skillsData.map(skill => ({
    skill: skill.name,
    score: skill.value,
    fullMark: 100
  }));

  function getSkillColor(skill) {
    const colors = {
      analytical: "#3b82f6",
      creative: "#10b981",
      technical: "#8b5cf6", 
      communication: "#f59e0b",
      leadership: "#ef4444"
    };
    return colors[skill] || "#6b7280";
  }

  const getPerformanceMessage = (score) => {
    if (score >= 90) return "Outstanding performance! You're in the top 5%.";
    if (score >= 80) return "Excellent work! You're in the top 15%.";
    if (score >= 70) return "Good job! You're above average.";
    if (score >= 60) return "Fair performance. Room for improvement.";
    return "Keep practicing! You can do better.";
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate('/assessments')}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FiChevronLeft className="w-5 h-5" />
              <span>Back to Assessments</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <FiDownload className="w-4 h-4" />
                <span>Download Report</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <FiShare2 className="w-4 h-4" />
                <span>Share Results</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Assessment Results</h1>
          <p className="text-gray-600">
            {result.assessmentId?.title || 'Assessment'} completed on{' '}
            {new Date(result.completedAt).toLocaleDateString()}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Overall Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Score</h2>
                <div className={`text-6xl font-bold mb-4 ${getScoreColor(overallScore)}`}>
                  {overallScore}%
                </div>
                <p className="text-gray-600 text-lg">
                  {getPerformanceMessage(overallScore)}
                </p>
              </div>

              {/* Skills Breakdown Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Skills Breakdown</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={skillsData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {skillsData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Radar Chart */}
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6 text-center">Skill Profile</h3>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="skill" />
                      <PolarRadiusAxis domain={[0, 100]} />
                      <Radar
                        name="Score"
                        dataKey="score"
                        stroke="#3b82f6"
                        fill="#3b82f6"
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Strengths */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-green-600">
                💪 Strengths
              </h3>
              <div className="space-y-3">
                {analysis.strengths?.length > 0 ? (
                  analysis.strengths.map((strength, index) => (
                    <div key={index} className="p-3 bg-green-50 rounded-lg">
                      <div className="font-medium text-green-800">{strength.category}</div>
                      <div className="text-sm text-green-600">{strength.description}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    • You excel at breaking down complex problems into logical steps.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Areas for Improvement */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-orange-600">
                📈 Areas for Improvement
              </h3>
              <div className="space-y-3">
                {analysis.weaknesses?.length > 0 ? (
                  analysis.weaknesses.map((weakness, index) => (
                    <div key={index} className="p-3 bg-orange-50 rounded-lg">
                      <div className="font-medium text-orange-800">{weakness.category}</div>
                      <div className="text-sm text-orange-600">{weakness.description}</div>
                      {weakness.improvement && (
                        <div className="mt-2 space-y-1">
                          {weakness.improvement.slice(0, 2).map((tip, tipIndex) => (
                            <div key={tipIndex} className="text-xs text-orange-500">
                              • {tip}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">
                    • Focus practice on interpreting data charts to raise analytical speed.
                  </p>
                )}
              </div>
            </motion.div>

            {/* Learning Style */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-purple-600">
                🎯 Learning Style
              </h3>
              <div className="p-4 bg-purple-50 rounded-lg">
                <p className="text-purple-800 font-medium mb-2">
                  {analysis.learningStyle || 'Balanced Learner'}
                </p>
                <p className="text-sm text-purple-600">
                  Based on your responses, this learning approach will help you maximize your potential.
                </p>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 text-blue-600">
                🎓 Recommendations
              </h3>
              <div className="space-y-3">
                {analysis.recommendations?.length > 0 ? (
                  analysis.recommendations.map((rec, index) => (
                    <div key={index} className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                      • {rec}
                    </div>
                  ))
                ) : (
                  <div className="p-3 bg-blue-50 rounded-lg text-sm text-blue-700">
                    • Based on your scores, we've prepared a personalized learning plan to help you improve.
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            onClick={() => navigate('/assessments')}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium"
          >
            <FiRefreshCw className="w-4 h-4" />
            <span>Take Another Assessment</span>
          </button>
          
          <button
            onClick={() => navigate('/recommendations')}
            className="flex items-center justify-center space-x-2 px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <span>Get Personalized Recommendations</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default AssessmentResultPage;
