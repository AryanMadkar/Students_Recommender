import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
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
  FiCheckCircle
} from 'react-icons/fi';
import axios from 'axios';

const TopPath = () => {
  const navigate = useNavigate();
  const [careerPaths, setCareerPaths] = useState([]);
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPath, setSelectedPath] = useState(null);
  const [activeTab, setActiveTab] = useState('trending');

  useEffect(() => {
    fetchTopPaths();
    fetchPersonalizedRoadmap();
  }, []);

  const fetchTopPaths = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch top trending careers
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/recommendations/careers`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCareerPaths(response.data.data || []);
      }
    } catch (err) {
      console.error('Top paths fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load career paths');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchPersonalizedRoadmap = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/recommendations/roadmap`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setRoadmap(response.data.data);
      }
    } catch (err) {
      console.error('Roadmap fetch error:', err);
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
      case 'high': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'low': return 'text-red-600 bg-red-50';
      default: return 'text-blue-600 bg-blue-50';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Top Career Paths</h1>
          <p className="text-gray-600">
            Discover trending careers and get personalized roadmaps for your future
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6">
            <button
              onClick={() => setActiveTab('trending')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'trending'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Trending Careers
            </button>
            <button
              onClick={() => setActiveTab('personalized')}
              className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
                activeTab === 'personalized'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Your Roadmap
            </button>
          </div>

          {activeTab === 'trending' && (
            <div>
              {error ? (
                <div className="text-center py-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <button
                    onClick={fetchTopPaths}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    Retry
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {careerPaths.length > 0 ? careerPaths.map((career, index) => (
                    <motion.div
                      key={career._id || index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow cursor-pointer group"
                      onClick={() => handlePathSelect(career)}
                    >
                      {/* Career Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                            {career.title}
                          </h3>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">{career.category}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getGrowthColor(career.growth?.demand)}`}>
                              {career.growth?.demand || 'High'} Demand
                            </span>
                          </div>
                        </div>
                        
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FiTrendingUp className="w-6 h-6 text-white" />
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {career.description}
                      </p>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <FiDollarSign className="w-4 h-4 text-green-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-500">Entry Salary</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {formatSalary(career.salaryRange?.entry?.min || 600000)}
                          </div>
                        </div>
                        
                        <div className="text-center p-3 bg-gray-50 rounded-lg">
                          <FiBarChart className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                          <div className="text-xs text-gray-500">Growth</div>
                          <div className="text-sm font-semibold text-gray-900">
                            {career.growth?.futureScope || 'Excellent'}
                          </div>
                        </div>
                      </div>

                      {/* Top Skills */}
                      <div className="mb-4">
                        <div className="text-sm font-medium text-gray-900 mb-2">Top Skills:</div>
                        <div className="flex flex-wrap gap-2">
                          {(career.requiredSkills?.slice(0, 3) || []).map((skill, idx) => (
                            <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                              {skill.skill || skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Match Percentage */}
                      {career.matchPercentage && (
                        <div className="mb-4 p-3 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-green-900">Match Score</span>
                            <span className="text-lg font-bold text-green-700">{career.matchPercentage}%</span>
                          </div>
                        </div>
                      )}

                      {/* Action */}
                      <Link
                        to={`/careers/${career._id}`}
                        className="block w-full text-center bg-gray-900 text-white py-2 px-4 rounded-lg hover:bg-gray-800 transition-colors group-hover:bg-blue-600"
                      >
                        Explore Career
                      </Link>
                    </motion.div>
                  )) : (
                    <div className="col-span-full text-center py-8">
                      <FiTarget className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 mb-2">No Career Paths Yet</h3>
                      <p className="text-gray-500 mb-4">
                        Complete your assessment to get personalized career recommendations
                      </p>
                      <Link
                        to="/assessments"
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                      >
                        <span>Take Assessment</span>
                        <FiArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'personalized' && (
            <div>
              {roadmap ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8"
                >
                  {/* Roadmap Summary */}
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">Your Personalized Roadmap</h3>
                    <p className="text-gray-700 mb-4">{roadmap.summary}</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-white rounded-lg">
                        <FiTarget className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-500">Timeline</div>
                        <div className="font-semibold text-gray-900">{roadmap.timeline}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg">
                        <FiAward className="w-6 h-6 text-green-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-500">Key Points</div>
                        <div className="font-semibold text-gray-900">{roadmap.keyPoints?.length || 0}</div>
                      </div>
                      
                      <div className="text-center p-4 bg-white rounded-lg">
                        <FiCheckCircle className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                        <div className="text-sm text-gray-500">Action Steps</div>
                        <div className="font-semibold text-gray-900">{roadmap.actionSteps?.length || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Key Points */}
                  {roadmap.keyPoints && roadmap.keyPoints.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Key Focus Areas</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {roadmap.keyPoints.map((point, index) => (
                          <div key={index} className="flex items-start space-x-3 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-sm font-medium text-blue-600">{index + 1}</span>
                            </div>
                            <p className="text-gray-700">{point}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Action Steps */}
                  {roadmap.actionSteps && roadmap.actionSteps.length > 0 && (
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4">Action Plan</h4>
                      <div className="space-y-4">
                        {roadmap.actionSteps.map((step, index) => (
                          <div key={index} className="flex items-start space-x-4 p-4 bg-white rounded-lg border border-gray-200">
                            <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <FiCheckCircle className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                              <p className="text-gray-900 font-medium">Step {index + 1}</p>
                              <p className="text-gray-600">{step}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="text-center">
                    <Link
                      to="/recommendations"
                      className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-colors"
                    >
                      <span>View All Recommendations</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-12">
                  <FiBookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Personalized Roadmap Yet</h3>
                  <p className="text-gray-500 mb-6">
                    Complete assessments and update your profile to get a personalized career roadmap
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                      to="/assessments"
                      className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                    >
                      <span>Take Assessment</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      to="/profile"
                      className="inline-flex items-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700"
                    >
                      <span>Update Profile</span>
                      <FiArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Selected Path Details */}
        {selectedPath && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-8 shadow-sm"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Career Deep Dive</h2>
              <button
                onClick={() => setSelectedPath(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">{selectedPath.title}</h3>
                <p className="text-gray-700 mb-6">{selectedPath.description}</p>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedPath.requiredSkills?.map((skill, index) => (
                        <span key={index} className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                          {skill.skill || skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Job Roles</h4>
                    <div className="space-y-1">
                      {selectedPath.jobRoles?.map((role, index) => (
                        <div key={index} className="text-gray-700">• {role}</div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Salary Information</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entry Level:</span>
                      <span className="font-semibold">
                        {formatSalary(selectedPath.salaryRange?.entry?.min || 0)} - {formatSalary(selectedPath.salaryRange?.entry?.max || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Mid Level:</span>
                      <span className="font-semibold">
                        {formatSalary(selectedPath.salaryRange?.mid?.min || 0)} - {formatSalary(selectedPath.salaryRange?.mid?.max || 0)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Senior Level:</span>
                      <span className="font-semibold">
                        {formatSalary(selectedPath.salaryRange?.senior?.min || 0)} - {formatSalary(selectedPath.salaryRange?.senior?.max || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <Link
                    to={`/careers/${selectedPath._id}`}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Explore Full Career Details</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TopPath;
