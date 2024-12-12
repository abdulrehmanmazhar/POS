import React, { useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
// import axios from 'axios';
import "./styles/login.css";

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevent the default form submission
    console.log("clicked");
    try {
      const response = await axiosInstance.post('/api/v1/login', { email, password });
      console.log('Logged in:', response.data);
    } catch (error: any) {
      console.error('Login error:', error.response?.data || error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}> {/* Attach onSubmit here */}
        <div>
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)} 
          />
        </div>
        <div>
          <label>Password:</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)} 
          />
        </div>
        <button type="submit">Login</button> {/* Submit handled by form */}
      </form>
    </div>
  );
};

export default Login;
