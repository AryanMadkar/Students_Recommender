import React, { useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // Add axios import

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false); // Add loading state
  const [error, setError] = useState(""); // Add error state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    educationStage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleNext = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Make POST request to your backend API
      const response = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Registration successful:", response.data);

      // Handle successful registration
      // You might want to redirect user or show success message
      // Example: navigate to login page or dashboard
    } catch (error) {
      console.error("Registration failed:", error);

      // Handle different types of errors
      if (error.response) {
        // Server responded with error status
        setError(error.response.data.message || "Registration failed");
      } else if (error.request) {
        // Request was made but no response received
        setError("Network error. Please try again.");
      } else {
        // Something else happened
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container registration-bg mb-[2rem]">
      <div className="auth-form-wrapper">
        <div className="logo-container">
          <span className="logo-text">*logo</span>
        </div>

        <p className="step-indicator">Step {step} of 3</p>

        {/* Show error message if any */}
        {error && (
          <div
            className="error-message"
            style={{ color: "red", marginBottom: "1rem" }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          {step === 1 && (
            <>
              <h1 className="auth-title">Tell us about yourself</h1>
              <div className="input-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="email">Email Address</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="john.doe@example.com"
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next
              </button>
            </>
          )}

          {step === 2 && (
            <>
              <h1 className="auth-title">Secure your account</h1>
              <div className="input-group">
                <label htmlFor="phone">Phone</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <button
                type="button"
                onClick={handleNext}
                className="btn btn-primary"
              >
                Next
              </button>
            </>
          )}

          {step === 3 && (
            <>
              <h1 className="auth-title">Your educational background</h1>
              <div className="input-group">
                <label htmlFor="educationStage">Education Stage</label>
                <select
                  id="educationStage"
                  name="educationStage"
                  value={formData.educationStage}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Stage</option>
                  <option value="after10th">After 10th</option>
                  <option value="after12th">After 12th</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
            </>
          )}
        </form>
        <div className="auth-links">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
