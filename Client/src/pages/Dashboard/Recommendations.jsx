import React from 'react';
import RecommendationCard from './RecommendationCards';

const Recommendations = () => {
  const recommendations = [
    {
      title: 'Software Development Engineer',
      description: 'A high-demand career focused on designing, developing, and maintaining software systems.',
      image: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=400&h=200&fit=crop',
      tag: 'Explore Career'
    },
    {
      title: 'Indian Institute of Technology Bombay (IIT-B)',
      description: 'One of India\'s premier engineering institutions, highly recommended for its strong academics.',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=400&h=200&fit=crop',
      tag: 'View College'
    },
    {
      title: 'Data Analyst',
      description: 'Analyze complex data to help organizations make informed decisions and identify trends.',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=200&fit=crop',
      tag: 'Explore Career'
    },
    {
      title: 'Delhi University',
      description: 'A prestigious public university in India known for its diverse academic programs.',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&h=200&fit=crop',
      tag: 'View College'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Recommendations</h3>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={index} {...rec} />
        ))}
      </div>
    </div>
  );
};

export default Recommendations;
