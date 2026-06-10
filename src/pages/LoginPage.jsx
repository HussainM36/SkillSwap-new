import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AuthPage.css';
import { AuthContext } from '../context/AuthContext';  // Ensure this is where your context is created
import axios from 'axios';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); // Use context for managing user state

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5003/api/auth/login', { email, password });
      
      if (response.data.token) {
  const user = response.data.user;

  localStorage.setItem(
    "token",
    response.data.token
  );

  localStorage.setItem(
    "userId",
    user._id
  );

  localStorage.setItem(
    "user",
    JSON.stringify(user)
  );

  console.log("Saved User ID:", user._id);

  setUser(user);

  navigate("/dashboard");
} else {
        setError(response.data.message);
        setSuccessMessage('');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
      setSuccessMessage('');
      console.error('Login error:', error);
    }
  };

  return (
    <div className="login-container">
      <h2>Welcome Back 👋</h2>
      <p>Login to your SkillSwap account</p>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="error">{error}</p>}
        {successMessage && <p className="success">{successMessage}</p>}
        <button type="submit" className="login-btn">Login</button>
        <div className="login-footer">
          <Link to="/forgot-password" className="forgot-link">Forgot Password?</Link>
          <p>Don’t have an account? <Link to="/signup">Sign up</Link></p>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
