import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FiBook, 
  FiClock, 
  FiTrendingUp, 
  FiDollarSign,
  FiArrowRight,
  FiStar,
  FiAward,
  FiFilter
} from 'react-icons/fi';
import axios from 'axios';

const SuggestedCourses = () => {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSuggestedCourses();
  }, []);

  const fetchSuggestedCourses = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/recommendations/courses`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

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
      case 'easy': return 'text-green-600 bg-green-50';
      case 'medium': return 'text-orange-600 bg-orange-50';
      case 'hard': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const filteredCourses = courses.filter(course => {
    if (filter === 'all') return true;
    return course.category?.toLowerCase() === filter.toLowerCase();
  });

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Suggested Courses</h1>
          <p className="text-gray-600">
            Courses tailored to your interests and career aspirations
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
            <span className="font-medium text-gray-900">Filter by Category</span>
          </div>
          
          <div className="flex flex-wrap gap-3">
            {['all', 'Engineering', 'Medical', 'Commerce', 'Arts', 'Science', 'Management'].map((category) => (
              <button
                key={category}
                onClick={() => setFilter(category)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filter === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
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

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course._id || index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getMatchColor(course.matchPercentage || 85)}`}>
                        {course.matchPercentage || 85}% Match
                      </span>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor('medium')}`}>
                        {course.difficulty || 'Medium'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {course.name || course.title}
                    </h3>
                    
                    <div className="text-sm text-gray-600">
                      {course.shortName || course.category} • {course.duration || '4 years'}
                    </div>
                  </div>
                  
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FiBook className="w-6 h-6 text-white" />
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {course.description || "A comprehensive program designed to prepare students for successful careers in their chosen field with hands-on experience and industry exposure."}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiClock className="w-5 h-5 text-blue-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-500">Duration</div>
                    <div className="font-semibold text-gray-900">{course.duration || '4 years'}</div>
                  </div>
                  
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <FiDollarSign className="w-5 h-5 text-green-600 mx-auto mb-1" />
                    <div className="text-sm text-gray-500">Avg Salary</div>
                    <div className="font-semibold text-gray-900">
                      ₹{((course.careerProspects?.[0]?.averageSalary || 800000) / 100000).toFixed(1)}L
                    </div>
                  </div>
                </div>

                {/* Skills */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Key Skills You'll Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {(course.skills?.technical?.slice(0, 4) || ['Problem Solving', 'Critical Thinking', 'Communication', 'Teamwork']).map((skill, idx) => (
                      <span key={idx} className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Career Prospects */}
                <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Career Opportunities:</h4>
                  <div className="space-y-1">
                    {(course.careerProspects?.slice(0, 3) || [
                      { jobRole: 'Software Engineer', averageSalary: 1200000 },
                      { jobRole: 'Product Manager', averageSalary: 1500000 }
                    ]).map((career, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span className="text-gray-700">{career.jobRole}</span>
                        <span className="font-medium text-gray-900">
                          ₹{((career.averageSalary || 800000) / 100000).toFixed(1)}L
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Eligibility */}
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">Eligibility:</h4>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>• {course.eligibility?.academicRequirement || '12th with relevant subjects'}</div>
                    <div>• Minimum {course.eligibility?.minimumMarks || 60}% marks</div>
                    {course.eligibility?.entranceExams && course.eligibility.entranceExams.length > 0 && (
                      <div>• {course.eligibility.entranceExams.join(', ')}</div>
                    )}
                  </div>
                </div>

                {/* Why Recommended */}
                <div className="mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-semibold text-yellow-900 mb-2">Why this matches you:</h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    <li>• Aligns with your assessment results</li>
                    <li>• High growth potential in current market</li>
                    <li>• Matches your academic background</li>
                  </ul>
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                  <Link
                    to={`/courses/${course._id || course.id}`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors group"
                  >
                    <span>Learn More</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button className="px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    <FiStar className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Courses */}
        {filteredCourses.length === 0 && !error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiBook className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Course Suggestions Yet</h3>
            <p className="text-gray-500 mb-6">
              Complete your profile and assessments to get personalized course recommendations
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
        {filteredCourses.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-8 text-white text-center"
          >
            <h3 className="text-2xl font-bold mb-2">Ready to Start Your Journey?</h3>
            <p className="text-purple-100 mb-6">
              Get detailed guidance on admissions, eligibility, and career prospects for your chosen courses
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50">
                Schedule Consultation
              </button>
              <Link
                to="/colleges"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-400"
              >
                Find Colleges
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuggestedCourses;
