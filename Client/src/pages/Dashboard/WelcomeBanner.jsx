import React from "react";
import { motion } from "framer-motion";
import { FiArrowRight, FiStar, FiTrendingUp } from "react-icons/fi";

const WelcomeBanner = () => {
  const currentHour = new Date().getHours();
  const greeting =
    currentHour < 12
      ? "Good morning"
      : currentHour < 18
      ? "Good afternoon"
      : "Good evening";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-6 md:p-8 text-white"
    >
      <div className="relative z-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="mb-6 md:mb-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <p className="text-indigo-100 text-sm font-medium mb-2">
                {greeting}, welcome back! 👋
              </p>
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2">
                Aryan Madkar
              </h1>
              <p className="text-indigo-100 text-base md:text-lg max-w-2xl">
                Ready to advance your career? Let's explore new opportunities
                and achieve your goals together.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="mt-6 flex flex-wrap gap-4"
            >
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <FiStar className="h-4 w-4" />
                <span className="text-sm font-medium">Career Score: 85%</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2">
                <FiTrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Progress: +12% this week
                </span>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex-shrink-0"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex items-center space-x-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 group"
            >
              <span>Try Personalized Planning</span>
              <FiArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
            </motion.button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default WelcomeBanner;
