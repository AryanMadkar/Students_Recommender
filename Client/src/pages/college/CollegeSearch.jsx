import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch, FiFilter, FiMapPin, FiStar, FiBookmark, FiArrowRight, FiChevronLeft, FiLoader } from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const CollegeSearch = () => {
  const navigate = useNavigate();
  const [colleges, setColleges] = useState([]);
  const [filteredColleges, setFilteredColleges] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({ 
    state: "", 
    city: "", 
    type: "", 
    course: "", 
    minRating: "", 
    maxFees: "" 
  });
  const [showFilters, setShowFilters] = useState(false);
  const [savedColleges, setSavedColleges] = useState([]);
  const { isAuthenticated, api } = useAuth();
  const { searchColleges } = useApp();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    // Initial load without filters
    fetchColleges();
    fetchSavedColleges();
  }, [isAuthenticated]);

  // Fetch colleges with current filters
  const fetchColleges = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Build clean filter object - only include non-empty values
      const cleanFilters = {};
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value.trim() !== "") {
          cleanFilters[key] = value.trim();
        }
      });
      
      // Add search query if present
      if (searchQuery && searchQuery.trim() !== "") {
        cleanFilters.search = searchQuery.trim();
      }
      
      console.log("Fetching colleges with filters:", cleanFilters);
      
      const response = await api.get("/api/colleges/search", {
        params: cleanFilters
      });
      
      if (response.data.success) {
        setColleges(response.data.data.colleges || []);
        setFilteredColleges(response.data.data.colleges || []);
      }
    } catch (err) {
      setError("Failed to load colleges");
      console.error("Colleges fetch error:", err);
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedColleges = async () => {
    try {
      const response = await api.get("/api/colleges/user/favorites");
      if (response.data.success) {
        const favorites = response.data.data.favorites || [];
        setSavedColleges(favorites.map((fav) => fav._id));
      }
    } catch (err) {
      console.error("Saved colleges fetch error:", err);
    }
  };

  // Handle search and filter changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchColleges();
    }, 500); // Debounce API calls

    return () => clearTimeout(debounceTimer);
  }, [searchQuery, filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ 
      state: "", 
      city: "", 
      type: "", 
      course: "", 
      minRating: "", 
      maxFees: "" 
    });
    setSearchQuery("");
  };

  const toggleSaveCollege = async (collegeId) => {
    try {
      const isSaved = savedColleges.includes(collegeId);
      const method = isSaved ? "delete" : "post";
      await api[method](`/api/colleges/${collegeId}/favorite`);
      setSavedColleges((prev) => 
        isSaved 
          ? prev.filter((id) => id !== collegeId) 
          : [...prev, collegeId]
      );
    } catch (err) {
      console.error("Toggle save error:", err);
    }
  };

  if (loading && colleges.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen">
        <FiLoader className="animate-spin text-4xl text-blue-600" />
        <span className="ml-2">Loading colleges...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center text-blue-600 mr-4"
        >
          <FiChevronLeft className="mr-1" /> Back
        </button>
        <h1 className="text-3xl font-bold">College Search</h1>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search colleges, locations, or courses..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Filters Toggle */}
      <button 
        onClick={() => setShowFilters(!showFilters)} 
        className="flex items-center mb-4 text-blue-600 hover:text-blue-800"
      >
        <FiFilter className="mr-2" /> Filters {showFilters ? "▲" : "▼"}
      </button>

      {/* Filters */}
      {showFilters && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="bg-gray-50 p-4 rounded-lg mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              placeholder="State (e.g., Maharashtra)"
              value={filters.state}
              onChange={(e) => handleFilterChange("state", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="City (e.g., Mumbai)"
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Types</option>
              <option value="Central">Central</option>
              <option value="State">State</option>
              <option value="Private">Private</option>
              <option value="Deemed">Deemed</option>
            </select>
            <input
              placeholder="Course (e.g., Computer Science)"
              value={filters.course}
              onChange={(e) => handleFilterChange("course", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Min Rating (1-5)"
              type="number"
              min="1"
              max="5"
              step="0.1"
              value={filters.minRating}
              onChange={(e) => handleFilterChange("minRating", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
            <input
              placeholder="Max Fees (in lakhs)"
              type="number"
              min="0"
              value={filters.maxFees}
              onChange={(e) => handleFilterChange("maxFees", e.target.value)}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button 
            onClick={clearFilters} 
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          >
            Clear All Filters
          </button>
        </motion.div>
      )}

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-gray-600">
          {searchQuery && `Results for "${searchQuery}" • `}
          {filteredColleges.length} colleges found
          {loading && <FiLoader className="inline animate-spin ml-2" />}
        </p>
      </div>

      {/* College Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredColleges.map((college) => (
          <motion.div
            key={college._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
          >
            <div className="flex justify-between items-start mb-3">
              <h2 className="text-xl font-bold text-gray-800 line-clamp-2">
                {college.name}
              </h2>
              <button 
                onClick={() => toggleSaveCollege(college._id)}
                className="text-xl"
              >
                <FiBookmark 
                  className={savedColleges.includes(college._id) 
                    ? "text-blue-600 fill-current" 
                    : "text-gray-400"
                  } 
                />
              </button>
            </div>

            <div className="space-y-2 mb-4">
              <p className="flex items-center text-gray-600">
                <FiMapPin className="mr-2 text-blue-500" /> 
                {college.location?.city}, {college.location?.state}
              </p>
              
              <p className="flex items-center text-gray-600">
                <FiStar className="mr-2 text-yellow-500" /> 
                {college.ratings?.overall || 4.5}/5 
                <span className="ml-1 text-sm">({college.type})</span>
              </p>

              {college.courses && college.courses.length > 0 && (
                <p className="text-sm text-gray-600">
                  <strong>Courses:</strong> {" "}
                  {college.courses.slice(0, 2).map(course => course.name).join(", ")}
                  {college.courses.length > 2 && ` +${college.courses.length - 2} more`}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {college.placementStats?.averagePackage && (
                  <span>Avg. Package: ₹{(college.placementStats.averagePackage / 100000).toFixed(1)}L</span>
                )}
              </div>
              <Link 
                to={`/colleges/${college._id}`} 
                className="flex items-center text-blue-600 hover:text-blue-800 font-medium"
              >
                View Details <FiArrowRight className="ml-1" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* No Results */}
      {!loading && filteredColleges.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">
            <FiSearch className="mx-auto text-6xl mb-4" />
            <h3 className="text-xl mb-2">No colleges found</h3>
            <p>Try adjusting your search criteria or clearing the filters</p>
          </div>
          <button 
            onClick={clearFilters}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Help Section */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-3">Need Help Finding Colleges?</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <Link 
            to="/assessments" 
            className="block p-4 bg-white rounded-lg hover:bg-gray-50 border"
          >
            <h4 className="font-medium mb-2">Take Assessment</h4>
            <p className="text-sm text-gray-600">Get personalized college recommendations based on your profile</p>
          </Link>
          <Link 
            to="/counseling" 
            className="block p-4 bg-white rounded-lg hover:bg-gray-50 border"
          >
            <h4 className="font-medium mb-2">Get Counseling</h4>
            <p className="text-sm text-gray-600">Speak with experts for admission guidance</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CollegeSearch;
