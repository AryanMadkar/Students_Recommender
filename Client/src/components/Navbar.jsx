import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/use-media-query"; // Adjust path if needed
import {
  FiHome,
  FiBookOpen,
  FiAward,
  FiUser,
  FiCheckSquare,
} from "react-icons/fi";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = [
    { name: "Home", path: "/dashboard", icon: <FiHome /> },
    { name: "Assessment", path: "/assessments", icon: <FiCheckSquare /> },
    { name: "Courses", path: "/suggested-courses", icon: <FiBookOpen /> },
    { name: "Colleges", path: "/colleges/search", icon: <FiHome /> },
    { name: "Profile", path: "/profile", icon: <FiUser /> },
  ];

  return (
    <>
      {isMobile ? (
        // Mobile View: Fixed Bottom Navigation Bar
        <motion.nav
          className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center py-2 px-4 z-50"
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          {navItems.map((item, index) => (
            <Link
              key={index}
              to={item.path}
              className="flex flex-col items-center text-gray-600 hover:text-blue-600 transition-colors"
            >
              <div className="text-2xl">{item.icon}</div>
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          ))}
        </motion.nav>
      ) : (
        // Desktop View: Standard Top Navigation Bar
        <motion.nav
          className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120 }}
        >
          <div className="text-xl font-bold text-blue-600">PathPilot</div>
          <div className="flex space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.icon}
                <span className="ml-2">{item.name}</span>
              </Link>
            ))}
          </div>
        </motion.nav>
      )}
    </>
  );
};

export default Navbar;
