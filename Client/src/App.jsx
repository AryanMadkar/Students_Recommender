import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
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
function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-white min-w-[100vw] min-h-[100vh] text-black">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/" element={<DashboardPage />} />

        {/* Redirect to login by default */}
        <Route path="*" element={<LoginPage />} />
      </Routes>
      {/* <ProfilePage />
      <AchievementsPage />
      <Settings /> */}
    </div>
  );
}

export default App;
