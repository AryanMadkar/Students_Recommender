import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiArrowLeft, 
  FiStar, 
  FiBookmark, 
  FiShare2, 
  FiTrendingUp,
  FiDollarSign,
  FiBook,
  FiUsers,
  FiAward,
  FiLoader
} from "react-icons/fi";
import axios from "axios";

const CareerDetails = () => {
  const { careerId } = useParams();
  const navigate = useNavigate();
  const [career, setCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [relatedCareers, setRelatedCareers] = useState([]);

  useEffect(() => {
    fetchCareerDetails();
  }, [careerId]);

  const fetchCareerDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Fetch career details from your backend
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/careers/${careerId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (response.data.success) {
        setCareer(response.data.data);
        // Check if bookmarked
        checkBookmarkStatus();
        // Fetch related careers
        fetchRelatedCareers(response.data.data.category);
      }
    } catch (err) {
      setError('Failed to load career details');
      console.error('Career fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkBookmarkStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/favorites`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      const favorites = response.data.data.careers || [];
      setIsBookmarked(favorites.includes(careerId));
    } catch (err) {
      console.error('Bookmark check error:', err);
    }
  };

  const fetchRelatedCareers = async (category) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/careers?category=${category}&limit=3`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        setRelatedCareers(response.data.data.filter(c => c._id !== careerId));
      }
    } catch (err) {
      console.error('Related careers fetch error:', err);
    }
  };

  const toggleBookmark = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isBookmarked 
        ? `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/favorites/careers/${careerId}`
        : `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/favorites/careers`;
      
      const method = isBookmarked ? 'delete' : 'post';
      
      await axios[method](endpoint, !isBookmarked ? { careerId } : undefined, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setIsBookmarked(!isBookmarked);
    } catch (err) {
      console.error('Bookmark toggle error:', err);
    }
  };

  const formatSalary = (salary) => {
    if (salary >= 1000000) {
      return `₹${(salary / 1000000).toFixed(1)}L`;
    }
    return `₹${(salary / 1000).toFixed(0)}K`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (error || !career) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Career not found'}</p>
          <button
            onClick={() => navigate('/careers')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Back to Careers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleBookmark}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isBookmarked
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <FiBookmark className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
                <span>{isBookmarked ? 'Saved' : 'Save'}</span>
              </button>
              
              <button className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200">
                <FiShare2 className="w-4 h-4" />
                <span>Share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Career Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{career.title}</h1>
                  <p className="text-lg text-gray-600">{career.category}</p>
                </div>
                <div className="flex items-center space-x-2 bg-blue-100 px-3 py-1 rounded-full">
                  <FiTrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-700">
                    {career.growth?.demand || 'High'} Demand
                  </span>
                </div>
              </div>
              
              <p className="text-gray-700 leading-relaxed mb-6">{career.description}</p>
              
              {/* Key Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <FiDollarSign className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Entry Salary</div>
                  <div className="font-semibold text-gray-900">
                    {formatSalary(career.salaryRange?.entry?.min || 0)} - {formatSalary(career.salaryRange?.entry?.max || 0)}
                  </div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <FiAward className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Growth</div>
                  <div className="font-semibold text-gray-900">{career.growth?.futureScope || 'Excellent'}</div>
                </div>
                
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <FiUsers className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-sm text-gray-500">Automation Risk</div>
                  <div className="font-semibold text-gray-900">{career.growth?.automationRisk || 'Low'}</div>
                </div>
              </div>
            </motion.div>

            {/* Required Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Required Skills</h2>
              <div className="space-y-4">
                {career.requiredSkills?.map((skill, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                    <div>
                      <div className="font-semibold text-gray-900">{skill.skill}</div>
                      <div className="text-sm text-gray-500">Proficiency: {skill.proficiency}</div>
                    </div>
                    <div className="flex">
                      {[...Array(skill.importance || 3)].map((_, i) => (
                        <FiStar key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Salary Breakdown */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-2xl p-8 shadow-sm"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Salary Breakdown</h2>
              <div className="space-y-4">
                {[
                  { level: 'Entry Level', range: career.salaryRange?.entry },
                  { level: 'Mid Level', range: career.salaryRange?.mid },
                  { level: 'Senior Level', range: career.salaryRange?.senior }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                    <div className="font-semibold text-gray-900">{item.level}</div>
                    <div className="text-lg font-bold text-gray-900">
                      {formatSalary(item.range?.min || 0)} - {formatSalary(item.range?.max || 0)}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Education Path */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                <FiBook className="w-5 h-5 mr-2 text-blue-600" />
                Education Path
              </h3>
              <div className="space-y-4">
                {career.educationPath?.map((edu, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-xl">
                    <div className="font-semibold text-gray-900">{edu.level}</div>
                    <div className="text-sm text-gray-600">{edu.fields?.join(', ')}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      Duration: {edu.duration} • {edu.mandatory ? 'Required' : 'Optional'}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Job Roles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Roles</h3>
              <div className="space-y-2">
                {career.jobRoles?.map((role, index) => (
                  <div key={index} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm">
                    {role}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Industries */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Top Industries</h3>
              <div className="space-y-2">
                {career.industries?.map((industry, index) => (
                  <div key={index} className="px-3 py-2 bg-green-50 text-green-700 rounded-lg text-sm">
                    {industry}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Related Careers */}
            {relatedCareers.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-2xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-bold text-gray-900 mb-4">Related Careers</h3>
                <div className="space-y-3">
                  {relatedCareers.map((relatedCareer) => (
                    <Link
                      key={relatedCareer._id}
                      to={`/careers/${relatedCareer._id}`}
                      className="block p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="font-medium text-gray-900">{relatedCareer.title}</div>
                      <div className="text-sm text-gray-600">{relatedCareer.category}</div>
                    </Link>
                  ))}
                </div>
              </motion.div>
            )}

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <h3 className="text-xl font-bold mb-2">Ready to Start?</h3>
              <p className="text-blue-100 mb-4">
                Take our assessment to see how well this career matches your skills and interests.
              </p>
              <Link
                to="/assessments"
                className="inline-flex items-center space-x-2 bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
              >
                <span>Take Assessment</span>
                <FiArrowLeft className="w-4 h-4 rotate-180" />
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDetails;
