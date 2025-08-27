import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  FiSearch, 
  FiFilter, 
  FiMapPin, 
  FiStar,
  FiBookmark,
  FiArrowRight,
  FiChevronLeft,
  FiLoader
} from "react-icons/fi";
import axios from "axios";

const CollegeSearch = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    state: '',
    city: '',
    type: '',
    course: '',
    minRating: '',
    maxFees: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedColleges, setSavedColleges] = useState([]);

  useEffect(() => {
    fetchColleges();
    fetchSavedColleges();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [colleges, searchQuery, filters]);

  const fetchColleges = async () => {
    try {
      const token = localStorage.getItem('token');
      const queryParams = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) queryParams.set(key, value);
      });

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/colleges/search?${queryParams}`,
        token ? { headers: { Authorization: `Bearer ${token}` } } : {}
      );

      if (response.data.success) {
        setColleges(response.data.data.colleges || []);
      }
    } catch (err) {
      setError('Failed to load colleges');
      console.error('Colleges fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await axios.get(
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/colleges/user/favorites`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        const favorites = response.data.data.favorites || [];
        setSavedColleges(favorites.map(fav => fav._id));
      }
    } catch (err) {
      console.error('Saved colleges fetch error:', err);
    }
  };

  const applyFilters = () => {
    let filtered = [...colleges];

    // Search query filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(college => 
        college.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location?.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.location?.state?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        college.courses?.some(course => 
          course.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply other filters
    if (filters.state) {
      filtered = filtered.filter(college => 
        college.location?.state?.toLowerCase() === filters.state.toLowerCase()
      );
    }

    if (filters.city) {
      filtered = filtered.filter(college => 
        college.location?.city?.toLowerCase() === filters.city.toLowerCase()
      );
    }

    if (filters.type) {
      filtered = filtered.filter(college => college.type === filters.type);
    }

    if (filters.course) {
      filtered = filtered.filter(college => 
        college.courses?.some(course => 
          course.name.toLowerCase().includes(filters.course.toLowerCase())
        )
      );
    }

    if (filters.minRating) {
      filtered = filtered.filter(college => 
        (college.ratings?.overall || 0) >= parseFloat(filters.minRating)
      );
    }

    if (filters.maxFees) {
      filtered = filtered.filter(college => {
        const minFee = Math.min(...(college.courses?.map(course => course.fees?.annual || 0) || [0]));
        return minFee <= parseInt(filters.maxFees) * 100000; // Convert lakhs to rupees
      });
    }

    setFilteredColleges(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      state: '',
      city: '',
      type: '',
      course: '',
      minRating: '',
      maxFees: ''
    });
    setSearchQuery('');
  };

  const toggleSaveCollege = async (collegeId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const isSaved = savedColleges.includes(collegeId);
      const method = isSaved ? 'delete' : 'post';
      
      await axios[method](
        `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/colleges/${collegeId}/favorite`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSavedColleges(prev => 
        isSaved 
          ? prev.filter(id => id !== collegeId)
          : [...prev, collegeId]
      );
    } catch (err) {
      console.error('Toggle save error:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FiLoader className="w-8 h-8 text-blue-600 animate-spin" />
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
              <FiChevronLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            
            <h1 className="text-xl font-semibold text-gray-900">Find Colleges</h1>
            
            <Link
              to="/colleges/favorites"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Saved ({savedColleges.length})
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-6 shadow-sm mb-8"
        >
          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search colleges, cities, courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FiFilter className="w-4 h-4" />
              <span>Filters</span>
            </button>
          </div>

          {/* Filters */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input
                  type="text"
                  placeholder="Enter state"
                  value={filters.state}
                  onChange={(e) => handleFilterChange('state', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input
                  type="text"
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => handleFilterChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Types</option>
                  <option value="Government">Government</option>
                  <option value="Private">Private</option>
                  <option value="Deemed">Deemed</option>
                  <option value="Central">Central</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
                <input
                  type="text"
                  placeholder="Enter course name"
                  value={filters.course}
                  onChange={(e) => handleFilterChange('course', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Rating</label>
                <select
                  value={filters.minRating}
                  onChange={(e) => handleFilterChange('minRating', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Any Rating</option>
                  <option value="4">4+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                  <option value="3">3+ Stars</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Fees (Lakhs)</label>
                <input
                  type="number"
                  placeholder="Enter max fees"
                  value={filters.maxFees}
                  onChange={(e) => handleFilterChange('maxFees', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div className="sm:col-span-2 lg:col-span-3 flex justify-end">
                <button
                  onClick={clearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            </motion.div>
          )}
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

        {/* Results Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {filteredColleges.length} Colleges Found
            </h2>
            {searchQuery && (
              <p className="text-gray-600">
                Results for "{searchQuery}"
              </p>
            )}
          </div>
        </div>

        {/* College Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredColleges.map((college, index) => (
            <motion.div
              key={college._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {college.name}
                    </h3>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <FiMapPin className="w-4 h-4" />
                      <span className="text-sm">{college.location?.city}, {college.location?.state}</span>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => toggleSaveCollege(college._id)}
                    className={`p-2 rounded-lg transition-colors ${
                      savedColleges.includes(college._id)
                        ? 'bg-red-100 text-red-600'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <FiBookmark className={`w-4 h-4 ${savedColleges.includes(college._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center justify-center space-x-1 text-blue-600 mb-1">
                      <FiStar className="w-4 h-4 fill-current" />
                      <span className="font-semibold">{college.ratings?.overall || 'N/A'}</span>
                    </div>
                    <div className="text-xs text-gray-600">Rating</div>
                  </div>
                  
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="font-semibold text-green-600 mb-1">
                      {college.placementStats?.placementPercentage || 85}%
                    </div>
                    <div className="text-xs text-gray-600">Placement</div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                    {college.type}
                  </span>
                  {college.courses && college.courses.length > 0 && (
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                      {college.courses.length} Courses
                    </span>
                  )}
                </div>

                {/* Courses Preview */}
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    {college.courses?.slice(0, 2).map(course => course.name).join(', ')}
                    {college.courses?.length > 2 && ` +${college.courses.length - 2} more`}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex space-x-2">
                  <Link
                    to={`/colleges/${college._id}`}
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors group"
                  >
                    <span>View Details</span>
                    <FiArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  
                  <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
                    Compare
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* No Results */}
        {filteredColleges.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiSearch className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No colleges found</h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your search criteria or clearing the filters
            </p>
            <button
              onClick={clearFilters}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
            >
              Clear Filters
            </button>
          </motion.div>
        )}

        {/* Load More (if pagination is implemented) */}
        {filteredColleges.length > 0 && filteredColleges.length % 20 === 0 && (
          <div className="text-center mt-8">
            <button className="bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors">
              Load More Colleges
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollegeSearch;
