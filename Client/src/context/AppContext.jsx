import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const { token, isAuthenticated, api } = useAuth();
  const [dashboardData, setDashboardData] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [userPreferences, setUserPreferences] = useState({
    notifications: true,
    emailUpdates: false,
    theme: "light"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  // Create axios instance
  const appApi = axios.create({
    baseURL: apiUrl,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Update headers when token changes
  useEffect(() => {
    if (token) {
      appApi.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete appApi.defaults.headers.Authorization;
    }
  }, [token]);

  const fetchDashboardData = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await appApi.get("/api/users/dashboard");
      if (response.data.success) {
        setDashboardData(response.data.data);
        console.log("dashboard data", response.data.data);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAssessments = async (stage = "after12th") => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await appApi.get(`/api/assessments?stage=${stage}`);
      if (response.data.success) {
        setAssessments(response.data.data);
        console.log("assessments", response.data.data);
      }
    } catch (err) {
      setError("Failed to load assessments");
      console.error("Assessments fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendations = async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await appApi.get("/api/recommendations/careers");
      if (response.data.success) {
        setRecommendations(response.data.data);
        console.log("recommendations", response.data.data);
      }
    } catch (err) {
      setError("Failed to load recommendations");
      console.error("Recommendations fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPreferences = async () => {
    if (!isAuthenticated) return;
    try {
      const response = await appApi.get("/api/users/preferences");
      if (response.data.success) {
        setUserPreferences(response.data.data);
        console.log("user preferences", response.data.data);
      }
    } catch (err) {
      console.error("Preferences fetch error:", err);
    }
  };

  const updateUserPreferences = async (preferences) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await appApi.put("/api/users/preferences", preferences);
      if (response.data.success) {
        setUserPreferences(response.data.data);
        console.log("preferences updated", response.data.data);
        return { success: true };
      }
    } catch (err) {
      setError("Failed to update preferences");
      console.error("Preferences update error:", err);
      return { success: false, message: "Failed to update preferences" };
    } finally {
      setLoading(false);
    }
  };

  const searchColleges = async (searchParams = {}) => {
    try {
      setLoading(true);
      const response = await appApi.get("/api/colleges/search", {
        params: { state: "Delhi", course: "Computer", ...searchParams },
      });
      if (response.data.success) {
        setColleges(response.data.data.colleges);
        console.log("colleges search", response.data.data);
        return response.data.data;
      }
    } catch (err) {
      setError("Failed to search colleges");
      console.error("Colleges search error:", err);
    } finally {
      setLoading(false);
    }
  };

  const submitAssessment = async (assessmentId, submissionData) => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
      const response = await appApi.post(
        `/api/assessments/${assessmentId}/submit`,
        submissionData
      );
      if (response.data.success) {
        console.log("assessment submitted", response.data.data);
        await fetchAssessments();
        await fetchRecommendations();
        return response.data.data;
      }
    } catch (err) {
      setError("Failed to submit assessment");
      console.error("Assessment submission error:", err);
    } finally {
      setLoading(false);
    }
  };

  const clearError = () => setError("");

  // Load data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchDashboardData();
      fetchAssessments();
      fetchRecommendations();
      fetchUserPreferences();
    }
  }, [isAuthenticated]);

  const value = {
    dashboardData,
    assessments,
    colleges,
    recommendations,
    userPreferences,
    loading,
    error,
    clearError,
    refreshDashboard: fetchDashboardData,
    refreshAssessments: fetchAssessments,
    fetchRecommendations,
    fetchUserPreferences,
    updateUserPreferences,
    searchColleges,
    submitAssessment,
    api: appApi,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
