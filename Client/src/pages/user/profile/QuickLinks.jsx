// src/components/profile/QuickLinks.js
import React from 'react';
import QuickLinkItem from './QuickLinkItem';
import { FiHeart, FiAward, FiSettings } from 'react-icons/fi';

const QuickLinks = () => (
  <div className="bg-white rounded-lg shadow-sm p-5">
    <h3 className="text-lg font-bold text-gray-900 mb-3">Quick Links</h3>
    <div className="space-y-2">
      <QuickLinkItem icon={<FiHeart />} title="Favorites" />
      <QuickLinkItem icon={<FiAward />} title="Achievements" />
      <QuickLinkItem icon={<FiSettings />} title="Settings" />
    </div>
  </div>
);

export default QuickLinks;
