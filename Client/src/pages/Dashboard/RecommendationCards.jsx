import React from 'react';
import { motion } from 'framer-motion';

const RecommendationCard = ({ title, description, image, tag }) => {
  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="flex items-center p-4 border rounded-lg hover:shadow-md transition-all cursor-pointer"
    >
      <img
        src={image}
        alt={title}
        className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
      />
      <div className="ml-4 flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
            <p className="text-xs text-gray-600 mt-1 leading-relaxed">{description}</p>
          </div>
          <button className="ml-4 px-3 py-1 text-xs font-medium text-blue-600 bg-blue-50 rounded-full hover:bg-blue-100 transition-colors flex-shrink-0">
            {tag}
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RecommendationCard;
