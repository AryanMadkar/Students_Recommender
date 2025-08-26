import React from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink, FiBookmark, FiStar } from 'react-icons/fi';

const RecommendationCard = ({ title, description, image, tag, type, rating }) => {
  const isCareer = tag === 'Explore Career';
  
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300"
    >
      <div className="relative overflow-hidden">
        <img 
          src={image} 
          alt={title}
          className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-colors"
          >
            <FiBookmark className="w-4 h-4 text-gray-600" />
          </motion.button>
        </div>
        <div className="absolute bottom-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
            isCareer 
              ? 'bg-blue-500/90 text-white' 
              : 'bg-purple-500/90 text-white'
          }`}>
            {tag}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-lg font-bold text-gray-900 leading-tight">{title}</h3>
          {rating && (
            <div className="flex items-center space-x-1 ml-2">
              <FiStar className="w-4 h-4 text-yellow-500 fill-current" />
              <span className="text-sm font-medium text-gray-600">{rating}</span>
            </div>
          )}
        </div>
        
        <p className="text-gray-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {description}
        </p>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className={`w-full py-3 px-4 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 ${
            isCareer
              ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
        >
          <span>{tag}</span>
          <FiExternalLink className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
