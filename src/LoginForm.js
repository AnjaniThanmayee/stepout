import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import { useNavigate } from 'react-router-dom';
import './App.css';

function LoginForm() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [adminUsername, setAdminUsername] = useState(''); // Add admin username state
  const [adminPassword, setAdminPassword] = useState(''); // Add admin password state

  const handleLogin = async () => {
    // User login logic
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      alert(data.message);
      if (data.message === 'Login successful') {
        navigate('/trainbooking');
      }
    } catch (error) {
      console.error('Error during user login:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  const handleAdminLogin = async () => {
    // Admin login logic
    try {
      const response = await fetch('http://localhost:5000/admin-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: adminUsername, password: adminPassword }), // Use adminUsername and adminPassword
      });

      const data = await response.json();
      alert(data.message);
      if (data.message === 'Admin login successful') {
        navigate('/admindashboard');
      }
    } catch (error) {
      console.error('Error during admin login:', error);
      alert('Something went wrong. Please try again later.');
    }
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleAdminUsernameChange = (event) => {
    setAdminUsername(event.target.value);
  };

  const handleAdminPasswordChange = (event) => {
    setAdminPassword(event.target.value);
  };

  return (
    <div className="Form">
      <h2>User Login</h2>
      <input
        type="text"
        name="username"
        placeholder="Username"
        onChange={handleUsernameChange}
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handlePasswordChange}
      />
      <button onClick={handleLogin}>Login</button>

      <h2>Admin Login</h2>
      <input
        type="text"
        name="adminUsername"
        placeholder="Admin Username"
        onChange={handleAdminUsernameChange}
      />
      <input
        type="password"
        name="adminPassword"
        placeholder="Admin Password"
        onChange={handleAdminPasswordChange}
      />
      <button onClick={handleAdminLogin}>Admin Login</button>
    </div>
  );
}

export default LoginForm;
