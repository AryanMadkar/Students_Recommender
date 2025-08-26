// src/components/settings/DangerZone.js
import React from 'react';
import { FiLogOut, FiTrash2 } from 'react-icons/fi';

const DangerZone = () => (
  <section>
    <h2 className="text-xl font-bold text-red-600 mb-4">Danger Zone</h2>
    <div className="space-y-3">
      <button className="w-full flex items-center justify-center p-3 bg-white border border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors">
        <FiLogOut className="mr-2" />
        Logout
      </button>
      <button className="w-full flex items-center justify-center p-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors">
        <FiTrash2 className="mr-2" />
        Delete Account
      </button>
    </div>
  </section>
);

export default DangerZone;
