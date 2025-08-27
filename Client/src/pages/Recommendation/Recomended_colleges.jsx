import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiStar, 
  FiMapPin, 
  FiBookmark, 
  FiArrowRight,
  FiFilter,
  FiTrendingUp,
  FiAward
} from 'react-icons/fi';
import axios from 'axios';

const RecommendedColleges = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ budget: '', location: '' });

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/recommendations/colleges`,
        {
          headers: { Authorization: `Bearer ${token}` },
          params: filters
        }
      );

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Recommended Colleges</h1>
          <p className="text-gray-600">
            Colleges that match your profile and career goals
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl p-6 shadow-sm mb-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <FiFilter className="w-5 h-5 text-gray-400" />
            <span className="font-medium text-gray-900">Refine Recommendations</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Budget (Annual Fees)</label>
              <select
                value={filters.budget}
                onChange={(e) => setFilters(prev => ({ ...prev, budget: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Budget</option>
                <option value="0-100000">Under ₹1 Lakh</option>
                <option value="100000-300000">₹1-3 Lakhs</option>
                <option value="300000-500000">₹3-5 Lakhs</option>
                <option value="500000+">Above ₹5 Lakhs</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Location</label>
              <select
                value={filters.location}
                onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Any Location</option>
                <option value="Delhi">Delhi</option>
                <option value="Mumbai">Mumbai</option>
                <option value="Bangalore">Bangalore</option>
                <option value="Chennai">Chennai</option>
                <option value="Hyderabad">Hyderabad</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={fetchRecommendations}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Apply Filters
            </button>
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

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {recommendations.map((college, index) => (
            <motion.div
              key={college._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                        {college.name || college.title}
                      </h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(college.matchScore || college.matchPercentage || 85)}`}>
                        {college.matchScore || college.matchPercentage || 85}% Match
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-4 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <FiMapPin className="w-4 h-4" />
                        <span className="text-sm">{college.location?.city || 'Location'}, {college.location?.state || 'State'}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1">
                        <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="text-sm">{college.ratings?.overall || '4.5'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    <FiBookmark className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {college.description || "Excellent institution known for its academic excellence and outstanding placement record."}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <FiTrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-500">Placement</div>
                    <div className="font-semibold text-gray-900">{college.placementStats?.placementPercentage || 95}%</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <FiAward className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-500">Avg Package</div>
                    <div className="font-semibold text-gray-900">₹{((college.placementStats?.averagePackage || 1200000) / 100000).toFixed(1)}L</div>
                  </div>
                  
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <FiStar className="w-5 h-5 text-purple-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-500">Rating</div>
                    <div className="font-semibold text-gray-900">{college.ratings?.overall || 4.5}/5</div>
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Why this is recommended for you:</h4>
                  <ul className="text-sm text-gray-700 space-y-1">
                    {college.reasons?.map((reason, idx) => (
                      <li key={idx} className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>{reason}</span>
                      </li>
                    )) || [
                      <li key={1} className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>Matches your academic profile and interests</span>
                      </li>,
                      <li key={2} className="flex items-start space-x-2">
                        <span className="text-blue-600">•</span>
                        <span>Strong placement record in your preferred field</span>
                      </li>
                    ]}
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/colleges/${college._id || college.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors group"
                  >
                    <span>View Details</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Compare
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Recommendations */}
        {recommendations.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiAward className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Recommendations Yet</h3>
            <p className="text-gray-500 mb-6">
              Complete your profile and take assessments to get personalized college recommendations
            </p>
            <Link
              to="/assessments"
              className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
            >
              <span>Take Assessment</span>
              <FiArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        )}

        {/* Call to Action */}
        {recommendations.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Need More Guidance?</h3>
            <p className="text-blue-100 mb-6">
              Get personalized counseling and application support for your preferred colleges
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-50">
                Book Counseling Session
              </button>
              <Link
                to="/colleges"
                className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-400"
              >
                Explore All Colleges
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default RecommendedColleges;
