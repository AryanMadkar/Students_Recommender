import React from "react";
import { useNavigate } from "react-router-dom";
import QuickLinkItem from "./QuickLinkItem";
import { FiHeart, FiAward, FiSettings } from "react-icons/fi";

const QuickLinks = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Links</h2>
      <div className="space-y-2">
        <QuickLinkItem
          icon={FiHeart}
          title="My Favorites"
          onClick={() => navigate("/favorites")}
        />
        <QuickLinkItem
          icon={FiAward}
          title="Achievements"
          onClick={() => navigate("/achievements")}
        />
        <QuickLinkItem
          icon={FiSettings}
          title="Settings"
          onClick={() => navigate("/settings")}
        />
      </div>
    </div>
  );
};

export default QuickLinks;
