import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Ensure this CSS file exists

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Implement your login logic here (API calls, etc.)
    console.log('Logging in with:', { email, password });
    // On successful login, set authentication token and navigate
    localStorage.setItem('authToken', 'dummyToken'); // Example
    navigate('/dashboard');
  };

  return (
    <div className="auth-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit} className="auth-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="auth-button">Log In</button>
      </form>
      <p>Don't have an account? <Link to="/signin">Sign In</Link></p>
    </div>
  );
};

export default Login;