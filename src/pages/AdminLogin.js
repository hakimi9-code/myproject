import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import LoadingSpinner from '../components/LoadingSpinner';
import Toast, { useToast } from '../components/Toast';
import './AdminLogin.css';

// Use relative API URL in production, localhost in development
const getApiUrl = () => {
  const isProduction = window.location.hostname !== 'localhost';
  if (isProduction) {
    if (process.env.REACT_APP_API_URL) {
      return process.env.REACT_APP_API_URL;
    }
    return 'https://hakimi-store.onrender.com';
  }
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  return 'http://localhost:5000/api';
};

const API_URL = getApiUrl();

function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [registerName, setRegisterName] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { toasts, showToast, removeToast } = useToast();
  
  const from = location.state?.from?.pathname || '/admin';

  // Check if already logged in
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate(from, { replace: true });
    }
  }, [navigate, from]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      showToast('Please enter email and password', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      // Store auth data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      showToast(data.message || 'Login successful!', 'success');
      
      // Redirect after short delay
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
      
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!registerName || !email || !password) {
      showToast('All fields are required', 'error');
      return;
    }

    if (password.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }

    setLoading(true);
    
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: registerName, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      // Store auth data
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('adminUser', JSON.stringify(data.user));
      
      showToast('Registration successful!', 'success');
      
      setTimeout(() => {
        navigate(from, { replace: true });
      }, 1000);
      
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-background">
        <div className="login-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>
      
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <span className="logo-icon">🛒</span>
            <span className="logo-text">MiniStore</span>
          </div>
          <h1>{showRegister ? 'Create Admin Account' : 'Admin Login'}</h1>
          <p>{showRegister ? 'Set up your admin account' : 'Access your dashboard'}</p>
        </div>

        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            message={toast.message}
            type={toast.type}
            duration={toast.duration}
            onClose={() => removeToast(toast.id)}
          />
        ))}

        {loading && <LoadingSpinner message={showRegister ? 'Creating account...' : 'Logging in...'} />}

        {!loading && (
          <form onSubmit={showRegister ? handleRegister : handleLogin} className="login-form">
            {showRegister && (
              <div className="form-group">
                <label htmlFor="registerName">Full Name</label>
                <input
                  type="text"
                  id="registerName"
                  value={registerName}
                  onChange={(e) => setRegisterName(e.target.value)}
                  placeholder="Enter your name"
                  autoComplete="name"
                />
              </div>
            )}
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                autoComplete="email"
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                required
              />
            </div>

            <button type="submit" className="login-button">
              {showRegister ? 'Create Account' : 'Sign In'}
            </button>

            <div className="login-footer">
              <button 
                type="button" 
                className="toggle-button"
                onClick={() => {
                  setShowRegister(!showRegister);
                  setRegisterName('');
                }}
              >
                {showRegister 
                  ? 'Already have an account? Sign In' 
                  : "Don't have an account? Register"}
              </button>
            </div>
          </form>
        )}

        <div className="login-back">
          <Link to="/" className="back-link">← Back to Store</Link>
        </div>
      </div>
      
      <div className="login-features">
        <div className="feature">
          <span className="feature-icon">📊</span>
          <span>Dashboard Analytics</span>
        </div>
        <div className="feature">
          <span className="feature-icon">📦</span>
          <span>Order Management</span>
        </div>
        <div className="feature">
          <span className="feature-icon">🖼️</span>
          <span>Product Upload</span>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;

