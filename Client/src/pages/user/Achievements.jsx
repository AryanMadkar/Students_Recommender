import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiChevronLeft,
  FiStar,
  FiTrendingUp,
  FiSearch,
  FiAward,
  FiGift,
  FiZap,
  FiTarget,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import { useApp } from "../../context/AppContext";

const Achievements = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { user, isAuthenticated, api } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchAchievements();
  }, [isAuthenticated]);

  const fetchAchievements = async () => {
    try {
      const response = await api.get("/api/users/achievements");
      if (response.data.success) {
        setAchievements(response.data.data || defaultAchievements);
      }
    } catch (err) {
      console.error("Achievements fetch error:", err);
      setAchievements(defaultAchievements);
    } finally {
      setLoading(false);
    }
  };

  const defaultAchievements = [
    {
      id: 1,
      title: "Welcome to PathPilot!",
      description:
        "Successfully created your account and started your career journey",
      icon: <FiGift className="w-6 h-6" />,
      date: new Date().toLocaleDateString(),
      type: "milestone",
      earned: true,
    },
    {
      id: 2,
      title: "Profile Explorer",
      description:
        "Complete your profile to unlock personalized recommendations",
      icon: <FiStar className="w-6 h-6" />,
      date: "Not yet earned",
      type: "profile",
      earned: false,
    },
    {
      id: 3,
      title: "Assessment Starter",
      description: "Take your first career assessment",
      icon: <FiTarget className="w-6 h-6" />,
      date: "Not yet earned",
      type: "assessment",
      earned: false,
    },
    {
      id: 4,
      title: "Career Explorer",
      description: "Explore 10 different career paths",
      icon: <FiTrendingUp className="w-6 h-6" />,
      date: "Not yet earned",
      type: "exploration",
      earned: false,
    },
    {
      id: 5,
      title: "College Hunter",
      description: "Research and save 5 colleges to your favorites",
      icon: <FiAward className="w-6 h-6" />,
      date: "Not yet earned",
      type: "research",
      earned: false,
    },
  ];

  const filteredAchievements = achievements.filter(
    (achievement) =>
      achievement.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const earnedCount = achievements.filter((a) => a.earned).length;
  const totalCount = achievements.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              <h1 className="text-3xl font-bold text-gray-900">Achievements</h1>
              <p className="text-gray-600">
                Track your progress and milestones
              </p>
            </div>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Your Progress
            </h2>
            <div className="text-sm text-gray-600">
              {earnedCount} of {totalCount} earned
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${(earnedCount / totalCount) * 100}%` }}
            ></div>
          </div>
          <div className="mt-2 text-sm text-gray-600">
            {Math.round((earnedCount / totalCount) * 100)}% complete
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search achievements..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                achievement.earned
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`p-3 rounded-lg ${
                    achievement.earned
                      ? "bg-green-100 text-green-600"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {achievement.earned ? (
                    <FiCheckCircle className="w-6 h-6" />
                  ) : (
                    achievement.icon
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-600 mb-3">
                    {achievement.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      {achievement.earned ? "Earned: " : "Available: "}
                      {achievement.date}
                    </span>
                    {achievement.earned && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                        Completed
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredAchievements.length === 0 && (
          <div className="text-center py-12">
            <FiSearch className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No achievements found matching your search.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Achievements;
