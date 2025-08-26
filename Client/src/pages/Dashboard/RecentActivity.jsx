import React from 'react';
import { FiCheckCircle, FiEye, FiHeart } from 'react-icons/fi';

const RecentActivity = () => {
  const activities = [
    {
      icon: FiCheckCircle,
      text: 'Completed "Career Aptitude Test"',
      time: '2 days ago',
      color: 'text-green-600'
    },
    {
      icon: FiEye,
      text: 'Viewed details for "IISM Institute of Science and Technology"',
      time: '3 days ago',
      color: 'text-blue-600'
    },
    {
      icon: FiHeart,
      text: 'Saved "Data Scientist" as a favorite career',
      time: '1 week ago',
      color: 'text-red-600'
    }
  ];

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className={`p-1 ${activity.color}`}>
              <activity.icon size={16} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-800">{activity.text}</p>
              <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;
