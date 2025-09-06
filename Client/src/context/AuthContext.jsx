import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const api = axios.create({
    baseURL: apiUrl,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Add request interceptor to handle token updates
  api.interceptors.request.use((config) => {
    const currentToken = localStorage.getItem("token");
    if (currentToken) {
      config.headers.Authorization = `Bearer ${currentToken}`;
    }
    return config;
  });

  // Add response interceptor to handle auth errors
  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.log("401 Unauthorized - logging out");
        logout();
      }
      return Promise.reject(error);
    }
  );

  useEffect(() => {
    if (token) {
      api.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.Authorization;
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      validateToken();
    } else {
      setLoading(false);
    }
  }, []);

  const validateToken = async () => {
    try {
      const response = await api.get("/api/auth/validate");
      if (response.data.success) {
        setUser(response.data.data.user);
        await fetchUserProfile();
      } else {
        logout();
      }
    } catch (error) {
      console.error("Token validation failed:", error);
      logout();
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const response = await api.get("/api/auth/me");
      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
        return userData;
      }
    } catch (error) {
      console.error("Profile fetch error:", error);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/login`, credentials);
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);
        // Set the token in api instance immediately
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        await fetchUserProfile();
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Login failed",
        };
      }
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await axios.post(`${apiUrl}/api/auth/register`, userData);
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);
        // Set the token in api instance immediately
        api.defaults.headers.Authorization = `Bearer ${newToken}`;
        await fetchUserProfile();
        return { success: true };
      } else {
        return {
          success: false,
          message: response.data.message || "Registration failed",
        };
      }
    } catch (error) {
      console.error("Registration error:", error);
      return {
        success: false,
        message: error.response?.data?.message || "Registration failed",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    delete api.defaults.headers.Authorization;
  };

  const updateUser = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const value = {
    user,
    token,
    loading,
    login,
    register,
    logout,
    updateUser,
    fetchUserProfile,
    isAuthenticated: !!user && !!token,
    api,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
