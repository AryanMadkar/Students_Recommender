import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Context Providers
import { AuthProvider } from "./context/AuthContext";
import { AppProvider } from "./context/AppContext";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";

// User Pages
import Settings from "./pages/user/settings/Settings";
import AchievementsPage from "./pages/user/Achievements";
import ProfilePage from "./pages/user/profile/ProfilePage";

// Auth Pages
import LoginPage from "./pages/auth/Login";
import RegisterPage from "./pages/auth/Register";
import ForgotPasswordPage from "./pages/auth/ForgetPassword";

// Dashboard
import DashboardPage from "./pages/Dashboard/DashboardPage";

// Assessment Pages
import AssessmentPage from "./pages/Assessments/Assissment";
import QuizQuestion from "./pages/Assessments/Question";
import ResultsPage from "./pages/Assessments/Results";

// Career Pages
import CareerDetails from "./pages/Career/Career_Details";
import TopPath from "./pages/Recommendation/TopPath";

// College Pages
import CollegeDetails from "./pages/college/CollegeDetails";
import CollegeSearch from "./pages/college/CollegeSearch";
import RecommendedColleges from "./pages/Recommendation/Recomended_colleges";

// Course Pages
import SuggestedCourses from "./pages/Recommendation/Suggested_Cources";

// Toast notifications
import { Toaster } from "react-hot-toast";
import UserProfile from "./pages/user/UserProfile";

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <Toaster position="top-right" />

            <Routes>
              {/* Public Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/forgot-password" element={<ForgotPasswordPage />} />

              {/* Protected Routes with Navbar */}
              <Route
                path="/*"
                element={
                  <ProtectedRoute>
                    <div className="flex flex-col min-h-screen">
                      <Navbar />
                      <main className="flex-1">
                        <Routes>
                          {/* Dashboard */}
                          <Route path="/" element={<DashboardPage />} />
                          <Route
                            path="/dashboard"
                            element={<DashboardPage />}
                          />

                          {/* Assessment Routes */}
                          <Route
                            path="/assessments"
                            element={<AssessmentPage />}
                          />
                          <Route
                            path="/assessments/:assessmentId/start"
                            element={<QuizQuestion />}
                          />
                          <Route
                            path="/assessments/:assessmentId/results"
                            element={<ResultsPage />}
                          />
                          <Route
                            path="/assessments/results/:resultId"
                            element={<ResultsPage />}
                          />

                          {/* Career Routes */}
                          <Route
                            path="/careers/:careerId"
                            element={<CareerDetails />}
                          />
                          <Route
                            path="/recommendations/careers"
                            element={<TopPath />}
                          />
                          <Route path="/top-paths" element={<TopPath />} />

                          {/* College Routes */}
                          <Route path="/colleges" element={<CollegeSearch />} />
                          <Route
                            path="/colleges/:collegeId"
                            element={<CollegeDetails />}
                          />
                          <Route
                            path="/recommendations/colleges"
                            element={<RecommendedColleges />}
                          />

                          {/* Course Routes */}
                          <Route
                            path="/courses"
                            element={<SuggestedCourses />}
                          />
                          <Route
                            path="/recommendations/courses"
                            element={<SuggestedCourses />}
                          />

                          {/* User Profile Routes */}
                          <Route path="/profile" element={<ProfilePage />} />
                          <Route
                            path="/profile/edit"
                            element={<UserProfile />}
                          />
                          <Route path="/settings" element={<Settings />} />
                          <Route
                            path="/achievements"
                            element={<AchievementsPage />}
                          />

                          {/* Recommendation Routes */}
                          <Route
                            path="/recommendations"
                            element={<TopPath />}
                          />
                          <Route
                            path="/recommended-colleges"
                            element={<RecommendedColleges />}
                          />
                          <Route
                            path="/suggested-courses"
                            element={<SuggestedCourses />}
                          />

                          {/* Fallback Route */}
                          <Route path="*" element={<DashboardPage />} />
                        </Routes>
                      </main>
                    </div>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
