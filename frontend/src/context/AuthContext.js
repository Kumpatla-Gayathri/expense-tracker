import React, { createContext, useState, useEffect, useContext } from 'react';
import { loginUser, registerUser } from '../services/api';

// Create the context
const AuthContext = createContext();

// AuthProvider wraps the whole app
// so every component can access auth state
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const savedUser  = localStorage.getItem('user');
    const savedToken = localStorage.getItem('token');

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      // Restore user from browser storage
    }
    setLoading(false);
  }, []);

  // ── Login function
  const login = async (email, password) => {
    const { data } = await loginUser({ email, password });
    // Store token and user in browser storage
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ── Register function
  const register = async (name, email, password) => {
    const { data } = await registerUser({ name, email, password });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  // ── Logout function
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // Clear browser storage
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
    // Makes user, login, register, logout
    // available to ALL components
  );
};

// Custom hook to use auth anywhere
export const useAuth = () => useContext(AuthContext);
// Instead of importing AuthContext everywhere
// just import useAuth and call it!

export default AuthContext;