import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FiHome, FiList, FiTarget, FiLogOut } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const location         = useLocation();
  // location.pathname tells us current page URL
  const navigate         = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('👋 Logged out successfully!');
    navigate('/login');
  };

  // Nav links
  const links = [
    { path: '/',             label: 'Dashboard',    icon: <FiHome /> },
    { path: '/transactions', label: 'Transactions', icon: <FiList /> },
    { path: '/goals',        label: 'Goals',        icon: <FiTarget /> },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%)',
      padding: '0 24px',
      boxShadow: '0 2px 20px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      // Stays at top when scrolling
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '64px'
      }}>

        {/* Logo */}
        <Link to="/" style={{
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ fontSize: '24px' }}>💰</span>
          <span style={{
            color: 'white',
            fontWeight: '800',
            fontSize: '18px',
            letterSpacing: '-0.5px'
          }}>
            SpendSmart
          </span>
        </Link>

        {/* Nav Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {links.map(link => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                background: location.pathname === link.path
                  ? 'rgba(255,255,255,0.2)'
                  : 'transparent',
                // Highlight active page
                transition: 'all 0.2s ease'
              }}
            >
              {link.icon}
              {link.label}
            </Link>
          ))}
        </div>

        {/* User Info + Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{
            color: 'rgba(255,255,255,0.8)',
            fontSize: '14px'
          }}>
            👋 {user?.name?.split(' ')[0]}
            {/* Show first name only */}
          </span>
          <button
            onClick={handleLogout}
            className="btn"
            style={{
              background: 'rgba(255,255,255,0.15)',
              color: 'white',
              padding: '6px 14px',
              fontSize: '13px'
            }}
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;