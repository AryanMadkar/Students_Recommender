import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { token, isAuthenticated } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  const api = axios.create({
    baseURL: apiUrl,
    headers: token ? { Authorization: `Bearer ${token}` } : {}
  });

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/api/dashboard');
      if (response.data.success) {
        setDashboardData(response.data.data);
      }
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async () => {
    if (!isAuthenticated) return;
    
    try {
      setLoading(true);
      const response = await api.get('/api/assessments');
      if (response.data.success) {
        setAssessments(response.data.data);
      }
    } catch (err) {
      setError('Failed to load assessments');
      console.error('Assessments fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError('');

  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchAssessments();
    }
  }, [isAuthenticated]);

  const value = {
    dashboardData,
    assessments,
    loading,
    error,
    clearError,
    refreshDashboard: fetchDashboardData,
    refreshAssessments: fetchAssessments,
    api
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
