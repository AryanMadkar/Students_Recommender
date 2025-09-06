import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiStar, FiMapPin, FiBookmark, FiArrowRight, FiFilter, FiTrendingUp, FiAward, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const RecommendedColleges = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    budget: '',
    location: ''
  });

  const { isAuthenticated, api } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchRecommendations();
  }, [isAuthenticated]);

  const fetchRecommendations = async () => {
    try {
      const response = await api.get('/api/colleges/recommendations/personalized', {
        params: filters
      });

      if (response.data.success) {
        setRecommendations(response.data.data || []);
      }
    } catch (err) {
      console.error('Recommendations fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load recommendations');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50';
    return 'text-red-600 bg-red-50';
  };

  const toggleSaveCollege = async (collegeId) => {
    try {
      await api.post(`/api/colleges/${collegeId}/favorite`);
      // Update UI to reflect the change
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recommendations...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Recommended Colleges</h1>
              <p className="text-gray-600">Colleges that match your profile and career goals</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <FiFilter className="text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-900">Filter Recommendations</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget Range</label>
              <select
                value={filters.budget}
                onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All budgets</option>
                <option value="low">Under ₹2L per year</option>
                <option value="medium">₹2L - ₹5L per year</option>
                <option value="high">Above ₹5L per year</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All locations</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Delhi">Delhi</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
              </select>
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={fetchRecommendations}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
          </div>
        </div>

        {/* Recommendations Grid */}
        {recommendations.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((college, index) => (
              <motion.div
                key={college._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {college.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                      <FiMapPin className="w-4 h-4" />
                      <span>{college.location?.city}, {college.location?.state}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getMatchColor(college.matchPercentage || 75)}`}>
                      {college.matchPercentage || 75}% Match
                    </span>
                    <button
                      onClick={() => toggleSaveCollege(college._id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <FiBookmark className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {college.description || "Excellent institution known for its academic excellence and outstanding placement record."}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 text-yellow-500 mb-1">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium text-gray-900">
                        {college.ratings?.overall || 4.2}/5
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Rating</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1 mb-1">
                      <FiTrendingUp className="w-4 h-4 text-green-500" />
                      <span className="text-sm font-medium text-gray-900">
                        {college.placement?.average || 85}%
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Placement</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Starting from</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{college.fees?.annual ? (college.fees.annual / 100000).toFixed(1) : '2.5'}L/year
                    </p>
                  </div>
                  <Link
                    to={`/colleges/${college._id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>View Details</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiAward className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No recommendations yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile and take assessments to get personalized college recommendations
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

        {/* Call to Action */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need personalized guidance?</h3>
          <p className="text-gray-600 mb-4">
            Get personalized counseling and application support for your preferred colleges
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Book Counseling Session
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendedColleges;
