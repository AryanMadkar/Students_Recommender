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

  // Create axios instance with token
  const api = axios.create({
    baseURL: apiUrl,
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  // Update axios headers when token changes
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
  }, [token]);

  const validateToken = async () => {
    try {
      const response = await axios.get(`${apiUrl}/api/auth/validate`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.data.success) {
        setUser(response.data.data.user);
        // Also fetch complete profile data
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
        console.log("user profile", userData);
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
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        credentials
      );
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);

        // Fetch complete user profile data
        setTimeout(async () => {
          await fetchUserProfile();
        }, 100);

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
      const response = await axios.post(
        `${apiUrl}/api/auth/register`,
        userData
      );
      if (response.data.success) {
        const { token: newToken, user: newUser } = response.data.data;
        localStorage.setItem("token", newToken);
        setToken(newToken);
        setUser(newUser);

        // Fetch complete user profile data
        setTimeout(async () => {
          await fetchUserProfile();
        }, 100);

        console.log(newUser);
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
