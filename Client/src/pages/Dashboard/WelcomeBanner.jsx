import React from 'react';

const WelcomeBanner = () => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
          <img 
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=48&h=48&fit=crop&crop=face" 
            alt="Profile" 
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800">Welcome back,</h2>
          <p className="text-xl font-semibold text-gray-800">Priya Sharma!</p>
          <p className="text-sm text-gray-600">Try personalized planning</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
