import React from "react";
import { FiArrowRight, FiStar } from "react-icons/fi";

const demoCareer = {
  title: "Data Scientist",
  desc: "A data scientist analyzes large sets of data to derive meaningful insights, typically using statistical tools, machine learning and advanced analytics.",
  skills: [
    "Python", "SQL", "Machine Learning", "Statistics",
    "Data Visualization", "Pandas", "Model Deployment", "Deep Learning"
  ],
  salaries: [
    { label: "Entry", value: "₹ 7L - 11L" },
    { label: "Mid", value: "₹ 12L - 18L" },
    { label: "Senior", value: "₹ 20L - 45L" }
  ],
  relatedPrograms: [
    { title: "B.Tech Computer Science", duration: "4 yrs" },
    { title: "B.Sc. Data Science", duration: "3 yrs" }
  ],
  colleges: [
    "IIT Bombay",
    "IIT Madras",
    "IIIT Hyderabad"
  ]
};

const CareerDetails = () => (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <header className="bg-white px-4 py-3 border-b border-gray-200 flex items-center justify-between">
      <span className="text-xs text-gray-400">Career Details</span>
      <span className="text-gray-400"><FiStar /></span>
    </header>
    <div className="flex-1 overflow-y-auto px-4 py-5">
      <h2 className="text-xl font-semibold mb-1">{demoCareer.title}</h2>
      <p className="text-gray-700 mb-4 text-sm">{demoCareer.desc}</p>
      
      <div className="mb-5">
        <div className="mb-2 text-sm font-semibold">Required Skills</div>
        <div className="flex flex-wrap gap-2">
          {demoCareer.skills.map((skill, i) => (
            <span
              key={i}
              className="bg-orange-200 text-orange-800 px-3 py-1 text-xs rounded font-medium"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-1 text-sm font-semibold">Salary & Growth Prospects</div>
        <ul className="text-gray-700 text-sm">
          {demoCareer.salaries.map((s, i) => (
            <li key={i} className="flex justify-between py-1 border-b">
              <span>{s.label}</span>
              <span className="font-semibold">{s.value}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <div className="mb-1 text-sm font-semibold">Related Programs & Colleges</div>
        <ul className="mb-4 text-sm">
          {demoCareer.relatedPrograms.map((prog, i) => (
            <li key={i} className="flex items-center justify-between py-1">
              <span>{prog.title}</span>
              <span className="text-gray-400">{prog.duration}</span>
            </li>
          ))}
        </ul>
        <div className="mb-2 text-xs font-semibold text-gray-800">Top Colleges</div>
        <ul className="text-xs flex gap-2 flex-wrap">
          {demoCareer.colleges.map((c, i) => (
            <li key={i} className="bg-blue-100 text-blue-800 rounded px-2 py-0.5">{c}</li>
          ))}
        </ul>
      </div>
    </div>
    <div className="p-4 bg-white border-t">
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-3 font-semibold flex justify-center items-center gap-2 transition">
        <span>View Skill Roadmap</span>
        <FiArrowRight className="w-5 h-5" />
      </button>
    </div>
    <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2 text-gray-400">
      <FiStar />
      <FiStar />
      <FiStar />
      <FiStar />
    </nav>
  </div>
);

export default CareerDetails;
