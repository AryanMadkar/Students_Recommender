import { useState } from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Layout Components
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

// College Pages;
import CollegeDetails from "./pages/college/CollegeDetails";
import CollegeSearch from "./pages/college/CollegeSearch";
import RecommendedColleges from "./pages/Recommendation/Recomended_colleges";

// Course Pages
import SuggestedCourses from "./pages/Recommendation/Suggested_Cources";

// Toast notifications
import { Toaster } from "react-hot-toast";

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App">
        <Toaster 
          position="top-center" 
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              theme: {
                primary: 'green',
                secondary: 'black',
              },
            },
          }}
        />
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />

          {/* Protected Routes - Include Navbar */}
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <DashboardPage />
            </>
          } />

          {/* Assessment Routes */}
          <Route path="/assessments" element={
            <>
              <Navbar />
              <AssessmentPage />
            </>
          } />
          <Route path="/assessments/:assessmentId/start" element={
            <>
              <QuizQuestion />
            </>
          } />
          <Route path="/assessments/:assessmentId/results" element={
            <>
              <Navbar />
              <ResultsPage />
            </>
          } />
          <Route path="/assessments/results/:resultId" element={
            <>
              <Navbar />
              <ResultsPage />
            </>
          } />

          {/* Career Routes */}
          <Route path="/careers/:careerId" element={
            <>
              <Navbar />
              <CareerDetails />
            </>
          } />
          <Route path="/careers" element={
            <>
              <Navbar />
              <TopPath />
            </>
          } />
          <Route path="/top-paths" element={
            <>
              <Navbar />
              <TopPath />
            </>
          } />

          {/* College Routes */}
          <Route path="/colleges" element={
            <>
              <Navbar />
              <CollegeSearch />
            </>
          } />
          <Route path="/colleges/:collegeId" element={
            <>
              <Navbar />
              <CollegeDetails />
            </>
          } />
          <Route path="/recommended-colleges" element={
            <>
              <Navbar />
              <RecommendedColleges />
            </>
          } />

          {/* Course Routes */}
          <Route path="/suggested-courses" element={
            <>
              <Navbar />
              <SuggestedCourses />
            </>
          } />
          <Route path="/courses" element={
            <>
              <Navbar />
              <SuggestedCourses />
            </>
          } />

          {/* User Profile Routes */}
          <Route path="/profile" element={
            <>
              <Navbar />
              <ProfilePage />
            </>
          } />
          <Route path="/settings" element={
            <>
              <Navbar />
              <Settings />
            </>
          } />
          <Route path="/achievements" element={
            <>
              <Navbar />
              <AchievementsPage />
            </>
          } />

          {/* Recommendations Routes */}
          <Route path="/recommendations" element={
            <>
              <Navbar />
              <DashboardPage />
            </>
          } />
          <Route path="/recommendations/careers" element={
            <>
              <Navbar />
              <TopPath />
            </>
          } />
          <Route path="/recommendations/colleges" element={
            <>
              <Navbar />
              <RecommendedColleges />
            </>
          } />
          <Route path="/recommendations/courses" element={
            <>
              <Navbar />
              <SuggestedCourses />
            </>
          } />

          {/* Fallback Routes */}
          <Route path="*" element={<LoginPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
