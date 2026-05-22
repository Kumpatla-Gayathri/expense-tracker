import axios from 'axios';

// Base URL of our backend
const API = axios.create({
baseURL: 'https://expense-tracker-backend-adl2.onrender.com/api',
  // All requests will start with this URL
});

// Automatically attach token to every request
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  // Get token from browser storage

  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
    // Attach token to request header
    // So protected routes work automatically
  }
  return req;
});

// ── Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser    = (data) => API.post('/auth/login', data);
export const getProfile   = ()     => API.get('/auth/profile');

// ── Transaction APIs
export const getTransactions   = (params) => API.get('/transactions', { params });
export const addTransaction    = (data)   => API.post('/transactions', data);
export const updateTransaction = (id, data) => API.put(`/transactions/${id}`, data);
export const deleteTransaction = (id)     => API.delete(`/transactions/${id}`);
export const getSummary        = ()       => API.get('/transactions/summary');

// ── Goal APIs
export const getGoals     = ()         => API.get('/goals');
export const createGoal   = (data)     => API.post('/goals', data);
export const updateGoal   = (id, data) => API.put(`/goals/${id}`, data);
export const depositGoal  = (id, data) => API.put(`/goals/${id}/deposit`, data);
export const deleteGoal   = (id)       => API.delete(`/goals/${id}`);