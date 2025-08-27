import { useState } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import Settings from "./pages/user/settings/Settings";
import AchievementsPage from "./pages/user/Achievements";
import ProfilePage from "./pages/user/profile/ProfilePage";
import LoginPage from "./pages/auth/Login";
import RegistrationPage from "./pages/auth/Register";
import { Routes, Route } from "react-router-dom";
import ForgotPasswordPage from "./pages/auth/ForgetPassword";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import AssessmentCard from "./pages/Assessments/Assissment";

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative">
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route
            path="/*"
            element={
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">
                  <Routes>
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/assessment" element={<AssessmentCard />} />

                    <Route
                      path="/achievements"
                      element={<AchievementsPage />}
                    />
                    <Route path="/settings" element={<Settings />} />
                  </Routes>
                </main>
                {/* <AssessmentCard/> */}
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
