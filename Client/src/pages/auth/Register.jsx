import React, { useState } from "react";
import { Link } from "react-router-dom"; // Assuming you use react-router for navigation

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your registration logic here, e.g., calling the API
    // This will have all the form data required by your backend
    console.log("Final registration data:", formData);
  };

  return (
    <div className="auth-container registration-bg mb-[2rem]">
      <div className="auth-form-wrapper">
        <div className="logo-container">
          <span className="logo-text">*logo</span>
        </div>

        <p className="step-indicator">Step {step} of 3</p>

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
                  <option value="high-school">High School</option>
                  <option value="undergraduate">Undergraduate</option>
                  <option value="graduate">Graduate</option>
                  <option value="professional">Professional</option>
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                Register
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
