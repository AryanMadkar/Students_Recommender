// src/pages/Achievements.js

import React from "react";
import {
  FiChevronLeft,
  FiStar,
  FiTrendingUp,
  FiSearch,
  FiAward,
  FiGift,
  FiZap,
} from "react-icons/fi";

// Sample data for achievements - you can fetch this from an API
const achievementsData = [
  {
    icon: <FiStar />,
    title: "Pathfinder Initiate",
    description: "Completed your first assessment and set a goal.",
    date: "April 15, 2024",
    color: "blue",
  },
  {
    icon: <FiTrendingUp />,
    title: "Career Explorer",
    description: "Explored 5 diverse career paths.",
    date: "April 20, 2024",
    color: "orange",
  },
  {
    icon: <FiSearch />,
    title: "College Navigator",
    description: "Viewed details of 10 colleges and added them to your list.",
    date: "May 01, 2024",
    color: "white",
  },
  {
    icon: <FiGift />,
    title: "Skill Architect",
    description: "Started your first skill roadmap.",
    date: "May 05, 2024",
    color: "white",
  },
  {
    icon: <FiZap />,
    title: "Top Contributor",
    description: "Provided valuable feedback on an assessment.",
    date: "May 12, 2024",
    color: "white",
  },
  {
    icon: <FiAward />,
    title: "Golden Scholar",
    description: "Achieved a perfect score in a core assessment.",
    date: "May 18, 2024",
    color: "blue",
  },
  {
    icon: <FiGift />,
    title: "Community Builder",
    description: "Shared PathPilot with a friend.",
    date: "May 25, 2024",
    color: "white",
  },
  {
    icon: <FiZap />,
    title: "Proactive Learner",
    description: "Completed all recommended daily tasks for a week.",
    date: "June 01, 2024",
    color: "orange",
  },
];

// Reusable Achievement Card Component
const AchievementCard = ({ icon, title, description, date, color }) => {
  const bgColor = {
    blue: "bg-blue-500",
    orange: "bg-orange-500",
    white: "bg-white",
  };

  const iconColor = {
    blue: "text-white",
    orange: "text-white",
    white: "text-black",
  };

  return (
    <div className="bg-white rounded-xl mb-[6rem] shadow-md overflow-hidden flex flex-col p-5 text-center items-center">
      <div
        className={`w-20 h-20 rounded-lg flex items-center justify-center ${bgColor[color]}`}
      >
        <div className={`text-4xl ${iconColor[color]}`}>{icon}</div>
      </div>
      <div className="flex-grow flex flex-col justify-center items-center mt-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-600 mt-1">{description}</p>
        <p className="text-xs text-gray-500 mt-2">Earned: {date}</p>
      </div>
      <button className="mt-4 text-sm font-semibold text-blue-500 hover:text-blue-600">
        View Details
      </button>
    </div>
  );
};

// Main Achievements Page Component
const AchievementsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen font-sans">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center">
          <FiChevronLeft className="text-2xl text-gray-600 cursor-pointer" />
          <h1 className="text-xl font-bold text-gray-800 text-center flex-grow -ml-6">
            Achievements
          </h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-2 gap-4">
          {achievementsData.map((achievement, index) => (
            <AchievementCard
              key={index}
              icon={achievement.icon}
              title={achievement.title}
              description={achievement.description}
              date={achievement.date}
              color={achievement.color}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default AchievementsPage;
