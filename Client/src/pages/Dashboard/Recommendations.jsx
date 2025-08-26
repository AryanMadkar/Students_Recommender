import React from 'react';
import RecommendationCard from './RecommendationCards';
import { motion } from 'framer-motion';

const Recommendations = () => {
  const recommendations = [
    { 
      title: 'Software Development Engineer', 
      description: 'A high-demand career focused on designing, developing, and maintaining software systems. Perfect for problem-solvers who love coding.', 
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop', 
      tag: 'Explore Career',
      type: 'career',
      rating: '4.8'
    },
    { 
      title: 'Indian Institute of Technology Bombay (IIT-B)', 
      description: 'One of India\'s premier engineering institutions, highly recommended for its strong academics and excellent placement record.', 
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop', 
      tag: 'View College',
      type: 'college',
      rating: '4.9'
    },
    { 
      title: 'Data Scientist', 
      description: 'Analyze complex data to help organizations make informed decisions and identify trends. High growth potential in AI/ML era.', 
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop', 
      tag: 'Explore Career',
      type: 'career',
      rating: '4.7'
    },
    { 
      title: 'Delhi University', 
      description: 'A prestigious public university in India known for its diverse academic programs and vibrant campus life.', 
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop', 
      tag: 'View College',
      type: 'college',
      rating: '4.6'
    },
    { 
      title: 'Machine Learning Engineer', 
      description: 'Design and implement ML systems that can learn and improve from data. Perfect blend of software engineering and AI.', 
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=200&fit=crop', 
      tag: 'Explore Career',
      type: 'career',
      rating: '4.8'
    },
    { 
      title: 'Stanford University', 
      description: 'World-renowned university known for innovation, entrepreneurship, and cutting-edge research in technology and engineering.', 
      image: 'https://images.unsplash.com/photo-1564981797816-1043664bf78d?w=400&h=200&fit=crop', 
      tag: 'View College',
      type: 'college',
      rating: '5.0'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Personalized Recommendations</h2>
        <div className="flex space-x-2">
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors">
            Careers
          </button>
          <button className="px-4 py-2 text-gray-600 rounded-xl font-medium hover:bg-gray-100 transition-colors">
            Colleges
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((recommendation, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <RecommendationCard {...recommendation} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
