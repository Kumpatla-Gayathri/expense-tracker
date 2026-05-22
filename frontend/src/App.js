import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Login        from './pages/Login';
import Register     from './pages/Register';
import Dashboard    from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Goals        from './pages/Goals';

// Protected Route Component
// Only allows access if user is logged in
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '24px'
    }}>
      ⏳ Loading...
    </div>
  );

  return user ? children : <Navigate to="/login" />;
  // If logged in → show page
  // If not logged in → redirect to login
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Toaster shows notification popups */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1F4E79',
              color: '#fff',
              borderRadius: '10px',
            }
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/transactions" element={
            <ProtectedRoute>
              <Transactions />
            </ProtectedRoute>
          } />

          <Route path="/goals" element={
            <ProtectedRoute>
              <Goals />
            </ProtectedRoute>
          } />

          {/* Redirect unknown routes to home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;