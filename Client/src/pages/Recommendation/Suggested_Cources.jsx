import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBook, FiClock, FiTrendingUp, FiDollarSign, FiArrowRight, FiStar, FiAward, FiFilter, FiChevronLeft } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const SuggestedCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  const { isAuthenticated, api } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchSuggestedCourses();
  }, [isAuthenticated]);

  const fetchSuggestedCourses = async () => {
    try {
      const response = await api.get('/api/recommendations/courses');

      if (response.data.success) {
        setCourses(response.data.data || []);
      }
    } catch (err) {
      console.error('Courses fetch error:', err);
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load course suggestions');
      }
    } finally {
      setLoading(false);
    }
  };

  const getMatchColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600 bg-green-50 border-green-200';
    if (percentage >= 60) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'text-green-600 bg-green-50';
      case 'medium':
        return 'text-orange-600 bg-orange-50';
      case 'hard':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.category?.toLowerCase() === filter.toLowerCase();
  });

  const categories = ['all', 'engineering', 'medical', 'commerce', 'arts', 'science'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading course suggestions...</p>
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
              <h1 className="text-3xl font-bold text-gray-900">Suggested Courses</h1>
              <p className="text-gray-600">Courses tailored to your interests and career aspirations</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center space-x-4 mb-8">
          <FiFilter className="text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-300'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCourses.map((course, index) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {course.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getMatchColor(course.matchPercentage || 75)}`}>
                        {course.matchPercentage || 75}% Match
                      </span>
                      {course.difficulty && (
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}>
                          {course.difficulty}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-4">
                  {course.description || "A comprehensive program designed to prepare students for successful careers in their chosen field with hands-on experience and industry exposure."}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center space-x-2">
                    <FiClock className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {course.duration || '4 years'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiDollarSign className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      ₹{course.fees ? (course.fees / 100000).toFixed(1) : '3.5'}L/year
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiTrendingUp className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-600">
                      {course.careerOpportunities || 'High'} prospects
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FiStar className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600">
                      {course.rating || 4.3}/5
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {course.skills && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {course.skills.slice(0, 3).map((skill, skillIndex) => (
                      <span
                        key={skillIndex}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        {skill}
                      </span>
                    ))}
                    {course.skills.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                        +{course.skills.length - 3} more
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Avg. Salary</p>
                    <p className="text-lg font-semibold text-gray-900">
                      ₹{course.averageSalary ? (course.averageSalary / 100000).toFixed(1) : '6.5'}L
                    </p>
                  </div>
                  <Link
                    to={`/courses/${course._id}`}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <span>Learn More</span>
                    <FiArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No course suggestions yet</h3>
            <p className="text-gray-600 mb-4">
              Complete your profile and assessments to get personalized course recommendations
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
        <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-8 text-center">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Need course guidance?</h3>
          <p className="text-gray-600 mb-4">
            Get detailed guidance on admissions, eligibility, and career prospects for your chosen courses
          </p>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
            Get Course Counseling
          </button>
        </div>
      </div>
    </div>
  );
};

export default SuggestedCourses;
