import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you use react-router for navigation

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    // Your login logic here, e.g., calling the API
    console.log({ email, password });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-wrapper">
        <div className="logo-container">
          {/* You can replace this with your actual logo component or an <img> tag */}
          <span className="logo-text">*logo</span>
        </div>
        <h1 className="auth-title">Welcome Back</h1>
        <form onSubmit={handleLogin} className="auth-form">
          <div className="input-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            Login
          </button>
        </form>
        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <p>
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
