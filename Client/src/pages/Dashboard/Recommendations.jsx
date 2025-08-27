import React from "react";
import RecommendationCard from "./RecommendationCards";
import { motion } from "framer-motion";
import { FiStar, FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";

const Recommendations = ({ dashboardData }) => {
  const recommendations = dashboardData?.recommendations || [];

  // Default recommendations if no real data
  const defaultRecommendations = [
    {
      title: "Complete Your Profile",
      description:
        "Add more details to your profile to get personalized recommendations tailored to your interests and goals.",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop",
      tag: "Get Started",
      type: "profile",
      rating: null,
    },
    {
      title: "Take Assessment",
      description:
        "Start with our comprehensive assessment to discover your strengths and get career recommendations.",
      image:
        "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=200&fit=crop",
      tag: "Assessment",
      type: "assessment",
      rating: null,
    },
  ];

  const displayRecommendations =
    recommendations.length > 0
      ? recommendations.slice(0, 6)
      : defaultRecommendations;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
      className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <h2 className="text-xl font-semibold text-gray-900">
            Recommendations
          </h2>
          <FiStar className="w-5 h-5 text-yellow-500" />
        </div>
        {recommendations.length > 0 && (
          <Link
            to="/recommendations"
            className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center space-x-1"
          >
            <span>View All</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      <div className="space-y-4">
        {displayRecommendations.map((recommendation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 * index }}
          >
            <RecommendationCard
              title={recommendation.title}
              description={recommendation.description}
              image={recommendation.image}
              tag={recommendation.tag}
              type={recommendation.type}
              rating={recommendation.rating}
              matchPercentage={recommendation.matchPercentage}
            />
          </motion.div>
        ))}
      </div>

      {recommendations.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-8"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiStar className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="font-medium text-gray-900 mb-2">
            No Recommendations Yet
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Complete your profile and take assessments to get personalized
            recommendations
          </p>
          <Link
            to="/assessments"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            <span>Get Started</span>
            <FiArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Recommendations;
