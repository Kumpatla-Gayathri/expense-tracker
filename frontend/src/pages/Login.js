import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);

  const { login }    = useAuth();
  const navigate     = useNavigate();
  // navigate lets us redirect to another page

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prevents page from refreshing on form submit

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back! 👋');
      navigate('/');
      // Redirect to dashboard after login
    } catch (error) {
      toast.error(error.response?.data?.message || ' Login failed!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '420px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>💰</div>
          <h1 style={{ color: '#1F4E79', fontSize: '24px', fontWeight: '800' }}>
            SpendSmart
          </h1>
          <p style={{ color: '#64748B', fontSize: '14px' }}>
            Welcome back! Login to your account
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          >
            {loading ? ' Logging in...' : ' Login'}
          </button>
        </form>

        {/* Register Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#64748B',
          fontSize: '14px'
        }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: '#1F4E79', fontWeight: '600' }}>
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;