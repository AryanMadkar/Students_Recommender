import React from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "../hooks/use-media-query"; // Adjust path if needed
import { FiHome, FiBookOpen, FiAward, FiUser, FiCheckSquare } from "react-icons/fi";

const Navbar = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");

  const navItems = [
    { name: "Home", icon: <FiHome /> },
    { name: "Assessment", icon: <FiCheckSquare /> },
    { name: "Courses", icon: <FiBookOpen /> }, // Corrected from "Corses"
    { name: "Colleges", icon: <FiAward /> },
    { name: "Profile", icon: <FiUser /> },
  ];

  return (
    <>
      {isMobile ? (
        // Mobile View: Fixed Bottom Navigation Bar
        <nav className="fixed bottom-0 w-full bg-white shadow-t-md z-50">
          <div className="flex justify-around items-center h-[4.5rem] px-2">
            {navItems.map((item) => (
              <motion.div
                key={item.name}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="flex flex-col items-center justify-center gap-1 text-gray-600 hover:text-blue-500 cursor-pointer"
              >
                <div className="text-2xl">{item.icon}</div>
                <h1 className="text-xs font-medium">{item.name}</h1>
              </motion.div>
            ))}
          </div>
        </nav>
      ) : (
        // Desktop View: Standard Top Navigation Bar
        <nav className="w-full h-[4rem] bg-white shadow-md flex items-center justify-between px-8">
          <div className="logo">
            <h1 className="text-2xl font-bold text-gray-800">Logo</h1>
          </div>
          <div className="navitems flex flex-row gap-10 items-center justify-center">
            {navItems.map((item) => (
              <motion.h1
                key={item.name}
                whileHover={{ scale: 1.05, color: "#3B82F6" }} // text-blue-500
                whileTap={{ scale: 0.95 }}
                className="text-gray-700 font-semibold cursor-pointer"
              >
                {item.name}
              </motion.h1>
            ))}
          </div>
        </nav>
      )}
    </>
  );
};

export default Navbar;
