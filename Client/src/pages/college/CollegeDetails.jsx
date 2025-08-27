import React, { useState } from "react";
import { FiChevronLeft, FiStar } from "react-icons/fi";

const demoCollege = {
  name: "Indian Institute of Technology Bombay",
  location: "Mumbai",
  img: "https://source.unsplash.com/70x70/?iit,building",
  badges: ["Government", "Engineering", "Top Ranked"],
  courses: [
    { code: "B.Tech", name: "Computer Science & Engineering" },
    { code: "B.Sc", name: "Data Science" },
    { code: "M.Tech", name: "AI & Machine Learning" }
  ]
};

const CollegeDetails = () => {
  const [tab, setTab] = useState("courses");
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
        <button className="p-2 rounded-lg hover:bg-gray-100">
          <FiChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <span className="text-base font-semibold flex-1 text-center">{demoCollege.name}</span>
        <button className="p-2 rounded-lg">
          <FiStar className="w-5 h-5 text-gray-400" />
        </button>
      </header>
      <div className="flex-1 overflow-y-auto px-4 py-5">
        <div className="flex flex-col items-center">
          <img src={demoCollege.img} alt="" className="w-16 h-16 rounded-full shadow border-2 border-gray-100 mb-3"/>
          <h2 className="text-lg font-semibold mb-2 text-center">{demoCollege.name}</h2>
          <div className="flex gap-2 mb-4">
            {demoCollege.badges.map((b, i) => (
              <span key={i} className="bg-blue-100 text-blue-700 rounded px-2 py-0.5 text-xs">{b}</span>
            ))}
          </div>
        </div>
        <div className="flex justify-center mb-4 gap-4">
          <button onClick={() => setTab("courses")}
            className={`px-4 py-2 rounded-t-lg font-medium text-xs ${tab === "courses" ? "bg-white border-b-2 border-blue-600 text-blue-600 shadow" : "bg-gray-100 text-gray-500"}`}>Courses</button>
          <button onClick={() => setTab("reviews")}
            className={`px-4 py-2 rounded-t-lg font-medium text-xs ${tab === "reviews" ? "bg-white border-b-2 border-blue-600 text-blue-600 shadow" : "bg-gray-100 text-gray-500"}`}>Reviews</button>
        </div>
        {tab === "courses" && (
          <div>
            <h4 className="font-semibold mb-2 text-sm">Available Courses</h4>
            <ul>
              {demoCollege.courses.map((course, i) => (
                <li key={i} className="flex items-center justify-between p-3 border-b">
                  <span className="text-sm font-medium">{course.code}</span>
                  <span className="text-gray-600 text-sm">{course.name}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {tab === "reviews" && (
          <div className="text-gray-500 mt-6 text-center text-sm">
            ★ No reviews yet. Be the first to add your experience!
          </div>
        )}
      </div>
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 text-gray-400">
        <FiStar />
        <FiStar />
        <FiStar />
        <FiStar />
      </nav>
    </div>
  );
};

export default CollegeDetails;
