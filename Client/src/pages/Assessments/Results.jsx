import React from "react";
import { motion } from "framer-motion";
import { FiChevronLeft, FiRefreshCw, FiArrowRight } from "react-icons/fi";
import {
  PieChart, Pie, Cell, Legend, ResponsiveContainer
} from "recharts";

const score = 85;                          // ­­­dummy overall %
const skills = [                           // ­­­dummy skill split
  { name: "Critical Thinking", value: 40, color: "#facc15" },
  { name: "Communication",   value: 35, color: "#34d399" },
  { name: "Analytical Skill", value: 25, color: "#3b82f6" }
];

export default function AssessmentResultPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top bar */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between"
      >
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <FiChevronLeft className="w-5 h-5 text-gray-600" />
        </button>
        <h1 className="text-sm font-semibold text-gray-900">
          Assessment Results
        </h1>
        <div className="w-5" /> {/* spacer */}
      </motion.header>

      <div className="flex-1 overflow-y-auto px-4 pb-28 space-y-8">
        {/* Overall card */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-4"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs uppercase font-medium text-gray-500">
                Overall Score
              </p>
              <p className="text-3xl font-bold text-gray-900">{score}%</p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <FiRefreshCw className="w-4 h-4 text-gray-500" />
            </button>
          </div>

          {/* mini-progress bar */}
          <div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ duration: 0.6 }}
                className="h-2 bg-blue-600 rounded-full"
              />
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Your performance is above 75 % of test-takers.
            </p>
          </div>
        </motion.section>

        {/* Skill doughnut */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
        >
          <h2 className="text-sm font-semibold text-gray-900 mb-4">
            Skill Breakdown
          </h2>
          <div className="h-60">
            <ResponsiveContainer>
              <PieChart>
                <Pie
                  data={skills}
                  dataKey="value"
                  innerRadius="60%"
                  outerRadius="90%"
                  paddingAngle={3}
                >
                  {skills.map((s) => (
                    <Cell key={s.name} fill={s.color} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </motion.section>

        {/* AI analysis */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-2"
        >
          <h2 className="text-sm font-semibold text-gray-900">
            AI-Powered Analysis
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            • You excel at breaking down complex problems into logical steps.<br />
            • Your written answers were clear and concise, showing strong communication.<br />
            • Time-management lagged on analytical questions – consider pacing drills.<br />
            • Focus practice on interpreting data charts to raise analytical speed.
          </p>
        </motion.section>

        {/* Next steps */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-50 rounded-xl border border-blue-100 p-5 text-center space-y-4"
        >
          <div className="mx-auto w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <FiArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900">
            Next Steps & Recommendations
          </h3>
          <p className="text-sm text-gray-700">
            Based on your scores, we’ve prepared a personalized learning plan
            to help you reach 90 %+ on your next attempt.
          </p>

          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg flex items-center justify-center space-x-2">
            <span>View Personalized Recommendations</span>
            <FiArrowRight className="w-4 h-4" />
          </button>
        </motion.section>
      </div>

      {/* bottom nav placeholder */}
      <nav className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-200 flex justify-around py-2">
        <div className="w-16 h-1.5 rounded-full bg-gray-300" />
      </nav>
    </div>
  );
}
