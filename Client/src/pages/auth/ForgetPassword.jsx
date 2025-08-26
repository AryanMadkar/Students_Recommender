import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiMail, FiArrowLeft, FiCheckCircle } from 'react-icons/fi';
// In a real app, you'd have an API service like this:
// import { sendPasswordResetEmail } from '../services/authService';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // --- MOCK API CALL ---
    // In a real app, you would call your backend API here.
    // For example:
    // try {
    //   await sendPasswordResetEmail(email);
    //   setIsSent(true);
    // } catch (err) {
    //   setError(err.message || 'Failed to send reset email. Please try again.');
    // } finally {
    //   setIsLoading(false);
    // }

    // This is a mock delay to simulate a network request.
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simulate a successful response
    if (email === "fail@example.com") {
        setError('No user found with this email.');
    } else {
        setIsSent(true);
    }
    
    setIsLoading(false);
    // --- END MOCK API CALL ---
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      } 
    },
  };
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4">
      <motion.div
        className="w-full max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center">
          <span className="text-3xl font-bold tracking-wider">*logo</span>
        </div>

        {isSent ? (
          <div className="text-center space-y-4">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}>
              <FiCheckCircle className="mx-auto text-5xl text-green-500" />
            </motion.div>
            <h2 className="text-2xl font-semibold text-gray-800">Check Your Email</h2>
            <p className="text-gray-600">
              We've sent a password reset link to <span className="font-medium text-gray-800">{email}</span>. Please check your inbox and spam folder.
            </p>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3 mt-4 text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <FiArrowLeft />
              Back to Login
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-semibold text-gray-800">Forgot Password?</h2>
                <p className="mt-2 text-sm text-gray-600">
                    No worries, we'll send you reset instructions.
                </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <div className="relative mt-1">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                    <FiMail className="w-5 h-5 text-gray-400" />
                  </span>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your registered email"
                    className="w-full py-3 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>
              
              {error && <p className="text-sm text-red-600">{error}</p>}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:bg-blue-300"
                >
                  {isLoading ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>

            <div className="text-center">
              <Link to="/login" className="font-medium text-sm text-blue-500 hover:text-blue-600 flex items-center justify-center gap-1">
                <FiArrowLeft />
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;
