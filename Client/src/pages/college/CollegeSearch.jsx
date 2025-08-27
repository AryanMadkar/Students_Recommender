import React from "react";
import { FiChevronLeft, FiArrowRight } from "react-icons/fi";

const colleges = [
  {
    id: 1,
    name: "Indian Institute of Technology Bombay",
    location: "Mumbai",
    courses: "B.Tech, M.Tech, Data Science",
    img: "https://source.unsplash.com/70x70/?university,iit",
  },
  {
    id: 2,
    name: "Indian Institute of Management Ahmedabad",
    location: "Ahmedabad",
    courses: "MBA, Data Analytics",
    img: "https://source.unsplash.com/70x70/?college,ahmedabad",
  },
  {
    id: 3,
    name: "Delhi Technological University",
    location: "Delhi",
    courses: "B.Tech, B.Sc Data Science",
    img: "https://source.unsplash.com/70x70/?campus,delhi",
  },
];

const CollegeSearch = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    {/* Header */}
    <header className="bg-white px-4 py-3 flex items-center border-b border-gray-100">
      <button className="p-2 rounded-lg hover:bg-gray-100">
        <FiChevronLeft className="w-5 h-5 text-gray-600" />
      </button>
      <span className="text-base font-semibold flex-1 text-center">
        Find Colleges
      </span>
    </header>

    {/* List */}
    <div className="flex-1 overflow-y-auto px-4 pb-4">
      <h3 className="text-xs font-medium text-gray-700 mt-3 mb-2">
        Recommended Colleges
      </h3>
      <ul className="space-y-3">
        {colleges.map((college) => (
          <li
            key={college.id}
            className="bg-white rounded-lg p-3 border border-gray-100 flex items-center shadow hover:shadow-md transition"
          >
            <img
              src={college.img}
              alt=""
              className="rounded-md w-14 h-14 object-cover mr-3"
            />
            <div className="flex-1">
              <div className="font-semibold text-sm">{college.name}</div>
              <div className="text-xs text-gray-500">{college.courses}</div>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2 font-medium text-xs flex items-center gap-1">
              <span>View Details</span>
              <FiArrowRight />
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
);

export default CollegeSearch;
