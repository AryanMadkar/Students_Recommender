import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiArrowLeft,
  FiAlertCircle,
  FiCheckCircle,
} from "react-icons/fi";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

const RegistrationPage = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    educationStage: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    if (error) setError("");
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.name.trim()) {
          setError("Name is required");
          return false;
        }
        if (formData.name.trim().length < 2) {
          setError("Name must be at least 2 characters long");
          return false;
        }
        break;
      case 2:
        if (!formData.email) {
          setError("Email is required");
          return false;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
          setError("Please enter a valid email address");
          return false;
        }
        if (!formData.phone) {
          setError("Phone number is required");
          return false;
        }
        if (!/^[6-9]\d{9}$/.test(formData.phone)) {
          setError("Please enter a valid 10-digit Indian phone number");
          return false;
        }
        break;
      case 3:
        if (!formData.password) {
          setError("Password is required");
          return false;
        }
        if (formData.password.length < 6) {
          setError("Password must be at least 6 characters long");
          return false;
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
          setError(
            "Password must contain at least one uppercase letter, one lowercase letter, and one number"
          );
          return false;
        }
        if (!formData.educationStage) {
          setError("Please select your education stage");
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prevStep) => prevStep + 1);
      setError("");
    }
  };

  const handlePrevious = () => {
    setStep((prevStep) => prevStep - 1);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    setLoading(true);
    setError("");

    try {
      const result = await register(formData);
      if (result.success) {
        setStep(4); // Success step
        toast.success("Registration successful!");
        setTimeout(() => {
          navigate("/dashboard");
        }, 2000);
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Registration failed:", error);
      setError("An unexpected error occurred. Please try again.");
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  };

  // Success Step
  if (step === 4) {
    return (
      <div className="auth-container registration-bg">
        <motion.div
          className="auth-form-wrapper"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div
            className="text-center"
            variants={stepVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            >
              <FiCheckCircle className="w-8 h-8 text-green-600" />
            </motion.div>
            <h1 className="auth-title text-green-600">Welcome Aboard!</h1>
            <p className="text-gray-600 mb-6">
              Your account has been created successfully. Redirecting to your
              dashboard...
            </p>
          </motion.div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="auth-container registration-bg">
      <motion.div
        className="auth-form-wrapper"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="logo-container">
          <h2 className="logo-text gradient-text">PathPilot</h2>
        </div>

        <div className="step-indicator">Step {step} of 3</div>
        <h1 className="auth-title">Create Your Account</h1>
        <p className="text-gray-600 mb-6">Start your career journey today</p>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-6">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700">
            <FiAlertCircle className="mr-2" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="input-group">
                  <label htmlFor="name">
                    <FiUser className="inline mr-2" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    disabled={loading}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleNext}
                  className="btn btn-primary w-full"
                  disabled={loading}
                >
                  Next <FiArrowRight className="ml-2" />
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="input-group">
                  <label htmlFor="email">
                    <FiMail className="inline mr-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    disabled={loading}
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="phone">
                    <FiPhone className="inline mr-2" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                    disabled={loading}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1"
                    disabled={loading}
                  >
                    <FiArrowLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    Next <FiArrowRight className="ml-2" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                variants={stepVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <div className="input-group">
                  <label htmlFor="password">
                    <FiLock className="inline mr-2" />
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Create a strong password"
                      disabled={loading}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                      disabled={loading}
                    >
                      {showPassword ? <FiEyeOff /> : <FiEye />}
                    </button>
                  </div>
                </div>
                <div className="input-group">
                  <label htmlFor="educationStage">Education Stage</label>
                  <select
                    id="educationStage"
                    name="educationStage"
                    value={formData.educationStage}
                    onChange={handleChange}
                    disabled={loading}
                  >
                    <option value="">Select your education stage</option>
                    <option value="high_school">High School</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="graduate">Graduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="working_professional">
                      Working Professional
                    </option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    className="btn bg-gray-200 text-gray-700 hover:bg-gray-300 flex-1"
                    disabled={loading}
                  >
                    <FiArrowLeft className="mr-2" /> Back
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary flex-1"
                    disabled={loading}
                  >
                    {loading ? "Creating Account..." : "Create Account"}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>

        <div className="auth-links">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationPage;
