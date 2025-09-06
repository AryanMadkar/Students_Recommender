import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiHeart,
  FiStar,
  FiMapPin,
  FiBook,
  FiTrendingUp,
  FiTrash2,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const Favorites = () => {
  const [activeTab, setActiveTab] = useState("colleges");
  const [favorites, setFavorites] = useState({
    colleges: [],
    careers: [],
    courses: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const { user, isAuthenticated, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchFavorites();
  }, [isAuthenticated]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("/api/users/favorites");
      if (response.data.success) {
        setFavorites(response.data.data);
      }
    } catch (err) {
      console.error("Favorites fetch error:", err);
      setError("Failed to load favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (id, type) => {
    try {
      await api.delete(`/api/users/favorites/${type}/${id}`);
      setFavorites((prev) => ({
        ...prev,
        [type]: prev[type].filter((item) => item._id !== id),
      }));
    } catch (err) {
      console.error("Remove favorite error:", err);
    }
  };

  const tabs = [
    {
      id: "colleges",
      label: "Colleges",
      icon: FiBook,
      count: favorites.colleges.length,
    },
    {
      id: "careers",
      label: "Careers",
      icon: FiTrendingUp,
      count: favorites.careers.length,
    },
    {
      id: "courses",
      label: "Courses",
      icon: FiStar,
      count: favorites.courses.length,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
              <h1 className="text-3xl font-bold text-gray-900">My Favorites</h1>
              <p className="text-gray-600">
                Your saved colleges, careers, and courses
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div className="bg-white rounded-xl shadow-sm">
          {/* Colleges Tab */}
          {activeTab === "colleges" && (
            <div className="p-6">
              {favorites.colleges.length === 0 ? (
                <div className="text-center py-12">
                  <FiBook className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No favorite colleges yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start exploring colleges and save your favorites
                  </p>
                  <Link
                    to="/colleges/search"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Explore Colleges
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.colleges.map((college) => (
                    <motion.div
                      key={college._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {college.name}
                        </h3>
                        <button
                          onClick={() =>
                            removeFavorite(college._id, "colleges")
                          }
                          className="text-red-400 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                        <FiMapPin className="w-4 h-4" />
                        <span>
                          {college.location?.city}, {college.location?.state}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                        <FiStar className="w-4 h-4" />
                        <span>{college.ratings?.overall || "N/A"}/5</span>
                      </div>
                      <Link
                        to={`/colleges/${college._id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                      >
                        View Details →
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Careers Tab */}
          {activeTab === "careers" && (
            <div className="p-6">
              {favorites.careers.length === 0 ? (
                <div className="text-center py-12">
                  <FiTrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No favorite careers yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Discover career paths that match your interests
                  </p>
                  <Link
                    to="/careers/explore"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Explore Careers
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.careers.map((career) => (
                    <motion.div
                      key={career._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {career.title}
                        </h3>
                        <button
                          onClick={() => removeFavorite(career._id, "careers")}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {career.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-green-600">
                          {career.salaryRange || "Salary varies"}
                        </span>
                        <Link
                          to={`/careers/${career._id}`}
                          className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                          View Details →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === "courses" && (
            <div className="p-6">
              {favorites.courses.length === 0 ? (
                <div className="text-center py-12">
                  <FiStar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No favorite courses yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Find courses that align with your career goals
                  </p>
                  <Link
                    to="/courses/suggested"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Explore Courses
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.courses.map((course) => (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-semibold text-gray-900">
                          {course.name}
                        </h3>
                        <button
                          onClick={() => removeFavorite(course._id, "courses")}
                          className="text-red-400 hover:text-red-600"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {course.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-500">
                          {course.duration}
                        </span>
                        <span className="text-sm font-medium text-blue-600">
                          Learn More →
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Favorites;
