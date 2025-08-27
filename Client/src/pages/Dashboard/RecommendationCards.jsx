import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiBookmark, FiStar, FiPercent } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const RecommendationCard = ({ 
  title, 
  description, 
  image, 
  tag, 
  type, 
  rating, 
  matchPercentage,
  id 
}) => {
  const isCareer = type === 'career';
  const isCollege = type === 'college';
  const isAssessment = type === 'assessment';
  const isProfile = type === 'profile';

  const getTagColor = () => {
    if (isCareer) return 'bg-emerald-100 text-emerald-700';
    if (isCollege) return 'bg-blue-100 text-blue-700';
    if (isAssessment) return 'bg-purple-100 text-purple-700';
    if (isProfile) return 'bg-orange-100 text-orange-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getLink = () => {
    if (isCareer) return `/careers/${id}`;
    if (isCollege) return `/colleges/${id}`;
    if (isAssessment) return '/assessments';
    if (isProfile) return '/profile';
    return '#';
  };

  return (
    <motion.div
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200 group"
    >
      <div className="flex">
        {/* Image */}
        <div className="w-24 h-20 flex-shrink-0 relative overflow-hidden">
          <img
            src={image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=200&fit=crop'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
          
          {/* Tag */}
          <div className="absolute top-2 left-2">
            <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTagColor()}`}>
              {tag}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1 group-hover:text-blue-600 transition-colors">
              {title}
            </h3>
            
            <div className="flex items-center space-x-2 ml-2 flex-shrink-0">
              {matchPercentage && (
                <div className="flex items-center space-x-1 text-emerald-600">
                  <FiPercent className="w-3 h-3" />
                  <span className="text-xs font-medium">{matchPercentage}</span>
                </div>
              )}
              
              {rating && (
                <div className="flex items-center space-x-1 text-yellow-600">
                  <FiStar className="w-3 h-3 fill-current" />
                  <span className="text-xs font-medium">{rating}</span>
                </div>
              )}
            </div>
          </div>

          <p className="text-xs text-gray-600 line-clamp-2 mb-3">
            {description}
          </p>

          {/* Actions */}
          <div className="flex items-center justify-between">
            <Link
              to={getLink()}
              className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-xs font-medium group"
            >
              <span>{isCareer || isCollege ? 'View Details' : 'Get Started'}</span>
              <FiExternalLink className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
            </Link>

            {(isCareer || isCollege) && (
              <button className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <FiBookmark className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
