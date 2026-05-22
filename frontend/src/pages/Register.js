import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [name,     setName]     = useState('');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [confirm,  setConfirm]  = useState('');
  const [loading,  setLoading]  = useState(false);

  const { register } = useAuth();
  const navigate     = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check passwords match
    if (password !== confirm) {
      toast.error(' Passwords do not match!');
      return;
    }

    // Check password length
    if (password.length < 6) {
      toast.error(' Password must be at least 6 characters!');
      return;
    }

    setLoading(true);
    try {
      await register(name, email, password);
      toast.success(' Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || ' Registration failed!');
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
            Create your account and start tracking!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

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
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Repeat your password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ width: '100%', padding: '12px', fontSize: '15px' }}
          >
            {loading ? ' Creating account...' : ' Create Account'}
          </button>
        </form>

        {/* Login Link */}
        <p style={{
          textAlign: 'center',
          marginTop: '20px',
          color: '#64748B',
          fontSize: '14px'
        }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#1F4E79', fontWeight: '600' }}>
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;