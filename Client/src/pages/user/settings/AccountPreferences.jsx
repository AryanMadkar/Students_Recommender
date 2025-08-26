// src/components/settings/AccountPreferences.js
import React from 'react';
import SettingsItem from './SettingsItem';
import { FiUser, FiKey, FiLink } from 'react-icons/fi';

const AccountPreferences = () => (
  <section>
    <h2 className="text-xl font-bold text-gray-800 mb-4">Account Preferences</h2>
    <div className="space-y-3">
      <SettingsItem icon={<FiUser />} title="Edit Profile" subtitle="Update your personal details" />
      <SettingsItem icon={<FiKey />} title="Change Password" subtitle="Update your login credentials securely" />
      <SettingsItem icon={<FiLink />} title="Linked Accounts" subtitle="Manage connected social and academic accounts" />
    </div>
  </section>
);

export default AccountPreferences;
